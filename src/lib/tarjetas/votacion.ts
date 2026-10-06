/**
 * Textos de la tarjeta de una votación cualquiera, a partir de sus datos oficiales. Funciones puras (build y navegador),
 * probadas en tests/tarjeta-votacion.test.ts. No interpretan: solo acortan el título oficial y dicen quién lo propuso.
 */

/** Grupos parlamentarios tal como aparecen en los títulos oficiales → nombre corto de la web. */
const GRUPOS_TITULO: [RegExp, string][] = [
  [/Popular en el Congreso/i, 'PP'], [/Socialista/i, 'PSOE'], [/Plurinacional SUMAR|\bSUMAR\b/i, 'SUMAR'], [/\bVOX\b/i, 'VOX'],
  [/Republicano/i, 'ERC'], [/Euskal Herria Bildu/i, 'EH Bildu'], [/Vasco \(EAJ-PNV\)|EAJ-PNV/i, 'PNV'], [/Junts per Catalunya/i, 'Junts'], [/Mixto/i, 'Mixto'],
];

export type Origen =
  | { tipo: 'grupos'; grupos: string[]; clase: 'pl' | 'pnl' | 'mocion' | 'enmienda' }
  | { tipo: 'decreto' }
  | { tipo: 'proyecto' }
  | { tipo: 'otro' };

/** Quién propuso lo que se vota, según el título oficial y su clase (claseTipo de src/lib/votaciones.ts). */
export function origen(titulo: string, clase: string): Origen {
  if (/Real Decreto-ley/i.test(titulo) || clase === 'rdl') return { tipo: 'decreto' };
  // Enmiendas: las presenta un grupo, aunque se voten sobre un proyecto del Gobierno
  const enm = /enmienda/i.test(titulo) && titulo.match(/presentadas? por (?:el|los) Grupos? Parlamentarios?\s+(.+?)\.?\s*$/i);
  if (enm) {
    const grupos = GRUPOS_TITULO.filter(([r]) => r.test(enm[1])).map(([, g]) => g);
    if (grupos.length) return { tipo: 'grupos', grupos, clase: 'enmienda' };
  }
  if (/^(Votaci[oó]n .*)?Proyecto de Ley/i.test(titulo)) return { tipo: 'proyecto' };
  // «… del Grupo Parlamentario X» o «… de los Grupos Parlamentarios X, Y y Z»
  const m = titulo.match(/(?:del Grupo Parlamentario|de los Grupos Parlamentarios|presentadas? por (?:el|los) Grupos? Parlamentarios?)\s+(.+?)(?:,\s*(?:Orgánica|por la que|sobre|para|relativa|de |sobre)|\.|,? relativa|,? sobre|,? para|,? de modificación|$)/i);
  if (m) {
    const grupos = GRUPOS_TITULO.filter(([r]) => r.test(m[1])).map(([, g]) => g);
    if (grupos.length) {
      const c = /enmienda/i.test(titulo) ? 'enmienda' : clase === 'pnl' ? 'pnl' : clase === 'mocion' ? 'mocion' : 'pl';
      return { tipo: 'grupos', grupos, clase: c };
    }
  }
  return { tipo: 'otro' };
}

/**
 * Título oficial sin la fórmula del principio («Proposición de Ley del Grupo Parlamentario X, …»), que ya se dice
 * aparte. Lo que queda es literal. Si no se reconoce la fórmula, el título entero.
 */
export function tituloSinFormula(titulo: string): string {
  const t = titulo.trim().replace(/\s*\(corresponde al número de expediente[^)]*\)\.?\s*/i, '').replace(/\.\s*$/, '');
  const m = t.match(/^(?:Proposici[oó]n(?: no)? de Ley|Moci[oó]n consecuencia de interpelaci[oó]n urgente)\s+(?:Orgánica\s+)?(?:del Grupo Parlamentario|de los Grupos Parlamentarios)\s+[^,]+?(?:\s+y\s+[^,]+?)?,\s*(.+)$/i);
  const resto = m ? m[1]
    // «Proposición de Ley para …» (sin grupo, p. ej. iniciativas populares) → «Para …»
    : t.replace(/^Proposici[oó]n de Ley\s+(?=(?:para|sobre|de|relativa|por)\b)/i, '')
      // «Votación conjunta de las enmiendas …» → «Enmiendas …»
      .replace(/^Votaci[oó]n (?:conjunta )?de (?:la|las)\s+/i, '');
  return resto.charAt(0).toUpperCase() + resto.slice(1);
}

/**
 * Parte un texto en líneas que caben en `ancho` (con la función de medir del lienzo). Si no cabe en `maxLineas`,
 * la última termina en «…». Las palabras demasiado largas se cortan.
 */
export function partirLineas(texto: string, ancho: number, maxLineas: number, medir: (s: string) => number): { lineas: string[]; cortado: boolean } {
  const palabras = texto.split(/\s+/).filter(Boolean);
  const lineas: string[] = [];
  let actual = '';
  for (const p of palabras) {
    const prueba = actual ? `${actual} ${p}` : p;
    if (medir(prueba) <= ancho) { actual = prueba; continue; }
    if (actual) lineas.push(actual);
    actual = p;
    while (medir(actual) > ancho && actual.length > 1) {
      let i = actual.length - 1;
      while (i > 1 && medir(actual.slice(0, i)) > ancho) i--;
      lineas.push(actual.slice(0, i));
      actual = actual.slice(i);
    }
  }
  if (actual) lineas.push(actual);
  if (lineas.length <= maxLineas) return { lineas, cortado: false };
  const res = lineas.slice(0, maxLineas);
  let ultima = res[maxLineas - 1];
  while (ultima && medir(`${ultima}…`) > ancho) ultima = ultima.replace(/\s*\S+$/, '') || ultima.slice(0, -1);
  res[maxLineas - 1] = `${ultima.replace(/[\s,;:.]+$/, '')}…`;
  return { lineas: res, cortado: true };
}
