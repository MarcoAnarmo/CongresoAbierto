import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { conIdiomas, type Idioma } from '../../../../../i18n';
import { votaciones, circunscripciones } from '../../../../../lib/data';
import { tarjetaResumen, tarjetaVotacion, tarjetaProvincia, type ModoHemiciclo } from '../../../../../lib/tarjetas';
import { tarjetaEstadistica, ESTADISTICAS, type IdEstadistica } from '../../../../../lib/tarjetas-estadisticas';

/**
 * Miniaturas (WebP, 540 px de ancho) de las tarjetas verticales que se ven en la galería (/tarjetas): resumen,
 * votaciones clave, provincias y estadísticas. La galería las muestra a unos 200–300 px; la tarjeta completa (PNG 1080×1920)
 * solo se descarga al compartirla. Una tarjeta de provincia pasa de ~800 KB a unas decenas de KB.
 */
const ANCHO = 540;
type Tipo = 'resumen' | 'votacion' | 'provincia' | 'estadistica';
export function getStaticPaths() {
  return conIdiomas([
    ...(['grupo', 'propiedades', 'viviendas'] as const).map((id) => ({ params: { tipo: 'resumen', id } })),
    ...votaciones.map((v) => ({ params: { tipo: 'votacion', id: v.id } })),
    ...circunscripciones.map((c) => ({ params: { tipo: 'provincia', id: c.id } })),
    ...ESTADISTICAS.map((id) => ({ params: { tipo: 'estadistica', id } })),
  ]);
}
export const GET: APIRoute = async ({ params, props }) => {
  const lang = (props as { lang: Idioma }).lang;
  const id = params.id!;
  const tipo = params.tipo as Tipo;
  const png = tipo === 'resumen' ? await tarjetaResumen('historia', lang, id as ModoHemiciclo)
    : tipo === 'votacion' ? await tarjetaVotacion(votaciones.find((v) => v.id === id)!, 'historia', lang)
    : tipo === 'estadistica' ? await tarjetaEstadistica(id as IdEstadistica, 'historia', lang)
    : await tarjetaProvincia(id, 'historia', lang);
  const webp = await sharp(png).resize({ width: ANCHO }).webp({ quality: 80 }).toBuffer();
  return new Response(webp as unknown as BodyInit, { headers: { 'Content-Type': 'image/webp' } });
};
