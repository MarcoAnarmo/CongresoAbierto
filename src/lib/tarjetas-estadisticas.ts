/**
 * Tarjetas para compartir de las estadísticas de dinero y de participación en empresas y entidades:
 * rentas, acciones y fondos, empresas privadas y aportaciones a ONG. Las cifras salen de src/lib/estadisticas-dinero.ts
 * (las mismas que la página Estadísticas). Siempre totales, nunca medias, y solo lo que dicen los documentos oficiales.
 */
import { diputados, grupos, colorGrupo } from './data';
import type { Diputado } from './types';
import { C, h, img, lienzo, cabecera, pie, fotoDataUri, aPng, type Formato, type Nodo } from './og';
import * as D from './estadisticas-dinero';
import { formatos, f, pl, type Idioma } from '../i18n';
import comun from '../i18n/textos/comun';
import textosTarjetas from '../i18n/textos/tarjetas';
import textosEst from '../i18n/textos/estadisticas';

export const ESTADISTICAS = ['rentas', 'inversiones', 'empresas', 'ong'] as const;
export type IdEstadistica = (typeof ESTADISTICAS)[number];

const G = [...grupos].sort((a, b) => a.orden - b.orden).map((g) => g.corto);
/** Por grupo, de más a menos (a igualdad, en el orden de la Cámara). */
const ordenados = <T extends { g: string; n: number }>(xs: T[]) => [...xs].sort((a, b) => b.n - a.n || G.indexOf(a.g) - G.indexOf(b.g));

/* ---------- Piezas ---------- */
const punto = (color: string, tam: number) => h('div', { width: tam, height: tam, borderRadius: tam / 2, background: color, flexShrink: 0 });

/** Rótulo naranja, título grande y subtítulo. */
const titular = (etiqueta: string, titulo: string, sub: string | null, e: number, tam: number) =>
  h('div', { flexDirection: 'column', gap: 16 * e, flexShrink: 0 },
    h('div', { alignSelf: 'flex-start', alignItems: 'center', gap: 10 * e, padding: `${8 * e}px ${20 * e}px`, borderRadius: 999, background: C.naranja, color: '#fff', fontSize: 24 * e, fontWeight: 800 },
      punto('#fff', 11 * e), etiqueta),
    h('div', { fontSize: tam, fontWeight: 800, letterSpacing: -0.035 * tam, lineHeight: 1.04 }, titulo),
    sub ? h('div', { fontSize: 26 * e, color: C.apagado, lineHeight: 1.3 }, sub) : null);

/** Bloque blanco con un título pequeño. */
const bloque = (titulo: string | null, e: number, ...hijos: (Nodo | null)[]) =>
  h('div', { flexDirection: 'column', gap: 14 * e, padding: `${22 * e}px ${26 * e}px`, borderRadius: 26 * e, background: C.blanco, border: `${2 * e}px solid ${C.borde}`, flexShrink: 0 },
    titulo ? h('div', { fontSize: 24 * e, fontWeight: 700, color: C.apagado }, titulo) : null, ...hijos);

/** Cifra grande con su texto al lado. */
const cifraGrande = (valor: string, texto: string, e: number, destacada = true) =>
  h('div', { alignItems: 'center', gap: 20 * e, padding: `${18 * e}px ${26 * e}px`, borderRadius: 26 * e, background: destacada ? C.acentoSuave : C.blanco, border: `${2 * e}px solid ${destacada ? C.acentoBorde : C.borde}`, flexShrink: 0 },
    h('div', { fontSize: 76 * e, fontWeight: 800, letterSpacing: -2.5 * e, lineHeight: 1, color: destacada ? C.acento : C.texto, flexShrink: 0 }, valor),
    h('div', { fontSize: 26 * e, lineHeight: 1.25, color: C.texto, flex: 1 }, texto));

/** Fila con etiqueta, barra (valor respecto al máximo) y cifra. */
const filaBarra = (etiqueta: string, valor: number, max: number, texto: string, e: number, color: string = C.naranja, marca?: string) =>
  h('div', { flexDirection: 'column', gap: 6 * e },
    h('div', { justifyContent: 'space-between', alignItems: 'baseline', gap: 16 * e, fontSize: 25 * e },
      h('div', { alignItems: 'center', gap: 10 * e, flex: 1, minWidth: 0 }, marca ? punto(marca, 14 * e) : null, h('div', { flex: 1 }, etiqueta)),
      h('div', { fontWeight: 800, flexShrink: 0 }, texto)),
    h('div', { width: '100%', height: 12 * e, borderRadius: 999, background: C.chip },
      h('div', { width: `${Math.max(1.5, (100 * valor) / (max || 1))}%`, height: 12 * e, borderRadius: 999, background: color })));

/** Fila de un grupo: cuántos de cuántos (la barra es la proporción del propio grupo). */
const filaGrupo = (x: { g: string; n: number; de: number }, deGrupo: string, e: number) =>
  h('div', { alignItems: 'center', gap: 14 * e, fontSize: 24 * e },
    h('div', { alignItems: 'center', gap: 10 * e, width: 170 * e, flexShrink: 0, fontWeight: 700 }, punto(colorGrupo(x.g), 14 * e), x.g),
    h('div', { flex: 1, height: 22 * e, borderRadius: 999, background: C.chip, overflow: 'hidden' },
      h('div', { width: `${x.de ? (100 * x.n) / x.de : 0}%`, height: 22 * e, background: colorGrupo(x.g) })),
    h('div', { width: 150 * e, justifyContent: 'flex-end', flexShrink: 0, fontWeight: 700, color: C.apagado }, deGrupo));

/** Fila de una persona: puesto, foto, nombre y grupo, e importe. */
const filaPersona = (i: number, foto: string | null, d: Diputado, valor: string, e: number) =>
  h('div', { alignItems: 'center', gap: 18 * e, padding: `${10 * e}px 0`, borderTop: i ? `${2 * e}px solid ${C.chip}` : 'none' },
    h('div', { width: 36 * e, fontSize: 30 * e, fontWeight: 800, color: C.apagado, flexShrink: 0 }, String(i + 1)),
    foto
      ? h('div', { width: 76 * e, height: 76 * e, borderRadius: 38 * e, overflow: 'hidden', border: `${4 * e}px solid ${colorGrupo(d.grupoCorto)}`, flexShrink: 0 }, img(foto, 76 * e, 96 * e, { objectFit: 'cover' }))
      : h('div', { width: 76 * e, height: 76 * e, borderRadius: 38 * e, background: C.chip, border: `${4 * e}px solid ${colorGrupo(d.grupoCorto)}`, flexShrink: 0 }),
    h('div', { flexDirection: 'column', flex: 1, gap: 2 * e, minWidth: 0 },
      h('div', { fontSize: 29 * e, fontWeight: 800, lineHeight: 1.15 }, d.nombreCompleto),
      h('div', { alignItems: 'center', gap: 8 * e, fontSize: 22 * e, color: C.apagado }, punto(colorGrupo(d.grupoCorto), 12 * e), d.grupoCorto)),
    h('div', { fontSize: 32 * e, fontWeight: 800, color: C.acento, flexShrink: 0 }, valor));

/* ---------- Contenido de cada tarjeta ---------- */
interface Contenido { etiqueta: string; titulo: string; sub: string | null; historia: (Nodo | null)[]; horizontal: (Nodo | null)[] }

async function contenido(id: IdEstadistica, lang: Idioma): Promise<Contenido> {
  const tt = textosTarjetas[lang].estadisticas;
  const te = textosEst[lang];
  const tv = comun[lang].vinculos;
  const { num, eur } = formatos(lang);
  const deGrupo = (x: { n: number; de: number }) => f(tt.deGrupo, { n: num(x.n), de: num(x.de) });
  const euros = (x: D.Importe) => (x.alMenos ? f(te.masRentas.alMenos, { x: eur(x.euros) }) : eur(x.euros));

  if (id === 'rentas') {
    const top = D.masRentas(diputados, 5);
    const fotos = await Promise.all(top.map((x) => fotoDataUri(x.d.fotoUrl)));
    const porGrupo = ordenados(D.porGrupo(diputados, G, D.declaraRentas, D.conDeclaracion));
    return {
      etiqueta: tt.rentas.etiqueta, titulo: tt.rentas.titulo, sub: tt.rentas.sub,
      historia: [
        bloque(null, 0.86, ...top.map((x, i) => filaPersona(i, fotos[i], x.d, euros(x), 0.86))),
        bloque(tt.rentas.grupos, 0.86, ...porGrupo.map((x) => filaGrupo(x, deGrupo(x), 0.86))),
      ],
      horizontal: [h('div', { flexDirection: 'column', gap: 4 }, ...top.slice(0, 3).map((x, i) => filaPersona(i, fotos[i], x.d, euros(x), 0.78)))],
    };
  }

  if (id === 'inversiones') {
    const t = D.totalesInversion(diputados);
    const top = D.masNombradas(diputados, (e, a) => e.tipo === 'empresa' && a.relacion === 'acciones', 5);
    const porGrupo = ordenados(D.porGrupo(diputados, G, D.declaraAcciones, D.conDeclaracion));
    const diputadosN = (n: number) => pl(n, comun[lang].palabras.diputados, lang);
    return {
      etiqueta: tt.inversiones.etiqueta, titulo: tt.inversiones.titulo, sub: null,
      historia: [
        cifraGrande(num(t.acciones), `${tt.inversiones.acciones} · ${f(te.inversiones.euros, { x: eur(t.eurosAcciones) })}`, 0.86),
        cifraGrande(num(t.fondos), `${tt.inversiones.fondos} · ${f(te.inversiones.euros, { x: eur(t.eurosFondos) })}`, 0.86, false),
        bloque(tt.inversiones.top, 0.86, ...top.slice(0, 4).map((x) => filaBarra(x.nombre, x.n, top[0].n, diputadosN(x.n), 0.86))),
        bloque(tt.inversiones.grupos, 0.86, ...porGrupo.map((x) => filaGrupo(x, deGrupo(x), 0.86))),
      ],
      horizontal: [
        h('div', { gap: 14 }, h('div', { flex: 1 }, cifraGrande(num(t.acciones), tt.inversiones.acciones, 0.62)), h('div', { flex: 1 }, cifraGrande(num(t.fondos), tt.inversiones.fondos, 0.62, false))),
        h('div', { flexDirection: 'column', gap: 8 }, ...top.slice(0, 3).map((x) => filaBarra(x.nombre, x.n, top[0].n, diputadosN(x.n), 0.72))),
      ],
    };
  }

  if (id === 'empresas') {
    const n = diputados.filter(D.conEmpresas).length;
    const rel = D.relacionesConEmpresas(diputados).slice(0, 5);
    const rem = D.remuneracionDiputados(diputados);
    const nBorme = diputados.filter(D.conBorme).length;
    const remCaja = (k: (typeof D.REMUNERACIONES)[number]) => h('div', { flexDirection: 'column', flex: 1, gap: 4, padding: '14px 16px', borderRadius: 18, background: k === 'si' ? C.acentoSuave : C.fondo, border: `2px solid ${k === 'si' ? C.acentoBorde : C.borde}` },
      h('div', { fontSize: 50, fontWeight: 800, letterSpacing: -1.5, color: k === 'si' ? C.acento : C.texto }, num(rem.get(k)!)),
      h('div', { fontSize: 21, lineHeight: 1.2, color: C.apagado }, tt.remCorto[k]));
    return {
      etiqueta: tt.empresas.etiqueta, titulo: tt.empresas.titulo, sub: tt.empresas.aviso,
      historia: [
        cifraGrande(num(n), tt.empresas.cifra, 0.9),
        bloque(tt.empresas.relacion, 0.9, ...rel.map((x) => filaBarra(tv.relaciones[x.relacion], x.n, rel[0].n, num(x.n), 0.9))),
        bloque(tt.empresas.rem, 0.9, h('div', { gap: 10 }, ...D.REMUNERACIONES.map(remCaja))),
        cifraGrande(num(nBorme), tt.empresas.borme, 0.8, false),
      ],
      horizontal: [
        cifraGrande(num(n), tt.empresas.cifra, 0.62),
        h('div', { flexDirection: 'column', gap: 8 }, ...rel.slice(0, 3).map((x) => filaBarra(tv.relaciones[x.relacion], x.n, rel[0].n, num(x.n), 0.72))),
      ],
    };
  }

  // ONG
  const n = diputados.filter(D.aportaAOng).length;
  const top = D.masNombradas(diputados, (e, a) => D.esOng(e.tipo) && a.relacion === 'aportacion', 6);
  const porGrupo = ordenados(D.porGrupo(diputados, G, D.aportaAOng, D.conIntereses));
  const diputadosN = (k: number) => pl(k, comun[lang].palabras.diputados, lang);
  return {
    etiqueta: tt.ong.etiqueta, titulo: tt.ong.titulo, sub: null,
    historia: [
      cifraGrande(num(n), tt.ong.cifra, 0.9),
      bloque(tt.ong.top, 0.86, ...top.map((x) => filaBarra(x.nombre, x.n, top[0].n, diputadosN(x.n), 0.86))),
      bloque(tt.ong.grupos, 0.86, ...porGrupo.map((x) => filaGrupo(x, deGrupo(x), 0.86))),
    ],
    horizontal: [
      cifraGrande(num(n), tt.ong.cifra, 0.62),
      h('div', { flexDirection: 'column', gap: 8 }, ...top.slice(0, 3).map((x) => filaBarra(x.nombre, x.n, top[0].n, diputadosN(x.n), 0.72))),
    ],
  };
}

export async function tarjetaEstadistica(id: IdEstadistica, formato: Formato, lang: Idioma = 'es') {
  const c = await contenido(id, lang);
  if (formato === 'horizontal') {
    return aPng(lienzo('horizontal',
      h('div', { justifyContent: 'space-between', alignItems: 'center' }, cabecera(0.8), h('div', { fontSize: 20, fontWeight: 800, color: C.acento }, 'congresoabierto.org')),
      h('div', { gap: 36, flex: 1, alignItems: 'center', marginTop: 18 },
        h('div', { width: 470, flexShrink: 0 }, titular(c.etiqueta, c.titulo, c.sub, 0.78, 52)),
        h('div', { flexDirection: 'column', flex: 1, gap: 14 }, ...c.horizontal)),
      pie(1, lang),
    ), 'horizontal');
  }
  return aPng(lienzo('historia',
    cabecera(1.2),
    h('div', { flexDirection: 'column', gap: 22, flex: 1, justifyContent: 'center', padding: '24px 0' },
      titular(c.etiqueta, c.titulo, c.sub, 0.95, 72),
      ...c.historia),
    pie(1.2, lang),
  ), 'historia');
}
