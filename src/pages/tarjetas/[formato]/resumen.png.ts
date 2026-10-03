import type { APIRoute } from 'astro';
import { respuestaPng, type Formato } from '../../../lib/og';
import { tarjetaResumen } from '../../../lib/tarjetas';

export function getStaticPaths() {
  return (['historia', 'horizontal'] as const).map((formato) => ({ params: { formato } }));
}
export const GET: APIRoute = async ({ params }) => respuestaPng(await tarjetaResumen(params.formato as Formato));
