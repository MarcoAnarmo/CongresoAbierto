import type { APIRoute } from 'astro';
import { votacionesPleno } from '../../../lib/data';

/** Voto de cada diputado en cada votación del Pleno, para pintarla en el hemiciclo (se descarga solo al pedirla). */
export function getStaticPaths() {
  return votacionesPleno.map((v) => ({ params: { id: v.id }, props: { v } }));
}

const letra = { 'Sí': 'S', 'No': 'N', 'Abstención': 'A', 'No vota': 'X' } as const;

export const GET: APIRoute = ({ props }) => {
  const { v } = props as { v: (typeof votacionesPleno)[number] };
  return new Response(JSON.stringify({
    id: v.id, titulo: v.titulo, tipo: v.tipo, fecha: v.fecha, resultado: v.resultado, totales: v.totales,
    votos: Object.fromEntries(Object.entries(v.votos).map(([c, x]) => [c, letra[x as keyof typeof letra] ?? 'X'])),
  }), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
