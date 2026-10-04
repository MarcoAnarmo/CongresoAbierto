/** Contenido de cada tipo de tarjeta para redes. El dibujo común está en og.ts. */
import { diputados, votaciones, grupos, colorGrupo, fmtEur, fmtNum, slug, resumen, candidaturaDistinta } from './data';
import type { Diputado, VotacionClave, Voto } from './types';
import { C, h, lienzo, cabecera, pie, cifra, retrato, barraVotos, fotoDataUri, aPng, type Formato } from './og';

const fechaCorta = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
const fechaLarga = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
/** «RDL 8/2026 · alquiler (28/04/2026)» → «RDL 8/2026 · alquiler». */
export const temaCorto = (tema: string) => tema.replace(/\s*\(\d{2}\/\d{2}\/\d{4}\)\s*$/, '');
const n = (x: number | null) => (x === null ? '—' : fmtNum(x));
const colorVoto: Record<Voto, string> = { 'Sí': C.si, 'No': C.no, 'Abstención': C.abs, 'No vota': C.novota };
const ordenGrupo = new Map(grupos.map((g) => [g.corto, g.orden]));
const puntoGrupo = (color: string, tam: number) => h('div', { width: tam, height: tam, borderRadius: tam / 2, background: color, flexShrink: 0 });
const pastilla = (texto: string, color: string, escala: number) =>
  h('div', { padding: `${6 * escala}px ${16 * escala}px`, borderRadius: 999, background: color, color: '#fff', fontSize: 22 * escala, fontWeight: 700 }, texto);
const resultadoColor = (r: string) => (/Aprobada|Convalidado/.test(r) ? C.si : C.no);

/* ---------- Diputado ---------- */
/**
 * Rótulos cortos de las votaciones clave para las tarjetas, con palabras de su título oficial.
 * «mini» es el rótulo de la tira de votos de la tarjeta horizontal. Si falta una votación, se usa su tema.
 */
const ROTULOS: Record<string, { corto: string; mini: string; quien: string }> = {
  'pl-ley-vivienda-sumar-2026': { corto: 'Modificar la Ley de vivienda', mini: 'Ley de vivienda', quien: 'Propuesta de SUMAR' },
  'pnl-especulacion-2026': { corto: 'Frenar la especulación inmobiliaria', mini: 'Especulación', quien: 'Propuesta (no de ley) de SUMAR' },
  'pl-okupacion-pp-2026': { corto: 'Contra la ocupación ilegal', mini: 'Ocupación ilegal', quien: 'Propuesta del PP' },
  'rdl-8-2026': { corto: 'Medidas en el alquiler', mini: 'Decreto alquiler', quien: 'Decreto ley del Gobierno' },
  'pl-suelo-vivienda-pp-2026': { corto: 'Ordenación urbanística y vivienda', mini: 'Urbanismo', quien: 'Propuesta del PP' },
  'pl-pisos-turisticos-2025': { corto: 'Regular los pisos turísticos', mini: 'Pisos turísticos', quien: 'Propuesta de EH Bildu' },
  'pl-alquiler-temporada-2024-12': { corto: 'Alquiler temporal y de habitaciones', mini: 'Alquiler temporal', quien: 'Propuesta de SUMAR, ERC, Bildu y Mixto' },
};
export const rotulo = (v: VotacionClave) => ROTULOS[v.id] ?? { corto: temaCorto(v.tema), mini: temaCorto(v.tema), quien: v.tipo.replace(/\.$/, '') };

/** Etiqueta de un voto; sin voto registrado es porque aún no era diputado o diputada. */
const textoVoto = (voto: Voto | undefined, d: Diputado) => voto ?? (d.genero === 'F' ? 'No era diputada' : 'No era diputado');
function chipVoto(voto: Voto | undefined, d: Diputado, ancho: number, alto: number, tam: number) {
  const color = voto ? colorVoto[voto] : C.chip;
  return h('div', {
    width: ancho, height: alto, borderRadius: alto / 2, background: color, color: voto ? (voto === 'Abstención' ? C.texto : '#fff') : C.apagado,
    alignItems: 'center', justifyContent: 'center', fontSize: voto ? Math.round(voto === 'Abstención' ? tam * 0.86 : tam) : Math.round(tam * 0.68), fontWeight: 800, flexShrink: 0,
  }, textoVoto(voto, d));
}

/** Cifra grande con su rótulo; «tono» decide el fondo (blanco, naranja suave u oscuro). */
function dato(valor: string, etiqueta: string, tono: 'claro' | 'acento' | 'oscuro', e: number, flex = 1, tamValor = 96) {
  const fondo = { claro: C.blanco, acento: C.acentoSuave, oscuro: C.texto }[tono];
  const borde = { claro: C.borde, acento: '#f7c9a6', oscuro: C.texto }[tono];
  return h('div', {
    flexDirection: 'column', justifyContent: 'space-between', flex, gap: 6 * e, padding: `${22 * e}px ${26 * e}px`,
    borderRadius: 24 * e, background: fondo, border: `${2 * e}px solid ${borde}`,
  },
    h('div', { fontSize: tamValor * e, fontWeight: 800, letterSpacing: -3 * e, lineHeight: 1, color: tono === 'acento' ? C.acento : tono === 'oscuro' ? '#fff' : C.texto }, valor),
    h('div', { fontSize: 25 * e, lineHeight: 1.25, color: tono === 'oscuro' ? '#d5d8de' : C.apagado }, etiqueta));
}

export async function tarjetaDiputado(d: Diputado, formato: Formato) {
  const p = d.patrimonio;
  const foto = await fotoDataUri(d.fotoUrl);
  const color = colorGrupo(d.grupoCorto);
  const cargo = `${d.genero === 'F' ? 'Diputada' : 'Diputado'} por ${nombreLegible(d.circunscripcion)}`;
  const sinDecl = p.propiedades === null;
  const prop = sinDecl ? '—' : n(p.propiedades);
  const etProp = sinDecl ? 'sin declaración de bienes publicada' : p.propiedades === 1 ? 'propiedad declarada' : 'propiedades declaradas';
  const viv = sinDecl ? '—' : n(p.viviendas);
  const etViv = sinDecl || !p.propiedades ? 'viviendas' : p.viviendas === 1 ? 'de ellas, vivienda' : 'de ellas, viviendas';
  const sueldo = fmtEur(d.retribucion.totalMensual);
  const etSueldo = 'al mes del Congreso';
  const votos = [...votaciones].sort((a, b) => b.fecha.localeCompare(a.fecha))
    .map((v) => ({ v, r: rotulo(v), voto: v.votos[String(d.codParlamentario)] as Voto | undefined }));
  const veh = p.vehiculos ? `${n(p.vehiculos)} ${p.vehiculos === 1 ? 'vehículo' : 'vehículos'}` : null;
  const notaBienes = sinDecl ? null : [p.declaracionFecha && `Declaración de bienes del ${fechaCorta(p.declaracionFecha)}`, veh && `también declara ${veh}`].filter(Boolean).join(' · ');
  const nombre = d.nombreCompleto;

  if (formato === 'horizontal') {
    const tam = nombre.length > 34 ? 44 : nombre.length > 24 ? 50 : 58;
    return aPng(h('div', {
      width: 1200, height: 630, flexDirection: 'column', justifyContent: 'space-between', background: C.fondo, color: C.texto,
      fontFamily: 'Inter', borderTop: `12px solid ${C.naranja}`, padding: '30px 52px 32px',
    },
      h('div', { justifyContent: 'space-between', alignItems: 'center' },
        cabecera(0.78),
        h('div', { fontSize: 22, fontWeight: 700, color: C.acento }, 'congresoabierto.pages.dev')),
      h('div', { gap: 30, alignItems: 'stretch' },
        retrato(foto, nombre, 206, 262, color),
        h('div', { flexDirection: 'column', justifyContent: 'space-between', flex: 1, gap: 14 },
          h('div', { flexDirection: 'column', gap: 8 },
            h('div', { fontSize: tam, fontWeight: 800, letterSpacing: -1.5, lineHeight: 1.05 }, nombre),
            h('div', { alignItems: 'center', gap: 10, fontSize: 24, color: C.apagado }, puntoGrupo(color, 18), h('div', { fontWeight: 700, color: C.texto }, d.grupoCorto), candidaturaDistinta(d) ? `(${d.partido}) · ${cargo}` : `· ${cargo}`)),
          h('div', { gap: 14 },
            dato(prop, etProp, 'claro', 0.68, 1, 100),
            dato(viv, etViv, 'acento', 0.68, 1, 100),
            dato(sueldo, etSueldo, 'oscuro', 0.68, 1.45, 96)))),
      h('div', { flexDirection: 'column', gap: 10 },
        h('div', { fontSize: 19, fontWeight: 700, color: C.apagado, letterSpacing: 0.3 }, 'CÓMO VOTÓ SOBRE VIVIENDA'),
        h('div', { gap: 10 },
          ...votos.map(({ r, voto }) => h('div', { flexDirection: 'column', alignItems: 'center', gap: 6, width: 146 },
            chipVoto(voto, d, 146, 40, 22),
            h('div', { fontSize: 17, color: C.apagado, textAlign: 'center', lineHeight: 1.15 }, r.mini))))),
    ), 'horizontal');
  }

  const tam = nombre.length > 34 ? 60 : nombre.length > 22 ? 68 : 80;
  return aPng(h('div', {
    width: 1080, height: 1920, flexDirection: 'column', background: C.fondo, color: C.texto,
    fontFamily: 'Inter', borderTop: `16px solid ${C.naranja}`, padding: '150px 72px 0',
  },
    // Cabecera (zona alta: la tapan en parte el nombre y la barra de la historia)
    h('div', { justifyContent: 'space-between', alignItems: 'center' },
      cabecera(1.15),
      h('div', { fontSize: 27, fontWeight: 800, color: C.acento }, 'congresoabierto.pages.dev')),
    // Quién es
    h('div', { alignItems: 'center', gap: 40, marginTop: 48 },
      retrato(foto, nombre, 280, 356, color),
      h('div', { flexDirection: 'column', gap: 20, flex: 1 },
        h('div', { alignSelf: 'flex-start', alignItems: 'center', gap: 12, padding: '8px 20px', borderRadius: 999, background: C.blanco, border: `2px solid ${C.borde}`, fontSize: 30, fontWeight: 800 }, puntoGrupo(color, 22), d.grupoCorto, candidaturaDistinta(d) && h('div', { fontWeight: 400, color: C.apagado }, `· ${d.partido}`)),
        h('div', { fontSize: tam, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1.04 }, nombre),
        h('div', { fontSize: 32, color: C.apagado, lineHeight: 1.25 }, cargo))),
    // Qué declara y cuánto cobra
    h('div', { flexDirection: 'column', gap: 12, marginTop: 40 },
      h('div', { gap: 16 },
        dato(prop, etProp, 'claro', 1, 1, 104),
        dato(viv, etViv, 'acento', 1, 1, 104),
        dato(sueldo, etSueldo, 'oscuro', 1, 1.3, sueldo.length > 6 ? 70 : 78)),
      notaBienes && h('div', { fontSize: 24, color: C.apagado, paddingLeft: 6 }, notaBienes),
      p.revisar && h('div', { alignItems: 'center', gap: 10, fontSize: 24, fontWeight: 700, color: C.acento, paddingLeft: 6 }, h('div', { width: 30, height: 30, borderRadius: 15, background: C.acento, color: '#fff', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800 }, '!'), 'Lectura no confirmada: compruébala en el PDF oficial')),
    // Cómo votó
    h('div', { flexDirection: 'column', marginTop: 32, background: C.blanco, border: `2px solid ${C.borde}`, borderRadius: 28, padding: '24px 30px 10px' },
      h('div', { fontSize: 25, fontWeight: 800, color: C.apagado, letterSpacing: 0.5, marginBottom: 4 }, 'CÓMO VOTÓ SOBRE VIVIENDA'),
      ...votos.map(({ v, r, voto }, i) => h('div', { alignItems: 'center', justifyContent: 'space-between', gap: 18, padding: '11px 0', borderTop: i ? `2px solid ${C.chip}` : 'none' },
        h('div', { flexDirection: 'column', flex: 1, gap: 3 },
          h('div', { fontSize: 30, fontWeight: 800, lineHeight: 1.15, letterSpacing: -0.5 }, r.corto),
          h('div', { flexWrap: 'wrap', gap: 8, fontSize: 21, color: C.apagado, lineHeight: 1.25 },
            `${r.quien} · ${fechaCorta(v.fecha)} ·`, h('div', { color: resultadoColor(v.resultado), fontWeight: 700 }, v.resultado))),
        chipVoto(voto, d, 184, 56, 29)))),
    // Pie (justo encima de la zona de respuesta de la historia)
    h('div', { flexDirection: 'column', gap: 4, marginTop: 22, fontSize: 23, color: C.apagado, paddingLeft: 6 },
      h('div', { fontWeight: 700, color: C.texto }, 'Conoce a quien te representa'),
      h('div', {}, 'Datos oficiales del Congreso y del BOE, sin interpretaciones')),
  ), 'historia');
}

/* ---------- Votación ---------- */
function votoPorGrupo(v: VotacionClave) {
  return [...grupos].sort((a, b) => a.orden - b.orden).map((g) => {
    const t = { si: 0, no: 0, abstencion: 0, noVota: 0 };
    diputados.filter((d) => d.grupoCorto === g.corto).forEach((d) => {
      const x = v.votos[String(d.codParlamentario)];
      if (x === 'Sí') t.si++; else if (x === 'No') t.no++; else if (x === 'Abstención') t.abstencion++; else if (x === 'No vota') t.noVota++;
    });
    return { g, t, total: t.si + t.no + t.abstencion + t.noVota };
  }).filter((x) => x.total > 0);
}

export async function tarjetaVotacion(v: VotacionClave, formato: Formato) {
  const t = v.totales;
  const e = formato === 'historia' ? 1.45 : 1;
  const numeros = h('div', { gap: 16 * e },
    cifra(String(t.si), 'sí', false, e), cifra(String(t.no), 'no', false, e), cifra(String(t.abstencion), 'abstención', false, e), cifra(String(t.noVota), 'no vota', false, e));
  const titulo = (tam: number) => h('div', { flexDirection: 'column', gap: 14 * e },
    h('div', { fontSize: 26 * e, color: C.apagado }, `${fechaLarga(v.fecha)} · Pleno del Congreso`),
    h('div', { fontSize: tam, fontWeight: 800, letterSpacing: -2, lineHeight: 1.08 }, temaCorto(v.tema)),
    h('div', {}, pastilla(v.resultado, resultadoColor(v.resultado), e)));
  if (formato === 'horizontal') {
    return aPng(lienzo('horizontal', cabecera(), titulo(62), h('div', { flexDirection: 'column', gap: 16 }, numeros, barraVotos(t, 16, 1072)), pie()), 'horizontal');
  }
  const filas = votoPorGrupo(v);
  return aPng(lienzo('historia',
    cabecera(1.4),
    titulo(76),
    h('div', { flexDirection: 'column', gap: 22 }, numeros, barraVotos(t, 24, 920)),
    h('div', { flexDirection: 'column', gap: 16, background: C.blanco, border: `3px solid ${C.borde}`, borderRadius: 26, padding: '28px 32px' },
      h('div', { fontSize: 28, fontWeight: 700, color: C.apagado }, 'Voto por grupo'),
      ...filas.map(({ g, t: tg }) => h('div', { alignItems: 'center', gap: 18 },
        h('div', { alignItems: 'center', gap: 12, width: 190, fontSize: 28, fontWeight: 700 }, puntoGrupo(g.color, 20), g.corto),
        barraVotos(tg, 20, 600)))),
    pie(1.4),
  ), 'historia');
}

/* ---------- Provincia ---------- */
export const nombreLegible = (c: string) => (c === 'S/C Tenerife' ? 'Santa Cruz de Tenerife' : c.replace(/^(.+) \((.+)\)$/, '$2 $1'));
export const slugTexto = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
export const circunscripciones = [...new Set(diputados.map((d) => d.circunscripcion))]
  .map((c) => ({ id: slugTexto(nombreLegible(c)), nombre: c, legible: nombreLegible(c) }))
  .sort((a, b) => a.legible.localeCompare(b.legible, 'es'));

export async function tarjetaProvincia(id: string, formato: Formato) {
  const c = circunscripciones.find((x) => x.id === id)!;
  const ds = diputados.filter((d) => d.circunscripcion === c.nombre)
    .sort((a, b) => (ordenGrupo.get(a.grupoCorto)! - ordenGrupo.get(b.grupoCorto)!) || a.apellidos.localeCompare(b.apellidos, 'es'));
  const conDatos = ds.filter((d) => d.patrimonio.viviendas !== null);
  const viv = conDatos.reduce((a, d) => a + (d.patrimonio.viviendas ?? 0), 0);
  const prop = conDatos.reduce((a, d) => a + (d.patrimonio.propiedades ?? 0), 0);
  const porGrupo = [...new Set(ds.map((d) => d.grupoCorto))].map((g) => ({ g, n: ds.filter((d) => d.grupoCorto === g).length }));
  const e = formato === 'historia' ? 1.45 : 1;
  const composicion = h('div', { flexWrap: 'wrap', gap: 12 * e },
    ...porGrupo.map(({ g, n: k }) => h('div', { alignItems: 'center', gap: 10 * e, padding: `${8 * e}px ${16 * e}px`, borderRadius: 999, background: C.blanco, border: `${2 * e}px solid ${C.borde}`, fontSize: 24 * e, fontWeight: 700 }, puntoGrupo(colorGrupo(g), 16 * e), `${g} ${k}`)));
  const cifras = h('div', { gap: 18 * e },
    cifra(String(ds.length), ds.length === 1 ? 'diputado elegido' : 'diputados elegidos', true, e),
    cifra(conDatos.length ? fmtNum(prop) : '—', prop === 1 ? 'propiedad declarada' : 'propiedades declaradas', false, e),
    cifra(conDatos.length ? fmtNum(viv) : '—', viv === 1 ? 'es vivienda' : 'son viviendas', false, e));
  const titulo = (tam: number) => h('div', { flexDirection: 'column', gap: 8 * e },
    h('div', { fontSize: 28 * e, color: C.apagado }, 'Tus diputados por'),
    h('div', { fontSize: tam, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05 }, c.legible));
  if (formato === 'horizontal') return aPng(lienzo('horizontal', cabecera(), titulo(72), composicion, cifras, pie()), 'horizontal');

  const fotos = await Promise.all(ds.map((d) => fotoDataUri(d.fotoUrl)));
  const k = ds.length;
  const w = k <= 4 ? 200 : k <= 9 ? 160 : k <= 16 ? 130 : k <= 24 ? 110 : 96;
  return aPng(lienzo('historia',
    cabecera(1.4),
    titulo(96),
    h('div', { flexWrap: 'wrap', gap: 14, justifyContent: 'center' },
      ...ds.map((d, i) => retrato(fotos[i], d.nombreCompleto, w, Math.round(w * 1.27), colorGrupo(d.grupoCorto)))),
    composicion,
    h('div', { flexDirection: 'column', gap: 18 },
      h('div', { gap: 18 }, cifra(String(ds.length), ds.length === 1 ? 'diputado' : 'diputados', true, 1.3), cifra(conDatos.length ? fmtNum(prop) : '—', prop === 1 ? 'propiedad declarada' : 'propiedades declaradas', false, 1.3)),
      h('div', { fontSize: 30, color: C.apagado }, conDatos.length ? `De ellas, ${fmtNum(viv)} ${viv === 1 ? 'es vivienda' : 'son viviendas'}` : '')),
    pie(1.4),
  ), 'historia');
}

/* ---------- Resumen del Congreso ---------- */
export async function tarjetaResumen(formato: Formato) {
  const con = diputados.filter((d) => d.patrimonio.viviendas !== null);
  const prop = con.reduce((a, d) => a + (d.patrimonio.propiedades ?? 0), 0);
  const viv = con.reduce((a, d) => a + (d.patrimonio.viviendas ?? 0), 0);
  const pct = (k: number) => `${Math.round((100 * k) / con.length)} %`;
  const alguna = con.filter((d) => (d.patrimonio.viviendas ?? 0) > 0).length;
  const tres = con.filter((d) => (d.patrimonio.viviendas ?? 0) >= 3).length;
  const e = formato === 'historia' ? 1.45 : 1;
  const c = [cifra(fmtNum(prop), 'propiedades declaradas', true, e), cifra(fmtNum(viv), 'son viviendas', false, e), cifra(pct(alguna), 'tiene al menos una vivienda', false, e), cifra(pct(tres), 'declara 3 viviendas o más', false, e)];
  const titulo = (tam: number) => h('div', { flexDirection: 'column', gap: 12 * e },
    h('div', { fontSize: tam, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05 }, '¿Quién te representa y qué tiene?'),
    h('div', { fontSize: 28 * e, color: C.apagado }, 'Los 350 diputados del Congreso, según sus declaraciones oficiales'));
  if (formato === 'horizontal') return aPng(lienzo('horizontal', cabecera(), titulo(60), h('div', { gap: 16 }, ...c), pie()), 'horizontal');
  const filas = [...resumen].sort((a, b) => b.propiedades - a.propiedades);
  const max = Math.max(...filas.map((f) => f.propiedades));
  return aPng(lienzo('historia',
    cabecera(1.4),
    titulo(84),
    h('div', { flexDirection: 'column', gap: 22 }, h('div', { gap: 22 }, c[0], c[1]), h('div', { gap: 22 }, c[2], c[3])),
    h('div', { flexDirection: 'column', gap: 14, background: C.blanco, border: `3px solid ${C.borde}`, borderRadius: 26, padding: '28px 32px' },
      h('div', { fontSize: 28, fontWeight: 700, color: C.apagado }, 'Propiedades declaradas por grupo'),
      ...filas.map((f) => h('div', { alignItems: 'center', gap: 16 },
        h('div', { alignItems: 'center', gap: 12, width: 190, fontSize: 27, fontWeight: 700 }, puntoGrupo(f.color, 18), f.corto),
        h('div', { width: Math.max(8, Math.round((560 * f.propiedades) / max)), height: 22, borderRadius: 11, background: f.color }),
        h('div', { fontSize: 27, fontWeight: 700 }, fmtNum(f.propiedades))))),
    pie(1.4),
  ), 'historia');
}

/* ---------- Páginas genéricas (solo vista previa de enlaces) ---------- */
export const PAGINAS: Record<string, { titulo: string; subtitulo: string }> = {
  diputados: { titulo: 'Los 350 diputados', subtitulo: 'Quiénes son, qué declaran y cuánto cobran, según sus declaraciones oficiales.' },
  votaciones: { titulo: 'Votaciones sobre vivienda', subtitulo: 'Qué se votó en el Pleno del Congreso y qué votó cada diputado.' },
  metodologia: { titulo: 'Metodología', subtitulo: 'De dónde sale cada dato y cómo se cuenta.' },
  colabora: { titulo: 'Colabora', subtitulo: 'Proyecto independiente y de código abierto.' },
  tarjetas: { titulo: 'Tarjetas para compartir', subtitulo: 'Diputados, votaciones y provincias, listas para historias y redes.' },
};
export function tarjetaPagina(id: string) {
  const p = PAGINAS[id];
  return aPng(lienzo('horizontal', cabecera(),
    h('div', { flexDirection: 'column', gap: 22 },
      h('div', { fontSize: 72, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05 }, p.titulo),
      h('div', { fontSize: 32, color: C.apagado, lineHeight: 1.35 }, p.subtitulo)),
    pie()), 'horizontal');
}

/** Rutas de las imágenes (relativas a la raíz de la web). */
export const rutaTarjeta = {
  diputado: (d: Diputado, f: Formato) => `/tarjetas/${f}/diputado/${slug(d)}.png`,
  votacion: (v: VotacionClave, f: Formato) => `/tarjetas/${f}/votacion/${v.id}.png`,
  provincia: (id: string, f: Formato) => `/tarjetas/${f}/provincia/${id}.png`,
  resumen: (f: Formato) => `/tarjetas/${f}/resumen.png`,
  pagina: (id: string) => `/tarjetas/horizontal/pagina/${id}.png`,
};

/* ---------- Texto y enlace para compartir ---------- */
const cuenta = (k: number, uno: string, varios: string) => `${fmtNum(k)} ${k === 1 ? uno : varios}`;
/** Enlace (ruta de la web) y texto que acompaña a cada tarjeta al compartirla. Solo datos oficiales, sin valoraciones. */
export const compartir = {
  diputado: (d: Diputado) => {
    const p = d.patrimonio;
    const bienes = p.propiedades === null ? 'no tiene publicada su declaración de bienes'
      : `declara ${cuenta(p.propiedades, 'propiedad', 'propiedades')}${p.propiedades && p.viviendas !== null ? ` (${cuenta(p.viviendas, 'vivienda', 'viviendas')})` : ''}`;
    return {
      enlace: `/diputado/${slug(d)}`,
      texto: `${d.nombreCompleto} (${d.grupoCorto}, ${nombreLegible(d.circunscripcion)}) ${bienes} y cobra ${fmtEur(d.retribucion.totalMensual)} al mes del Congreso. Así votó sobre vivienda:`,
    };
  },
  votacion: (v: VotacionClave) => ({
    enlace: `/?votacion=${encodeURIComponent(v.id)}#hemiciclo`,
    texto: `${rotulo(v).corto} (${fechaLarga(v.fecha)}): ${v.resultado.toLowerCase()} con ${v.totales.si} sí, ${v.totales.no} no y ${v.totales.abstencion} abstenciones. Qué votó cada diputado:`,
  }),
  provincia: (id: string) => {
    const c = circunscripciones.find((x) => x.id === id)!;
    const k = diputados.filter((d) => d.circunscripcion === c.nombre).length;
    return { enlace: `/diputados?provincia=${encodeURIComponent(c.nombre)}`, texto: `${k === 1 ? 'El diputado elegido' : `Los ${k} diputados elegidos`} por ${c.legible}: qué declaran, cuánto cobran y cómo votan.` };
  },
  resumen: () => ({ enlace: '/', texto: 'Los 350 diputados del Congreso: qué declaran, cuánto cobran y cómo votan, con sus datos oficiales.' }),
};

