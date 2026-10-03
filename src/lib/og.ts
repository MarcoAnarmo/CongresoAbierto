/**
 * Tarjetas para compartir en redes (Open Graph, 1200×630).
 * Se generan como PNG estáticos en el build con satori (HTML/CSS → SVG) y resvg (SVG → PNG).
 * No usan la foto del diputado: solo nombre, grupo y cifras oficiales.
 */
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const fuente = (peso: number) => readFileSync(require.resolve(`@fontsource/inter/files/inter-latin-${peso}-normal.woff`));
let fuentes: { name: string; data: Buffer; weight: 400 | 700 | 800; style: 'normal' }[] | null = null;
const cargarFuentes = () => (fuentes ??= ([400, 700, 800] as const).map((w) => ({ name: 'Inter', data: fuente(w), weight: w, style: 'normal' as const })));

export const OG_ANCHO = 1200;
export const OG_ALTO = 630;

const C = { fondo: '#f7f6f2', texto: '#15171c', apagado: '#555c68', borde: '#e2dfd8', acento: '#c2410c', acentoSuave: '#fff3ea', blanco: '#ffffff' };

const LOGO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#16181d" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18 7.5 37M15 18l7.5 19M49 18l-7.5 19M49 18l7.5 19"/><path d="M6 37h18a9 7.5 0 0 1-18 0zM40 37h18a9 7.5 0 0 1-18 0z" fill="#f7a04b"/><path d="M4.5 15.5c3.5 2 7.5 2.8 10.5 2.5 4.5-.5 8.5-3.5 13-3.6M59.5 15.5c-3.5 2-7.5 2.8-10.5 2.5-4.5-.5-8.5-3.5-13-3.6"/><rect x="17" y="55.5" width="30" height="5.5" rx="2.4" fill="#f7a04b"/><rect x="21.5" y="51" width="21" height="5" rx="2.2" fill="#e2852f"/><rect x="29" y="4" width="6" height="48" rx="3" fill="#f7a04b"/><circle cx="32" cy="15" r="5.2" fill="#ffd36e"/><circle cx="15" cy="18" r="2.4" fill="#f7a04b"/><circle cx="49" cy="18" r="2.4" fill="#f7a04b"/></svg>`;
const LOGO_URI = `data:image/svg+xml;base64,${Buffer.from(LOGO).toString('base64')}`;

type Nodo = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, ...children: (Nodo | string | null | false)[]): Nodo =>
  ({ type, props: { style: { display: 'flex', ...style }, children: children.filter((c) => c !== null && c !== false) } });

const cabecera = () =>
  h('div', { alignItems: 'center', gap: 16 },
    { type: 'img', props: { src: LOGO_URI, width: 64, height: 64 } },
    h('div', { fontSize: 32, fontWeight: 800, letterSpacing: -0.5 }, 'Congreso Abierto'));

const pie = (texto: string) =>
  h('div', { justifyContent: 'space-between', alignItems: 'center', fontSize: 24, color: C.apagado, borderTop: `2px solid ${C.borde}`, paddingTop: 22 },
    h('div', {}, texto),
    h('div', { color: C.acento, fontWeight: 700 }, 'congresoabierto.pages.dev'));

const lienzo = (...hijos: Nodo[]) =>
  h('div', { width: OG_ANCHO, height: OG_ALTO, flexDirection: 'column', justifyContent: 'space-between', background: C.fondo, color: C.texto, fontFamily: 'Inter', padding: '52px 64px', borderTop: `14px solid #f26a1b` }, ...hijos);

async function aPng(nodo: Nodo) {
  const svg = await satori(nodo as any, { width: OG_ANCHO, height: OG_ALTO, fonts: cargarFuentes() });
  return new Uint8Array(new Resvg(svg, { fitTo: { mode: 'width', value: OG_ANCHO } }).render().asPng());
}

export interface DatosTarjetaDiputado {
  nombre: string; grupo: string; color: string; circunscripcion: string; genero: 'F' | 'M';
  cifras: { valor: string; etiqueta: string; destacada?: boolean }[];
}

export function tarjetaDiputado(d: DatosTarjetaDiputado) {
  const tam = d.nombre.length > 34 ? 58 : d.nombre.length > 24 ? 66 : 76;
  return aPng(lienzo(
    cabecera(),
    h('div', { flexDirection: 'column', gap: 14 },
      h('div', { fontSize: tam, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05 }, d.nombre),
      h('div', { alignItems: 'center', gap: 14, fontSize: 30, color: C.apagado },
        h('div', { width: 22, height: 22, borderRadius: 11, background: d.color }),
        `${d.grupo} · ${d.genero === 'F' ? 'Diputada' : 'Diputado'} por ${d.circunscripcion}`)),
    h('div', { gap: 18 },
      ...d.cifras.map((c) => h('div', {
        flexDirection: 'column', flex: 1, gap: 4, padding: '20px 24px', borderRadius: 18,
        background: c.destacada ? C.acentoSuave : C.blanco, border: `2px solid ${c.destacada ? '#f7c9a6' : C.borde}`,
      },
        h('div', { fontSize: 52, fontWeight: 800, color: c.destacada ? C.acento : C.texto, letterSpacing: -1 }, c.valor),
        h('div', { fontSize: 22, color: C.apagado }, c.etiqueta)))),
    pie('Datos oficiales del Congreso y del BOE, sin interpretaciones'),
  ));
}

export function tarjetaPagina(titulo: string, subtitulo: string) {
  return aPng(lienzo(
    cabecera(),
    h('div', { flexDirection: 'column', gap: 22 },
      h('div', { fontSize: 72, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05, maxWidth: 1000 }, titulo),
      h('div', { fontSize: 32, color: C.apagado, lineHeight: 1.35, maxWidth: 1000 }, subtitulo)),
    pie('Datos oficiales del Congreso y del BOE, sin interpretaciones'),
  ));
}
