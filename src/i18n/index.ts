/**
 * Idiomas de la web: castellano (en la raíz) y catalán/valenciano, euskera, gallego e inglés (con prefijo: /ca/, /eu/, /gl/, /en/).
 *
 * Los textos de la interfaz están en src/i18n/textos/<área>.ts, cada uno con los cinco idiomas.
 * Los datos oficiales (títulos de votaciones, cargos, estudios, textos de las declaraciones…) se muestran tal como
 * los publica el Congreso, en castellano: no se traducen.
 */
import { fechaTexto } from './fechas';

export const IDIOMAS = ['es', 'ca', 'eu', 'gl', 'en'] as const;
export type Idioma = (typeof IDIOMAS)[number];
export const DEFECTO: Idioma = 'es';

/** Nombre de cada idioma en ese mismo idioma (para el selector). */
export const NOMBRE_IDIOMA: Record<Idioma, string> = { es: 'Castellano', ca: 'Català', eu: 'Euskara', gl: 'Galego', en: 'English' };
/** Locale para Intl (números, importes y fechas). */
export const LOCALE: Record<Idioma, string> = { es: 'es-ES', ca: 'ca-ES', eu: 'eu-ES', gl: 'gl-ES', en: 'en-GB' };
/** Locale de Open Graph. */
export const OG_LOCALE: Record<Idioma, string> = { es: 'es_ES', ca: 'ca_ES', eu: 'eu_ES', gl: 'gl_ES', en: 'en_GB' };

export const esIdioma = (x: unknown): x is Idioma => typeof x === 'string' && (IDIOMAS as readonly string[]).includes(x);

/** Parámetro `lang` de las rutas [...lang]: undefined para el castellano (raíz) y el código para el resto. */
export const parametroIdioma = (lang: Idioma) => (lang === DEFECTO ? undefined : lang);
/** Rutas estáticas de cada idioma, para getStaticPaths(). */
export const rutasIdioma = () => IDIOMAS.map((lang) => ({ params: { lang: parametroIdioma(lang) }, props: { lang } }));
/** Combina las rutas de cada idioma con otras rutas (diputados, tarjetas…). */
export const conIdiomas = <P extends Record<string, string | undefined>, Q extends Record<string, unknown>>(rutas: { params: P; props?: Q }[]) =>
  IDIOMAS.flatMap((lang) => rutas.map((r) => ({ params: { ...r.params, lang: parametroIdioma(lang) }, props: { ...(r.props ?? ({} as Q)), lang } })));

/** Idioma de una página a partir de Astro.params.lang. */
export const idiomaDe = (lang: string | undefined): Idioma => (esIdioma(lang) ? lang : DEFECTO);

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
/** Prefijo de idioma: '' en castellano y '/ca', '/eu'… en el resto. */
export const prefijo = (lang: Idioma) => (lang === DEFECTO ? '' : `/${lang}`);
/** Dirección de una página de la web en un idioma: enlace('/diputados', 'ca') → '/ca/diputados'. */
export const enlace = (p: string, lang: Idioma) => {
  const pre = prefijo(lang);
  if (!pre) return `${base}${p}`;
  return `${base}${pre}${p === '/' ? '/' : p}`;
};
/** Ruta sin el prefijo de idioma ('/ca/diputados' → '/diputados'). */
export const sinIdioma = (pathname: string) => {
  const p = pathname.startsWith(base) ? pathname.slice(base.length) || '/' : pathname;
  const m = p.match(/^\/(ca|eu|gl|en)(\/.*|$)/);
  return m ? m[2] || '/' : p;
};

/** Formatos de números, importes y fechas en cada idioma. */
export function formatos(lang: Idioma) {
  const loc = LOCALE[lang];
  const eur0 = new Intl.NumberFormat(loc, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  const eur2 = new Intl.NumberFormat(loc, { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 });
  const num = new Intl.NumberFormat(loc, { maximumFractionDigits: 2 });
  return {
    eur: (n: number) => eur0.format(n),
    eur2: (n: number) => eur2.format(n),
    num: (n: number) => num.format(n),
    /** 29 de noviembre de 2026 / 29 de novembre de 2026 / 2026(e)ko azaroaren 29a / 29 November 2026 */
    fecha: (iso: string | null) => (iso ? fechaTexto(iso, lang, loc) : '—'),
    /** 29/11/2026 */
    fechaCorta: (iso: string) => fechaTexto(iso, lang, loc, { mes: 'num' }),
    /** Ordenación alfabética */
    comparar: (a: string, b: string) => a.localeCompare(b, loc),
  };
}

/**
 * Un área de textos: un objeto por idioma con las mismas claves. El castellano es la referencia: TypeScript avisa si
 * a otro idioma le falta una clave o una función no tiene la misma forma.
 */
export type Textos<T> = { [K in keyof T]: T[K] extends (...a: infer A) => string ? (...a: A) => string : T[K] extends string ? string : T[K] extends readonly string[] ? string[] : Textos<T[K]> };
export const area = <T>(es: T, otros: Record<Exclude<Idioma, 'es'>, Textos<T>>) => ({ es: es as unknown as Textos<T>, ...otros }) as Record<Idioma, Textos<T>>;

/** Sustituye {clave} por su valor: f('{n} diputados', { n: 3 }) → '3 diputados'. */
export const f = (s: string, v: Record<string, string | number> = {}) => s.replace(/\{([^{}\s]+)\}/g, (_, k) => (k in v ? String(v[k]) : `{${k}}`));
/** Singular o plural con el número ya formateado: pl(1, ['{n} vivienda', '{n} viviendas'], 'es') → '1 vivienda'. */
export const pl = (n: number, [uno, varios]: readonly [string, string] | string[], lang: Idioma = DEFECTO, v: Record<string, string | number> = {}) =>
  f(n === 1 ? uno : varios, { n: new Intl.NumberFormat(LOCALE[lang]).format(n), ...v });

/** Idioma de una página a partir de su dirección (para componentes y la plantilla). */
export const idiomaDeUrl = (pathname: string): Idioma => {
  const p = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  const m = p.match(/^\/(ca|eu|gl|en)(\/|$)/);
  return m ? (m[1] as Idioma) : DEFECTO;
};
