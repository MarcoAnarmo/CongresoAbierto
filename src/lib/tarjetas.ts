/** Contenido de cada tipo de tarjeta para redes. El dibujo común está en og.ts. */
import { diputados, votaciones, votacionesPleno, temasDe, grupos, colorGrupo, fmtEur, fmtNum, slug, candidaturaDistinta, ELECCIONES, antesDeElecciones } from './data';
import { disponerPorGrupos } from './hemiciclo';
import type { Diputado, VotacionClave, Voto } from './types';
import { C, h, img, lienzo, cabecera, pie, cifra, retrato, barraVotos, fotoDataUri, aPng, type Formato } from './og';

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

/* Iconos sencillos (trazo) para las cifras: edificio, casa y euro. */
const icono = (trazos: string, color: string) =>
  `data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${trazos}</svg>`).toString('base64')}`;
const ICONOS = {
  propiedades: icono('<path d="M4 21V5l8-3v19M12 21h8V9l-8-3"/><path d="M7.5 8h1M7.5 12h1M7.5 16h1M15.5 12h1M15.5 16h1M2.5 21h19"/>', C.acento),
  viviendas: icono('<path d="M3 11 12 3.5 21 11"/><path d="M5.5 9.5V20.5h13V9.5"/><path d="M10 20.5v-6h4v6"/>', C.acento),
  sueldo: icono('<path d="M17.5 6.5A7 7 0 1 0 17.5 17.5"/><path d="M4.5 10.5h9M4.5 13.5h9"/>', C.acento),
};
type Cifra = { valor: string; etiqueta: string; icono: keyof typeof ICONOS; destacada?: boolean; flex?: number; tam: number };

/** Panel blanco con las cifras en columnas, separadas por una línea fina, cada una con su icono. */
function panelCifras(cifras: Cifra[], e: number) {
  return h('div', { background: C.blanco, border: `${2 * e}px solid ${C.borde}`, borderRadius: 28 * e, padding: `${24 * e}px ${8 * e}px` },
    ...cifras.map((c, i) => h('div', {
      flexDirection: 'column', flex: c.flex ?? 1, gap: 10 * e, padding: `0 ${24 * e}px`,
      borderLeft: i ? `${2 * e}px solid ${C.chip}` : 'none',
    },
      // Misma altura para todas las cifras: así los rótulos quedan alineados aunque el importe vaya más pequeño
      h('div', { height: 92 * e, alignItems: 'flex-end', fontSize: c.tam * e, fontWeight: 800, letterSpacing: -2.5 * e, lineHeight: 1, color: c.destacada ? C.acento : C.texto }, c.valor),
      h('div', { alignItems: 'flex-start', gap: 10 * e },
        h('div', { width: 40 * e, height: 40 * e, borderRadius: 20 * e, background: C.acentoSuave, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
          img(ICONOS[c.icono], 24 * e, 24 * e)),
        h('div', { fontSize: 24 * e, lineHeight: 1.22, color: C.apagado, marginTop: 6 * e, flex: 1 }, c.etiqueta)))));
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
  const cifras = (ancha: boolean): Cifra[] => [
    { valor: prop, etiqueta: etProp, icono: 'propiedades', tam: 96 },
    { valor: viv, etiqueta: etViv, icono: 'viviendas', destacada: true, tam: 96 },
    { valor: sueldo, etiqueta: etSueldo, icono: 'sueldo', flex: ancha ? 1.35 : 1.3, tam: sueldo.length > 6 ? 68 : 76 },
  ];

  if (formato === 'horizontal') {
    const tam = nombre.length > 34 ? 46 : nombre.length > 24 ? 52 : 60;
    return aPng(h('div', {
      width: 1200, height: 630, flexDirection: 'column', justifyContent: 'space-between', background: C.fondo, color: C.texto,
      fontFamily: 'Inter', borderTop: `12px solid ${C.naranja}`, padding: '30px 52px 32px',
    },
      h('div', { justifyContent: 'space-between', alignItems: 'center' },
        cabecera(0.78),
        h('div', { fontSize: 22, fontWeight: 700, color: C.acento }, 'congresoabierto.org')),
      h('div', { gap: 30, alignItems: 'stretch' },
        retrato(foto, nombre, 224, 292, color),
        h('div', { flexDirection: 'column', justifyContent: 'space-between', flex: 1, gap: 14 },
          h('div', { flexDirection: 'column', gap: 8 },
            h('div', { fontSize: tam, fontWeight: 800, letterSpacing: -1.5, lineHeight: 1.05 }, nombre),
            h('div', { alignItems: 'center', gap: 10, fontSize: 24, color: C.apagado }, puntoGrupo(color, 18), h('div', { fontWeight: 700, color: C.texto }, d.grupoCorto), candidaturaDistinta(d) ? `(${d.partido}) · ${cargo}` : `· ${cargo}`)),
          panelCifras(cifras(true), 0.7))),
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
      h('div', { fontSize: 27, fontWeight: 800, color: C.acento }, 'congresoabierto.org')),
    // Quién es
    h('div', { alignItems: 'center', gap: 40, marginTop: 48 },
      retrato(foto, nombre, 264, 352, color),
      h('div', { flexDirection: 'column', gap: 20, flex: 1 },
        h('div', { alignSelf: 'flex-start', alignItems: 'center', gap: 12, padding: '8px 20px', borderRadius: 999, background: C.blanco, border: `2px solid ${C.borde}`, fontSize: 30, fontWeight: 800 }, puntoGrupo(color, 22), d.grupoCorto, candidaturaDistinta(d) && h('div', { fontWeight: 400, color: C.apagado }, `· ${d.partido}`)),
        h('div', { fontSize: tam, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1.04 }, nombre),
        h('div', { fontSize: 32, color: C.apagado, lineHeight: 1.25 }, cargo))),
    // Qué declara y cuánto cobra
    h('div', { flexDirection: 'column', gap: 12, marginTop: 40 },
      panelCifras(cifras(false), 1),
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
      h('div', {}, antesDeElecciones() ? `Elecciones generales del 29-N · Datos oficiales, sin interpretaciones` : 'Datos oficiales del Congreso y del BOE, sin interpretaciones')),
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
  // Horizontal: la vista previa de la portada. Historia: enfocada en las elecciones, con las cifras y el hemiciclo
  if (formato === 'horizontal') return tarjetaPagina('inicio');
  const con = diputados.filter((d) => d.patrimonio.viviendas !== null);
  const prop = con.reduce((a, d) => a + (d.patrimonio.propiedades ?? 0), 0);
  const viv = con.reduce((a, d) => a + (d.patrimonio.viviendas ?? 0), 0);
  const elecciones = antesDeElecciones();
  const orden = [...grupos].sort((a, b) => a.orden - b.orden).filter((g) => diputados.some((d) => d.grupoCorto === g.corto));
  const caja = (v: string, t: string, destacada = false) => h('div', {
    flexDirection: 'column', flex: 1, gap: 2, padding: '20px 26px', borderRadius: 24,
    background: destacada ? C.acentoSuave : C.blanco, border: `3px solid ${destacada ? '#f7c9a6' : C.borde}`,
  },
    h('div', { fontSize: 66, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05, color: destacada ? C.acento : C.texto }, v),
    h('div', { fontSize: 28, color: C.apagado, lineHeight: 1.2 }, t));
  const fijo = { flexShrink: 0 };
  return aPng(h('div', {
    width: 1080, height: 1920, flexDirection: 'column', background: C.fondo, color: C.texto, fontFamily: 'Inter',
    borderTop: `16px solid ${C.naranja}`, padding: '150px 72px 0',
  },
    // Cabecera (zona alta: la tapan en parte el nombre y la barra de la historia)
    h('div', { ...fijo, justifyContent: 'space-between', alignItems: 'center' }, cabecera(1.15), h('div', { fontSize: 27, fontWeight: 800, color: C.acento }, 'congresoabierto.org')),
    h('div', { ...fijo, alignSelf: 'flex-start', alignItems: 'center', gap: 14, marginTop: 44, padding: '12px 28px', borderRadius: 999, background: C.naranja, color: '#fff', fontSize: 32, fontWeight: 800 },
      h('div', { width: 15, height: 15, borderRadius: 8, background: '#fff' }), elecciones ? 'Elecciones generales · 29 de noviembre' : 'Conoce a quien te representa'),
    h('div', { ...fijo, fontSize: elecciones ? 116 : 96, fontWeight: 800, letterSpacing: -4, lineHeight: 1.02, marginTop: 26 }, elecciones ? 'Prepárate para votar' : 'Conoce a quien te representa'),
    h('div', { ...fijo, fontSize: 36, color: C.apagado, lineHeight: 1.3, marginTop: 18 }, 'Qué declaran tener, cuánto cobran y cómo votan los 350 diputados del Congreso'),
    // Hemiciclo con los 350 escaños por grupo
    h('div', { ...fijo, flexDirection: 'column', alignItems: 'center', marginTop: 32, background: C.blanco, border: `3px solid ${C.borde}`, borderRadius: 30, padding: '26px 24px 24px' },
      img(hemicicloUri(), 780, 412),
      h('div', { flexWrap: 'wrap', justifyContent: 'center', gap: '6px 16px', marginTop: 12, fontSize: 22, fontWeight: 700, color: C.apagado },
        ...orden.map((g) => h('div', { alignItems: 'center', gap: 7 }, puntoGrupo(g.color, 14), g.corto))),
      h('div', { alignItems: 'center', gap: 14, marginTop: 20, padding: '14px 32px', borderRadius: 999, background: C.texto, color: '#fff', fontSize: 32, fontWeight: 800 }, 'Míralo escaño a escaño', img(FLECHA, 30, 30))),
    // Cifras del Congreso
    h('div', { ...fijo, flexDirection: 'column', gap: 16, marginTop: 26 },
      h('div', { gap: 16 }, caja(fmtNum(prop), 'propiedades declaradas', true), caja(fmtNum(viv), 'de ellas, viviendas')),
      h('div', { gap: 16 }, caja(fmtNum(votacionesPleno.length), 'votaciones del Pleno'), caja(String(diputados.length), 'diputados, uno a uno'))),
    h('div', { ...fijo, marginTop: 18, fontSize: 24, color: C.apagado, paddingLeft: 6 }, 'Datos oficiales del Congreso y del BOE, sin interpretaciones'),
  ), 'historia');
}

/* ---------- Vista previa de enlaces (portada y páginas) ---------- */
/** Hemiciclo con los 350 escaños coloreados por grupo, como imagen SVG para satori. */
let hemiciclo: string | null = null;
function hemicicloUri() {
  if (hemiciclo) return hemiciclo;
  const orden = [...grupos].sort((a, b) => a.orden - b.orden).map((g) => ({ g, n: diputados.filter((d) => d.grupoCorto === g.corto).length })).filter((x) => x.n);
  const { escanos } = disponerPorGrupos(orden.map((x) => x.n), 11);
  const colores = orden.flatMap((x) => Array(x.n).fill(x.g.color) as string[]);
  const puntos = escanos.map((e, i) => `<circle cx="${e.x.toFixed(4)}" cy="${(-e.y).toFixed(4)}" r="${(e.r * 0.92).toFixed(4)}" fill="${colores[i]}"/>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="840" height="444" viewBox="-1.04 -1.06 2.08 1.1" preserveAspectRatio="xMidYMid meet">${puntos}</svg>`;
  return (hemiciclo = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`);
}

const conDeclaracion = () => diputados.filter((d) => d.patrimonio.viviendas !== null);
const totalPropiedades = () => conDeclaracion().reduce((a, d) => a + (d.patrimonio.propiedades ?? 0), 0);
const totalViviendas = () => conDeclaracion().reduce((a, d) => a + (d.patrimonio.viviendas ?? 0), 0);
const cifrasCongreso = (): [string, string][] => [[fmtNum(totalPropiedades()), 'propiedades declaradas'], [fmtNum(totalViviendas()), 'de ellas, viviendas'], [String(diputados.length), 'diputados']];
const cifrasVotaciones = (): [string, string][] => [
  [fmtNum(votacionesPleno.length), 'votaciones del Pleno'],
  [fmtNum(votacionesPleno.filter((v) => temasDe(v).includes('vivienda')).length), 'sobre vivienda'],
  [String(diputados.length), 'diputados, uno a uno'],
];

export const PAGINAS: Record<string, { titulo: string; subtitulo: string; cifras: () => [string, string][]; llamada: string }> = {
  inicio: { titulo: 'Prepárate para votar', subtitulo: 'Qué declaran tener, cuánto cobran y cómo votan los 350 diputados del Congreso', cifras: cifrasCongreso, llamada: 'Míralo escaño a escaño' },
  diputados: { titulo: 'Los 350 diputados', subtitulo: 'Quiénes son, qué declaran tener y cuánto cobran, con sus documentos oficiales', cifras: cifrasCongreso, llamada: 'Busca a los de tu provincia' },
  votaciones: { titulo: 'Cómo votó cada diputado', subtitulo: 'Todas las votaciones del Pleno de la XV Legislatura, por tema y fecha', cifras: cifrasVotaciones, llamada: 'Míralo escaño a escaño' },
  metodologia: { titulo: 'De dónde sale cada dato', subtitulo: 'Solo documentos oficiales del Congreso y del BOE, copiados y revisados uno a uno', cifras: cifrasCongreso, llamada: 'Compruébalo en el original' },
  colabora: { titulo: 'Ayuda a mantenerlo al día', subtitulo: 'Proyecto independiente y de código abierto: avisa de un error o propón una mejora', cifras: cifrasCongreso, llamada: 'Míralo escaño a escaño' },
  tarjetas: { titulo: 'Compártelo en tus redes', subtitulo: 'Tarjetas con los datos de cada diputado, provincia y votación, listas para historias', cifras: cifrasCongreso, llamada: 'Busca a tu diputado' },
};

const FLECHA = `data:image/svg+xml;base64,${Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>').toString('base64')}`;
/** Vista previa de enlaces (1200×630): elecciones, titular, cifras en cajitas y el hemiciclo. */
export function tarjetaPagina(id: string) {
  const p = PAGINAS[id];
  const elecciones = antesDeElecciones();
  const etiqueta = h('div', { alignItems: 'center', gap: 10, padding: '9px 20px', borderRadius: 999, background: C.naranja, color: '#fff', fontSize: 22, fontWeight: 800 },
    h('div', { width: 12, height: 12, borderRadius: 6, background: '#fff' }),
    elecciones ? 'Elecciones generales · 29 de noviembre' : 'Conoce a quien te representa');
  const caja = ([v, t]: [string, string], i: number) => h('div', {
    flexDirection: 'column', flex: 1, gap: 2, padding: '14px 18px', borderRadius: 16,
    background: i === 0 ? C.acentoSuave : C.blanco, border: `2px solid ${i === 0 ? '#f7c9a6' : C.borde}`,
  },
    h('div', { fontSize: 44, fontWeight: 800, letterSpacing: -1, color: i === 0 ? C.acento : C.texto, lineHeight: 1.05 }, v),
    h('div', { fontSize: 19, color: C.apagado, lineHeight: 1.2 }, t));
  return aPng(h('div', {
    width: 1200, height: 630, flexDirection: 'column', justifyContent: 'space-between', background: C.fondo, color: C.texto,
    fontFamily: 'Inter', borderTop: `14px solid ${C.naranja}`, padding: '34px 56px 30px',
  },
    h('div', { justifyContent: 'space-between', alignItems: 'center' }, cabecera(0.9), etiqueta),
    h('div', { gap: 36, alignItems: 'center' },
      h('div', { flexDirection: 'column', gap: 18, width: 620 },
        h('div', { fontSize: id === 'inicio' && elecciones ? 70 : 62, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1.02 }, id === 'inicio' && !elecciones ? 'Conoce a quien te representa' : p.titulo),
        h('div', { fontSize: 26, color: C.apagado, lineHeight: 1.3 }, p.subtitulo),
        h('div', { gap: 12, marginTop: 6 }, ...p.cifras().map(caja))),
      h('div', { flexDirection: 'column', alignItems: 'center', gap: 16, flex: 1 },
        img(hemicicloUri(), 420, 222),
        h('div', { alignItems: 'center', gap: 12, padding: '12px 22px 12px 26px', borderRadius: 999, background: C.texto, color: '#fff', fontSize: 23, fontWeight: 800 }, p.llamada, img(FLECHA, 22, 22)))),
    h('div', { justifyContent: 'space-between', alignItems: 'center', fontSize: 20, color: C.apagado, borderTop: `2px solid ${C.borde}`, paddingTop: 16 },
      h('div', {}, 'Datos oficiales del Congreso y del BOE, sin interpretaciones'),
      h('div', { color: C.acento, fontWeight: 800, fontSize: 22 }, 'congresoabierto.org')),
  ), 'horizontal');
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
      texto: `${antesDeElecciones() ? ELECCIONES.llamada : ''}${d.nombreCompleto} (${d.grupoCorto}, ${nombreLegible(d.circunscripcion)}) ${bienes} y cobra ${fmtEur(d.retribucion.totalMensual)} al mes del Congreso. Así votó sobre vivienda:`,
    };
  },
  votacion: (v: VotacionClave) => ({
    enlace: `/?votacion=${encodeURIComponent(v.id)}#hemiciclo`,
    texto: `${rotulo(v).corto} (${fechaLarga(v.fecha)}): ${v.resultado.toLowerCase()} con ${v.totales.si} sí, ${v.totales.no} no y ${v.totales.abstencion} abstenciones. Qué votó cada diputado:`,
  }),
  provincia: (id: string) => {
    const c = circunscripciones.find((x) => x.id === id)!;
    const k = diputados.filter((d) => d.circunscripcion === c.nombre).length;
    return { enlace: `/diputados?provincia=${encodeURIComponent(c.nombre)}`, texto: `${antesDeElecciones() ? ELECCIONES.llamada : ''}${k === 1 ? 'El diputado elegido' : `Los ${k} diputados elegidos`} por ${c.legible}: qué declaran, cuánto cobran y cómo votan.` };
  },
  resumen: () => ({ enlace: '/', texto: `${antesDeElecciones() ? `${ELECCIONES.texto}. ` : ''}Los 350 diputados de la XV Legislatura: qué declaran, cuánto cobran y cómo votan, con sus datos oficiales.` }),
};

