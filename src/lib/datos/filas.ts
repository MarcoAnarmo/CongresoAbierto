/**
 * Filas de cada tabla descargable a partir de los datos de la web. Solo se usa en la build.
 * El orden de cada fila es el de las columnas en tablas.ts (se comprueba al generar).
 */
import { diputados, votacionesPleno, grupos, slug, temasDe } from '../data';
import type { Diputado } from '../types';
import { TABLAS, SEP_LISTA, type Celda, type DefTabla } from './tablas';
import { votoMayoritario } from './derivados';

const SITIO = 'https://congresoabierto.org';
const nombreGrupo = new Map(grupos.map((g) => [g.corto, g.nombre]));
const lista = (xs: string[]) => (xs.length ? xs.join(SEP_LISTA) : null);
const conAviso = (d: Diputado) =>
  !!(d.patrimonio.revisar || d.deudas?.principal?.aviso || d.deudas?.anteriores.some((x) => x.aviso) || d.finanzas?.avisos.length || d.intereses?.avisos.length);
const redondea = (n: number) => Math.round(n * 100) / 100;

/** Una fila como objeto {columna: valor}; se ordena según la definición de la tabla. */
type Registro = Record<string, Celda>;

function diputadoRegistro(d: Diputado): Registro {
  const fz = d.finanzas, pa = d.participacion, dd = d.deudas;
  return {
    id: d.codParlamentario, nombre: d.nombre, apellidos: d.apellidos, genero: d.genero,
    grupo: d.grupoCorto, grupo_nombre: nombreGrupo.get(d.grupoCorto) ?? d.grupo, partido: d.partido, circunscripcion: d.circunscripcion,
    fecha_alta: d.fechaAlta, anio_nacimiento: d.perfil?.anioNacimiento ?? null, legislaturas: d.perfil ? d.perfil.legislaturas.length : null,
    cargos: lista(d.cargos), formacion: lista(d.perfil?.formacion.map((x) => x.texto) ?? []), tipo_formacion: d.perfil?.tipoFormacion ?? null,
    retribucion_mensual: redondea(d.retribucion.totalMensual),
    propiedades: d.patrimonio.propiedades, viviendas: d.patrimonio.viviendas, vehiculos: d.patrimonio.vehiculos,
    rentas_declaradas: fz ? redondea(fz.rentas?.total ?? 0) : null, rentas_al_menos: fz ? !!fz.rentas?.totalIncompleto : null,
    depositos: fz ? redondea(fz.depositos?.total ?? 0) : null, depositos_al_menos: fz ? !!fz.depositos?.totalIncompleto : null,
    deuda_pendiente: dd ? redondea(dd.principal?.totalPendiente ?? 0) : null, deuda_al_menos: dd ? !!dd.principal?.totalIncompleto : null,
    votaciones_en_escano: pa?.enEscano ?? null, votos_si: pa?.si ?? null, votos_no: pa?.no ?? null, votos_abstencion: pa?.abstencion ?? null, no_vota: pa?.noVota ?? null,
    votos_distintos_del_grupo: pa?.distintoGrupo ?? null,
    lectura_no_confirmada: conAviso(d), url_ficha_oficial: d.fichaUrl, url_declaracion_bienes: d.patrimonio.declaracionUrl,
    url_congreso_abierto: `${SITIO}/diputado/${slug(d)}`,
  };
}

function* inmuebles(): Generator<Registro> {
  for (const d of diputados) {
    const base = { diputado_id: d.codParlamentario, diputado: d.nombreCompleto, grupo: d.grupoCorto, circunscripcion: d.circunscripcion, lectura_no_confirmada: d.patrimonio.revisar, url_declaracion: d.patrimonio.declaracionUrl };
    for (const [titular, xs] of [['propio', d.patrimonio.inmuebles], ['sociedad', d.patrimonio.inmueblesSociedad]] as const) {
      for (const i of xs) {
        yield { ...base, titular, descripcion: i.descripcion, naturaleza: i.naturaleza, es_vivienda: i.esVivienda, provincia: i.provincia, anio_adquisicion: i.anioAdquisicion, derecho: i.derecho, porcentaje: i.porcentaje, titulo: i.titulo };
      }
    }
  }
}

function* votaciones(): Generator<Registro> {
  for (const v of votacionesPleno) {
    yield {
      id: v.id, fecha: v.fecha, sesion: v.sesion, numero: v.numeroVotacion, tipo: v.tipo, titulo: v.titulo, temas: lista(temasDe(v)), resultado: v.resultado,
      si: v.totales.si, no: v.totales.no, abstencion: v.totales.abstencion, no_vota: v.totales.noVota, url_votacion: v.fuenteUrl || null, url_expediente: v.expedienteUrl || null,
    };
  }
}

function* votosGrupo(): Generator<Registro> {
  for (const v of votacionesPleno) {
    for (const [grupo, si, no, abstencion, noVota] of v.porGrupo ?? []) {
      yield { votacion_id: v.id, fecha: v.fecha, titulo: v.titulo, temas: lista(temasDe(v)), grupo, si, no, abstencion, no_vota: noVota, voto_mayoritario: votoMayoritario(si, no, abstencion) };
    }
  }
}

const GENERADORES: Record<string, () => Iterable<Registro>> = {
  diputados: () => diputados.map(diputadoRegistro),
  inmuebles,
  votaciones,
  'votos-grupo': votosGrupo,
};

const cache = new Map<string, Celda[][]>();
/** Filas de una tabla de partición única, en el orden de sus columnas (se calculan una vez por build). */
export function filasTabla(t: DefTabla): Celda[][] {
  const hecho = cache.get(t.id);
  if (hecho) return hecho;
  const gen = GENERADORES[t.id];
  if (!gen) throw new Error(`La tabla ${t.id} no tiene generador de filas`);
  const ids = t.columnas.map((c) => c.id);
  const filas: Celda[][] = [];
  for (const r of gen()) {
    const extra = Object.keys(r).filter((k) => !ids.includes(k));
    if (extra.length) throw new Error(`Columnas sin definir en ${t.id}: ${extra.join(', ')}`);
    filas.push(ids.map((k) => (k in r ? (r[k] ?? null) : null)));
  }
  cache.set(t.id, filas);
  return filas;
}

/**
 * Votos nominales de un año, compactos: cada votación con sus diputados por voto (como en votaciones-pleno.json).
 * El navegador cruza los códigos con la tabla de diputados para montar una fila por diputado y votación.
 */
const LETRA: Record<string, string> = { 'Sí': 'S', 'No': 'N', 'Abstención': 'A', 'No vota': 'X' };
export interface FicheroVotosAnio { tabla: 'votos'; anio: number; generado: string; votaciones: [id: string, fecha: string, temas: string, votos: Record<string, string>][] }
export function votosAnio(anio: number): FicheroVotosAnio['votaciones'] {
  return votacionesPleno.filter((v) => v.fecha.startsWith(String(anio))).map((v) => {
    const porLetra: Record<string, string[]> = {};
    for (const [cod, voto] of Object.entries(v.votos)) (porLetra[LETRA[voto] ?? 'X'] ??= []).push(cod);
    return [v.id, v.fecha, lista(temasDe(v)) ?? '', Object.fromEntries(Object.entries(porLetra).map(([l, cs]) => [l, cs.join(' ')]))];
  });
}
/** Filas de la tabla de votos (diputado × votación con voto registrado). */
let nVotos: number | null = null;
export const filasVotos = () => (nVotos ??= aniosVotos().reduce((a, y) => a + votosAnio(y).reduce((b, v) => b + Object.values(v[3]).reduce((c, cs) => c + cs.split(' ').length, 0), 0), 0));
export const aniosVotos = () => [...new Set(votacionesPleno.map((v) => Number(v.fecha.slice(0, 4))))].sort();

export const tablasUnicas = () => TABLAS.filter((t) => t.particion === 'unica');
export const generado = () => new Date().toISOString();
