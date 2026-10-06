/**
 * Votaciones del Pleno en formato compacto para la página Votaciones (índice que se descarga en el navegador)
 * y plantillas HTML de cada fila, que comparten el servidor (primera carga) y el cliente (filtros y paginación).
 * Este fichero no importa los datos: lo usan también los scripts de cliente.
 */
import { fechaTexto } from '../i18n/fechas';
import type { VotacionClave } from './types';

/** Votación en el índice del cliente. */
export interface ItemVotacion {
  id: string;
  /** Fecha (AAAA-MM-DD), sesión y número de votación. */
  f: string; s: number; n: number;
  /** Texto oficial del expediente (literal) y etiqueta corta de las votaciones clave. */
  t: string; c?: string;
  /** Subgrupo oficial y modalidad («Enmienda 14», «Votación de conjunto»…). */
  d?: string;
  /** Tipo (clase propia, ver claseTipo) y tipo oficial. */
  k: string; tp: string;
  te: string[];
  r: string;
  /** Totales oficiales: sí, no, abstención, no vota. */
  to: [number, number, number, number];
  /** Recuento por grupo en la fecha de la votación. */
  g?: [string, number, number, number, number][];
  /** Votación clave (con documentos y contenido revisados a mano) o con voto nominal pendiente. */
  cl?: 1; pe?: 1;
  /** JSON y PDF oficiales de la votación. */
  fu: string; pdf?: string;
  /** Sin voto de cada diputado en los datos abiertos (p. ej. votación secreta): solo hay totales. */
  nv?: 1;
}

/** Clasificación por el tipo de punto del orden del día (campo oficial «titulo» de la votación). */
export const claseTipo = (t: string) => (/Decretos-leyes/.test(t) ? 'rdl' : /no de Ley/i.test(t) ? 'pnl' : /Proposici[oó]n(es)? de Ley/i.test(t) ? 'pl' : /Mociones/.test(t) ? 'mocion' : /Dict[aá]menes de Comisiones sobre iniciativas legislativas|totalidad de iniciativas legislativas|Enmiendas del Senado|Avocaci|lectura [uú]nica/i.test(t) ? 'leg' : /Convenios internacionales/.test(t) ? 'int' : 'otro');
export const TIPOS: { id: string; nombre: string; plural: string }[] = [
  { id: 'rdl', nombre: 'Decreto-ley', plural: 'Decretos-leyes' },
  { id: 'pl', nombre: 'Proposición de ley', plural: 'Proposiciones de ley' },
  { id: 'pnl', nombre: 'Proposición no de ley', plural: 'Proposiciones no de ley' },
  { id: 'mocion', nombre: 'Moción', plural: 'Mociones' },
  { id: 'leg', nombre: 'Tramitación de leyes', plural: 'Tramitación de leyes' },
  { id: 'int', nombre: 'Convenio internacional', plural: 'Convenios internacionales' },
  { id: 'otro', nombre: 'Otros', plural: 'Otros' },
];
/**
 * Textos de las filas y la lista, en el idioma de la página (solo cadenas: los usa también el script del navegador).
 * Los datos del índice (resultado, tipo oficial…) siguen en castellano; aquí solo se traducen al mostrarlos.
 */
export interface TextosLista {
  /** Locale para Intl (fechas de la lista). */
  locale: string;
  /** «Votación clave», «· solo totales». */
  clave: string; soloTotales: string;
  /** Piezas de los totales: «{n} sí», «{n} no», «{n} abst.», «{n} no vota». */
  si: string; no: string; abst: string; noVota: string;
  /** Cabecera de cada día: ['{n} votación', '{n} votaciones']. */
  votaciones: string[];
  /** Nombre de cada tipo propio (TIPOS) y «Votación» cuando no hay tipo. */
  tipos: Record<string, string>; votacion: string;
  /** Resultado oficial (en castellano) → texto en el idioma de la página. */
  resultados: Record<string, string>;
}
const conN = (s: string, n: number | string) => s.replace('{n}', String(n));
export const nombreTipo = (k: string, tp: string, tx: TextosLista) => (TIPOS.some((x) => x.id === k && k !== 'otro') ? tx.tipos[k] : undefined) ?? (tp.replace(/\.$/, '') || tx.votacion);
/** Resultado oficial en el idioma de la página. */
export const resultadoTexto = (r: string, tx: TextosLista) => tx.resultados[r] ?? r;
export const favorable = (r: string) => (/Aprobada|Convalidado/.test(r) ? 'si' : /pendiente/i.test(r) ? 'pend' : 'no');
/** Etiqueta corta oficial sin la fecha final: «RDL 8/2026 · alquiler (28/04/2026)» → «RDL 8/2026 · alquiler». */
export const sinFecha = (tema: string) => tema.replace(/\s*\(\d{2}\/\d{2}\/\d{4}\)\s*$/, '');

const pdfDe = (v: VotacionClave) => v.documentos.find((d) => d.tipo === 'votacion')?.url;
export function aItem(v: VotacionClave): ItemVotacion {
  const t = v.totales;
  return {
    id: v.id, f: v.fecha, s: v.sesion, n: v.numeroVotacion, t: v.titulo, ...(v.automatica ? {} : { c: sinFecha(v.tema), cl: 1 as const }),
    ...(v.detalle ? { d: v.detalle } : {}), k: claseTipo(v.tipo), tp: v.tipo, te: v.temas ?? ['otros'], r: v.resultado,
    to: [t.si, t.no, t.abstencion, t.noVota], ...(v.porGrupo?.length ? { g: v.porGrupo } : {}), fu: v.fuenteUrl,
    ...(pdfDe(v) ? { pdf: pdfDe(v) } : {}), ...(Object.keys(v.votos).length ? {} : { nv: 1 as const }),
  };
}

/** Votación por llamamiento cuyo voto nominal aún no está en datos abiertos (data/manual/votaciones-pendientes.json). */
export function itemPendiente(p: { id: string; fecha: string; titulo: string }): ItemVotacion {
  // «…de los Reales Decretos-leyes 26/2026 y 27/2026, de 29 de septiembre» → «RDL 26/2026 y 27/2026»
  const m = p.titulo.match(/Decretos?-leyes? ([\d/]+(?: y [\d/]+)?)/);
  return {
    id: p.id, f: p.fecha, s: 0, n: 0, t: p.titulo, ...(m ? { c: `RDL ${m[1]}` } : {}), k: 'rdl', tp: 'Convalidación o derogación de Reales Decretos-leyes.',
    te: ['vivienda'], r: 'Voto nominal pendiente', to: [0, 0, 0, 0], cl: 1, pe: 1, fu: '',
  };
}
/** Todas, de la más reciente a la más antigua (en cada día, las pendientes primero y luego por sesión y número). */
export const ordenar = (xs: ItemVotacion[]) => xs.sort((a, b) => b.f.localeCompare(a.f) || (b.pe ?? 0) - (a.pe ?? 0) || b.s - a.s || b.n - a.n);

/** Texto sin tildes y en minúsculas, para buscar. */
export const normalizar = (x: string) => x.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
/** Cada palabra buscada tiene que aparecer, en cualquier orden. «Alquiler» encuentra también «arrendamiento» y viceversa. */
const SINONIMOS: Record<string, string[]> = { alquiler: ['arrendamiento', 'arrendamientos', 'alquiler'], arrendamiento: ['alquiler', 'arrendamiento'], okupacion: ['ocupacion'] };
export function coincide(texto: string, palabras: string[]) {
  return palabras.every((w) => texto.includes(w) || (SINONIMOS[w]?.some((x) => texto.includes(x)) ?? false));
}
export const palabrasDe = (q: string) => normalizar(q.trim()).split(/\s+/).filter(Boolean);

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const pct = (n: number, t: number) => `${t ? ((100 * n) / t).toFixed(2) : 0}%`;
/** El final del detalle es lo que distingue votaciones del mismo asunto («Enmienda 14», «Punto 2»). */
const finDe = (t: string, n = 90) => (t.length > n ? `…${t.slice(-(n - 1)).replace(/^\S*\s/, '')}` : t);

export function barraHtml(to: number[], fina = true) {
  const [si, no, ab, nv] = to; const tot = si + no + ab + nv;
  return `<span class="barra${fina ? ' fina' : ''}" aria-hidden="true"><span class="b-si" style="width:${pct(si, tot)}"></span><span class="b-no" style="width:${pct(no, tot)}"></span><span class="b-abs" style="width:${pct(ab, tot)}"></span><span class="b-nv" style="width:${pct(nv, tot)}"></span></span>`;
}
/** Votaciones que caben, como mucho, en una tarjeta de comparación. */
export const MAX_COMPARAR = 7;

/** Texto que acompaña al enlace al compartir una votación (página Votaciones y galería de tarjetas). {resultado} va en minúscula. */
export function textoCompartirVotacion(i: ItemVotacion, plantilla: string, tx: TextosLista, fecha: (iso: string) => string) {
  const [si, no, ab] = i.to;
  const titulo = i.c ?? (i.t.length > 140 ? `${i.t.slice(0, 138).trimEnd()}…` : i.t);
  const v: Record<string, string | number> = { titulo, fecha: fecha(i.f), resultado: resultadoTexto(i.r, tx).toLocaleLowerCase(tx.locale), si, no, ab };
  return plantilla.replace(/\{([^{}\s]+)\}/g, (_, k) => (k in v ? String(v[k]) : `{${k}}`));
}
export const totalesTexto = (to: number[], tx: TextosLista) => [conN(tx.si, to[0]), conN(tx.no, to[1]), conN(tx.abst, to[2]), ...(to[3] ? [conN(tx.noVota, to[3])] : [])].join(' · ');

/** Fila compacta de una votación (se abre en la ventana de detalle). `base` lleva ya el prefijo del idioma. */
export function filaHtml(i: ItemVotacion, base: string, tx: TextosLista) {
  const fav = favorable(i.r);
  const tit = i.c ?? i.t;
  return `<li class="vf${i.pe ? ' pend' : ''}"><a class="vf-a" href="${base}/votaciones?v=${encodeURIComponent(i.id)}" data-v="${esc(i.id)}">`
    + `<span class="vf-meta"><span class="etq">${esc(nombreTipo(i.k, i.tp, tx))}</span>${i.cl ? `<span class="etq clave">${esc(tx.clave)}</span>` : ''}</span>`
    + `<span class="vf-tit">${esc(tit)}</span>`
    + (i.d && !i.c ? `<span class="vf-det">${esc(finDe(i.d))}</span>` : '')
    + `<span class="vf-res"><span class="insignia ${fav}">${esc(resultadoTexto(i.r, tx))}</span>${i.pe ? '' : `<span class="vf-n">${totalesTexto(i.to, tx)}</span>`}${i.nv ? `<span class="vf-n">${esc(tx.soloTotales)}</span>` : ''}</span>`
    + (i.pe ? '' : barraHtml(i.to))
    + `<svg class="vf-ir" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6" /></svg>`
    + `</a></li>`;
}

const fechaDia = (iso: string, locale: string) => {
  const s = fechaTexto(iso, locale.slice(0, 2), locale, { semana: true });
  return s.charAt(0).toUpperCase() + s.slice(1);
};
/** Lista agrupada por día (las votaciones ya vienen ordenadas). `total` cuenta las de cada día aunque solo se muestren algunas. */
export function listaHtml(items: ItemVotacion[], base: string, tx: TextosLista, total?: Record<string, number>) {
  let html = '', dia = '';
  for (const i of items) {
    if (i.f !== dia) {
      if (dia) html += '</ul></section>';
      dia = i.f;
      const n = total?.[dia] ?? items.filter((x) => x.f === dia).length;
      html += `<section class="v-dia"><h3><time datetime="${dia}">${fechaDia(dia, tx.locale)}</time><span>${conN(n === 1 ? tx.votaciones[0] : tx.votaciones[1], n)}</span></h3><ul class="v-filas">`;
    }
    html += filaHtml(i, base, tx);
  }
  return html + (dia ? '</ul></section>' : '');
}
