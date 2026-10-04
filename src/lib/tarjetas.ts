/** Contenido de cada tipo de tarjeta para redes. El dibujo común está en og.ts. */
import { diputados, votaciones, grupos, colorGrupo, fmtEur, fmtNum, slug, resumen } from './data';
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
export async function tarjetaDiputado(d: Diputado, formato: Formato) {
  const p = d.patrimonio;
  const foto = await fotoDataUri(d.fotoUrl);
  const color = colorGrupo(d.grupoCorto);
  const cargo = `${d.genero === 'F' ? 'Diputada' : 'Diputado'} por ${d.circunscripcion}`;
  const cifras = [
    cifra(n(p.propiedades), 'propiedades', true, formato === 'historia' ? 1.45 : 1),
    cifra(n(p.viviendas), 'viviendas', false, formato === 'historia' ? 1.45 : 1),
    cifra(n(p.vehiculos), 'vehículos', false, formato === 'historia' ? 1.45 : 1),
    cifra(fmtEur(d.retribucion.totalMensual), 'al mes del Congreso', false, formato === 'historia' ? 1.45 : 1),
  ];
  if (formato === 'horizontal') {
    const tam = d.nombreCompleto.length > 34 ? 50 : d.nombreCompleto.length > 24 ? 58 : 66;
    return aPng(lienzo('horizontal',
      cabecera(),
      h('div', { alignItems: 'center', gap: 28 },
        retrato(foto, d.nombreCompleto, 132, 168, color),
        h('div', { flexDirection: 'column', gap: 10, flex: 1 },
          h('div', { fontSize: tam, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05 }, d.nombreCompleto),
          h('div', { alignItems: 'center', gap: 12, fontSize: 28, color: C.apagado }, puntoGrupo(color, 20), `${d.grupoCorto} · ${cargo}`))),
      h('div', { gap: 18 }, ...cifras),
      pie(),
    ), 'horizontal');
  }
  const votos = [...votaciones].sort((a, b) => b.fecha.localeCompare(a.fecha))
    .map((v) => ({ v, voto: v.votos[String(d.codParlamentario)] as Voto | undefined }))
    .filter((x) => x.voto).slice(0, 4);
  const tam = d.nombreCompleto.length > 30 ? 62 : 74;
  return aPng(lienzo('historia',
    cabecera(1.4),
    h('div', { flexDirection: 'column', gap: 44 },
      h('div', { alignItems: 'center', gap: 36 },
        retrato(foto, d.nombreCompleto, 290, 370, color),
        h('div', { flexDirection: 'column', gap: 18, flex: 1 },
          h('div', { fontSize: tam, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05 }, d.nombreCompleto),
          h('div', { alignItems: 'center', gap: 14, fontSize: 34, fontWeight: 700 }, puntoGrupo(color, 26), d.grupoCorto),
          h('div', { fontSize: 30, color: C.apagado, lineHeight: 1.3 }, cargo))),
      h('div', { flexDirection: 'column', gap: 22 },
        h('div', { gap: 22 }, cifras[0], cifras[1]),
        h('div', { gap: 22 }, cifras[2], cifras[3])),
      votos.length > 0 && h('div', { flexDirection: 'column', gap: 16, background: C.blanco, border: `3px solid ${C.borde}`, borderRadius: 26, padding: '28px 32px' },
        h('div', { fontSize: 28, fontWeight: 700, color: C.apagado }, 'Cómo votó sobre vivienda'),
        ...votos.map(({ v, voto }) => h('div', { alignItems: 'center', justifyContent: 'space-between', gap: 20 },
          h('div', { flexDirection: 'column', flex: 1 },
            h('div', { fontSize: 29, fontWeight: 700, lineHeight: 1.2 }, temaCorto(v.tema)),
            h('div', { fontSize: 23, color: C.apagado }, fechaCorta(v.fecha))),
          pastilla(voto!, colorVoto[voto!], 1.3))))),
    pie(1.4),
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
