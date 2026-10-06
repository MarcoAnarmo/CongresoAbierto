/**
 * Ayudas de idioma para los scripts del navegador. Los textos llegan en un <script type="application/json" data-textos="…">
 * que pinta cada componente con la parte `cliente` de su área (solo cadenas y listas de cadenas).
 */
import { fechaTexto, nombreMes, localeNumeros, koEko } from './fechas';

const raiz = document.documentElement;

/** Idioma de la página (atributo lang del <html>). */
export const idioma = () => raiz.lang || 'es';
/** Locale para Intl (data-locale del <html>). */
export const locale = () => raiz.dataset.locale || 'es-ES';
/** Prefijo de las direcciones en este idioma ('' o '/ca', '/eu'…), ya con la base de la web. */
export const prefijo = () => raiz.dataset.prefijo ?? '';
/** Base de la web sin idioma (para /datos/…, que es igual en todos los idiomas). */
export const base = () => raiz.dataset.base ?? '';

/** Lee los textos de un componente. */
export function textos<T>(id: string): T {
  const el = document.querySelector(`script[data-textos="${id}"]`);
  return (el ? JSON.parse(el.textContent || '{}') : {}) as T;
}

/** Sustituye {clave} por su valor: f('{n} diputados', { n: 3 }) → '3 diputados'. */
export const f = (s: string, v: Record<string, string | number> = {}) => s.replace(/\{([^{}\s]+)\}/g, (_, k) => (k in v ? String(v[k]) : `{${k}}`));
/** Singular o plural: pl(1, ['{n} vivienda', '{n} viviendas']) → '1 vivienda'. */
export const pl = (n: number, [uno, varios]: readonly [string, string] | string[], v: Record<string, string | number> = {}) =>
  f(n === 1 ? uno : varios, { n: new Intl.NumberFormat(localeNumeros(locale())).format(n), ...v });

/** Locale para Intl con números: Chrome no trae euskera ni gallego, y entonces se usa el formato de España (es-ES). */
export const localeNum = () => localeNumeros(locale());
export const fmtNum = (n: number) => new Intl.NumberFormat(localeNum()).format(n);
export const fmtEur = (n: number) => new Intl.NumberFormat(localeNum(), { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
/** 29 de noviembre de 2026 (también en euskera y gallego aunque el navegador no los traiga). */
export const fmtFecha = (iso: string, o?: Parameters<typeof fechaTexto>[3]) => fechaTexto(iso, idioma(), locale(), o);
/** 29/11/2026 (2026/11/29 en euskera). */
export const fmtFechaCorta = (iso: string) => fechaTexto(iso, idioma(), locale(), { mes: 'num' });
export { nombreMes, koEko };
