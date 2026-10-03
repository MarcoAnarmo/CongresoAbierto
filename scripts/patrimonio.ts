/**
 * Normalización de las declaraciones de bienes transcritas (data/raw/patrimonio/*.jsonl).
 * Reglas documentadas en docs/metodologia.md.
 */
import type { Inmueble, Vehiculo, Patrimonio } from '../src/lib/types.ts';

export interface FilaRaw { desc: string; sit?: string; anio?: string; derecho?: string; titulo?: string }
export interface DeclRaw {
  cod: number; tipo?: 'ultima' | 'anterior'; pdf?: string;
  urbana?: FilaRaw[]; rustica?: FilaRaw[]; sociedad?: FilaRaw[];
  vehiculos?: { anio?: string; desc: string }[];
  esModificacionParcial?: boolean; obs?: string; dudas?: string; cambios?: string; revisado?: boolean;
}

export interface Exclusion { contiene: string; motivo: string }
export interface Ajustes { excluirInmuebles?: Exclusion[]; excluirVehiculos?: Exclusion[]; nota?: string }

/** Las matrículas no deben publicarse (nota 13 del formulario oficial). */
const sinMatricula = (s: string) => s.replace(/\b\d{4}\s?[B-DF-HJ-NP-TV-Z]{3}\b|\[matrícula omitida\]/g, '').replace(/\s{2,}/g, ' ').trim();
const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z0-9%]+/g, ' ').trim();

const RE_VIVIENDA = /VIVIEND|VVIENDA|VIVENDA|\bPISO|\bCASA|CHALET|APARTAMENT|[ÁA]TICO|D[ÚU]PLEX|ADOSAD|UNIFAMILIAR|BUNGAL|\bESTUDIO\b|RESIDENCIAL/;
const RE_NO_VIVIENDA_PURO = /^(\d+[.,]?\d*\s*%\s*)?(PLAZA|GARAJE|GARAGE|TRASTERO|APARCAMIENTO|COCHERA|LOCAL|SOLAR|NAVE|OFICINA|ALMAC[EÉ]N|PARCELA|TERRENO|FINCA R[ÚU]STICA)/;
const NUM_PALABRA: Record<string, number> = { DOS: 2, TRES: 3, CUATRO: 4, CINCO: 5, SEIS: 6, SIETE: 7, OCHO: 8, NUEVE: 9, DIEZ: 10 };
const NUM = '(\\d{1,2}|DOS|TRES|CUATRO|CINCO|SEIS|SIETE|OCHO|NUEVE|DIEZ)';
const PLURALES = 'VIVIENDAS|PISOS|CASAS|APARTAMENTOS|CHALETS|ESTUDIOS|LOCALES|PLAZAS|GARAJES|GARAGES|TRASTEROS|APARCAMIENTOS|PARKINGS|SOLARES|FINCAS|PARCELAS|TERRENOS|NAVES|OFICINAS|ALMACENES|COCHERAS|HAZAS';
const valor = (t: string) => NUM_PALABRA[t] ?? parseInt(t, 10);

export function esVivienda(descRaw: string): boolean {
  const d = descRaw.toUpperCase();
  if (!RE_VIVIENDA.test(d)) return false;
  // "ALMACEN (RESIDENCIAL GARAGE)": la palabra residencial describe otro uso
  if (RE_NO_VIVIENDA_PURO.test(d) && !/VIVIEND|PISO|CASA|CHALET|APARTAMENT/.test(d)) return false;
  return true;
}

/** Número de viviendas descritas en una fila ("2 PISOS", "DOS VIVIENDAS"). */
export function unidades(descRaw: string): number {
  const d = norm(descRaw);
  const m = d.match(/\b(\d+|DOS|TRES|CUATRO|CINCO|SEIS)\s+(VIVIENDAS|PISOS|CASAS|APARTAMENTOS|CHALETS)\b/);
  if (!m) return 1;
  const n = NUM_PALABRA[m[1]] ?? parseInt(m[1], 10);
  return Number.isFinite(n) && n > 0 && n < 20 ? n : 1;
}

/**
 * Número de inmuebles que describe una fila de la declaración.
 * Una fila = 1 inmueble, salvo que indique unidades en plural con número
 * («16 VIVIENDAS», «8 Fincas rústicas», «Piso, dos plazas de garaje»: 1 + 2).
 */
export function unidadesInmueble(descRaw: string): number {
  const d = norm(descRaw);
  const re = new RegExp(`\\b${NUM}\\s+(?:[A-Z]+\\s+)?(${PLURALES})\\b`, 'g');
  let suma = 0;
  for (const m of d.matchAll(re)) { const n = valor(m[1]); if (n >= 2 && n <= 50) suma += n; }
  if (suma === 0) return 1;
  const empiezaConNumero = new RegExp(`^${NUM}\\s`).test(d);
  return suma + (empiezaConNumero ? 0 : 1);
}

/** Porcentaje de titularidad (0-100) a partir del texto de derecho y descripción. */
export function porcentaje(desc: string, derecho: string): number | null {
  const t = `${desc} ${derecho}`.toUpperCase();
  const pct = t.match(/(\d{1,3}(?:[.,']\d+)?)\s*%/);
  if (pct) {
    const v = parseFloat(pct[1].replace(/[,']/g, '.'));
    if (v > 0 && v <= 100) return Math.round(v * 100) / 100;
  }
  const frac = t.match(/\b(\d)\s*\/\s*(\d{1,2})\b/);
  if (frac) { const v = (100 * +frac[1]) / +frac[2]; if (v > 0 && v <= 100) return Math.round(v * 100) / 100; }
  if (/MITAD|PROINDIVISO AL 50/.test(t)) return 50;
  if (/GANANCIAL/.test(t)) return 50;
  if (/PLENO DOMINIO|PROPIEDAD|PROPIETARI|100/.test(t)) return 100;
  return null;
}

function anio(s?: string): number | null {
  const m = (s ?? '').replace(/\./g, '').match(/(19|20)\d\d/);
  return m ? parseInt(m[0], 10) : null;
}

function fila(f: FilaRaw, naturaleza: Inmueble['naturaleza']): Inmueble {
  const desc = (f.desc ?? '').trim();
  const derecho = (f.derecho ?? '').trim();
  return {
    descripcion: desc,
    naturaleza,
    esVivienda: esVivienda(desc),
    provincia: (f.sit ?? '').trim() || null,
    anioAdquisicion: anio(f.anio),
    derecho: derecho || null,
    porcentaje: porcentaje(desc, derecho),
    titulo: (f.titulo ?? '').trim() || null,
  };
}

/** Clave para reconocer el mismo bien en declaraciones distintas: tipo (primera palabra), localidad y año. */
const clave = (i: Inmueble) => `${norm(i.descripcion).replace(/^\d+\s*%?\s*/, '').split(' ')[0]}|${norm(i.provincia ?? '').split(' ')[0]}|${i.anioAdquisicion}`;

export function fechaPdf(pdf: string): string | null {
  const m = pdf.match(/_(\d{4})(\d{2})(\d{2})\.pdf$/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}

export function construirPatrimonio(decls: DeclRaw[], urlBase: string, ajustes: Ajustes = {}): Patrimonio {
  if (!decls.length) {
    return { estado: 'sin-declaracion', declaracionUrl: null, declaracionFecha: null, propiedades: null, viviendas: null, viviendasEquivalentes: null, inmueblesTotales: null, vehiculos: null, viviendasSociedad: null, inmuebles: [], inmueblesSociedad: [], listaVehiculos: [], fuentes: [], combinada: false, revisar: false, notas: [] };
  }
  const ord = [...decls].sort((a, b) => (fechaPdf(b.pdf!) ?? '').localeCompare(fechaPdf(a.pdf!) ?? ''));
  // Declaraciones a combinar: desde la más reciente hasta la primera completa
  const usadas: DeclRaw[] = [];
  for (const d of ord) { usadas.push(d); if (!d.esModificacionParcial) break; }
  const combinada = usadas.length > 1;

  const inmuebles: Inmueble[] = []; const soc: Inmueble[] = []; const veh: Vehiculo[] = [];
  const vistos = new Set<string>(); const vistosV = new Set<string>(); const excluidos: string[] = [];
  for (const d of usadas) {
    const nuevos = new Set<string>(); const nuevosV = new Set<string>();
    for (const [lista, nat] of [[d.urbana, 'urbana'], [d.rustica, 'rustica'], [d.sociedad, 'sociedad']] as const) {
      for (const f of lista ?? []) {
        if (!f.desc?.trim()) continue;
        const i = fila(f, nat);
        const texto = `${i.descripcion} ${i.provincia ?? ''} ${f.anio ?? ''}`;
        const ex = ajustes.excluirInmuebles?.find((e) => texto.includes(e.contiene));
        if (ex) { excluidos.push(`${i.descripcion} (${i.provincia ?? ''}): ${ex.motivo}`); continue; }
        // Solo se descartan repeticiones entre declaraciones distintas (la más reciente manda);
        // dentro de una misma declaración, dos filas iguales son dos bienes.
        const k = nat + clave(i);
        if (vistos.has(k)) continue; nuevos.add(k);
        (nat === 'sociedad' ? soc : inmuebles).push(i);
      }
    }
    for (const v of d.vehiculos ?? []) {
      if (!v.desc?.trim()) continue;
      const exV = ajustes.excluirVehiculos?.find((e) => v.desc.includes(e.contiene));
      if (exV) { excluidos.push(`${v.desc}: ${exV.motivo}`); continue; }
      const k = norm(v.desc);
      if (vistosV.has(k)) continue; nuevosV.add(k);
      veh.push({ descripcion: sinMatricula(v.desc.trim()), anioAdquisicion: anio(v.anio) });
    }
    nuevos.forEach((k) => vistos.add(k)); nuevosV.forEach((k) => vistosV.add(k));
  }
  const notas: string[] = [];
  for (const d of usadas) {
    const f = fechaPdf(d.pdf!);
    if (d.esModificacionParcial && d.cambios?.trim()) notas.push(`Modificación del ${f}: ${sinMatricula(d.cambios.trim())}`);
    if (d.obs?.trim()) notas.push(`Declaración del ${f}: ${sinMatricula(d.obs.trim())}`);
    if (d.dudas?.trim()) notas.push(`Lectura dudosa (declaración del ${f}): ${sinMatricula(d.dudas.trim())}`);
  }
  for (const e of excluidos) notas.push(`No se cuenta: ${e}`);
  if (ajustes.nota) notas.push(ajustes.nota);
  const hayVentaSinIdentificar = !!ajustes.nota;
  const viv = inmuebles.filter((i) => i.esVivienda);
  const propiedades = inmuebles.reduce((a, i) => a + Math.max(unidadesInmueble(i.descripcion), i.esVivienda ? unidades(i.descripcion) : 0), 0);
  const viviendas = viv.reduce((a, i) => a + unidades(i.descripcion), 0);
  const equiv = viv.reduce((a, i) => a + unidades(i.descripcion) * ((i.porcentaje ?? 100) / 100), 0);
  return {
    estado: usadas.every((d) => d.revisado) ? 'verificado' : 'transcrito',
    declaracionUrl: urlBase + usadas[0].pdf!.replace(/^(\d{6})_/, '$1/$1_'),
    declaracionFecha: fechaPdf(usadas[0].pdf!),
    propiedades,
    viviendas,
    viviendasEquivalentes: Math.round(equiv * 100) / 100,
    inmueblesTotales: inmuebles.length,
    vehiculos: veh.length,
    viviendasSociedad: soc.filter((i) => i.esVivienda).length,
    inmuebles, inmueblesSociedad: soc, listaVehiculos: veh,
    fuentes: usadas.map((d) => ({ url: urlBase + d.pdf!.replace(/^(\d{6})_/, '$1/$1_'), fecha: fechaPdf(d.pdf!), parcial: !!d.esModificacionParcial })),
    combinada,
    revisar: hayVentaSinIdentificar || usadas.some((d) => /\?/.test(d.dudas ?? '')),
    notas,
  };
}
