/**
 * CSV para Excel y para programas de datos. Sin dependencias: lo usan la build (ficheros fijos) y el navegador.
 *
 * - 'excel': lo que abre bien Excel con configuración española/europea: separador «;», coma decimal, BOM UTF-8
 *   (para que respete las tildes) y saltos de línea CRLF.
 * - 'csv': CSV estándar (RFC 4180) para R, Python, Google Sheets…: separador «,», punto decimal, UTF-8.
 */
import type { Celda, TipoColumna } from './tablas';

export type FormatoCsv = 'excel' | 'csv';

/** Texto que una hoja de cálculo podría ejecutar como fórmula (inyección CSV): se protege con un apóstrofo. */
const PELIGROSO = /^[=+\-@\t\r]/;

export interface OpcionesCsv {
  formato: FormatoCsv;
  /** Cómo escribir verdadero/falso (p. ej. ['Sí', 'No'] en la versión para Excel). */
  booleanos?: [string, string];
}

export function celdaCsv(v: Celda, tipo: TipoColumna, { formato, booleanos = ['true', 'false'] }: OpcionesCsv): string {
  if (v === null || v === undefined || v === '') return '';
  const sep = formato === 'excel' ? ';' : ',';
  let s: string;
  if (typeof v === 'boolean') s = v ? booleanos[0] : booleanos[1];
  else if (typeof v === 'number') s = formato === 'excel' ? String(v).replace('.', ',') : String(v);
  else {
    s = v;
    // Solo el texto libre se protege: números, fechas y direcciones no empiezan por esos signos
    if ((tipo === 'texto' || tipo === 'lista') && PELIGROSO.test(s)) s = `'${s}`;
  }
  return s.includes(sep) || s.includes('"') || s.includes('\n') || s.includes('\r') ? `"${s.replace(/"/g, '""')}"` : s;
}

export function aCsv(cabecera: string[], tipos: TipoColumna[], filas: Celda[][], op: OpcionesCsv): string {
  const sep = op.formato === 'excel' ? ';' : ',';
  const salto = op.formato === 'excel' ? '\r\n' : '\n';
  const lineas = [cabecera.map((h) => celdaCsv(h, 'texto', op)).join(sep)];
  for (const f of filas) lineas.push(f.map((v, i) => celdaCsv(v, tipos[i], op)).join(sep));
  return (op.formato === 'excel' ? '\uFEFF' : '') + lineas.join(salto) + salto;
}
