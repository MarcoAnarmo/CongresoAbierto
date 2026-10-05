import diputadosJson from '../../data/congreso/diputados.json';
import votacionesJson from '../../data/congreso/votaciones.json';
import resumenJson from '../../data/congreso/resumen.json';
import plenoJson from '../../data/congreso/votaciones-pleno.json';
import gruposJson from '../../data/manual/grupos.json';
import type { Contenido, Diputado, GrupoInfo, VotacionClave } from './types';

export const diputados = diputadosJson.diputados as unknown as Diputado[];
export const votaciones = votacionesJson.votaciones as unknown as VotacionClave[];
export const pendientes = (votacionesJson as any).pendientes as { id: string; fecha: string; titulo: string; estado: string; fuentes: { titulo: string; url: string }[]; contenidos?: Contenido[] }[];
export const grupos = gruposJson as GrupoInfo[];
export const resumen = resumenJson.grupos as (GrupoInfo & {
  diputados: number; conDeclaracion: number; propiedades: number; viviendas: number; viviendasEquivalentes: number;
  vehiculos: number; mediaViviendas: number | null; sinVivienda: number; tresOMas: number; retribucionMensualMedia: number;
})[];
export const meta = diputadosJson.meta;

export const colorGrupo = (corto: string) => grupos.find((g) => g.corto === corto)?.color ?? '#888';

const eur0 = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const eur2 = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 });
const num = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 });
export const fmtEur = (n: number) => eur0.format(n);
export const fmtEur2 = (n: number) => eur2.format(n);
export const fmtNum = (n: number) => num.format(n);
export const fmtFecha = (iso: string | null) => (iso ? new Date(iso + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : '—');
export const slug = (d: Diputado) => `${d.codParlamentario}-${d.nombreCompleto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const url = (p: string) => `${base}${p}`;

/** Repositorio público del proyecto y enlaces para proponer cambios. */
export const REPO = 'https://github.com/MarcoAnarmo/CongresoAbierto';
export const enlaceSugerencia = `${REPO}/issues/new?template=sugerencia.yml`;
export const enlaceGuia = `${REPO}/blob/main/CONTRIBUTING.md`;
export const enlacePrimerasTareas = `${REPO}/issues?q=is%3Aissue+is%3Aopen`;
export const enlaceIncidencias = `${REPO}/issues`;
export const enlaceHojaDeRuta = `${REPO}/issues?q=is%3Aissue+is%3Aopen+label%3Ahoja-de-ruta`;
export const enlaceError = (que?: string) =>
  `${REPO}/issues/new?template=error-en-un-dato.yml${que ? `&title=${encodeURIComponent(`Error: ${que}`)}&diputado=${encodeURIComponent(que)}` : ''}`;

/**
 * Elecciones generales convocadas tras la disolución de las Cortes de la XV Legislatura.
 * Mientras no se hayan celebrado (fecha de la build), la portada y los textos para compartir las mencionan.
 */
export const ELECCIONES = { fecha: '2026-11-29', texto: 'Elecciones generales el 29 de noviembre de 2026', corto: 'elecciones del 29 de noviembre', llamada: 'Antes de votar el 29 de noviembre, conoce a quien te representa. ' };
export const antesDeElecciones = () => new Date().toISOString().slice(0, 10) <= ELECCIONES.fecha;

/** Datos compactos para los scripts de cliente (hemiciclo y lista de diputados). */
export function datosCliente() {
  return diputados.map((d) => ({
    c: d.codParlamentario,
    n: d.nombreCompleto,
    g: d.grupoCorto,
    p: d.partido,
    ci: d.circunscripcion,
    pr: d.patrimonio.propiedades,
    v: d.patrimonio.viviendas,
    co: d.patrimonio.vehiculos,
    r: d.retribucion.totalMensual,
    rv: d.patrimonio.revisar,
    s: slug(d),
  }));
}

/** Candidatura por la que fue elegido/a; se indica aparte cuando no coincide con su grupo parlamentario actual. */
const sinTildes = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
export const candidaturaDistinta = (d: Diputado) => !sinTildes(d.partido).includes(sinTildes(d.grupoCorto));
export const etiquetaPartido = (d: Diputado) => (candidaturaDistinta(d) ? `${d.grupoCorto} (candidatura ${d.partido})` : d.partido);

/** Temas con los que se filtran las votaciones (data/manual/temas.json). */
export const TEMAS = (votacionesJson as any).temas as { id: string; nombre: string }[];
export const temasDe = (v: { temas?: string[] }) => v.temas ?? ['otros'];
/** Todas las votaciones del Pleno importadas de datos abiertos, más las votaciones clave. Más recientes primero. */
export const votacionesPleno = [...votaciones, ...((plenoJson as any).votaciones as VotacionClave[])]
  .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.sesion - a.sesion || b.numeroVotacion - a.numeroVotacion);
