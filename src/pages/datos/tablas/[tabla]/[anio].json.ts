import type { APIRoute } from 'astro';
import { aniosVotos, votosAnio, generado, type FicheroVotosAnio } from '../../../../lib/datos/filas';

/** Votos nominales del Pleno por año (tabla «votos», partida por años para no descargar todo de golpe). */
export function getStaticPaths() {
  return aniosVotos().map((anio) => ({ params: { tabla: 'votos', anio: String(anio) } }));
}

export const GET: APIRoute = ({ params }) => {
  const anio = Number(params.anio);
  const fichero: FicheroVotosAnio = { tabla: 'votos', anio, generado: generado(), votaciones: votosAnio(anio) };
  return new Response(JSON.stringify(fichero), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
