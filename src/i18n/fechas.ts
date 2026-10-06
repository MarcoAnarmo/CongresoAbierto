/**
 * Fechas en cada idioma, también donde el navegador no trae ese idioma: Chrome (escritorio y Android) no incluye
 * euskera ni gallego en Intl y escribiría «November 29, 2026». Para esos dos se usan tablas propias.
 * El euskera usa siempre la tabla, también en el servidor: Intl da «2026(e)ko azaroaren 29(a)», con paréntesis.
 */
type Opciones = { semana?: boolean; mes?: 'long' | 'short' | 'num'; anio?: boolean };

const MESES = {
  gl: ['xaneiro', 'febreiro', 'marzo', 'abril', 'maio', 'xuño', 'xullo', 'agosto', 'setembro', 'outubro', 'novembro', 'decembro'],
  eu: ['urtarrila', 'otsaila', 'martxoa', 'apirila', 'maiatza', 'ekaina', 'uztaila', 'abuztua', 'iraila', 'urria', 'azaroa', 'abendua'],
};
const MESES_CORTOS = {
  gl: ['xan.', 'feb.', 'mar.', 'abr.', 'maio', 'xuño', 'xul.', 'ago.', 'set.', 'out.', 'nov.', 'dec.'],
  eu: ['urt.', 'ots.', 'mar.', 'api.', 'mai.', 'eka.', 'uzt.', 'abu.', 'ira.', 'urr.', 'aza.', 'abe.'],
};
const SEMANA = {
  gl: ['domingo', 'luns', 'martes', 'mércores', 'xoves', 'venres', 'sábado'],
  eu: ['igandea', 'astelehena', 'asteartea', 'asteazkena', 'osteguna', 'ostirala', 'larunbata'],
};

/** Sufijo del año en euskera: 2026ko, 2025eko (bost), 2021eko (bat), 2030eko (hamar)… */
export const koEko = (y: number) => {
  const u = y % 10, d = Math.floor(y / 10) % 10;
  if (u === 0) return d % 2 === 1 ? 'eko' : 'ko'; // 2030 «hogeita hamar» → eko; 2020 «hogei» → ko
  if (u === 1 || u === 5) return 'eko';
  return 'ko';
};
/** Artículo del día en euskera: «29a», «1a»; 11 y 31 (hamaika) no lo llevan. */
const diaEu = (d: number) => (d === 11 || d === 31 ? String(d) : `${d}a`);

const soportado = new Map<string, boolean>();
const tieneIntl = (loc: string) => {
  if (!soportado.has(loc)) {
    let ok = false;
    try { ok = Intl.DateTimeFormat.supportedLocalesOf(loc).length > 0 && new Intl.DateTimeFormat(loc).resolvedOptions().locale.slice(0, 2) === loc.slice(0, 2); } catch {}
    soportado.set(loc, ok);
  }
  return soportado.get(loc)!;
};

/** Fecha ISO (AAAA-MM-DD) como texto en un idioma. */
export function fechaTexto(iso: string, lang: string, locale: string, o: Opciones = {}): string {
  const { semana = false, mes = 'long', anio = true } = o;
  const f = new Date(iso.slice(0, 10) + 'T12:00:00');
  const y = f.getFullYear(), m = f.getMonth(), d = f.getDate(), w = f.getDay();
  if (lang === 'eu') {
    if (mes === 'num') return anio ? `${y}/${String(m + 1).padStart(2, '0')}/${String(d).padStart(2, '0')}` : `${String(m + 1).padStart(2, '0')}/${String(d).padStart(2, '0')}`;
    const mm = mes === 'short' ? `${MESES_CORTOS.eu[m]} ${d}` : `${MESES.eu[m].replace(/a$/, '')}aren ${diaEu(d)}`;
    return `${anio ? `${y}${koEko(y)} ` : ''}${mm}${semana ? `, ${SEMANA.eu[w]}` : ''}`;
  }
  if (lang === 'gl' && !tieneIntl(locale)) {
    if (mes === 'num') return anio ? `${String(d).padStart(2, '0')}/${String(m + 1).padStart(2, '0')}/${y}` : `${String(d).padStart(2, '0')}/${String(m + 1).padStart(2, '0')}`;
    const txt = mes === 'short' ? `${d} ${MESES_CORTOS.gl[m]}${anio ? ` ${y}` : ''}` : `${d} de ${MESES.gl[m]}${anio ? ` de ${y}` : ''}`;
    return `${semana ? `${SEMANA.gl[w]}, ` : ''}${txt}`;
  }
  const opts: Intl.DateTimeFormatOptions = mes === 'num'
    ? { day: '2-digit', month: '2-digit', ...(anio ? { year: 'numeric' } : {}) }
    : { day: 'numeric', month: mes, ...(anio ? { year: 'numeric' } : {}), ...(semana ? { weekday: 'long' } : {}) };
  return f.toLocaleDateString(locale, opts);
}

/** Nombre del mes (para «{mes} de {año}»). En euskera, la forma con -a final («azaroa»). */
export function nombreMes(mes0: number, lang: string, locale: string): string {
  if (lang === 'eu') return MESES.eu[mes0];
  if (lang === 'gl' && !tieneIntl(locale)) return MESES.gl[mes0];
  return new Date(2024, mes0, 1, 12).toLocaleDateString(locale, { month: 'long' });
}

/** Locale para números: si el navegador no trae el idioma (euskera y gallego en Chrome), el formato de España. */
export const localeNumeros = (locale: string) => (tieneIntl(locale) ? locale : 'es-ES');
