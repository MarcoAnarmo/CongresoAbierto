import type { APIRoute } from 'astro';
import { conIdiomas, type Idioma } from '../../../../../i18n';
import { diputados, slug } from '../../../../../lib/data';
import { respuestaPng, type Formato } from '../../../../../lib/og';
import { tarjetaDiputado } from '../../../../../lib/tarjetas';
import type { Diputado } from '../../../../../lib/types';

export function getStaticPaths() {
  return conIdiomas((['historia', 'horizontal'] as const).flatMap((formato) => diputados.map((d) => ({ params: { formato, slug: slug(d) }, props: { d } }))));
}
export const GET: APIRoute = async ({ params, props }) => respuestaPng(await tarjetaDiputado((props as { d: Diputado }).d, params.formato as Formato, (props as { lang: Idioma }).lang));
