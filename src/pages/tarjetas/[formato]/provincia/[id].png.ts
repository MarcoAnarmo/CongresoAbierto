import type { APIRoute } from 'astro';
import { respuestaPng, type Formato } from '../../../../lib/og';
import { tarjetaProvincia, circunscripciones } from '../../../../lib/tarjetas';

export function getStaticPaths() {
  return (['historia', 'horizontal'] as const).flatMap((formato) => circunscripciones.map((c) => ({ params: { formato, id: c.id } })));
}
export const GET: APIRoute = async ({ params }) => respuestaPng(await tarjetaProvincia(params.id!, params.formato as Formato));
