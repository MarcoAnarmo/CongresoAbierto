/**
 * Empresas y entidades con las que se relaciona cada diputado según documentos oficiales.
 * Entrada:
 *   data/raw/vinculos/textos.jsonl    (textos oficiales de cada diputado con su fuente; scripts/vinculos-textos.ts)
 *   data/raw/vinculos/entidades.jsonl (entidades nombradas en cada texto: copia literal, tipo y relación)
 *   data/manual/entidades.json        (nombres que son la misma entidad, entidades excluidas y tipos corregidos)
 *   data/raw/borme/vinculos-borme.jsonl (cargos en sociedades del BORME confirmados por otro documento; scripts/borme-clasificar.py)
 * Cada entidad lleva todas sus apariciones con el texto oficial y el enlace al documento.
 * Reglas en docs/metodologia.md («Empresas y entidades»).
 */
import { readFileSync, existsSync } from 'node:fs';
import { claveEntidad, esLiteral, slugEntidad, TIPOS_ENTIDAD, type AparicionVinculo, type ActoBorme, type ConfirmacionBorme, type EmpresaBorme, type EntidadExtraida, type TextoFuente, type TipoEntidad, type Vinculos, type VinculoEntidad } from '../src/lib/vinculos.ts';

const leer = <T>(ruta: string): T[] => (existsSync(ruta) ? readFileSync(ruta, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l) as T) : []);

interface Manual {
  /** clave de entidad → nombre con el que se agrupa (y se muestra). */
  unir: Record<string, string>;
  /** claves que no son entidades (el propio Congreso, referencias genéricas…). */
  excluir: string[];
  /** clave → tipo corregido. */
  tipos: Record<string, TipoEntidad>;
}
const manual: Manual = existsSync('data/manual/entidades.json')
  ? { unir: {}, excluir: [], tipos: {}, ...JSON.parse(readFileSync('data/manual/entidades.json', 'utf8')) }
  : { unir: {}, excluir: [], tipos: {} };
const excluidas = new Set(manual.excluir.map(claveEntidad));
const unir = new Map(Object.entries(manual.unir).map(([k, v]) => [claveEntidad(k), v]));
const tiposManual = new Map(Object.entries(manual.tipos).map(([k, v]) => [claveEntidad(k), v]));

const textos = leer<TextoFuente>('data/raw/vinculos/textos.jsonl');
const extraidas = new Map(leer<{ texto: string; entidades: EntidadExtraida[] }>('data/raw/vinculos/entidades.jsonl').map((e) => [e.texto, e.entidades]));
const sinExtraer = textos.filter((t) => !extraidas.has(t.texto));
if (sinExtraer.length) console.warn(`Vínculos: ${sinExtraer.length} textos sin revisar en entidades.jsonl (no se publican sus entidades).`);

/** Orden de las fuentes: primero lo que acuerda el Congreso, luego lo que declara el diputado. */
const ORDEN_FUENTE = { compatibilidad: 0, registro: 1, intereses: 2, bienes: 3, ficha: 4 } as const;

const porDiputado = new Map<number, Vinculos>();
/** clave de entidad → nombres literales vistos (para elegir cómo se muestra). */
const variantes = new Map<string, Map<string, number>>();
const grupos = new Map<number, Map<string, { tipos: Map<TipoEntidad, number>; apariciones: AparicionVinculo[] }>>();

for (const t of textos) {
  for (const e of extraidas.get(t.texto) ?? []) {
    if (!esLiteral(e.nombre, t.texto) || !TIPOS_ENTIDAD.includes(e.tipo)) {
      console.warn(`Vínculos: entidad descartada (no es literal o tipo desconocido): «${e.nombre}» en «${t.texto.slice(0, 60)}»`);
      continue;
    }
    let clave = claveEntidad(e.nombre);
    if (!clave || excluidas.has(clave)) continue;
    const unida = unir.get(clave);
    if (unida) clave = claveEntidad(unida);
    if (!variantes.has(clave)) variantes.set(clave, new Map());
    const v = variantes.get(clave)!;
    v.set(unida ?? e.nombre.trim(), (v.get(unida ?? e.nombre.trim()) ?? 0) + (unida ? 1000 : 1));
    if (!grupos.has(t.cod)) grupos.set(t.cod, new Map());
    const g = grupos.get(t.cod)!;
    if (!g.has(clave)) g.set(clave, { tipos: new Map(), apariciones: [] });
    const x = g.get(clave)!;
    x.tipos.set(e.tipo, (x.tipos.get(e.tipo) ?? 0) + 1);
    if (!x.apariciones.some((a) => a.url === t.url && a.texto === t.texto)) {
      x.apariciones.push({ fuente: t.fuente, apartado: t.apartado, rol: e.rol.trim(), texto: t.texto, fecha: t.fecha, periodo: t.periodo ?? null, url: t.url });
    }
  }
}

/** Nombre que se muestra: la variante más usada; a igualdad, la que lleva tildes y minúsculas. */
const nombreDe = (clave: string) =>
  [...variantes.get(clave)!.entries()].sort((a, b) => b[1] - a[1] || +(b[0] !== b[0].toUpperCase()) - +(a[0] !== a[0].toUpperCase()) || b[0].length - a[0].length)[0][0];
const masFrecuente = <K>(m: Map<K, number>) => [...m.entries()].sort((a, b) => b[1] - a[1])[0][0];

// Cargos en sociedades del BORME, solo los confirmados por otro documento oficial
const borme = new Map<number, EmpresaBorme[]>();
for (const x of leer<{ cod: number; empresa: string; nivel: ConfirmacionBorme; motivo: string; actos: ActoBorme[] }>('data/raw/borme/vinculos-borme.jsonl')) {
  if (!borme.has(x.cod)) borme.set(x.cod, []);
  const fechas = x.actos.map((a) => a.fecha).sort();
  borme.get(x.cod)!.push({ nombre: x.empresa, confirmacion: x.nivel, motivo: x.motivo, desde: fechas[0], hasta: fechas[fechas.length - 1], actos: x.actos });
}
for (const xs of borme.values()) xs.sort((a, b) => b.hasta.localeCompare(a.hasta) || a.nombre.localeCompare(b.nombre, 'es'));

for (const cod of borme.keys()) if (!grupos.has(cod)) grupos.set(cod, new Map());
for (const [cod, g] of grupos) {
  const entidades: VinculoEntidad[] = [...g.entries()].map(([clave, x]) => ({
    slug: slugEntidad(nombreDe(clave)),
    nombre: nombreDe(clave),
    tipo: tiposManual.get(clave) ?? masFrecuente(x.tipos),
    apariciones: x.apariciones.sort((a, b) => ORDEN_FUENTE[a.fuente] - ORDEN_FUENTE[b.fuente] || (b.fecha ?? '').localeCompare(a.fecha ?? '')),
  }));
  entidades.sort((a, b) => TIPOS_ENTIDAD.indexOf(a.tipo) - TIPOS_ENTIDAD.indexOf(b.tipo) || a.nombre.localeCompare(b.nombre, 'es'));
  const porTipo: Vinculos['porTipo'] = {};
  for (const e of entidades) porTipo[e.tipo] = (porTipo[e.tipo] ?? 0) + 1;
  porDiputado.set(cod, { entidades, borme: borme.get(cod) ?? [], porTipo });
}

export const construirVinculos = (cod: number): Vinculos | null => porDiputado.get(cod) ?? null;
