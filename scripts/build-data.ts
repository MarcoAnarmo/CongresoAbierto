/**
 * Genera los JSON que consume la web a partir de los datos en bruto:
 *   data/raw/diputados_base.tsv   (buscador oficial de diputados)
 *   data/raw/fichas.tsv           (ficha de cada diputado: cargos y declaración)
 *   data/raw/patrimonio/*.jsonl   (transcripción de las declaraciones de bienes)
 *   data/raw/votaciones/*.json    (votaciones clave descargadas de datos abiertos)
 *   data/manual/*.json            (grupos, votaciones clave y correcciones manuales)
 * Salida: data/congreso/{diputados,votaciones,resumen}.json
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { calcularRetribucion } from './retribuciones.ts';
import { construirPatrimonio, type DeclRaw } from './patrimonio.ts';
import type { Diputado, GrupoInfo, VotacionClave, Voto } from '../src/lib/types.ts';

const RAW = 'data/raw';
const OUT = 'data/congreso';
const URL_BIENES = 'https://www.congreso.es/docbienes/leg15/';
mkdirSync(OUT, { recursive: true });

const leerTsv = (f: string) => readFileSync(join(RAW, f), 'utf8').split('\n').filter(Boolean).map((l) => l.split('|'));
const grupos: GrupoInfo[] = JSON.parse(readFileSync('data/manual/grupos.json', 'utf8'));
const correcciones = JSON.parse(readFileSync('data/manual/correcciones.json', 'utf8')).diputados as Record<string, any>;
const grupoPorNombre = new Map(grupos.map((g) => [g.nombre, g]));

// --- Fichas
const fichas = new Map(leerTsv('fichas.tsv').map(([cod, pdf, nDecl, cargoCamara, cargoComision]) => [cod, { pdf, nDecl: +nDecl, cargos: [cargoCamara, cargoComision].filter(Boolean) }]));

// --- Patrimonio: agrupar declaraciones por diputado
const decls = new Map<number, DeclRaw[]>();
// La transcripción revisada (revisado.jsonl) sustituye a las anteriores cuando existe.
const ficherosPatrimonio = readdirSync(join(RAW, 'patrimonio')).filter((f) => f.endsWith('.jsonl')).sort();
const usarRevisado = ficherosPatrimonio.includes('revisado.jsonl');
for (const f of usarRevisado ? ['revisado.jsonl'] : ficherosPatrimonio) {
  const piloto = f.includes('pilot');
  for (const linea of readFileSync(join(RAW, 'patrimonio', f), 'utf8').split('\n')) {
    if (!linea.trim()) continue;
    const d = JSON.parse(linea) as DeclRaw;
    if (piloto) {
      d.tipo = 'ultima';
      d.pdf = fichas.get(String(d.cod))!.pdf.split('/')[1];
      d.esModificacionParcial = /modificaci/i.test(d.obs ?? '') && !(d.urbana?.length);
    }
    if (!decls.has(d.cod)) decls.set(d.cod, []);
    const lista = decls.get(d.cod)!;
    if (!lista.some((x) => x.pdf === d.pdf)) lista.push(d);
  }
}

// --- Diputados
const diputados: Diputado[] = leerTsv('diputados_base.tsv').map(([cod, apellidos, nombre, genero, partido, grupo, circ, alta]) => {
  const ficha = fichas.get(cod)!;
  const g = grupoPorNombre.get(grupo);
  if (!g) throw new Error(`Grupo desconocido: ${grupo}`);
  const patrimonio = construirPatrimonio(decls.get(+cod) ?? [], URL_BIENES, correcciones[cod] ?? {});
  const [d, m, y] = alta.split('/');
  return {
    id: `congreso-xv-${cod}`,
    camara: 'congreso',
    legislatura: 'XV',
    codParlamentario: +cod,
    nombre,
    apellidos,
    nombreCompleto: `${nombre} ${apellidos}`,
    genero: genero === '2' ? 'F' : 'M',
    partido,
    grupo,
    grupoCorto: g.corto,
    circunscripcion: circ,
    fechaAlta: `${y}-${m}-${d}`,
    fichaUrl: `https://www.congreso.es/es/busqueda-de-diputados?p_p_id=diputadomodule&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&_diputadomodule_mostrarFicha=true&codParlamentario=${cod}&idLegislatura=XV`,
    fotoUrl: `https://www.congreso.es/docu/imgweb/diputados/${cod}_15.jpg`,
    cargos: ficha.cargos,
    retribucion: calcularRetribucion(ficha.cargos, circ),
    patrimonio,
  } satisfies Diputado;
});

// --- Votaciones clave (formato compacto: voto mayoritario por grupo + excepciones)
const votaciones: VotacionClave[] = [];
const clavesManual = JSON.parse(readFileSync('data/manual/votaciones-clave.json', 'utf8')) as any[];
const compactas = new Map(readFileSync(join(RAW, 'votaciones', 'votaciones-compactas.txt'), 'utf8').split('\n')
  .filter((l) => l.trim() && !l.startsWith('#')).map((l) => [l.split('|')[0], l.split('|')]));
const LETRA: Record<string, Voto> = { S: 'Sí', N: 'No', A: 'Abstención', X: 'No vota' };
for (const vc of clavesManual) {
  const c = compactas.get(vc.id);
  if (!c) { console.warn(`(aviso) sin datos oficiales todavía para ${vc.id}`); continue; }
  const [, , sesion, num, tot, mayorias, excepciones] = c;
  const mayoria = new Map(mayorias.split(';').map((x) => { const [g, v] = x.split('='); return [`GP ${g}`, v]; }));
  const exc = new Map((excepciones ?? '').split(',').filter(Boolean).map((x) => x.split(':') as [string, string]));
  const votos: Record<string, Voto> = {};
  for (const d of diputados) {
    const letra = exc.get(String(d.codParlamentario)) ?? mayoria.get(d.grupo);
    if (!letra) throw new Error(`${vc.id}: sin voto para el grupo ${d.grupo}`);
    if (letra !== '-') votos[d.codParlamentario] = LETRA[letra];
  }
  const [si, no, abstencion, noVota] = tot.split(',').map(Number);
  votaciones.push({ ...vc, sesion: +sesion, numeroVotacion: +num, totales: { si, no, abstencion, noVota },
    resultado: /Decretos-leyes/.test(vc.tipo) ? (si > no ? 'Convalidado' : 'Derogado') : (si > no ? 'Aprobada' : 'Rechazada'), votos, asientos: {} });
}
const pendientes = JSON.parse(readFileSync('data/manual/votaciones-pendientes.json', 'utf8'));

// --- Resumen por grupo
const resumen = grupos.map((g) => {
  const ds = diputados.filter((d) => d.grupoCorto === g.corto);
  const conDatos = ds.filter((d) => d.patrimonio.viviendas !== null);
  const suma = (f: (d: Diputado) => number) => ds.reduce((a, d) => a + f(d), 0);
  return {
    ...g,
    diputados: ds.length,
    conDeclaracion: conDatos.length,
    propiedades: suma((d) => d.patrimonio.propiedades ?? 0),
    viviendas: suma((d) => d.patrimonio.viviendas ?? 0),
    viviendasEquivalentes: Math.round(suma((d) => d.patrimonio.viviendasEquivalentes ?? 0) * 100) / 100,
    vehiculos: suma((d) => d.patrimonio.vehiculos ?? 0),
    mediaViviendas: conDatos.length ? Math.round((suma((d) => d.patrimonio.viviendas ?? 0) / conDatos.length) * 100) / 100 : null,
    sinVivienda: conDatos.filter((d) => d.patrimonio.viviendas === 0).length,
    tresOMas: conDatos.filter((d) => (d.patrimonio.viviendas ?? 0) >= 3).length,
    retribucionMensualMedia: Math.round(suma((d) => d.retribucion.totalMensual) / ds.length),
  };
});

const meta = { generado: new Date().toISOString(), fuente: 'Congreso de los Diputados (datos abiertos y fichas oficiales)', legislatura: 'XV' };
writeFileSync(join(OUT, 'diputados.json'), JSON.stringify({ meta, diputados }, null, 1));
writeFileSync(join(OUT, 'votaciones.json'), JSON.stringify({ meta, votaciones, pendientes }, null, 1));
writeFileSync(join(OUT, 'resumen.json'), JSON.stringify({ meta, grupos: resumen }, null, 1));
console.log(`OK: ${diputados.length} diputados, ${votaciones.length} votaciones clave`);
console.log(`Propiedades: ${diputados.reduce((a, d) => a + (d.patrimonio.propiedades ?? 0), 0)} · Viviendas declaradas: ${diputados.reduce((a, d) => a + (d.patrimonio.viviendas ?? 0), 0)} · a revisar: ${diputados.filter((d) => d.patrimonio.revisar).length}`);
