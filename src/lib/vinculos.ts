/**
 * Vínculos de los diputados con empresas, administraciones, fundaciones, asociaciones y otras entidades,
 * tal como aparecen en documentos oficiales. Lógica pura compartida por los scripts y la web.
 */

/** Documento oficial del que sale un texto. */
export type FuenteVinculo = 'registro' | 'compatibilidad' | 'intereses' | 'bienes' | 'ficha';

/** Un texto literal de un documento oficial sobre un diputado. */
export interface TextoFuente {
  id: string;
  cod: number;
  fuente: FuenteVinculo;
  /** Sección del documento (A-H en el registro, número del BOCG, apartado de la declaración…). */
  apartado: string;
  texto: string;
  fecha: string | null;
  url: string;
  /** Período declarado (solo trabajos anteriores de la declaración de intereses económicos). */
  periodo?: string | null;
}

export const TIPOS_ENTIDAD = ['empresa', 'publica', 'fundacion', 'asociacion', 'partido', 'sindicato', 'educacion', 'colegio', 'otra'] as const;
export type TipoEntidad = (typeof TIPOS_ENTIDAD)[number];

/** Entidad nombrada en un texto: `nombre` es una copia literal de una parte del texto. */
export interface EntidadExtraida { nombre: string; tipo: TipoEntidad; rol: string }

/** Una aparición de una entidad en un documento oficial. */
export interface AparicionVinculo {
  fuente: FuenteVinculo;
  apartado: string;
  /** Lo que dice el documento sobre la relación (copia literal o casi: el cargo o la actividad). */
  rol: string;
  texto: string;
  fecha: string | null;
  periodo: string | null;
  url: string;
}

export interface VinculoEntidad {
  slug: string;
  nombre: string;
  tipo: TipoEntidad;
  apariciones: AparicionVinculo[];
}

/** Un acto inscrito en el BORME (Sección A) a nombre del diputado. */
export interface ActoBorme {
  fecha: string;
  /** Identificador del anuncio del BORME (p. ej. BORME-A-2019-123-28). */
  borme: string;
  /** Registro mercantil (provincia) donde se inscribe. */
  provincia: string;
  /** Nombramientos, Ceses/Dimisiones, Revocaciones, Reelecciones… tal como lo escribe el BORME. */
  acto: string;
  /** Cargo tal como lo abrevia el BORME (Consejero, Adm. Unico, Apoderado…). */
  cargo: string;
  url: string;
}

/**
 * Cómo se confirma que la persona del BORME es el diputado (el BORME no publica el DNI):
 * 'declarada': la empresa aparece también en sus documentos oficiales;
 * 'cargo-publico': empresa pública del mismo lugar o administración en la que declara un cargo;
 * 'apellido': la empresa lleva su nombre y apellido y está inscrita en la provincia por la que es diputado.
 */
export type ConfirmacionBorme = 'declarada' | 'cargo-publico' | 'apellido';

export interface EmpresaBorme {
  /** Nombre de la sociedad tal como lo publica el BORME. */
  nombre: string;
  confirmacion: ConfirmacionBorme;
  /** Entidad de sus documentos que lo confirma (o sus apellidos). */
  motivo: string;
  desde: string;
  hasta: string;
  actos: ActoBorme[];
}

export interface Vinculos {
  entidades: VinculoEntidad[];
  /** Cargos en sociedades según el BORME, solo los confirmados por otro documento oficial. */
  borme: EmpresaBorme[];
  /** Número de entidades por tipo. */
  porTipo: Partial<Record<TipoEntidad, number>>;
}

/** Identificador estable de un texto (FNV-1a de 53 bits sobre sus campos). */
export function idTexto(t: Pick<TextoFuente, 'cod' | 'fuente' | 'apartado' | 'texto'>): string {
  const s = `${t.cod}|${t.fuente}|${t.apartado}|${t.texto}`;
  let h1 = 0x811c9dc5, h2 = 0x01000193;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
    h2 = Math.imul(h2 ^ c, 0x5bd1e995) >>> 0;
  }
  return (h1.toString(36) + h2.toString(36)).slice(0, 12);
}

/** Texto sin tildes, en minúsculas y con espacios simples, para comparar. */
export const plano = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[«»"“”'’`´]/g, '').replace(/\s+/g, ' ').trim();

/** Formas jurídicas que no distinguen a una entidad («Telefónica S.A.» = «Telefonica SA»). */
const FORMA = /[\s,]+(s\.?\s?a\.?\s?u|s\.?\s?l\.?\s?u|s\.?\s?l\.?\s?p|s\.?\s?a|s\.?\s?l|s\.?\s?coop(?:\.?\s?and)?|sociedad (?:anonima|limitada)(?: unipersonal)?|s\.?\s?c|c\.?\s?b)\.?$/;

/** Clave para unir variantes del nombre de una misma entidad. */
export function claveEntidad(nombre: string): string {
  let k = plano(nombre).replace(/[.,;:()\s]+$/g, '');
  for (let antes = ''; antes !== k; ) { antes = k; k = k.replace(FORMA, '').replace(/[.,;:()\s]+$/g, ''); }
  return k.replace(/[^a-z0-9ñ]+/g, ' ').trim();
}

export const slugEntidad = (nombre: string) => claveEntidad(nombre).replace(/ñ/g, 'n').replace(/\s+/g, '-').slice(0, 80);

/** ¿Es `nombre` una copia literal de una parte de `texto` (sin tener en cuenta tildes ni mayúsculas)? */
export const esLiteral = (nombre: string, texto: string) => plano(texto).includes(plano(nombre));
