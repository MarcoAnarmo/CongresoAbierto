/**
 * Tablas descargables: qué columnas y filtros tiene cada una. Este fichero no importa datos, así que lo usan igual
 * la build (que genera los ficheros) y el navegador (que filtra y monta el CSV). Los nombres visibles de tablas,
 * columnas y filtros están en src/i18n/textos/datos.ts.
 *
 * Para añadir una tabla (otra cámara, un parlamento autonómico…): definirla aquí, escribir sus filas en filas.ts
 * y sus textos en datos.ts. La página y la descarga funcionan solas.
 */

export type TipoColumna = 'texto' | 'entero' | 'decimal' | 'fecha' | 'url' | 'booleano' | 'lista';
export type Celda = string | number | boolean | null;

export interface DefColumna {
  id: string;
  tipo: TipoColumna;
  /** Marcada al abrir la tabla. */
  defecto?: boolean;
}

export type DefFiltro =
  /** Elegir uno o varios valores de una columna (si es de tipo 'lista', basta con que contenga uno). */
  | { id: string; tipo: 'valores'; columna: string }
  /** Entre dos fechas. */
  | { id: string; tipo: 'fechas'; columna: string }
  /** Texto libre, sin distinguir tildes ni mayúsculas. */
  | { id: string; tipo: 'texto'; columnas: string[] };

export interface DefTabla {
  id: string;
  columnas: DefColumna[];
  filtros: DefFiltro[];
  /**
   * 'unica': un fichero /datos/tablas/<id>.json.
   * 'anual': un fichero por año (/datos/tablas/<id>/<año>.json); el filtro de fechas decide cuáles se descargan.
   */
  particion: 'unica' | 'anual';
  /** También se publica completa como CSV fijo (/datos/csv/<id>.csv). */
  csvFijo: boolean;
  /** Apartados de las columnas (tablas con muchas): cada uno empieza en la columna `desde`. Nombres en datos.ts (secciones). */
  secciones?: { id: string; desde: string }[];
}

/** Columnas de una tabla agrupadas en sus apartados (una sola sección sin nombre si la tabla no tiene apartados). */
export function columnasPorSeccion(t: DefTabla): { id: string | null; columnas: DefColumna[] }[] {
  if (!t.secciones?.length) return [{ id: null, columnas: t.columnas }];
  const r: { id: string | null; columnas: DefColumna[] }[] = [];
  for (const col of t.columnas) {
    const s = t.secciones.find((x) => x.desde === col.id);
    if (s || !r.length) r.push({ id: s?.id ?? null, columnas: [] });
    r[r.length - 1].columnas.push(col);
  }
  return r;
}

/** Separador de los valores de las columnas de tipo 'lista' (temas, cargos…). */
export const SEP_LISTA = ' | ';

const c = (id: string, tipo: TipoColumna, defecto = false): DefColumna => ({ id, tipo, defecto });

export const TABLAS: DefTabla[] = [
  {
    id: 'diputados',
    particion: 'unica',
    csvFijo: true,
    columnas: [
      c('id', 'entero'), c('nombre', 'texto', true), c('apellidos', 'texto', true), c('genero', 'texto'),
      c('grupo', 'texto', true), c('grupo_nombre', 'texto'), c('partido', 'texto'), c('circunscripcion', 'texto', true),
      c('fecha_alta', 'fecha'), c('anio_nacimiento', 'entero'), c('legislaturas', 'entero'), c('cargos', 'lista'),
      c('formacion', 'lista'), c('tipo_formacion', 'texto'),
      c('retribucion_mensual', 'decimal', true), c('propiedades', 'entero', true), c('viviendas', 'entero', true), c('vehiculos', 'entero'),
      c('rentas_declaradas', 'decimal'), c('rentas_al_menos', 'booleano'), c('depositos', 'decimal'), c('depositos_al_menos', 'booleano'),
      c('deuda_pendiente', 'decimal'), c('deuda_al_menos', 'booleano'),
      c('votaciones_en_escano', 'entero'), c('votos_si', 'entero'), c('votos_no', 'entero'), c('votos_abstencion', 'entero'), c('no_vota', 'entero'),
      c('votos_distintos_del_grupo', 'entero'),
      c('lectura_no_confirmada', 'booleano', true), c('url_ficha_oficial', 'url'), c('url_declaracion_bienes', 'url'), c('url_congreso_abierto', 'url'),
    ],
    secciones: [
      { id: 'perfil', desde: 'id' }, { id: 'dinero', desde: 'retribucion_mensual' },
      { id: 'votos', desde: 'votaciones_en_escano' }, { id: 'fuentes', desde: 'lectura_no_confirmada' },
    ],
    filtros: [
      { id: 'buscar', tipo: 'texto', columnas: ['nombre', 'apellidos'] },
      { id: 'grupo', tipo: 'valores', columna: 'grupo' },
      { id: 'circunscripcion', tipo: 'valores', columna: 'circunscripcion' },
      { id: 'genero', tipo: 'valores', columna: 'genero' },
    ],
  },
  {
    id: 'inmuebles',
    particion: 'unica',
    csvFijo: true,
    columnas: [
      c('diputado_id', 'entero'), c('diputado', 'texto', true), c('grupo', 'texto', true), c('circunscripcion', 'texto'),
      c('titular', 'texto', true), c('descripcion', 'texto', true), c('naturaleza', 'texto'), c('es_vivienda', 'booleano', true),
      c('provincia', 'texto', true), c('anio_adquisicion', 'entero', true), c('derecho', 'texto'), c('porcentaje', 'decimal', true), c('titulo', 'texto'),
      c('lectura_no_confirmada', 'booleano'), c('url_declaracion', 'url'),
    ],
    filtros: [
      { id: 'buscar', tipo: 'texto', columnas: ['diputado'] },
      { id: 'grupo', tipo: 'valores', columna: 'grupo' },
      { id: 'circunscripcion', tipo: 'valores', columna: 'circunscripcion' },
      { id: 'es_vivienda', tipo: 'valores', columna: 'es_vivienda' },
      { id: 'titular', tipo: 'valores', columna: 'titular' },
    ],
  },
  {
    id: 'entidades',
    particion: 'unica',
    csvFijo: true,
    columnas: [
      c('diputado_id', 'entero'), c('diputado', 'texto', true), c('grupo', 'texto', true), c('circunscripcion', 'texto'),
      c('entidad', 'texto', true), c('tipo_entidad', 'texto', true), c('relacion', 'texto', true), c('fuente', 'texto', true), c('fecha', 'fecha', true),
      c('texto', 'texto'), c('url_documento', 'url', true), c('url_congreso_abierto', 'url'),
    ],
    filtros: [
      { id: 'buscar', tipo: 'texto', columnas: ['diputado', 'entidad'] },
      { id: 'grupo', tipo: 'valores', columna: 'grupo' },
      { id: 'tipo_entidad', tipo: 'valores', columna: 'tipo_entidad' },
      { id: 'fuente', tipo: 'valores', columna: 'fuente' },
    ],
  },
  {
    id: 'borme',
    particion: 'unica',
    csvFijo: true,
    columnas: [
      c('diputado_id', 'entero'), c('diputado', 'texto', true), c('grupo', 'texto', true), c('circunscripcion', 'texto'),
      c('empresa', 'texto', true), c('confirmacion', 'texto', true), c('motivo', 'texto'), c('fecha', 'fecha', true), c('acto', 'texto', true),
      c('cargo', 'texto', true), c('registro', 'texto'), c('url_borme', 'url', true), c('url_congreso_abierto', 'url'),
    ],
    filtros: [
      { id: 'buscar', tipo: 'texto', columnas: ['diputado', 'empresa'] },
      { id: 'grupo', tipo: 'valores', columna: 'grupo' },
      { id: 'confirmacion', tipo: 'valores', columna: 'confirmacion' },
    ],
  },
  {
    id: 'votaciones',
    particion: 'unica',
    csvFijo: true,
    columnas: [
      c('id', 'texto', true), c('fecha', 'fecha', true), c('sesion', 'entero'), c('numero', 'entero'), c('tipo', 'texto'), c('titulo', 'texto', true),
      c('temas', 'lista', true), c('resultado', 'texto', true), c('si', 'entero', true), c('no', 'entero', true), c('abstencion', 'entero', true), c('no_vota', 'entero'),
      c('url_votacion', 'url'), c('url_expediente', 'url'),
    ],
    filtros: [
      { id: 'fechas', tipo: 'fechas', columna: 'fecha' },
      { id: 'temas', tipo: 'valores', columna: 'temas' },
      { id: 'resultado', tipo: 'valores', columna: 'resultado' },
      { id: 'buscar', tipo: 'texto', columnas: ['titulo', 'tipo'] },
    ],
  },
  {
    id: 'votos-grupo',
    particion: 'unica',
    csvFijo: true,
    columnas: [
      c('votacion_id', 'texto', true), c('fecha', 'fecha', true), c('titulo', 'texto'), c('temas', 'lista', true), c('grupo', 'texto', true),
      c('si', 'entero', true), c('no', 'entero', true), c('abstencion', 'entero', true), c('no_vota', 'entero', true), c('voto_mayoritario', 'texto', true),
    ],
    filtros: [
      { id: 'fechas', tipo: 'fechas', columna: 'fecha' },
      { id: 'temas', tipo: 'valores', columna: 'temas' },
      { id: 'grupo', tipo: 'valores', columna: 'grupo' },
    ],
  },
  {
    id: 'votos',
    particion: 'anual',
    csvFijo: false,
    columnas: [
      c('votacion_id', 'texto', true), c('fecha', 'fecha', true), c('temas', 'lista'), c('diputado_id', 'entero'), c('diputado', 'texto', true),
      c('grupo', 'texto', true), c('circunscripcion', 'texto'), c('voto', 'texto', true),
    ],
    filtros: [
      { id: 'fechas', tipo: 'fechas', columna: 'fecha' },
      { id: 'temas', tipo: 'valores', columna: 'temas' },
      { id: 'grupo', tipo: 'valores', columna: 'grupo' },
      { id: 'circunscripcion', tipo: 'valores', columna: 'circunscripcion' },
      { id: 'voto', tipo: 'valores', columna: 'voto' },
      { id: 'buscar', tipo: 'texto', columnas: ['diputado'] },
    ],
  },
];

export const tabla = (id: string) => TABLAS.find((t) => t.id === id);

/** Fichero de datos de una tabla (con la base de la web delante). */
export const rutaTabla = (t: DefTabla, anio?: number) => (t.particion === 'anual' ? `/datos/tablas/${t.id}/${anio}.json` : `/datos/tablas/${t.id}.json`);
export const rutaCsvFijo = (t: DefTabla) => `/datos/csv/${t.id}.csv`;

/** Contenido de /datos/tablas/<id>.json: columnas en el orden de la definición y una fila por registro. */
export interface FicheroTabla { tabla: string; generado: string; columnas: string[]; filas: Celda[][] }
/** Índice /datos/tablas/indice.json: filas por tabla y años de las tablas anuales. */
export interface IndiceTablas { generado: string; tablas: Record<string, { filas: number; anios?: number[] }> }
