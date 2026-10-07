import type { APIRoute } from 'astro';
import { conIdiomas, type Idioma } from '../../../../../i18n';
import { respuestaPng, type Formato } from '../../../../../lib/og';
import { tarjetaEstadistica, ESTADISTICAS, type IdEstadistica } from '../../../../../lib/tarjetas-estadisticas';

/** Tarjetas de las estadísticas de rentas, acciones y fondos, empresas y ONG, en los dos formatos. */
export function getStaticPaths() {
  return conIdiomas((['historia', 'horizontal'] as const).flatMap((formato) => ESTADISTICAS.map((id) => ({ params: { formato, id } }))));
}
export const GET: APIRoute = async ({ params, props }) =>
  respuestaPng(await tarjetaEstadistica(params.id as IdEstadistica, params.formato as Formato, (props as { lang: Idioma }).lang));
