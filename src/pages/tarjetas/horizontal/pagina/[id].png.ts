import type { APIRoute } from 'astro';
import { respuestaPng } from '../../../../lib/og';
import { tarjetaPagina, PAGINAS } from '../../../../lib/tarjetas';

export function getStaticPaths() {
  return Object.keys(PAGINAS).map((id) => ({ params: { id } }));
}
export const GET: APIRoute = async ({ params }) => respuestaPng(await tarjetaPagina(params.id!));
