/**
 * Estadísticas de dinero (rentas, acciones y fondos) y de participación en empresas y entidades.
 * Funciones puras, calculadas en la build, que usan la página Estadísticas y las tarjetas para compartir.
 * Se prueban en tests/estadisticas-dinero.test.ts.
 *
 * Principios: siempre totales (cuántos diputados, cuántos euros), nunca medias; solo lo que dice el documento oficial
 * (la remuneración «no consta» no cuenta como cobrar ni como no cobrar); una aportación a una ONG no es un cargo en ella.
 */
import type { Diputado } from './types';
import { resumenInversiones } from './inversiones';
import type { AparicionVinculo, RelacionVinculo, RemuneracionVinculo, TipoEntidad, VinculoEntidad } from './vinculos';

/* ---------- Por grupo ---------- */

/** Por grupo: cuántos diputados cumplen `cumple` de los `de` que entran en la base (p. ej. los que tienen declaración). */
export function porGrupo(ds: Diputado[], grupos: string[], cumple: (d: Diputado) => boolean, base: (d: Diputado) => boolean = () => true) {
  return grupos.map((g) => {
    const xs = ds.filter((d) => d.grupoCorto === g && base(d));
    return { g, n: xs.filter(cumple).length, de: xs.length };
  }).filter((x) => x.de > 0);
}

/** Tiene publicada su declaración de bienes. */
export const conDeclaracion = (d: Diputado) => !!d.finanzas;
/** Tiene publicada alguna declaración de intereses económicos (donde se declaran las aportaciones a ONG). */
export const conIntereses = (d: Diputado) => !!d.intereses;

/* ---------- Rentas ---------- */

/** Declara alguna renta (sin el sueldo del Congreso): total mayor que cero o algún importe ilegible. */
export const declaraRentas = (d: Diputado) => {
  const r = d.finanzas?.rentas;
  return !!r && ((r.total ?? 0) > 0 || r.totalIncompleto);
};

export interface Importe { d: Diputado; euros: number; alMenos: boolean }
const ordenImporte = (a: Importe, b: Importe) => b.euros - a.euros || a.d.apellidos.localeCompare(b.d.apellidos, 'es');

/** Quién declara más rentas (total legible; «al menos» si algún importe es ilegible). */
export const masRentas = (ds: Diputado[], n = 10): Importe[] =>
  ds.filter(declaraRentas).map((d) => ({ d, euros: Math.round(d.finanzas!.rentas!.total ?? 0), alMenos: !!d.finanzas!.rentas!.totalIncompleto }))
    .filter((x) => x.euros > 0).sort(ordenImporte).slice(0, n);

export const TIPOS_RENTA = ['salariales', 'dividendos', 'intereses', 'otras'] as const;
/** Cuántos diputados declaran alguna renta de cada tipo (una persona cuenta en cada tipo que declara). */
export function tiposDeRenta(ds: Diputado[]) {
  const r = new Map<(typeof TIPOS_RENTA)[number], number>(TIPOS_RENTA.map((k) => [k, 0]));
  for (const d of ds) {
    const tipos = new Set((d.finanzas?.rentas?.filas ?? []).filter((x) => (x.euros ?? 0) > 0 || x.euros === null).map((x) => x.tipo));
    for (const k of tipos) if (r.has(k)) r.set(k, r.get(k)! + 1);
  }
  return r;
}

/* ---------- Acciones, fondos y otros valores ---------- */

/** Qué declara en la tabla oficial de «Deuda pública, obligaciones, acciones y participaciones», según sus palabras. */
export function inversionDe(d: Diputado) {
  const v = d.finanzas?.valores;
  const filas = v?.filas ?? [];
  const r = resumenInversiones(filas);
  return { declara: filas.length > 0, total: Math.round(v?.total ?? 0), alMenos: !!v?.totalIncompleto, ...r };
}
export const declaraAcciones = (d: Diputado) => inversionDe(d).nAcciones > 0;
export const declaraFondos = (d: Diputado) => inversionDe(d).nFondos > 0;
export const declaraValores = (d: Diputado) => inversionDe(d).declara;

/** Quién declara más en esa tabla (acciones, fondos, deuda pública y otros valores). */
export const masValores = (ds: Diputado[], n = 10): Importe[] =>
  ds.map((d) => ({ d, x: inversionDe(d) })).filter(({ x }) => x.total > 0)
    .map(({ d, x }) => ({ d, euros: x.total, alMenos: x.alMenos })).sort(ordenImporte).slice(0, n);

/** Totales del Congreso: diputados que declaran acciones o fondos y euros legibles de cada cosa. */
export function totalesInversion(ds: Diputado[]) {
  const r = { valores: 0, acciones: 0, fondos: 0, eurosValores: 0, eurosAcciones: 0, eurosFondos: 0, mixtas: 0 };
  for (const d of ds) {
    const x = inversionDe(d);
    if (x.declara) { r.valores++; r.eurosValores += x.total; }
    if (x.nAcciones) { r.acciones++; r.eurosAcciones += x.acciones; }
    if (x.nFondos) { r.fondos++; r.eurosFondos += x.fondos; }
  }
  return r;
}

/* ---------- Empresas y entidades ---------- */

const entidades = (d: Diputado): VinculoEntidad[] => d.vinculos?.entidades ?? [];
/** ¿Alguna entidad del diputado cumple la condición en alguna de sus apariciones? */
export const tieneVinculo = (d: Diputado, cumple: (e: VinculoEntidad, a: AparicionVinculo) => boolean) =>
  entidades(d).some((e) => e.apariciones.some((a) => cumple(e, a)));

export const esOng = (t: TipoEntidad) => t === 'fundacion' || t === 'asociacion';
/** Nombra alguna empresa privada en sus documentos (cualquier relación). */
export const conEmpresas = (d: Diputado) => tieneVinculo(d, (e) => e.tipo === 'empresa');
/** Declara aportaciones (cuotas o donaciones) a fundaciones, ONG o asociaciones. */
export const aportaAOng = (d: Diputado) => tieneVinculo(d, (e, a) => esOng(e.tipo) && a.relacion === 'aportacion');
/** Cargo, trabajo o actividad en una fundación, ONG o asociación (no cuenta una aportación). */
export const cargoEnOng = (d: Diputado) => tieneVinculo(d, (e, a) => esOng(e.tipo) && a.relacion !== 'aportacion');
/** Cargos en sociedades del BORME confirmados por otro documento oficial. */
export const conBorme = (d: Diputado) => (d.vinculos?.borme.length ?? 0) > 0;

/** Relaciones con empresas privadas: cuántos diputados tienen cada tipo (una persona cuenta en cada tipo que tiene). */
export function relacionesConEmpresas(ds: Diputado[]) {
  const r = new Map<RelacionVinculo, number>();
  for (const d of ds) {
    const rels = new Set(entidades(d).filter((e) => e.tipo === 'empresa').flatMap((e) => e.apariciones.map((a) => a.relacion)));
    for (const k of rels) r.set(k, (r.get(k) ?? 0) + 1);
  }
  return [...r].map(([relacion, n]) => ({ relacion, n })).sort((a, b) => b.n - a.n);
}

export const REMUNERACIONES = ['si', 'complemento', 'dietas', 'no'] as const;
type Rem = Exclude<RemuneracionVinculo, null>;
/**
 * Cuántos diputados tienen, en algún documento, una relación con remuneración, solo complemento por antigüedad,
 * solo dietas o gastos, o sin remuneración (con cualquier empresa o entidad). Una persona cuenta en cada caso que aparece.
 */
export function remuneracionDiputados(ds: Diputado[]) {
  const r = new Map<Rem, number>(REMUNERACIONES.map((k) => [k, 0]));
  for (const d of ds) {
    const rems = new Set(entidades(d).flatMap((e) => e.apariciones.map((a) => a.remuneracion)).filter((x): x is Rem => !!x));
    for (const k of rems) r.set(k, r.get(k)! + 1);
  }
  return r;
}

/** Diputados con alguna relación remunerada según el documento, con la entidad y el tipo de relación. */
export function conRemuneracion(ds: Diputado[]) {
  return ds.map((d) => ({
    d,
    entidades: entidades(d).filter((e) => e.apariciones.some((a) => a.remuneracion === 'si'))
      .map((e) => ({ nombre: e.nombre, tipo: e.tipo, relacion: e.apariciones.find((a) => a.remuneracion === 'si')!.relacion })),
  })).filter((x) => x.entidades.length > 0);
}

/**
 * Entidades nombradas por más diputados con una condición (p. ej. acciones de una empresa, aportaciones a una ONG).
 * Se agrupan por su identificador (el mismo nombre en toda la web) y cada diputado cuenta una vez.
 */
export function masNombradas(ds: Diputado[], cumple: (e: VinculoEntidad, a: AparicionVinculo) => boolean, n = 10) {
  const r = new Map<string, { nombre: string; tipo: TipoEntidad; n: number }>();
  for (const d of ds) {
    for (const e of entidades(d)) {
      if (!e.apariciones.some((a) => cumple(e, a))) continue;
      const x = r.get(e.slug) ?? { nombre: e.nombre, tipo: e.tipo, n: 0 };
      x.n++;
      r.set(e.slug, x);
    }
  }
  return [...r.values()].sort((a, b) => b.n - a.n || a.nombre.localeCompare(b.nombre, 'es')).slice(0, n);
}

/** Quién nombra más empresas privadas en sus documentos (con cualquier relación). */
export const masEmpresas = (ds: Diputado[], n = 10) =>
  ds.map((d) => ({ d, n: entidades(d).filter((e) => e.tipo === 'empresa').length })).filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n || a.d.apellidos.localeCompare(b.d.apellidos, 'es')).slice(0, n);
