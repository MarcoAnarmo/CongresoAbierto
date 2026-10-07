/**
 * Tarjetas para compartir en redes. Dos formatos de cada tarjeta:
 *  - historia: 1080×1920 (9:16), para historias de Instagram, estados de WhatsApp, TikTok…
 *  - horizontal: 1200×630, la vista previa que muestran las redes al pegar un enlace (Open Graph).
 * Se generan como PNG estáticos en el build con satori (HTML/CSS → SVG) y resvg (SVG → PNG).
 * Solo llevan datos oficiales; la foto es la oficial de congreso.es.
 */
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import type { Idioma } from '../i18n';
import textos from '../i18n/textos/tarjetas';

const require = createRequire(import.meta.url);
const fuente = (subconjunto: string, peso: number) => readFileSync(require.resolve(`@fontsource/inter/files/inter-${subconjunto}-${peso}-normal.woff`));
let fuentes: { name: string; data: Buffer; weight: 400 | 700 | 800; style: 'normal' }[] | null = null;
/**
 * Inter en latín básico y, detrás, latín extendido: este solo se usa para los caracteres que no estén en el primero
 * (por ejemplo, la ŀ catalana o letras de nombres propios); el resto de glifos salen del latín básico.
 */
const cargarFuentes = () => (fuentes ??= (['latin', 'latin-ext'] as const).flatMap((sub) =>
  ([400, 700, 800] as const).map((w) => ({ name: 'Inter', data: fuente(sub, w), weight: w, style: 'normal' as const }))));

import { C as COLORES, FORMATOS, type Formato } from './tarjetas/diseno';
export { FORMATOS, type Formato };

/** Colores de las tarjetas (src/lib/tarjetas/diseno.ts, compartidos con las que se dibujan en el navegador). */
export const C = COLORES;

const LOGO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="1 15 62 30" fill="none" stroke="#16181d" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><g transform="translate(32 46) scale(.94) translate(-32 -46)" stroke-width="1.1"><circle cx="20.9" cy="41.4" r="2.2" fill="#ffd36e"/><circle cx="27.4" cy="34.9" r="2.2" fill="#ffd36e"/><circle cx="36.6" cy="34.9" r="2.2" fill="#ffd36e"/><circle cx="43.1" cy="41.4" r="2.2" fill="#ffd36e"/><circle cx="14.6" cy="41.5" r="2.2" fill="#f7a04b"/><circle cx="16.5" cy="36.8" r="2.2" fill="#f7a04b"/><circle cx="22.8" cy="30.5" r="2.2" fill="#f7a04b"/><circle cx="27.5" cy="28.6" r="2.2" fill="#f7a04b"/><circle cx="36.5" cy="28.6" r="2.2" fill="#f7a04b"/><circle cx="41.2" cy="30.5" r="2.2" fill="#f7a04b"/><circle cx="47.5" cy="36.8" r="2.2" fill="#f7a04b"/><circle cx="49.4" cy="41.5" r="2.2" fill="#f7a04b"/><circle cx="8.4" cy="41.5" r="2.2" fill="#f7a04b"/><circle cx="9.8" cy="36.8" r="2.2" fill="#f7a04b"/><circle cx="12.2" cy="32.5" r="2.2" fill="#f7a04b"/><circle cx="18.5" cy="26.2" r="2.2" fill="#f7a04b"/><circle cx="22.8" cy="23.8" r="2.2" fill="#f7a04b"/><circle cx="27.5" cy="22.4" r="2.2" fill="#f7a04b"/><circle cx="36.5" cy="22.4" r="2.2" fill="#f7a04b"/><circle cx="41.2" cy="23.8" r="2.2" fill="#f7a04b"/><circle cx="45.5" cy="26.2" r="2.2" fill="#f7a04b"/><circle cx="51.8" cy="32.5" r="2.2" fill="#f7a04b"/><circle cx="54.2" cy="36.8" r="2.2" fill="#f7a04b"/><circle cx="55.6" cy="41.5" r="2.2" fill="#f7a04b"/><circle cx="2.3" cy="41.5" r="2.2" fill="#e2852f"/><circle cx="3.4" cy="36.8" r="2.2" fill="#e2852f"/><circle cx="5.3" cy="32.3" r="2.2" fill="#e2852f"/><circle cx="7.9" cy="28.2" r="2.2" fill="#e2852f"/><circle cx="14.2" cy="21.9" r="2.2" fill="#e2852f"/><circle cx="18.3" cy="19.3" r="2.2" fill="#e2852f"/><circle cx="22.8" cy="17.4" r="2.2" fill="#e2852f"/><circle cx="27.5" cy="16.3" r="2.2" fill="#e2852f"/><circle cx="36.5" cy="16.3" r="2.2" fill="#e2852f"/><circle cx="41.2" cy="17.4" r="2.2" fill="#e2852f"/><circle cx="45.7" cy="19.3" r="2.2" fill="#e2852f"/><circle cx="49.8" cy="21.9" r="2.2" fill="#e2852f"/><circle cx="56.1" cy="28.2" r="2.2" fill="#e2852f"/><circle cx="58.7" cy="32.3" r="2.2" fill="#e2852f"/><circle cx="60.6" cy="36.8" r="2.2" fill="#e2852f"/><circle cx="61.7" cy="41.5" r="2.2" fill="#e2852f"/></g></svg>`;
const LOGO_URI = `data:image/svg+xml;base64,${Buffer.from(LOGO).toString('base64')}`;

export type Nodo = { type: string; props: Record<string, unknown> };
type Hijo = Nodo | string | number | null | false | undefined;
/** Crea un nodo para satori; todos los contenedores son flex (satori lo exige). */
export const h = (type: string, style: Record<string, unknown>, ...children: Hijo[]): Nodo =>
  ({ type, props: { style: { display: 'flex', ...style }, children: children.filter((c) => c !== null && c !== false && c !== undefined).map((c) => (typeof c === 'number' ? String(c) : c)) } });
export const img = (src: string, w: number, hgt: number, style: Record<string, unknown> = {}): Nodo => ({ type: 'img', props: { src, width: w, height: hgt, style } });

/* ---------- Fotos oficiales ---------- */
/** Copia de las fotos oficiales en el repositorio (scripts/browser/fotos.js): congreso.es no las sirve al build. */
const FOTOS_REPO = join(process.cwd(), 'data', 'fotos');
const CACHE_FOTOS = join(process.cwd(), 'node_modules', '.cache', 'congreso-fotos');
const memoria = new Map<string, string | null>();
/**
 * Foto oficial: primero la copia de data/fotos; si falta (diputado nuevo), se intenta descargar una vez por build
 * (se guarda en node_modules/.cache). Si no hay foto, la tarjeta sale con las iniciales: el build nunca falla por una foto.
 */
export async function fotoDataUri(url: string): Promise<string | null> {
  if (memoria.has(url)) return memoria.get(url)!;
  const nombre = url.split('/').pop()!;
  const enRepo = join(FOTOS_REPO, nombre);
  const fichero = join(CACHE_FOTOS, nombre);
  let datos: Buffer | null = null;
  if (existsSync(enRepo)) datos = readFileSync(enRepo);
  else if (existsSync(fichero)) datos = readFileSync(fichero);
  else if (process.env.TARJETAS_SIN_FOTOS !== '1') {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(8000), headers: { 'User-Agent': 'CongresoAbierto (+https://github.com/MarcoAnarmo/CongresoAbierto)' } });
      if (r.ok && (r.headers.get('content-type') ?? '').startsWith('image/')) {
        datos = Buffer.from(await r.arrayBuffer());
        mkdirSync(CACHE_FOTOS, { recursive: true });
        writeFileSync(fichero, datos);
      }
    } catch { /* sin foto: se usan las iniciales */ }
  }
  const uri = datos ? `data:image/jpeg;base64,${datos.toString('base64')}` : null;
  memoria.set(url, uri);
  return uri;
}

export const iniciales = (nombre: string) => nombre.split(/\s+/).filter((p) => /^[A-ZÁÉÍÓÚÑ]/.test(p)).slice(0, 2).map((p) => p[0]).join('');

export function retrato(foto: string | null, nombre: string, w: number, hgt: number, color: string) {
  const marco = { width: w, height: hgt, borderRadius: Math.round(w * 0.1), border: `${Math.max(4, Math.round(w / 45))}px solid ${color}`, overflow: 'hidden', flexShrink: 0 };
  return foto
    ? h('div', marco, img(foto, w, hgt, { objectFit: 'cover' }))
    : h('div', { ...marco, background: C.chip, alignItems: 'center', justifyContent: 'center', fontSize: Math.round(w * 0.32), fontWeight: 800, color: C.apagado }, iniciales(nombre));
}

/* ---------- Piezas comunes ---------- */
export const cabecera = (escala = 1) =>
  h('div', { alignItems: 'center', gap: 16 * escala },
    img(LOGO_URI, 103 * escala, 50 * escala),
    h('div', { fontSize: 32 * escala, fontWeight: 800, letterSpacing: -0.5 }, 'Congreso Abierto'));

export const pie = (escala = 1, lang: Idioma = 'es') =>
  h('div', { flexDirection: escala > 1 ? 'column' : 'row', justifyContent: 'space-between', alignItems: escala > 1 ? 'flex-start' : 'center', gap: 6 * escala, fontSize: 24 * escala, color: C.apagado, borderTop: `${2 * escala}px solid ${C.borde}`, paddingTop: 22 * escala },
    h('div', {}, textos[lang].pie),
    h('div', { color: C.acento, fontWeight: 700 }, 'congresoabierto.org'));

/** Lienzo con los márgenes de cada formato. En historias se respeta la zona segura de Instagram (arriba y abajo). */
export const lienzo = (formato: Formato, ...hijos: Hijo[]) =>
  h('div', {
    width: FORMATOS[formato].ancho, height: FORMATOS[formato].alto, flexDirection: 'column', justifyContent: 'space-between',
    background: C.fondo, color: C.texto, fontFamily: 'Inter', borderTop: `14px solid ${C.naranja}`,
    padding: formato === 'historia' ? '200px 80px 230px' : '52px 64px',
  }, ...hijos);

export const cifra = (valor: string, etiqueta: string, destacada: boolean, escala = 1) =>
  h('div', {
    flexDirection: 'column', flex: 1, gap: 4 * escala, padding: `${20 * escala}px ${24 * escala}px`, borderRadius: 18 * escala,
    background: destacada ? C.acentoSuave : C.blanco, border: `${2 * escala}px solid ${destacada ? '#f7c9a6' : C.borde}`,
  },
    h('div', { fontSize: 52 * escala, fontWeight: 800, color: destacada ? C.acento : C.texto, letterSpacing: -1 }, valor),
    h('div', { fontSize: 22 * escala, color: C.apagado }, etiqueta));

/** Barra apilada de votos (sí, no, abstención, no vota). */
export function barraVotos(t: { si: number; no: number; abstencion: number; noVota: number }, alto: number, ancho: number) {
  const total = t.si + t.no + t.abstencion + t.noVota || 1;
  const tramo = (n: number, color: string) => (n > 0 ? h('div', { width: Math.round((ancho * n) / total), height: alto, background: color }) : null);
  return h('div', { width: ancho, height: alto, borderRadius: alto / 2, overflow: 'hidden', background: C.chip },
    tramo(t.si, C.si), tramo(t.no, C.no), tramo(t.abstencion, C.abs), tramo(t.noVota, C.novota));
}

export async function aPng(nodo: Nodo, formato: Formato) {
  const { ancho, alto } = FORMATOS[formato];
  const svg = await satori(nodo as any, { width: ancho, height: alto, fonts: cargarFuentes() });
  // satori ya convierte el texto en trazos: resvg no necesita fuentes. Sin cargar las del sistema, cada tarjeta tarda ~5 veces menos.
  return new Uint8Array(new Resvg(svg, { fitTo: { mode: 'width', value: ancho }, font: { loadSystemFonts: false } }).render().asPng());
}

export const respuestaPng = (png: Uint8Array) => new Response(png as unknown as BodyInit, { headers: { 'Content-Type': 'image/png' } });
