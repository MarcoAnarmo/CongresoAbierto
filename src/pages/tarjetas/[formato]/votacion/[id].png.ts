import type { APIRoute } from 'astro';
import { votaciones } from '../../../../lib/data';
import { respuestaPng, type Formato } from '../../../../lib/og';
import { tarjetaVotacion } from '../../../../lib/tarjetas';
import type { VotacionClave } from '../../../../lib/types';

export function getStaticPaths() {
  return (['historia', 'horizontal'] as const).flatMap((formato) => votaciones.map((v) => ({ params: { formato, id: v.id }, props: { v } })));
}
export const GET: APIRoute = async ({ params, props }) => respuestaPng(await tarjetaVotacion((props as { v: VotacionClave }).v, params.formato as Formato));
