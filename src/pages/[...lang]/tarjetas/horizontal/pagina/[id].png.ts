import type { APIRoute } from 'astro';
import { conIdiomas, type Idioma } from '../../../../../i18n';
import { respuestaPng } from '../../../../../lib/og';
import { tarjetaPagina, PAGINAS } from '../../../../../lib/tarjetas';

export function getStaticPaths() {
  return conIdiomas(Object.keys(PAGINAS).map((id) => ({ params: { id } })));
}
export const GET: APIRoute = async ({ params, props }) => respuestaPng(await tarjetaPagina(params.id!, (props as { lang: Idioma }).lang));
