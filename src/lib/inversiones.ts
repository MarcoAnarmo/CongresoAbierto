/**
 * Qué menciona cada fila de la tabla oficial «Deuda pública, obligaciones, acciones y participaciones» de la declaración
 * de bienes, según las palabras con que la describe el propio diputado. Una fila puede mencionar acciones y fondos a la vez.
 * Si la descripción no lo dice (por ejemplo, solo «TELEFONICA» o «Valores Caixabank»), no se clasifica: no se supone qué es.
 */
const PENSIONES = /plan(es)? de (pensiones|empleo|previsi)|\bepsv\b|e\.p\.s\.v|fondos? (de )?pensiones/i;
const FONDOS = /\bfondos?\b|multifondos|\bf\.?\s?i\.?m?\.?(?=\W|$)|sicav|\betf\b|indexad/i;
const ACCIONES = /acci[oó]n|acciones|participaci[oó]n|participaciones|capital social|\b\d+([.,]\d+)?\s?%|\bs\.?\s?a\.?(?=\W|$)|\bs\.?\s?l\.?(?=\W|$)|s\.?\s?coop|\bscl\b|\bslp\b/i;

export function mencionaValor(texto: string): { acciones: boolean; fondos: boolean } {
  const pension = PENSIONES.test(texto);
  return { acciones: ACCIONES.test(texto), fondos: !pension && FONDOS.test(texto) };
}

/** Euros legibles de las filas que mencionan acciones y de las que mencionan fondos (una fila mixta cuenta en las dos). */
export function resumenInversiones(filas: { texto: string; euros: number | null }[]) {
  const r = { acciones: 0, fondos: 0, nAcciones: 0, nFondos: 0 };
  for (const f of filas) {
    const m = mencionaValor(f.texto);
    if (m.acciones) { r.nAcciones++; r.acciones += f.euros ?? 0; }
    if (m.fondos) { r.nFondos++; r.fondos += f.euros ?? 0; }
  }
  r.acciones = Math.round(r.acciones);
  r.fondos = Math.round(r.fondos);
  return r;
}
