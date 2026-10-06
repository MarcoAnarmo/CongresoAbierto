import type { APIRoute } from 'astro';
import { conIdiomas, type Idioma } from '../../../../i18n';
import { respuestaPng, type Formato } from '../../../../lib/og';
import { tarjetaResumen, type ModoHemiciclo } from '../../../../lib/tarjetas';

/** Resumen con el hemiciclo coloreado por propiedades o viviendas (el de grupo es resumen.png). */
export function getStaticPaths() {
  return conIdiomas((['historia', 'horizontal'] as const).flatMap((formato) => (['propiedades', 'viviendas'] as const).map((modo) => ({ params: { formato, modo } }))));
}
export const GET: APIRoute = async ({ params, props }) =>
  respuestaPng(await tarjetaResumen(params.formato as Formato, (props as { lang: Idioma }).lang, params.modo as ModoHemiciclo));
