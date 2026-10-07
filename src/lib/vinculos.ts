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

/**
 * Qué relación describe el documento. Sale de la sección oficial del documento (registro A-H, apartado de la declaración)
 * o, en los acuerdos de compatibilidad, del artículo de la LOREG que cita el acuerdo. No se deduce del nombre de la entidad.
 */
export const RELACIONES = [
  'autorizada', 'cargo-publico', 'excedencia', 'docencia', 'publicaciones', 'partido', 'pension', 'cese',
  'trabajo-anterior', 'acciones', 'aportacion', 'regalo', 'trayectoria', 'borme', 'otras',
] as const;
export type RelacionVinculo = (typeof RELACIONES)[number];

/**
 * Lo que dice el propio documento sobre si cobra (null: el documento no lo dice; nunca se supone).
 * 'no': sin remuneración o renuncia a ella; 'dietas': solo indemnizaciones, dietas o gastos (de representación, de desplazamiento…);
 * 'complemento': solo el complemento por antigüedad de quien está en servicios especiales o excedencia;
 * 'si': dice que percibe una remuneración, honorarios o derechos de autor.
 */
export type RemuneracionVinculo = 'si' | 'no' | 'dietas' | 'complemento' | null;

const SECCION_REGISTRO: Record<string, RelacionVinculo> = {
  A: 'cargo-publico', B: 'excedencia', C1: 'pension', C2: 'pension', D: 'docencia', E: 'partido', F: 'publicaciones', G: 'autorizada', H: 'otras',
};
const APARTADO_INTERESES: Record<string, RelacionVinculo> = { actividades: 'trabajo-anterior', contribuciones: 'aportacion', donaciones: 'regalo', otros: 'otras' };

/** Tipo de relación de un texto oficial, según su sección o el artículo de la LOREG que cita el acuerdo. */
export function relacionDe(t: Pick<TextoFuente, 'fuente' | 'apartado' | 'texto'>): RelacionVinculo {
  if (t.fuente === 'registro') return SECCION_REGISTRO[t.apartado] ?? 'otras';
  if (t.fuente === 'intereses') return APARTADO_INTERESES[t.apartado] ?? 'otras';
  if (t.fuente === 'bienes') return 'acciones';
  if (t.fuente === 'ficha') return 'trayectoria';
  const x = t.texto;
  if (/servicios especiales|excedencia/i.test(x)) return 'excedencia';
  if (/^(Cese|Baja|Renuncia|Dimisi)/i.test(x)) return 'cese';
  if (/partidos pol[ií]ticos y grupos parlamentarios/i.test(x)) return 'partido';
  if (/159\.3[,.]?\s*b\)/.test(x)) return 'publicaciones';
  if (/157\.4/.test(x)) return 'docencia';
  if (/158\.2/.test(x)) return 'pension';
  if (/Se autoriza|159\.3[,.]?\s*c\)/.test(x)) return 'autorizada';
  if (/70\.1|157\.1|cargo electivo local|[Cc]argo compatible/.test(x)) return 'cargo-publico';
  return 'otras';
}

/**
 * Remuneración según el texto del documento. En los acuerdos del Congreso solo se lee lo que declara el diputado
 * (antes de «Se autoriza…», «Actividad compatible…»): la fórmula fija «sin la posibilidad de percibir remuneración del
 * sector público» es una condición del acuerdo, no una descripción de la actividad.
 */
export function remuneracionDe(texto: string): RemuneracionVinculo {
  const x = texto
    .split(/\b(Se autoriza|Actividad compatible|La Comisi[oó]n toma conocimiento|Percepci[oó]n compatible|Funci[oó]n p[uú]blica aneja|Trat[aá]ndose de|Cargo compatible)/)[0]
    .toLowerCase();
  if (/salvo (las? )?(indemnizaci|dietas)|[uú]nicamente (las? )?(indemnizaci|dietas)|solo (las? )?(indemnizaci|dietas)/.test(x)) return 'dietas';
  if (/sin (\S+\s+){0,4}?(remuneraci|retribuci|percepci[oó]n econ|prestaci[oó]n econ|ingresos|honorarios|sueldo|cobrar)|no conlleva (ninguna )?(remuneraci|retribuci)|no (retribuid|remunerad)|no percib|a la que renuncia|que renuncia|sin retribuir|sin cobrar|renunci\w* (a )?(las |la |su |sus |toda )?(rentas|remuneraci|retribuci|prestaci|percepci|ingresos|dietas)|gratuit|altruist|ad honorem/.test(x)) return 'no';
  if (/complemento (correspondiente )?por antig[uü]edad/.test(x)) return 'complemento';
  if (/(percibiendo|percibe)\s+(\S+\s+){0,3}(gastos|compensaci[oó]n por gastos|dietas|indemnizaci[oó]n por asistencia)/.test(x)) return 'dietas';
  if (/(?<!\b(no|ni|sin) )(percibiendo|percibe)\s+(\S+\s+){0,3}(remuneraci|retribuci|honorarios|gastos|indemnizaci|salario|sueldo|n[oó]mina|dietas|rentas)|con remuneraci|(?<!no )(remunerad[oa]s?|retribuid[oa]s?)\b|honorarios|derechos de autor/.test(x)) return 'si';
  return null;
}

/** Una aparición de una entidad en un documento oficial. */
export interface AparicionVinculo {
  fuente: FuenteVinculo;
  apartado: string;
  relacion: RelacionVinculo;
  remuneracion: RemuneracionVinculo;
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
