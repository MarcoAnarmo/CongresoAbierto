import type { APIRoute } from 'astro';
import { diputados, colorGrupo, slug, fmtEur } from '../../../lib/data';
import { tarjetaDiputado } from '../../../lib/og';
import type { Diputado } from '../../../lib/types';

export function getStaticPaths() {
  return diputados.map((d) => ({ params: { slug: slug(d) }, props: { d } }));
}

const n = (x: number | null) => (x === null ? '—' : String(x));

export const GET: APIRoute = async ({ props }) => {
  const d = (props as { d: Diputado }).d;
  const p = d.patrimonio;
  const png = await tarjetaDiputado({
    nombre: d.nombreCompleto,
    grupo: d.grupoCorto,
    color: colorGrupo(d.grupoCorto),
    circunscripcion: d.circunscripcion,
    genero: d.genero,
    cifras: [
      { valor: n(p.propiedades), etiqueta: 'propiedades', destacada: true },
      { valor: n(p.viviendas), etiqueta: 'viviendas' },
      { valor: n(p.vehiculos), etiqueta: 'vehículos' },
      { valor: fmtEur(d.retribucion.totalMensual), etiqueta: 'al mes del Congreso' },
    ],
  });
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
