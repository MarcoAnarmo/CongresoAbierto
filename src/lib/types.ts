/**
 * Esquema de datos del proyecto. Pensado para crecer: hoy solo hay Congreso,
 * mañana se añaden parlamentos autonómicos con `camara` distinta.
 */

export type Camara = 'congreso' | 'senado' | `autonomico-${string}`;

export type Voto = 'Sí' | 'No' | 'Abstención' | 'No vota';

export interface Retribucion {
  /** Importes mensuales oficiales (EUR) publicados por la Cámara. */
  mensual: {
    asignacion: number;
    complementoMesa: number;
    gastosRepresentacion: number;
    gastosLibreDisposicion: number;
    indemnizacion: number;
  };
  /** Suma de los importes mensuales oficiales que le corresponden (EUR/mes). */
  totalMensual: number;
  /** Cargos que generan complemento (no acumulables dentro de cada grupo). */
  cargosRetribuidos: string[];
  notas?: string;
}

export interface Inmueble {
  /** Texto literal de la declaración: PISO, CASA, VIVIENDA, LOCAL, GARAJE, SOLAR... */
  descripcion: string;
  naturaleza: 'urbana' | 'rustica' | 'sociedad';
  /** true si la descripción corresponde a uso residencial (piso, casa, vivienda, chalet, apartamento, dúplex, ático, adosado...). */
  esVivienda: boolean;
  provincia: string | null;
  anioAdquisicion: number | null;
  /** Texto literal del derecho: PLENO DOMINIO AL 50%, NUDA PROPIEDAD... */
  derecho: string | null;
  /** Porcentaje de titularidad si consta (0-100). */
  porcentaje: number | null;
  titulo: string | null;
}

export interface Vehiculo {
  descripcion: string;
  anioAdquisicion: number | null;
}

export type EstadoPatrimonio =
  /** Extraído automáticamente de un PDF con texto y revisado por script. */
  | 'extraido'
  /** Transcrito a partir de un PDF escaneado (OCR o revisión manual). */
  | 'transcrito'
  /** Revisado por una persona contra el PDF oficial. */
  | 'verificado'
  /** Aún sin procesar (PDF escaneado pendiente). */
  | 'pendiente'
  /** No hay declaración publicada. */
  | 'sin-declaracion';

export interface Patrimonio {
  estado: EstadoPatrimonio;
  declaracionUrl: string | null;
  declaracionFecha: string | null;
  /** Inmuebles a nombre propio (urbanos y rústicos), contando las unidades que indique cada fila. */
  propiedades: number | null;
  /** Número de inmuebles residenciales declarados (cualquier porcentaje). null si pendiente. */
  viviendas: number | null;
  /** Suma de porcentajes de titularidad de viviendas / 100 (p. ej. 2 al 50% = 1). */
  viviendasEquivalentes: number | null;
  inmueblesTotales: number | null;
  vehiculos: number | null;
  /** Viviendas declaradas como propiedad de sociedades participadas (no se suman a `viviendas`). */
  viviendasSociedad: number | null;
  inmuebles: Inmueble[];
  inmueblesSociedad: Inmueble[];
  listaVehiculos: Vehiculo[];
  /** PDFs oficiales usados (varios si la última declaración es una modificación parcial). */
  fuentes: { url: string; fecha: string | null; parcial: boolean }[];
  /** true si se combinan varias declaraciones (la última solo comunica cambios). */
  combinada: boolean;
  /** true si hay dudas de lectura o cambios (ventas) que conviene revisar a mano. */
  revisar: boolean;
  notas: string[];
}

export interface Diputado {
  id: string;
  camara: Camara;
  legislatura: string;
  codParlamentario: number;
  nombre: string;
  apellidos: string;
  nombreCompleto: string;
  genero: 'F' | 'M';
  partido: string;
  grupo: string;
  grupoCorto: string;
  circunscripcion: string;
  fechaAlta: string;
  fichaUrl: string;
  fotoUrl: string;
  cargos: string[];
  retribucion: Retribucion;
  patrimonio: Patrimonio;
}

export interface VotacionClave {
  id: string;
  fecha: string;
  sesion: number;
  numeroVotacion: number;
  /** Etiqueta corta para el selector (número oficial y fecha). */
  tema: string;
  /** Tipo de votación tal y como lo publica el Congreso. */
  tipo: string;
  /** Texto oficial del expediente votado (literal). */
  titulo: string;
  expediente: string;
  expedienteUrl: string;
  /** JSON oficial de la votación. */
  fuenteUrl: string;
  documentos: { titulo: string; url: string; tipo?: 'boe' | 'bocg' | 'ds' | 'votacion' }[];
  /** Qué contiene el texto votado: títulos de artículos o extractos literales del documento oficial. */
  contenido?: Contenido;
  /** Temas de la votación (ids de TEMAS). Si falta, se entiende vivienda. */
  temas?: string[];
  resultado: 'Aprobada' | 'Rechazada' | 'Convalidado' | 'Derogado';
  totales: { si: number; no: number; abstencion: number; noVota: number };
  /** codParlamentario -> voto */
  votos: Record<string, Voto>;
  /** codParlamentario -> asiento en el hemiciclo */
  asientos: Record<string, string>;
}

export interface GrupoInfo {
  corto: string;
  nombre: string;
  color: string;
  /** Orden de izquierda a derecha en el hemiciclo (vista desde la presidencia). */
  orden: number;
}

/** Contenido de un texto oficial: títulos o extractos literales, con su fuente. */
export interface Contenido { etiqueta: string; fuente: { titulo: string; url: string }; items: string[] }
