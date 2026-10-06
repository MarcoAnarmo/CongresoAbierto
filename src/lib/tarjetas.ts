/** Contenido de cada tipo de tarjeta para redes. El dibujo común está en og.ts. */
import { diputados, votaciones, votacionesPleno, temasDe, grupos, colorGrupo, slug, candidaturaDistinta, antesDeElecciones } from './data';
import { fechaTexto } from '../i18n/fechas';
import { disponerPorGrupos, TRAMOS, tramo } from './hemiciclo';
import type { Diputado, VotacionClave, Voto } from './types';
import { C, h, img, lienzo, cabecera, pie, cifra, retrato, barraVotos, fotoDataUri, aPng, type Formato } from './og';
import { LOCALE, formatos, f, pl, prefijo, type Idioma } from '../i18n';
import comun from '../i18n/textos/comun';
import textosTarjetas from '../i18n/textos/tarjetas';
import textosCompartir from '../i18n/textos/compartir';
import textosHemiciclo from '../i18n/textos/hemiciclo';

/*
 * Cada tarjeta tiene una versión por idioma (`lang`, castellano por defecto). Se traducen las etiquetas y textos propios
 * de la web; los datos oficiales (nombres, partidos, títulos de votaciones, formación, cargos) van tal cual, en castellano.
 */
const fechaCorta = (iso: string, lang: Idioma) => fechaTexto(iso, lang, LOCALE[lang], { mes: 'short' });
/** «RDL 8/2026 · alquiler (28/04/2026)» → «RDL 8/2026 · alquiler». */
export const temaCorto = (tema: string) => tema.replace(/\s*\(\d{2}\/\d{2}\/\d{4}\)\s*$/, '');
/** Elige la forma de un par [uno, varios] sin poner el número. */
const forma = (k: number | null, [uno, varios]: readonly string[] | string[]) => (k === 1 ? uno : varios);
/** Resultado oficial de una votación, traducido (si no está en la lista, tal cual). */
const resultadoTexto = (r: string, lang: Idioma) => (comun[lang].resultado as Record<string, string>)[r] ?? r;
const colorVoto: Record<Voto, string> = { 'Sí': C.si, 'No': C.no, 'Abstención': C.abs, 'No vota': C.novota };
const ordenGrupo = new Map(grupos.map((g) => [g.corto, g.orden]));
const puntoGrupo = (color: string, tam: number) => h('div', { width: tam, height: tam, borderRadius: tam / 2, background: color, flexShrink: 0 });
const pastilla = (texto: string, color: string, escala: number) =>
  h('div', { padding: `${6 * escala}px ${16 * escala}px`, borderRadius: 999, background: color, color: '#fff', fontSize: 22 * escala, fontWeight: 700 }, texto);
const resultadoColor = (r: string) => (/Aprobada|Convalidado/.test(r) ? C.si : C.no);

/* ---------- Diputado ---------- */
/**
 * Rótulos cortos de las votaciones clave para las tarjetas, con palabras de su título oficial (src/i18n/textos/tarjetas.ts).
 * «mini» es el rótulo de la tira de votos de la tarjeta horizontal. Si falta una votación, se usan su tema y su tipo oficiales.
 */
export const rotulo = (v: VotacionClave, lang: Idioma = 'es'): { corto: string; mini: string; quien: string } =>
  (textosTarjetas[lang].rotulos as Record<string, { corto: string; mini: string; quien: string }>)[v.id]
  ?? { corto: temaCorto(v.tema), mini: temaCorto(v.tema), quien: v.tipo.replace(/\.$/, '') };

/** Etiqueta de un voto; sin voto registrado es porque aún no era diputado o diputada. */
const textoVoto = (voto: Voto | undefined, d: Diputado, lang: Idioma) =>
  voto ? comun[lang].voto[voto] : textosTarjetas[lang].diputado.noEra[d.genero === 'F' ? 1 : 0];
function chipVoto(voto: Voto | undefined, d: Diputado, ancho: number, alto: number, tam: number, lang: Idioma) {
  const color = voto ? colorVoto[voto] : C.chip;
  const texto = textoVoto(voto, d, lang);
  let fontSize = voto ? Math.round(voto === 'Abstención' ? tam * 0.86 : tam) : Math.round(tam * 0.68);
  // En otros idiomas la etiqueta puede ser más larga («Ez du bozkatzen», «Did not vote»): se achica hasta que quepa
  // (Inter ExtraBold mide de media ~0,55 em por letra; se deja algo de margen).
  if (lang !== 'es') fontSize = Math.min(fontSize, Math.floor((ancho - 22) / (texto.length * 0.58)));
  return h('div', {
    width: ancho, height: alto, borderRadius: alto / 2, background: color, color: voto ? (voto === 'Abstención' ? C.texto : '#fff') : C.apagado,
    alignItems: 'center', justifyContent: 'center', fontSize, fontWeight: 800, flexShrink: 0,
  }, texto);
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

/** Formación (texto literal de su ficha) y cargos en la Cámara, para la tarjeta vertical. */
const recortar = (t: string, max: number) => (t.length <= max ? t : `${t.slice(0, max).replace(/\s+\S*$/, '')}…`);
function perfilTarjeta(d: Diputado, lang: Idioma) {
  const TIPO_FORMACION = textosTarjetas[lang].diputado.tipo;
  const lineas = d.perfil?.formacion ?? [];
  // La línea que nombra un centro (universidad) es la más informativa; si no hay, la primera
  const principal = lineas.find((f) => f.centros?.length) ?? lineas[0];
  // Tipo de centro de esa línea (según el RUCT); el de la ficha entera puede mezclar varias líneas
  const tipos = new Set((principal?.centros ?? []).map((c) => c.tipo));
  const tipo = !principal ? null
    : tipos.has('pública') && tipos.has('privada') ? TIPO_FORMACION.ambas
    : tipos.has('pública') ? TIPO_FORMACION.publica
    : tipos.has('privada') ? TIPO_FORMACION.privada
    : principal.otroCentro ? TIPO_FORMACION.otroCentro
    : TIPO_FORMACION.sinCentro;
  return {
    formacion: principal ? recortar(principal.texto.replace(/\.$/, ''), 92) : null,
    otras: Math.max(0, lineas.length - 1),
    tipo, tipoAviso: !tipos.size,
    cargos: d.cargos.slice(0, 2).map((c) => recortar(c, 110)),
    masCargos: Math.max(0, d.cargos.length - 2),
  };
}

export async function tarjetaDiputado(d: Diputado, formato: Formato, lang: Idioma = 'es') {
  const t = textosTarjetas[lang];
  const td = t.diputado;
  const fmt = formatos(lang);
  const n = (x: number | null) => (x === null ? '—' : fmt.num(x));
  const p = d.patrimonio;
  const foto = await fotoDataUri(d.fotoUrl);
  const color = colorGrupo(d.grupoCorto);
  const cargo = f(td.cargo[d.genero === 'F' ? 1 : 0], { provincia: nombreLegible(d.circunscripcion) });
  const sinDecl = p.propiedades === null;
  const prop = sinDecl ? '—' : n(p.propiedades);
  const etProp = sinDecl ? td.sinDeclaracion : forma(p.propiedades, td.propiedades);
  const viv = sinDecl ? '—' : n(p.viviendas);
  const etViv = sinDecl || !p.propiedades ? td.viviendas : forma(p.viviendas, td.deEllas);
  const sueldo = fmt.eur(d.retribucion.totalMensual);
  const etSueldo = td.sueldo;
  const votos = [...votaciones].sort((a, b) => b.fecha.localeCompare(a.fecha))
    .map((v) => ({ v, r: rotulo(v, lang), voto: v.votos[String(d.codParlamentario)] as Voto | undefined }));
  const veh = p.vehiculos ? pl(p.vehiculos, td.vehiculos, lang) : null;
  const notaBienes = sinDecl ? null : [p.declaracionFecha && f(td.declaracion, { fecha: fechaCorta(p.declaracionFecha, lang) }), veh].filter(Boolean).join(' · ');
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
        h('div', { fontSize: 19, fontWeight: 700, color: C.apagado, letterSpacing: 0.3 }, td.comoVoto),
        h('div', { gap: 10 },
          ...votos.map(({ r, voto }) => h('div', { flexDirection: 'column', alignItems: 'center', gap: 6, width: 146 },
            chipVoto(voto, d, 146, 40, 22, lang),
            h('div', { fontSize: 17, color: C.apagado, textAlign: 'center', lineHeight: 1.15 }, r.mini))))),
    ), 'horizontal');
  }

  const tam = nombre.length > 34 ? 60 : nombre.length > 22 ? 68 : 80;
  return aPng(h('div', {
    width: 1080, height: 1920, flexDirection: 'column', background: C.fondo, color: C.texto,
    fontFamily: 'Inter', borderTop: `16px solid ${C.naranja}`, padding: '124px 72px 0',
  },
    // Cabecera (zona alta: la tapan en parte el nombre y la barra de la historia)
    h('div', { justifyContent: 'space-between', alignItems: 'center' },
      cabecera(1.15),
      h('div', { fontSize: 27, fontWeight: 800, color: C.acento }, 'congresoabierto.org')),
    // Quién es
    h('div', { alignItems: 'center', gap: 40, marginTop: 36 },
      retrato(foto, nombre, 240, 320, color),
      h('div', { flexDirection: 'column', gap: 20, flex: 1 },
        h('div', { alignSelf: 'flex-start', alignItems: 'center', gap: 12, padding: '8px 20px', borderRadius: 999, background: C.blanco, border: `2px solid ${C.borde}`, fontSize: 30, fontWeight: 800 }, puntoGrupo(color, 22), d.grupoCorto, candidaturaDistinta(d) && h('div', { fontWeight: 400, color: C.apagado }, `· ${d.partido}`)),
        h('div', { fontSize: tam, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1.04 }, nombre),
        h('div', { fontSize: 32, color: C.apagado, lineHeight: 1.25 }, cargo))),
    // Qué declara y cuánto cobra
    h('div', { flexDirection: 'column', gap: 12, marginTop: 30 },
      panelCifras(cifras(false), 1),
      notaBienes && h('div', { fontSize: 24, color: C.apagado, paddingLeft: 6 }, notaBienes),
      p.revisar && h('div', { alignItems: 'center', gap: 10, fontSize: 24, fontWeight: 700, color: C.acento, paddingLeft: 6 }, h('div', { width: 30, height: 30, borderRadius: 15, background: C.acento, color: '#fff', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, flexShrink: 0 }, '!'), td.revisar)),
    // Formación y cargos en el Congreso (texto de su ficha oficial)
    (() => {
      const pf = perfilTarjeta(d, lang);
      const etq = (t: string) => h('div', { fontSize: 22, fontWeight: 800, color: C.apagado, letterSpacing: 0.5 }, t);
      const pastillaTipo = (t: string, aviso = false) => h('div', { alignSelf: 'flex-start', padding: '4px 14px', borderRadius: 999, fontSize: 21, fontWeight: 700, background: aviso ? C.chip : C.acentoSuave, color: aviso ? C.apagado : C.acento }, t);
      return h('div', { flexDirection: 'column', gap: 16, marginTop: 24, background: C.blanco, border: `2px solid ${C.borde}`, borderRadius: 28, padding: '22px 30px' },
        h('div', { flexDirection: 'column', gap: 6 },
          etq(td.formacion),
          pf.formacion
            ? h('div', { fontSize: 27, fontWeight: 700, lineHeight: 1.25 }, pf.formacion)
            : h('div', { fontSize: 27, fontWeight: 700, lineHeight: 1.25, color: C.apagado }, td.sinFormacion),
          (pf.tipo || pf.otras > 0) && h('div', { gap: 10, alignItems: 'center', flexWrap: 'wrap' },
            pf.tipo && pastillaTipo(pf.tipo, pf.tipoAviso),
            pf.otras > 0 && h('div', { fontSize: 21, color: C.apagado }, pl(pf.otras, td.masLineas, lang)))),
        h('div', { height: 2, background: C.chip }),
        h('div', { flexDirection: 'column', gap: 6 },
          etq(td.enElCongreso),
          ...(pf.cargos.length
            ? pf.cargos.map((c) => h('div', { fontSize: 27, fontWeight: 700, lineHeight: 1.25 }, c))
            : [h('div', { fontSize: 27, fontWeight: 700, lineHeight: 1.25, color: C.apagado }, td.sinCargos)]),
          pf.masCargos > 0 && h('div', { fontSize: 21, color: C.apagado }, pl(pf.masCargos, td.masCargos, lang))));
    })(),
    // Cómo votó
    h('div', { flexDirection: 'column', marginTop: 24, background: C.blanco, border: `2px solid ${C.borde}`, borderRadius: 28, padding: '20px 30px 8px' },
      h('div', { fontSize: 22, fontWeight: 800, color: C.apagado, letterSpacing: 0.5, marginBottom: 2 }, td.comoVoto),
      ...votos.map(({ v, r, voto }, i) => h('div', { alignItems: 'center', justifyContent: 'space-between', gap: 18, padding: '5px 0', borderTop: i ? `2px solid ${C.chip}` : 'none' },
        h('div', { flexDirection: 'column', flex: 1, gap: 2 },
          h('div', { fontSize: 27, fontWeight: 800, lineHeight: 1.15, letterSpacing: -0.5 }, r.corto),
          h('div', { flexWrap: 'wrap', gap: 8, fontSize: 19, color: C.apagado, lineHeight: 1.25 },
            `${r.quien} · ${fechaCorta(v.fecha, lang)} ·`, h('div', { color: resultadoColor(v.resultado), fontWeight: 700 }, resultadoTexto(v.resultado, lang)))),
        chipVoto(voto, d, 170, 48, 26, lang)))),
    // Pie (justo encima de la zona de respuesta de la historia)
    h('div', { marginTop: 18, fontSize: 23, color: C.apagado, paddingLeft: 6 },
      antesDeElecciones() ? t.pieElecciones : t.pieLema),
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

export async function tarjetaVotacion(v: VotacionClave, formato: Formato, lang: Idioma = 'es') {
  const tv = textosTarjetas[lang].votacion;
  const t = v.totales;
  const e = formato === 'historia' ? 1.45 : 1;
  const numeros = h('div', { gap: 16 * e },
    cifra(String(t.si), tv.si, false, e), cifra(String(t.no), tv.no, false, e), cifra(String(t.abstencion), tv.abstencion, false, e), cifra(String(t.noVota), tv.noVota, false, e));
  const titulo = (tam: number) => h('div', { flexDirection: 'column', gap: 14 * e },
    h('div', { fontSize: 26 * e, color: C.apagado }, f(tv.pleno, { fecha: formatos(lang).fecha(v.fecha) })),
    h('div', { fontSize: tam, fontWeight: 800, letterSpacing: -2, lineHeight: 1.08 }, temaCorto(v.tema)),
    h('div', {}, pastilla(resultadoTexto(v.resultado, lang), resultadoColor(v.resultado), e)));
  if (formato === 'horizontal') {
    return aPng(lienzo('horizontal', cabecera(), titulo(62), h('div', { flexDirection: 'column', gap: 16 }, numeros, barraVotos(t, 16, 1072)), pie(1, lang)), 'horizontal');
  }
  const filas = votoPorGrupo(v);
  return aPng(lienzo('historia',
    cabecera(1.4),
    titulo(76),
    h('div', { flexDirection: 'column', gap: 22 }, numeros, barraVotos(t, 24, 920)),
    h('div', { flexDirection: 'column', gap: 16, background: C.blanco, border: `3px solid ${C.borde}`, borderRadius: 26, padding: '28px 32px' },
      h('div', { fontSize: 28, fontWeight: 700, color: C.apagado }, tv.porGrupo),
      ...filas.map(({ g, t: tg }) => h('div', { alignItems: 'center', gap: 18 },
        h('div', { alignItems: 'center', gap: 12, width: 190, fontSize: 28, fontWeight: 700 }, puntoGrupo(g.color, 20), g.corto),
        barraVotos(tg, 20, 600)))),
    pie(1.4, lang),
  ), 'historia');
}

/* ---------- Provincia ---------- */
export const nombreLegible = (c: string) => (c === 'S/C Tenerife' ? 'Santa Cruz de Tenerife' : c.replace(/^(.+) \((.+)\)$/, '$2 $1'));
export const slugTexto = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
export const circunscripciones = [...new Set(diputados.map((d) => d.circunscripcion))]
  .map((c) => ({ id: slugTexto(nombreLegible(c)), nombre: c, legible: nombreLegible(c) }))
  .sort((a, b) => a.legible.localeCompare(b.legible, 'es'));

export async function tarjetaProvincia(id: string, formato: Formato, lang: Idioma = 'es') {
  const tp = textosTarjetas[lang].provincia;
  const fmtNum = formatos(lang).num;
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
    cifra(String(ds.length), forma(ds.length, tp.elegidos), true, e),
    cifra(conDatos.length ? fmtNum(prop) : '—', forma(prop, tp.propiedades), false, e),
    cifra(conDatos.length ? fmtNum(viv) : '—', forma(viv, tp.viviendas), false, e));
  const titulo = (tam: number) => h('div', { flexDirection: 'column', gap: 8 * e },
    h('div', { fontSize: 28 * e, color: C.apagado }, tp.titulo),
    h('div', { fontSize: tam, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05 }, c.legible));
  if (formato === 'horizontal') return aPng(lienzo('horizontal', cabecera(), titulo(72), composicion, cifras, pie(1, lang)), 'horizontal');

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
      h('div', { gap: 18 }, cifra(String(ds.length), forma(ds.length, tp.diputados), true, 1.3), cifra(conDatos.length ? fmtNum(prop) : '—', forma(prop, tp.propiedades), false, 1.3)),
      h('div', { fontSize: 30, color: C.apagado }, conDatos.length ? pl(viv, tp.deEllas, lang) : '')),
    pie(1.4, lang),
  ), 'historia');
}

/* ---------- Resumen del Congreso ---------- */
/**
 * Lo que se ve en el hemiciclo de la portada: por grupo (la tarjeta de siempre) o coloreado por propiedades o viviendas.
 * Al compartir desde la portada se usa la tarjeta del modo que esté elegido.
 */
export type ModoHemiciclo = 'grupo' | 'propiedades' | 'viviendas';

export async function tarjetaResumen(formato: Formato, lang: Idioma = 'es', modo: ModoHemiciclo = 'grupo') {
  // Horizontal: la vista previa de la portada. Historia: enfocada en las elecciones, con las cifras y el hemiciclo
  if (formato === 'horizontal') return tarjetaPagina('inicio', lang, modo);
  const tt = textosTarjetas[lang];
  const tc = comun[lang];
  const fmtNum = formatos(lang).num;
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
      h('div', { width: 15, height: 15, borderRadius: 8, background: '#fff', flexShrink: 0 }), elecciones ? tc.elecciones.tarjeta : tc.marca.lema),
    h('div', { ...fijo, fontSize: elecciones ? 116 : 96, fontWeight: 800, letterSpacing: -4, lineHeight: 1.02, marginTop: 26 }, elecciones ? tt.resumen.titulo : tc.marca.lema),
    h('div', { ...fijo, fontSize: 36, color: C.apagado, lineHeight: 1.3, marginTop: 18 }, tt.resumen.subtitulo),
    // Hemiciclo con los 350 escaños por grupo, o por propiedades o viviendas (con su escala debajo)
    h('div', { ...fijo, flexDirection: 'column', alignItems: 'center', marginTop: 32, background: C.blanco, border: `3px solid ${C.borde}`, borderRadius: 30, padding: '26px 24px 24px' },
      img(hemicicloUri(modo), 780, 412),
      modo === 'grupo'
        ? h('div', { flexWrap: 'wrap', justifyContent: 'center', gap: '6px 16px', marginTop: 12, fontSize: 22, fontWeight: 700, color: C.apagado },
          ...orden.map((g) => h('div', { alignItems: 'center', gap: 7 }, puntoGrupo(g.color, 14), g.corto)))
        : leyendaEscala(modo, lang, 1),
      h('div', { alignItems: 'center', gap: 14, marginTop: 20, padding: '14px 32px', borderRadius: 999, background: C.texto, color: '#fff', fontSize: 32, fontWeight: 800 }, tt.resumen.llamada, img(FLECHA, 30, 30))),
    // Cifras del Congreso
    h('div', { ...fijo, flexDirection: 'column', gap: 16, marginTop: 26 },
      h('div', { gap: 16 }, caja(fmtNum(prop), tt.cifras.propiedades, modo !== 'viviendas'), caja(fmtNum(viv), tt.cifras.viviendas, modo === 'viviendas')),
      h('div', { gap: 16 }, caja(fmtNum(votacionesPleno.length), tt.cifras.votaciones), caja(String(diputados.length), tt.cifras.unoAUno))),
    h('div', { ...fijo, marginTop: 18, fontSize: 24, color: C.apagado, paddingLeft: 6 }, tt.pie),
  ), 'historia');
}

/* ---------- Vista previa de enlaces (portada y páginas) ---------- */
/** Escala de propiedades y viviendas en tema claro (la misma que --int-0…--int-5 de global.css). */
const ESCALA = ['#ebe8e1', '#c4b9a7', '#a09280', '#776a5b', '#4f453b', '#241e19'];
/**
 * Hemiciclo con los 350 escaños como imagen SVG para satori: por grupo o, con propiedades o viviendas, cada escaño con
 * el color de su tramo. Los escaños siguen el orden de la web (grupo y, dentro, apellidos). Sin datos: solo el borde.
 */
const hemiciclos = new Map<ModoHemiciclo, string>();
function hemicicloUri(modo: ModoHemiciclo = 'grupo') {
  if (hemiciclos.has(modo)) return hemiciclos.get(modo)!;
  const orden = [...grupos].sort((a, b) => a.orden - b.orden).map((g) => ({ g, ds: diputados.filter((d) => d.grupoCorto === g.corto).sort((a, b) => a.apellidos.localeCompare(b.apellidos, 'es')) })).filter((x) => x.ds.length);
  const { escanos } = disponerPorGrupos(orden.map((x) => x.ds.length), 11);
  const color = (g: (typeof grupos)[number], d: Diputado) => {
    if (modo === 'grupo') return g.color;
    const i = tramo(modo === 'viviendas' ? d.patrimonio.viviendas : d.patrimonio.propiedades, TRAMOS[modo].cortes);
    return i < 0 ? null : ESCALA[i];
  };
  const colores = orden.flatMap((x) => x.ds.map((d) => color(x.g, d)));
  const puntos = escanos.map((e, i) => {
    const r = (e.r * 0.92).toFixed(4), c = colores[i];
    // El tramo 0 es casi del color del fondo: un borde fino mantiene la forma del escaño en la imagen
    if (c === ESCALA[0]) return `<circle cx="${e.x.toFixed(4)}" cy="${(-e.y).toFixed(4)}" r="${(e.r * 0.86).toFixed(4)}" fill="${c}" stroke="#d6d0c5" stroke-width="${(e.r * 0.12).toFixed(4)}"/>`;
    return c ? `<circle cx="${e.x.toFixed(4)}" cy="${(-e.y).toFixed(4)}" r="${r}" fill="${c}"/>`
      : `<circle cx="${e.x.toFixed(4)}" cy="${(-e.y).toFixed(4)}" r="${(e.r * 0.8).toFixed(4)}" fill="none" stroke="${C.apagado}" stroke-width="${(e.r * 0.18).toFixed(4)}" stroke-dasharray="${(e.r * 0.4).toFixed(4)} ${(e.r * 0.3).toFixed(4)}"/>`;
  }).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="840" height="444" viewBox="-1.04 -1.06 2.08 1.1" preserveAspectRatio="xMidYMid meet">${puntos}</svg>`;
  const uri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  hemiciclos.set(modo, uri);
  return uri;
}

/** Escala de menos a más bajo el hemiciclo (como en la web), con su título: «Propiedades declaradas por cada diputado». */
function leyendaEscala(modo: Exclude<ModoHemiciclo, 'grupo'>, lang: Idioma, escala: number) {
  const t = TRAMOS[modo];
  const hayNulos = diputados.some((d) => (modo === 'viviendas' ? d.patrimonio.viviendas : d.patrimonio.propiedades) === null);
  const paso = (fondo: Record<string, unknown>, texto: string) => h('div', { flexDirection: 'column', alignItems: 'center', gap: 6 * escala, width: 92 * escala },
    h('div', { width: 92 * escala, height: 20 * escala, borderRadius: 5 * escala, ...fondo }),
    h('div', { fontSize: 22 * escala, fontWeight: 700, color: C.apagado }, texto));
  return h('div', { flexDirection: 'column', alignItems: 'center', gap: 10 * escala, marginTop: 14 * escala },
    h('div', { fontSize: 24 * escala, fontWeight: 700, color: C.texto }, textosTarjetas[lang].resumen.leyenda[modo]),
    h('div', { gap: 5 * escala, alignItems: 'flex-start' },
      ...ESCALA.map((c, i) => paso({ background: c, border: `${Math.max(1, 1.5 * escala)}px solid ${i === 0 ? C.borde : c}` }, t.etiquetas[i])),
      ...(hayNulos ? [h('div', { width: 10 * escala }), paso({ border: `${2 * escala}px dashed ${C.apagado}` }, textosHemiciclo[lang].cliente.sd)] : [])));
}

const conDeclaracion = () => diputados.filter((d) => d.patrimonio.viviendas !== null);
const totalPropiedades = () => conDeclaracion().reduce((a, d) => a + (d.patrimonio.propiedades ?? 0), 0);
const totalViviendas = () => conDeclaracion().reduce((a, d) => a + (d.patrimonio.viviendas ?? 0), 0);
const cifrasCongreso = (lang: Idioma): [string, string][] => {
  const { num } = formatos(lang), t = textosTarjetas[lang].cifras;
  return [[num(totalPropiedades()), t.propiedades], [num(totalViviendas()), t.viviendas], [String(diputados.length), t.diputados]];
};
const cifrasVotaciones = (lang: Idioma): [string, string][] => {
  const { num } = formatos(lang), t = textosTarjetas[lang].cifras;
  return [
    [num(votacionesPleno.length), t.votaciones],
    [num(votacionesPleno.filter((v) => temasDe(v).includes('vivienda')).length), t.sobreVivienda],
    [String(diputados.length), t.unoAUno],
  ];
};

/** Páginas con vista previa propia y sus cifras. Título, subtítulo y llamada de cada idioma: textos/tarjetas.ts (paginas). */
type IdPagina = keyof (typeof textosTarjetas)['es']['paginas'];
export const PAGINAS: Record<IdPagina, { cifras: (lang: Idioma) => [string, string][] }> = {
  inicio: { cifras: cifrasCongreso },
  diputados: { cifras: cifrasCongreso },
  votaciones: { cifras: cifrasVotaciones },
  metodologia: { cifras: cifrasCongreso },
  colabora: { cifras: cifrasCongreso },
  tarjetas: { cifras: cifrasCongreso },
};

const FLECHA = `data:image/svg+xml;base64,${Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>').toString('base64')}`;
/** Vista previa de enlaces (1200×630): elecciones, titular, cifras en cajitas y el hemiciclo. */
export function tarjetaPagina(id: string, lang: Idioma = 'es', modo: ModoHemiciclo = 'grupo') {
  const tt = textosTarjetas[lang];
  const tc = comun[lang];
  const p = { ...tt.paginas[id as IdPagina], cifras: () => PAGINAS[id as IdPagina].cifras(lang) };
  const elecciones = antesDeElecciones();
  const etiqueta = h('div', { alignItems: 'center', gap: 10, padding: '9px 20px', borderRadius: 999, background: C.naranja, color: '#fff', fontSize: 22, fontWeight: 800 },
    h('div', { width: 12, height: 12, borderRadius: 6, background: '#fff', flexShrink: 0 }),
    elecciones ? tc.elecciones.tarjeta : tc.marca.lema);
  // Cifra destacada: la primera (propiedades) o, con el hemiciclo de viviendas, la de viviendas
  const destacada = modo === 'viviendas' ? 1 : 0;
  const caja = ([v, t]: [string, string], i: number) => h('div', {
    flexDirection: 'column', flex: 1, gap: 2, padding: '14px 18px', borderRadius: 16,
    background: i === destacada ? C.acentoSuave : C.blanco, border: `2px solid ${i === destacada ? '#f7c9a6' : C.borde}`,
  },
    h('div', { fontSize: 44, fontWeight: 800, letterSpacing: -1, color: i === destacada ? C.acento : C.texto, lineHeight: 1.05 }, v),
    h('div', { fontSize: 19, color: C.apagado, lineHeight: 1.2 }, t));
  return aPng(h('div', {
    width: 1200, height: 630, flexDirection: 'column', justifyContent: 'space-between', background: C.fondo, color: C.texto,
    fontFamily: 'Inter', borderTop: `14px solid ${C.naranja}`, padding: '34px 56px 30px',
  },
    h('div', { justifyContent: 'space-between', alignItems: 'center' }, cabecera(0.9), etiqueta),
    h('div', { gap: 36, alignItems: 'center' },
      h('div', { flexDirection: 'column', gap: 18, width: 620 },
        h('div', { fontSize: id === 'inicio' && elecciones ? 70 : 62, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1.02 }, id === 'inicio' && !elecciones ? tc.marca.lema : p.titulo),
        h('div', { fontSize: 26, color: C.apagado, lineHeight: 1.3 }, p.subtitulo),
        h('div', { gap: 12, marginTop: 6 }, ...p.cifras().map(caja))),
      h('div', { flexDirection: 'column', alignItems: 'center', gap: 16, flex: 1 },
        img(hemicicloUri(modo), 420, 222),
        ...(modo === 'grupo' ? [] : [leyendaEscala(modo, lang, 0.62)]),
        h('div', { alignItems: 'center', gap: 12, padding: '12px 22px 12px 26px', borderRadius: 999, background: C.texto, color: '#fff', fontSize: 23, fontWeight: 800 }, p.llamada, img(FLECHA, 22, 22)))),
    h('div', { justifyContent: 'space-between', alignItems: 'center', fontSize: 20, color: C.apagado, borderTop: `2px solid ${C.borde}`, paddingTop: 16 },
      h('div', {}, tt.pie),
      h('div', { color: C.acento, fontWeight: 800, fontSize: 22 }, 'congresoabierto.org')),
  ), 'horizontal');
}

/**
 * Rutas de las imágenes, sin la base de la web y con el prefijo del idioma ('/ca/tarjetas/…'; en castellano, '/tarjetas/…').
 * Cada idioma tiene sus tarjetas.
 */
export const rutaTarjeta = {
  diputado: (d: Diputado, f: Formato, lang: Idioma = 'es') => `${prefijo(lang)}/tarjetas/${f}/diputado/${slug(d)}.png`,
  votacion: (v: VotacionClave, f: Formato, lang: Idioma = 'es') => `${prefijo(lang)}/tarjetas/${f}/votacion/${v.id}.png`,
  provincia: (id: string, f: Formato, lang: Idioma = 'es') => `${prefijo(lang)}/tarjetas/${f}/provincia/${id}.png`,
  resumen: (f: Formato, lang: Idioma = 'es', modo: ModoHemiciclo = 'grupo') => `${prefijo(lang)}/tarjetas/${f}/resumen${modo === 'grupo' ? '' : `-${modo}`}.png`,
  pagina: (id: string, lang: Idioma = 'es') => `${prefijo(lang)}/tarjetas/horizontal/pagina/${id}.png`,
};

/* ---------- Texto y enlace para compartir ---------- */
/** Ruta de una página en un idioma, sin la base de la web: '/diputado/x' → '/ca/diputado/x'; '/' → '/ca/'. */
const pagina = (p: string, lang: Idioma) => `${prefijo(lang)}${p}`;
/** Llamada a votar que va delante de los textos mientras no se hayan celebrado las elecciones. */
const llamada = (lang: Idioma) => (antesDeElecciones() ? comun[lang].elecciones.llamada : '');
/**
 * Enlace (ruta de la web, sin la base y con el prefijo del idioma) y texto que acompaña a cada tarjeta al compartirla.
 * Solo datos oficiales, sin valoraciones.
 */
export const compartir = {
  diputado: (d: Diputado, lang: Idioma = 'es') => {
    const t = textosCompartir[lang].mensaje;
    const p = d.patrimonio;
    const bienes = p.propiedades === null ? t.sinDeclaracion
      : `${pl(p.propiedades, t.declara, lang)}${p.propiedades && p.viviendas !== null ? pl(p.viviendas, t.viviendas, lang) : ''}`;
    return {
      enlace: pagina(`/diputado/${slug(d)}`, lang),
      texto: llamada(lang) + f(t.diputado, { nombre: d.nombreCompleto, grupo: d.grupoCorto, provincia: nombreLegible(d.circunscripcion), bienes, sueldo: formatos(lang).eur(d.retribucion.totalMensual) }),
    };
  },
  votacion: (v: VotacionClave, lang: Idioma = 'es') => ({
    enlace: pagina(`/?votacion=${encodeURIComponent(v.id)}#hemiciclo`, lang),
    texto: f(textosCompartir[lang].mensaje.votacion, {
      titulo: rotulo(v, lang).corto, fecha: formatos(lang).fecha(v.fecha), resultado: resultadoTexto(v.resultado, lang).toLowerCase(),
      si: v.totales.si, no: v.totales.no, abs: v.totales.abstencion,
    }),
  }),
  provincia: (id: string, lang: Idioma = 'es') => {
    const c = circunscripciones.find((x) => x.id === id)!;
    const k = diputados.filter((d) => d.circunscripcion === c.nombre).length;
    return { enlace: pagina(`/diputados?provincia=${encodeURIComponent(c.nombre)}`, lang), texto: llamada(lang) + pl(k, textosCompartir[lang].mensaje.provincia, lang, { provincia: c.legible }) };
  },
  resumen: (lang: Idioma = 'es') => ({
    enlace: pagina('/', lang),
    texto: `${antesDeElecciones() ? `${comun[lang].elecciones.texto}. ` : ''}${textosCompartir[lang].mensaje.resumen}`,
  }),
};
