import type { APIRoute } from 'astro';
import { conIdiomas, type Idioma } from '../../../../../i18n';
import { respuestaPng, type Formato } from '../../../../../lib/og';
import { tarjetaProvincia, circunscripciones } from '../../../../../lib/tarjetas';

export function getStaticPaths() {
  return conIdiomas((['historia', 'horizontal'] as const).flatMap((formato) => circunscripciones.map((c) => ({ params: { formato, id: c.id } }))));
}
export const GET: APIRoute = async ({ params, props }) => respuestaPng(await tarjetaProvincia(params.id!, params.formato as Formato, (props as { lang: Idioma }).lang));
