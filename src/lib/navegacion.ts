/**
 * Menú de la web en un solo sitio: cabecera (ordenador), barra inferior (móvil), hoja «Más» y pie.
 *
 * - `principal`: aparece en la cabecera y en la barra del móvil. La barra del móvil tiene sitio para 5 botones:
 *   4 secciones y «Más». Si se añade una sección, va en `secundarias` (hoja «Más») o se agrupa con otra
 *   (como Estadísticas y Datos, que comparten botón en el móvil y se cambian con pestañas dentro de la página).
 * - `secundarias`: páginas para quien quiere saber más (método, colaborar, tarjetas…). En el móvil, en la hoja «Más».
 */
import type { NombreIcono } from './iconos';
import type comun from '../i18n/textos/comun';

type Nav = (typeof comun)['es']['nav'];
export interface EntradaMenu {
  href: string;
  /** Clave del texto en comun.nav (o en comun.pie para las externas). */
  texto: keyof Nav;
  /** Texto corto para la barra del móvil. */
  corto?: keyof Nav;
  icono: NombreIcono;
  /** Otras rutas que marcan esta entrada como la actual (p. ej. /diputado/… → Diputados). */
  tambien?: string[];
}

/** Cabecera en el ordenador, en este orden. */
export const PRINCIPAL: EntradaMenu[] = [
  { href: '/', texto: 'hemiciclo', icono: 'hemiciclo' },
  { href: '/diputados', texto: 'diputados', icono: 'fichas', tambien: ['/diputado/', '/provincia/'] },
  { href: '/votaciones', texto: 'votaciones', corto: 'votacionesCorto', icono: 'votaciones' },
  { href: '/estadisticas', texto: 'estadisticas', icono: 'estadisticas' },
  { href: '/datos', texto: 'datos', icono: 'descarga' },
];

/** Barra inferior del móvil: 4 secciones + «Más». Estadísticas y Datos comparten botón. */
export const BARRA_MOVIL: EntradaMenu[] = [
  PRINCIPAL[0],
  PRINCIPAL[1],
  PRINCIPAL[2],
  { href: '/estadisticas', texto: 'datos', icono: 'estadisticas', tambien: ['/datos'] },
];

/** Hoja «Más» (móvil) y desplegable «Más» (ordenador). */
export const SECUNDARIAS: EntradaMenu[] = [
  { href: '/metodologia', texto: 'metodologia', icono: 'metodo' },
  { href: '/colabora', texto: 'colabora', icono: 'colabora' },
  { href: '/tarjetas', texto: 'tarjetas', icono: 'imagen' },
];

/** ¿Es `ruta` (sin idioma ni barra final) la página de esta entrada? */
export const esActual = (e: EntradaMenu, ruta: string) =>
  e.href === '/' ? ruta === '/' || ruta === '' : ruta === e.href || ruta.startsWith(`${e.href}/`) || (e.tambien ?? []).some((x) => ruta === x || ruta.startsWith(x));
