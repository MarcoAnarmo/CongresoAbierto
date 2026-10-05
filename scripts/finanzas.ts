/**
 * Rentas, cuentas, valores y sociedades (páginas 1 a 3 de las declaraciones de bienes, data/raw/rentas/revisado.jsonl),
 * Registro de Intereses - Actividades (data/raw/intereses/actividades.jsonl, extraído de los PDF con texto)
 * y Declaraciones de Intereses Económicos (data/raw/intereses/economicos.jsonl, transcritas de los PDF escaneados).
 * Los textos se publican literalmente; los importes se leen como número solo cuando el formato no deja dudas.
 * Reglas documentadas en docs/metodologia.md.
 */
import { readFileSync, existsSync } from 'node:fs';
import { importe } from './deudas.ts';
import { fichasPersonales } from './perfil.ts';
import type { Actividades, FilaImporte, Finanzas, InteresesEconomicos, Participacion, TablaDeclarada } from '../src/lib/types.ts';

const leer = <T>(ruta: string): T[] => (existsSync(ruta) ? readFileSync(ruta, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l) as T) : []);

interface Fila { concepto?: string; descripcion?: string; euros?: string; saldo?: string; valor?: string }
interface RentasRaw {
  cod: number; pdf: string; vacia?: boolean; dudas?: string;
  rentas: Record<'salariales' | 'dividendos' | 'intereses' | 'otras', Fila[]>;
  irpf: string; depositos: Fila[]; valores: Fila[]; sociedades: Fila[]; otrosBienes: Fila[];
}
const rentasPorPdf = new Map(leer<RentasRaw>('data/raw/rentas/revisado.jsonl').map((r) => [r.pdf, r]));
/** Declaraciones que solo comunican cambios (de la transcripción del patrimonio). */
const parcialPorPdf = new Map(leer<{ pdf: string; esModificacionParcial?: boolean }>('data/raw/patrimonio/revisado.jsonl').map((r) => [r.pdf, !!r.esModificacionParcial]));

/** Celdas que no declaran nada. */
const vacio = (t?: string) => !t?.trim() || /^([-—–_.\s]+|ningun[oa]s?|no|nada|n\/a|no hay)\.?$/i.test(t.trim());
const fila = (texto = '', imp = ''): FilaImporte => ({ texto: texto.replace(/\s+/g, ' ').trim(), importe: imp.trim(), euros: vacio(imp) ? null : importe(imp) });
const util = (f: FilaImporte) => !(vacio(f.texto) && vacio(f.importe));
const dudosa = (f: FilaImporte) => /\?/.test(f.texto + f.importe);

function tabla<F extends FilaImporte>(filas: F[], d: { fecha: string | null; url: string; parcial: boolean }): TablaDeclarada<F> {
  const conImporte = filas.filter((f) => !vacio(f.importe) || !vacio(f.texto));
  return {
    ...d, filas,
    total: Math.round(filas.reduce((a, f) => a + (f.euros ?? 0), 0) * 100) / 100,
    // Incompleto si algún importe escrito no se puede leer como número, o si una fila con texto no tiene importe
    totalIncompleto: conImporte.some((f) => f.euros === null && !/^(0|0,00)$/.test(f.importe)),
  };
}

export function construirFinanzas(cod: number): Finanzas | null {
  const ficha = fichasPersonales.get(cod);
  if (!ficha) return null;
  // De la más reciente a la más antigua
  const decls = ficha.bienes
    .map((b) => ({ fecha: b.fecha, url: b.url, pdf: b.url.split('/').pop()!, parcial: false }))
    .map((b) => ({ ...b, parcial: parcialPorPdf.get(b.pdf) ?? /_00[1-9]_e_/.test(b.pdf), raw: rentasPorPdf.get(b.pdf) }))
    .filter((b) => b.raw)
    .sort((a, b) => (b.fecha ?? '').localeCompare(a.fecha ?? '') || b.pdf.localeCompare(a.pdf));
  if (!decls.length) return null;
  const avisos: string[] = [];
  const meta = (b: (typeof decls)[number]) => ({ fecha: b.fecha, url: b.url, parcial: b.parcial });

  let rentas: Finanzas['rentas'] = null;
  for (const b of decls) {
    const r = b.raw!;
    const filas = (['salariales', 'dividendos', 'intereses', 'otras'] as const)
      .flatMap((tipo) => (r.rentas?.[tipo] ?? []).map((x) => ({ ...fila(x.concepto, x.euros), tipo }))).filter(util);
    const irpf = vacio(r.irpf) ? null : r.irpf.trim();
    if (!filas.length && !irpf) continue;
    rentas = { ...tabla(filas, meta(b)), filas, irpf, irpfEuros: irpf ? importe(irpf) : null };
    if (filas.some(dudosa) || /\?/.test(irpf ?? '')) avisos.push('rentas');
    break;
  }
  const ultimaCon = (k: 'depositos' | 'valores' | 'sociedades' | 'otrosBienes') => {
    for (const b of decls) {
      const filas = (b.raw![k] ?? []).map((x) => fila(x.descripcion, x.saldo ?? x.valor)).filter(util);
      if (!filas.length) continue;
      if (filas.some(dudosa)) avisos.push(k);
      return tabla(filas, meta(b));
    }
    return null;
  };
  return { rentas, depositos: ultimaCon('depositos'), valores: ultimaCon('valores'), sociedades: ultimaCon('sociedades'), otrosBienes: ultimaCon('otrosBienes'), avisos };
}

// --- Registro de Intereses - Actividades
const TITULOS: Record<string, string> = {
  A: 'Cargos públicos', B: 'Actividades públicas a las que ha renunciado', C1: 'Prestaciones de derechos pasivos renunciadas',
  C2: 'Prestaciones de derechos pasivos compatibles', D: 'Actividades docentes extraordinarias', E: 'Cargos en partidos o grupos parlamentarios',
  F: 'Producción y creación literaria, científica, artística o técnica', G: 'Actividades privadas autorizadas', H: 'Otras actividades',
};
interface ActividadesRaw { cod: number; pdf: string; pendiente?: boolean; secciones: Record<string, { texto: string; fechaAcuerdo: string | null }[]> }
const actividades = new Map(leer<ActividadesRaw>('data/raw/intereses/actividades.jsonl').map((a) => [a.cod, a]));
export function construirActividades(cod: number): Actividades | null {
  const a = actividades.get(cod);
  if (!a) return null;
  const secciones = Object.keys(TITULOS).filter((k) => a.secciones[k]?.length).map((k) => ({ id: k, titulo: TITULOS[k], items: a.secciones[k] }));
  return { url: a.pdf, pendiente: !!a.pendiente, secciones, total: secciones.reduce((n, s) => n + s.items.length, 0) };
}

// --- Declaraciones de Intereses Económicos
interface EconomicosRaw {
  cod: number; pdf: string; tipo: 'inicial' | 'modificacion' | '';
  actividades: { periodo: string; empleador: string; sector: string; descripcion: string }[];
  donaciones: { benefactor: string; descripcion: string }[];
  fundaciones: { destinatario: string; descripcion: string }[];
  otros: string; avisos?: string[];
}
const economicos = new Map(leer<EconomicosRaw>('data/raw/intereses/economicos.jsonl').map((e) => [e.pdf, e]));
const filaVacia = (o: Record<string, string>) => Object.values(o).every((v) => vacio(v));
export function construirIntereses(cod: number): InteresesEconomicos | null {
  const ficha = fichasPersonales.get(cod);
  if (!ficha) return null;
  const decls = ficha.interesesEconomicos
    .map((i) => ({ fecha: i.fecha, url: i.url, raw: economicos.get(i.url.split('/').pop()!) }))
    .filter((d) => d.raw)
    .sort((a, b) => (b.fecha ?? '').localeCompare(a.fecha ?? '') || b.url.localeCompare(a.url));
  if (!decls.length) return null;
  const ultimo = <K extends 'actividades' | 'donaciones' | 'fundaciones'>(k: K) => {
    for (const d of decls) {
      const xs = (d.raw![k] as Record<string, string>[]).filter((x) => !filaVacia(x));
      if (xs.length) return { xs: xs as EconomicosRaw[K], fuente: { fecha: d.fecha, url: d.url } };
    }
    return { xs: [] as unknown as EconomicosRaw[K], fuente: null };
  };
  const t = ultimo('actividades'), dn = ultimo('donaciones'), c = ultimo('fundaciones');
  const avisos = decls.flatMap((d) => d.raw!.avisos ?? []);
  for (const [k, x] of [['trabajos', t], ['donaciones', dn], ['contribuciones', c]] as const) {
    if (/\?/.test(JSON.stringify(x.xs))) avisos.push(`Alguna lectura de ${k === 'trabajos' ? 'sus trabajos anteriores' : k} no está confirmada (marcada con «?»).`);
  }
  return {
    declaraciones: decls.map((d) => ({ fecha: d.fecha, url: d.url, tipo: d.raw!.tipo })),
    trabajos: t.xs, trabajosFuente: t.fuente, donaciones: dn.xs, donacionesFuente: dn.fuente, contribuciones: c.xs, contribucionesFuente: c.fuente,
    otros: decls.map((d) => d.raw!.otros?.trim()).filter((o): o is string => !!o && !vacio(o) && !/^[-—–_\s]+$/.test(o)).filter((o, i, a) => a.indexOf(o) === i),
    avisos,
  };
}

// --- Participación en las votaciones del Pleno
interface PlenoRaw { id: string; fecha: string; votos: Record<string, string>; di?: string }
const pleno = leer<PlenoRaw>('data/raw/votaciones/pleno.jsonl');
const participacion = new Map<string, Participacion>();
for (const v of [...pleno].sort((a, b) => a.fecha.localeCompare(b.fecha))) {
  const disidentes = new Set((v.di ?? '').split(' ').filter(Boolean));
  for (const [l, cods] of Object.entries(v.votos)) {
    for (const c of cods.split(' ').filter(Boolean)) {
      const p = participacion.get(c) ?? { enEscano: 0, si: 0, no: 0, abstencion: 0, noVota: 0, distintoGrupo: 0, distintoGrupoIds: [], desde: v.fecha, hasta: v.fecha };
      p.enEscano++; p.hasta = v.fecha;
      if (l === 'S') p.si++; else if (l === 'N') p.no++; else if (l === 'A') p.abstencion++; else p.noVota++;
      if (disidentes.has(c)) { p.distintoGrupo++; p.distintoGrupoIds.unshift(v.id); }
      participacion.set(c, p);
    }
  }
}
for (const p of participacion.values()) p.distintoGrupoIds = p.distintoGrupoIds.slice(0, 40);
export const construirParticipacion = (cod: number): Participacion | null => participacion.get(String(cod)) ?? null;
