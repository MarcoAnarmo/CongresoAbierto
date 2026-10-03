import type { APIRoute } from 'astro';
import { tarjetaPagina } from '../../lib/og';

/** Tarjetas genéricas para las páginas que no son de un diputado. */
export const PAGINAS: Record<string, { titulo: string; subtitulo: string }> = {
  portada: { titulo: '¿Quién te representa y qué tiene?', subtitulo: 'Los 350 diputados del Congreso: lo que cobran, las propiedades que declaran y cómo votan.' },
  ranking: { titulo: 'Ranking de los 350 diputados', subtitulo: 'Propiedades, viviendas, vehículos y retribución según sus declaraciones oficiales.' },
  votaciones: { titulo: 'Votaciones sobre vivienda', subtitulo: 'Qué se votó en el Pleno del Congreso y qué votó cada diputado.' },
  metodologia: { titulo: 'Metodología', subtitulo: 'De dónde sale cada dato y cómo se cuenta.' },
  colabora: { titulo: 'Colabora', subtitulo: 'Proyecto independiente y de código abierto.' },
};

export function getStaticPaths() {
  return Object.keys(PAGINAS).map((pagina) => ({ params: { pagina } }));
}

export const GET: APIRoute = async ({ params }) => {
  const p = PAGINAS[params.pagina!];
  return new Response(await tarjetaPagina(p.titulo, p.subtitulo), { headers: { 'Content-Type': 'image/png' } });
};
