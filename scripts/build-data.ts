/**
 * Genera los JSON que consume la web a partir de los datos en bruto:
 *   data/raw/diputados_base.tsv   (buscador oficial de diputados)
 *   data/raw/fichas.tsv           (ficha de cada diputado: cargos y declaración)
 *   data/raw/patrimonio/*.jsonl   (transcripción de las declaraciones de bienes)
 *   data/raw/fichas-personales.jsonl (ficha personal: formación, trayectoria, cargos y declaraciones)
 *   data/raw/votaciones/*.json    (votaciones clave descargadas de datos abiertos)
 *   data/manual/*.json            (grupos, votaciones clave y correcciones manuales)
 * Salida: data/congreso/{diputados,votaciones,resumen}.json
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { calcularRetribucion } from './retribuciones.ts';
import { construirPatrimonio, type DeclRaw } from './patrimonio.ts';
import { construirPerfil } from './perfil.ts';
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
    perfil: construirPerfil(+cod, genero === '2' ? 'F' : 'M', decls.get(+cod) ?? [], URL_BIENES),
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

// --- Temas: palabras clave sobre el título oficial (data/manual/temas.json) y correcciones a mano
const { temas: TEMAS } = JSON.parse(readFileSync('data/manual/temas.json', 'utf8')) as { temas: { id: string; nombre: string; palabras: string[] }[] };
const temasFijos = JSON.parse(readFileSync('data/manual/temas-correcciones.json', 'utf8')).votaciones as Record<string, string[]>;
const sinTildes = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const reTema = TEMAS.map((t) => ({ id: t.id, re: new RegExp(`(^|[^a-z0-9])(${t.palabras.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`) }));
function temasPorTexto(id: string, texto: string, tipo: string) {
  if (temasFijos[id]) return temasFijos[id];
  const t = sinTildes(texto);
  const ts = reTema.filter((x) => x.re.test(t)).map((x) => x.id);
  if (/Convenios internacionales/.test(tipo) && !ts.includes('exterior')) ts.push('exterior');
  return ts.length ? ts : ['otros'];
}
for (const v of votaciones) v.temas = (v as any).temas ?? temasPorTexto(v.id, v.titulo, v.tipo);

// --- Todas las votaciones del Pleno (data/raw/votaciones/pleno.jsonl, ver scripts/importar-votaciones.ts)
// Las votaciones clave (con texto, documentos y contenido revisados a mano) sustituyen a su versión automática.
const RUTA_PLENO = join(RAW, 'votaciones', 'pleno.jsonl');
const clavesPorFuente = new Set(votaciones.map((v) => v.fuenteUrl));
const LETRA_PLENO: Record<string, Voto> = { S: 'Sí', N: 'No', A: 'Abstención', X: 'No vota' };
const pleno: VotacionClave[] = existsSync(RUTA_PLENO) ? readFileSync(RUTA_PLENO, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l))
  .filter((p: any) => !clavesPorFuente.has(p.fuente))
  .map((p: any) => {
    const [titulo, ...modalidad] = String(p.texto).split('\n').map((s: string) => s.trim()).filter(Boolean);
    const t = p.totales;
    // Resultado a partir de los totales oficiales: mayoría simple, salvo la votación de conjunto
    // de leyes orgánicas, que exige mayoría absoluta (176 votos a favor; art. 81 de la Constitución).
    const organica = /Org[aá]nica/.test(titulo) && /conjunto/i.test([titulo, ...p.subgrupo].join(' '));
    const aprobada = organica ? t.si >= 176 : t.si > t.no;
    const esRdl = /Decretos-leyes/.test(p.tipo) && /^Real Decreto-ley/.test(titulo);
    const votos: Record<string, Voto> = {};
    for (const [cod, x] of Object.entries(p.votos as Record<string, string>)) votos[cod] = LETRA_PLENO[x];
    return {
      id: p.id, fecha: p.fecha, sesion: p.sesion, numeroVotacion: p.numero, tema: '', tipo: p.tipo, titulo,
      detalle: [...p.subgrupo, ...modalidad].join(' · ') || undefined,
      expediente: '', expedienteUrl: '', fuenteUrl: p.fuente,
      documentos: [{ titulo: `Resultado de la votación (PDF oficial)`, url: p.fuente.replace(/\.json$/, '.pdf'), tipo: 'votacion' }],
      resultado: esRdl ? (aprobada ? 'Convalidado' : 'Derogado') : aprobada ? 'Aprobada' : 'Rechazada',
      totales: t, votos, asientos: {}, temas: temasPorTexto(p.id, p.texto + ' ' + p.subgrupo.join(' '), p.tipo), automatica: true,
    } satisfies VotacionClave;
  }) : [];

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
writeFileSync(join(OUT, 'votaciones.json'), JSON.stringify({ meta, votaciones, pendientes, temas: [...TEMAS.map(({ id, nombre }) => ({ id, nombre })), { id: 'otros', nombre: 'Otros' }] }, null, 1));
writeFileSync(join(OUT, 'votaciones-pleno.json'), JSON.stringify({ meta, votaciones: pleno }));
writeFileSync(join(OUT, 'resumen.json'), JSON.stringify({ meta, grupos: resumen }, null, 1));
console.log(`OK: ${diputados.length} diputados, ${votaciones.length} votaciones clave y ${pleno.length} votaciones más del Pleno`);
console.log(`Propiedades: ${diputados.reduce((a, d) => a + (d.patrimonio.propiedades ?? 0), 0)} · Viviendas declaradas: ${diputados.reduce((a, d) => a + (d.patrimonio.viviendas ?? 0), 0)} · a revisar: ${diputados.filter((d) => d.patrimonio.revisar).length}`);
