/**
 * Asistente de descargas (página Datos): pasos y resumen de los filtros. Funciones puras, sin DOM, para usarlas en
 * src/scripts/descargas.ts y probarlas en tests/asistente.test.ts.
 */
import type { DefFiltro } from './tablas';

/** Pasos del asistente, en orden: 1) tabla, 2) filtros, 3) columnas, 4) formato y descarga. */
export const PASOS = ['tabla', 'filtros', 'columnas', 'descargar'] as const;
export type Paso = 1 | 2 | 3 | 4;
export const TOTAL_PASOS = PASOS.length;

/** Paso pedido en la dirección (?paso=3). Si no hay o no vale: el 4 si la dirección ya elige tabla (enlaces de «Descargar estos datos»), si no el 1. */
export function pasoInicial(params: URLSearchParams): Paso {
  const n = Number(params.get('paso'));
  if (Number.isInteger(n) && n >= 1 && n <= TOTAL_PASOS) return n as Paso;
  return params.has('tabla') ? 4 : 1;
}

/** Paso siguiente o anterior, sin salirse de 1…4. */
export const mover = (p: Paso, d: number): Paso => Math.min(TOTAL_PASOS, Math.max(1, p + d)) as Paso;

export interface EstadoFiltros { valores: Record<string, string[]>; desde: string; hasta: string; texto: string }
/** Un filtro aplicado, para el resumen y para quitarlo de uno en uno. */
export interface Aplicado {
  /** Filtro (id) y, si es de valores, el valor concreto. */
  filtro: string; valor?: string; campo?: 'desde' | 'hasta' | 'texto';
  /** Texto para mostrar (nombre del filtro y valor). */
  texto: string;
}

/** Filtros aplicados en el orden de la tabla, con su texto: «Grupo: PSOE», «Desde: 2024-01-01», «Nombre: “ana”». */
export function filtrosAplicados(
  e: EstadoFiltros, filtros: DefFiltro[], nombreFiltro: (id: string) => string, nombreValor: (filtro: string, v: string) => string,
  tx: { desde: string; hasta: string },
): Aplicado[] {
  const r: Aplicado[] = [];
  for (const fi of filtros) {
    if (fi.tipo === 'valores') for (const v of e.valores[fi.id] ?? []) r.push({ filtro: fi.id, valor: v, texto: `${nombreFiltro(fi.id)}: ${nombreValor(fi.id, v)}` });
    else if (fi.tipo === 'fechas') {
      if (e.desde) r.push({ filtro: fi.id, campo: 'desde', texto: `${tx.desde}: ${e.desde}` });
      if (e.hasta) r.push({ filtro: fi.id, campo: 'hasta', texto: `${tx.hasta}: ${e.hasta}` });
    } else if (e.texto) r.push({ filtro: fi.id, campo: 'texto', texto: `${nombreFiltro(fi.id)}: «${e.texto}»` });
  }
  return r;
}

/** Quita un filtro aplicado y devuelve el estado nuevo (sin cambiar el de entrada). */
export function quitarFiltro<E extends EstadoFiltros>(e: E, a: Pick<Aplicado, 'filtro' | 'valor' | 'campo'>): E {
  if (a.campo) return { ...e, [a.campo]: '' };
  const resto = (e.valores[a.filtro] ?? []).filter((v) => v !== a.valor);
  return { ...e, valores: { ...e.valores, [a.filtro]: resto } };
}
