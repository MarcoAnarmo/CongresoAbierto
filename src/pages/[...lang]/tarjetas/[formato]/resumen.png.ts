import type { APIRoute } from 'astro';
import { conIdiomas, type Idioma } from '../../../../i18n';
import { respuestaPng, type Formato } from '../../../../lib/og';
import { tarjetaResumen } from '../../../../lib/tarjetas';

export function getStaticPaths() {
  return conIdiomas((['historia', 'horizontal'] as const).map((formato) => ({ params: { formato } })));
}
export const GET: APIRoute = async ({ params, props }) => respuestaPng(await tarjetaResumen(params.formato as Formato, (props as { lang: Idioma }).lang));
