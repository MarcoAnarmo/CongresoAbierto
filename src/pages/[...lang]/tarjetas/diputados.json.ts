import type { APIRoute } from 'astro';
import { rutasIdioma, idiomaDe, formatos } from '../../../i18n';
import { diputados, slug } from '../../../lib/data';
import { nombreLegible } from '../../../lib/provincias';
import { compartir } from '../../../lib/tarjetas';

/**
 * Diputados para el buscador de la galería de tarjetas (/tarjetas, pestaña Diputados), en el idioma de la página.
 * Se descarga solo al abrir esa pestaña: así la galería no lleva 350 cajas de compartir en su HTML.
 * Cada fila: [slug, nombre completo, grupo, circunscripción, texto para compartir, propiedades declaradas (null sin declaración)].
 */
export const getStaticPaths = rutasIdioma;
export const GET: APIRoute = ({ params }) => {
  const lang = idiomaDe(params.lang);
  const { comparar } = formatos(lang);
  const filas = [...diputados].sort((a, b) => comparar(a.apellidos, b.apellidos))
    .map((d) => [slug(d), d.nombreCompleto, d.grupoCorto, nombreLegible(d.circunscripcion), compartir.diputado(d, lang).texto, d.patrimonio.propiedades]);
  return new Response(JSON.stringify(filas), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
