/**
 * Deudas y préstamos de cada diputado, transcritos de la página 4 de sus declaraciones de bienes
 * (data/raw/deudas/revisado.jsonl). Los textos se publican literalmente; los importes se leen como
 * número solo cuando el formato no deja dudas. Reglas documentadas en docs/metodologia.md.
 */
import { readFileSync, existsSync } from 'node:fs';
import type { Deudas, Prestamo, DeclaracionDeudas } from '../src/lib/types.ts';

interface DeudaRaw { cod: number; pdf: string; prestamos: { desc: string; fecha: string; concedido: string; pendiente: string }[]; otras: string; obs: string; dudas: string }

const RUTA = 'data/raw/deudas/revisado.jsonl';
const porPdf = new Map<string, DeudaRaw>(
  existsSync(RUTA) ? readFileSync(RUTA, 'utf8').split('\n').filter(Boolean).map((l) => { const d = JSON.parse(l) as DeudaRaw; return [d.pdf, d]; }) : [],
);

/** Textos que no declaran nada («NINGUNA», «No hay», guiones). */
const vacio = (t: string) => !t.trim() || /^(-+|ningun[oa]s?|no hay|no|nada|n\/a)\.?$/i.test(t.trim());

/**
 * Importe en euros a partir del texto literal. Devuelve null si no se puede leer sin interpretar:
 * dígitos ilegibles («?»), grupos de miles irregulares («232.00,00») o texto que no es un importe.
 */
export function importe(texto: string): number | null {
  // «180.000.-» y «20.000 E.» son formas de escribir euros
  let t = texto.trim().replace(/\.-$/, '').replace(/\s+E\.?$/i, '').replace(/€|euros?|eur\b/gi, '').replace(/\(?\d+([.,]\d+)?\s*%\)?/g, '').replace(/\s+/g, '').replace(/[’']/g, ',');
  if (!t || /[^\d.,]/.test(t)) return null;
  const sep = [...t.matchAll(/[.,]/g)].map((m) => m[0]);
  let entero = t, dec = '';
  const ultimo = Math.max(t.lastIndexOf('.'), t.lastIndexOf(','));
  if (ultimo >= 0) {
    const cola = t.slice(ultimo + 1);
    // El último separador es decimal si le siguen 1 o 2 cifras; si le siguen 3, es de miles
    if (cola.length === 1 || cola.length === 2) { entero = t.slice(0, ultimo); dec = cola; }
    else if (cola.length !== 3) return null;
  }
  // Los separadores restantes son de miles: todos iguales y con grupos de 3 cifras
  const grupos = entero.split(/[.,]/);
  if (new Set(sep.slice(0, dec ? -1 : undefined)).size > 1) return null;
  if (grupos.length > 1 && (grupos[0].length === 0 || grupos[0].length > 3 || grupos.slice(1).some((g) => g.length !== 3))) return null;
  const n = Number(grupos.join('') + (dec ? `.${dec}` : ''));
  return Number.isFinite(n) ? n : null;
}

/**
 * Deudas de cada declaración del patrimonio vigente (la última y, si solo comunica cambios, las anteriores
 * hasta la última completa). No se suman entre declaraciones: un mismo préstamo puede repetirse en varias.
 * La principal es la más reciente que rellena el apartado de deudas.
 */
export function construirDeudas(fuentes: { url: string; fecha: string | null; parcial: boolean }[]): Deudas | null {
  const declaraciones: DeclaracionDeudas[] = [];
  for (const f of fuentes) {
    const d = porPdf.get(f.url.split('/').pop()!);
    if (!d) continue;
    const prestamos: Prestamo[] = d.prestamos
      .filter((p) => !(vacio(p.desc) && vacio(p.concedido) && vacio(p.pendiente)))
      .map((p) => ({
        descripcion: p.desc, fechaConcesion: p.fecha || null, concedido: p.concedido || null, pendiente: p.pendiente || null,
        concedidoEuros: p.concedido ? importe(p.concedido) : null, pendienteEuros: p.pendiente ? importe(p.pendiente) : null,
      }));
    const pendientes = prestamos.filter((p) => p.pendiente);
    declaraciones.push({
      fecha: f.fecha, url: f.url, parcial: f.parcial, prestamos,
      otras: vacio(d.otras) ? null : d.otras, nota: d.obs || null,
      totalPendiente: pendientes.reduce((a, p) => a + (p.pendienteEuros ?? 0), 0),
      totalIncompleto: pendientes.some((p) => p.pendienteEuros === null),
    });
  }
  if (!declaraciones.length) return null;
  const conDatos = declaraciones.filter((x) => x.prestamos.length || x.otras);
  return { principal: conDatos[0] ?? null, anteriores: conDatos.slice(1), sinDeudas: conDatos.length === 0 };
}

/** Resumen de las deudas de una declaración para la línea de tiempo. */
export function resumenDeudas(pdf: string): string | null {
  const d = porPdf.get(pdf);
  if (!d) return null;
  const ps = d.prestamos.filter((p) => !(vacio(p.desc) && vacio(p.concedido) && vacio(p.pendiente)));
  if (!ps.length) return vacio(d.otras) ? 'sin préstamos declarados' : 'otras deudas declaradas';
  const suma = ps.reduce((a, p) => a + (importe(p.pendiente) ?? 0), 0);
  const incompleto = ps.some((p) => p.pendiente && importe(p.pendiente) === null);
  const eur = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(suma);
  return `${ps.length} ${ps.length === 1 ? 'préstamo' : 'préstamos'} con ${incompleto ? 'al menos ' : ''}${eur} pendientes`;
}
