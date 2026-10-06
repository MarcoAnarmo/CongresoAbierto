/**
 * Estadísticas de la página /estadisticas. Funciones puras: reciben los datos y devuelven recuentos.
 * Se calculan en la build (no en el navegador) y se prueban en tests/estadisticas.test.ts.
 *
 * Principio del proyecto: siempre totales (cuántos), nunca medias.
 */
import type { Diputado, VotacionClave } from './types';
import { votoMayoritario, esRentaDeAlquiler, tramoDe, type Posicion } from './datos/derivados';
import { sinTildes } from './texto';

type VotacionGrupos = Pick<VotacionClave, 'id' | 'porGrupo' | 'temas'>;
const temasDe = (v: { temas?: string[] }) => (v.temas?.length ? v.temas : ['otros']);

/** Voto mayoritario de cada grupo en cada votación: Map<idVotación, Map<grupo, posición>>. */
export function posiciones(vs: VotacionGrupos[]) {
  const r = new Map<string, Map<string, Posicion>>();
  for (const v of vs) {
    const m = new Map<string, Posicion>();
    for (const [g, si, no, abs] of v.porGrupo ?? []) {
      const p = votoMayoritario(si, no, abs);
      if (p) m.set(g, p);
    }
    r.set(v.id, m);
  }
  return r;
}

export type Recuento = Record<Posicion, number> & { total: number };
const vacio = (): Recuento => ({ 'Sí': 0, 'No': 0, 'Abstención': 0, 'Empate': 0, total: 0 });

/** Por tema y grupo: en cuántas votaciones el grupo votó mayoritariamente sí, no, abstención o empató. */
export function votoPorTema(vs: VotacionGrupos[], grupos: string[]) {
  const pos = posiciones(vs);
  const r = new Map<string, Map<string, Recuento>>();
  const nVotaciones = new Map<string, number>();
  for (const v of vs) {
    const m = pos.get(v.id)!;
    for (const tema of temasDe(v)) {
      nVotaciones.set(tema, (nVotaciones.get(tema) ?? 0) + 1);
      const porGrupo = r.get(tema) ?? new Map(grupos.map((g) => [g, vacio()]));
      r.set(tema, porGrupo);
      for (const g of grupos) {
        const p = m.get(g);
        if (!p) continue;
        const c = porGrupo.get(g)!;
        c[p]++; c.total++;
      }
    }
  }
  return { porTema: r, nVotaciones };
}

/** Para cada par de grupos: en cuántas votaciones los dos votaron (con mayoría clara) y en cuántas coincidieron. */
export function coincidencias(vs: VotacionGrupos[], grupos: string[]) {
  const pos = posiciones(vs);
  const r = new Map<string, Map<string, { iguales: number; ambos: number }>>(grupos.map((a) => [a, new Map(grupos.filter((b) => b !== a).map((b) => [b, { iguales: 0, ambos: 0 }]))]));
  for (const m of pos.values()) {
    for (const a of grupos) {
      const pa = m.get(a);
      if (!pa || pa === 'Empate') continue;
      for (const b of grupos) {
        if (a === b) continue;
        const pb = m.get(b);
        if (!pb || pb === 'Empate') continue;
        const c = r.get(a)!.get(b)!;
        c.ambos++;
        if (pa === pb) c.iguales++;
      }
    }
  }
  return r;
}

/** Diputados que más veces votaron distinto de la mayoría de su grupo. */
export const masDistintos = (ds: Diputado[], n = 10) =>
  ds.filter((d) => (d.participacion?.distintoGrupo ?? 0) > 0)
    .sort((a, b) => b.participacion!.distintoGrupo - a.participacion!.distintoGrupo || a.apellidos.localeCompare(b.apellidos, 'es'))
    .slice(0, n);

/** Cuántos diputados hay de cada valor de una clave (en el orden dado). */
export function contar<K extends string>(ds: Diputado[], clave: (d: Diputado) => K | null, orden: readonly K[]) {
  const r = new Map<K, number>(orden.map((k) => [k, 0]));
  for (const d of ds) {
    const k = clave(d);
    if (k !== null && r.has(k)) r.set(k, r.get(k)! + 1);
  }
  return r;
}

export const TIPOS_FORMACION = ['publica', 'privada', 'ambas', 'sin-centro', 'sin-datos'] as const;

/** Universidades del RUCT nombradas en la formación: cuántos diputados mencionan cada una (una vez por persona). */
export function universidades(ds: Diputado[], n = 10) {
  const r = new Map<string, { nombre: string; tipo: string; n: number }>();
  for (const d of ds) {
    const vistas = new Set<string>();
    for (const l of d.perfil?.formacion ?? []) for (const c of l.centros) {
      if (vistas.has(c.codigo)) continue;
      vistas.add(c.codigo);
      const x = r.get(c.codigo) ?? { nombre: c.nombre, tipo: c.tipo, n: 0 };
      x.n++;
      r.set(c.codigo, x);
    }
  }
  return [...r.values()].sort((a, b) => b.n - a.n || a.nombre.localeCompare(b.nombre, 'es')).slice(0, n);
}

/**
 * Áreas de estudio: clasificación propia por palabras del texto oficial de la formación.
 * Una persona cuenta una vez en cada área que aparece en su ficha (puede estar en varias).
 */
export const AREAS_ESTUDIO: { id: string; palabras: RegExp }[] = [
  { id: 'derecho', palabras: /\b(derecho|juridic|abogad|criminolog)/ },
  { id: 'economia', palabras: /\b(econom|empresa|empresarial|ade\b|administracion y direccion|finanz|contabil|marketing|comercio|actuarial)/ },
  { id: 'politicas', palabras: /\b(ciencias? politica|politicas|politologi|gestion y administracion publica|relaciones internacionales)/ },
  { id: 'sociales', palabras: /\b(sociolog|trabajo social|relaciones laborales|graduado social|antropolog|geografia)/ },
  { id: 'comunicacion', palabras: /\b(periodismo|comunicacion|ciencias de la informacion|audiovisual|publicidad)/ },
  { id: 'humanidades', palabras: /\b(historia|filolog|filosof|humanidades|letras|traduccion|arte|bellas artes|musica)/ },
  { id: 'educacion', palabras: /\b(magisterio|maestr|educacion|pedagog|psicopedagog)/ },
  { id: 'ingenieria', palabras: /\b(ingenier|arquitect|informatica|telecomunicacion)/ },
  { id: 'ciencias', palabras: /\b(fisica|quimic|biolog|matematic|geolog|ciencias ambientales|ciencias del mar|veterinari|agronom|estadistica)/ },
  { id: 'salud', palabras: /\b(medicina|medico|enfermer|psicolog|farmac|fisioterap|odontolog|nutricion)/ },
];
export function areasEstudio(ds: Diputado[]) {
  const r = new Map(AREAS_ESTUDIO.map((a) => [a.id, 0]));
  for (const d of ds) {
    const texto = sinTildes((d.perfil?.formacion ?? []).map((l) => l.texto).join(' ')).toLowerCase();
    for (const a of AREAS_ESTUDIO) if (a.palabras.test(texto)) r.set(a.id, r.get(a.id)! + 1);
  }
  return [...r].map(([id, n]) => ({ id, n })).sort((a, b) => b.n - a.n);
}

/** Cortes (en euros) de los tramos de rentas declaradas. El tramo 0 es «ninguna» (0 €). */
export const CORTES_RENTAS = [20000, 50000, 100000, 200000];
/**
 * Diputados por tramo de rentas declaradas (sin el sueldo del Congreso). Si algún importe es ilegible,
 * el total es un mínimo y cuenta en el tramo de ese mínimo (se dice cuántos son).
 */
export function tramosRentas(ds: Diputado[]) {
  const tramos = new Array(CORTES_RENTAS.length + 2).fill(0) as number[];
  let alMenos = 0, sinDeclaracion = 0;
  for (const d of ds) {
    const fz = d.finanzas;
    if (!fz) { sinDeclaracion++; continue; }
    const total = fz.rentas?.total ?? 0;
    if (fz.rentas?.totalIncompleto) alMenos++;
    tramos[total <= 0 && !fz.rentas?.totalIncompleto ? 0 : 1 + tramoDe(total, CORTES_RENTAS)]++;
  }
  return { tramos, alMenos, sinDeclaracion };
}

/** Diputados con alguna renta cuyo concepto menciona un alquiler o arrendamiento. */
export const conRentasDeAlquiler = (ds: Diputado[]) => ds.filter((d) => d.finanzas?.rentas?.filas.some(esRentaDeAlquiler));

/** Mujeres y hombres por grupo. */
export function generoPorGrupo(ds: Diputado[], grupos: string[]) {
  return grupos.map((g) => {
    const xs = ds.filter((d) => d.grupoCorto === g);
    return { g, F: xs.filter((d) => d.genero === 'F').length, M: xs.filter((d) => d.genero === 'M').length };
  });
}

/** Diputados por década de nacimiento (1940, 1950…), más los que no lo tienen en su ficha. */
export function decadas(ds: Diputado[]) {
  const r = new Map<number, number>();
  let sinDato = 0;
  for (const d of ds) {
    const a = d.perfil?.anioNacimiento;
    if (!a) { sinDato++; continue; }
    const k = Math.floor(a / 10) * 10;
    r.set(k, (r.get(k) ?? 0) + 1);
  }
  return { porDecada: [...r].sort((a, b) => a[0] - b[0]), sinDato };
}
