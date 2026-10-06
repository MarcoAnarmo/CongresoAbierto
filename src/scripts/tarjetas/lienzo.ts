/**
 * Dibujo de tarjetas en el navegador con la API de canvas, con el mismo diseño que las de la build
 * (colores y márgenes de src/lib/tarjetas/diseno.ts). Este módulo solo se descarga cuando alguien crea una tarjeta.
 */
import interNormal from '@fontsource/inter/files/inter-latin-400-normal.woff2?url';
import interBold from '@fontsource/inter/files/inter-latin-700-normal.woff2?url';
import interExtra from '@fontsource/inter/files/inter-latin-800-normal.woff2?url';
import { C, FORMATOS, MARGEN, FRANJA, LOGO, DOMINIO, type Formato } from '../../lib/tarjetas/diseno';
import { partirLineas } from '../../lib/tarjetas/votacion';

/** Nombre propio de la fuente: así cargarla no cambia la letra del resto de la página. */
const FUENTE = 'InterTarjeta';
let fuentes: Promise<void> | null = null;
export function cargarFuentes(): Promise<void> {
  return (fuentes ??= Promise.all(([[interNormal, '400'], [interBold, '700'], [interExtra, '800']] as const).map(async ([url, peso]) => {
    const f = new FontFace(FUENTE, `url(${url})`, { weight: peso });
    await f.load();
    document.fonts.add(f);
  })).then(() => undefined).catch((e) => { fuentes = null; throw e; }));
}

let logo: Promise<HTMLImageElement> | null = null;
export function cargarLogo(base: string): Promise<HTMLImageElement> {
  return (logo ??= new Promise((ok, mal) => {
    const img = new Image();
    img.onload = () => ok(img);
    img.onerror = () => { logo = null; mal(new Error('logo')); };
    img.src = `${base}/logo.svg`;
  }));
}

export type Peso = 400 | 700 | 800;

export class Lienzo {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly ancho: number;
  readonly alto: number;
  readonly m: { arriba: number; lados: number; abajo: number };

  constructor(readonly formato: Formato) {
    ({ ancho: this.ancho, alto: this.alto } = FORMATOS[formato]);
    this.m = MARGEN[formato];
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.ancho;
    this.canvas.height = this.alto;
    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.textBaseline = 'alphabetic';
    this.ctx.fillStyle = C.fondo;
    this.ctx.fillRect(0, 0, this.ancho, this.alto);
    this.ctx.fillStyle = C.naranja;
    this.ctx.fillRect(0, 0, this.ancho, FRANJA);
  }

  /** Ancho útil (sin márgenes laterales). */
  get util() { return this.ancho - 2 * this.m.lados; }

  fuente(tam: number, peso: Peso = 400) { this.ctx.font = `${peso} ${tam}px ${FUENTE}, system-ui, sans-serif`; }
  medir(s: string, tam: number, peso: Peso = 400) { this.fuente(tam, peso); return this.ctx.measureText(s).width; }

  /** Escribe una línea; `y` es la parte de arriba del texto. Devuelve su ancho. */
  texto(s: string, x: number, y: number, tam: number, peso: Peso = 400, color: string = C.texto, alinear: CanvasTextAlign = 'left') {
    this.fuente(tam, peso);
    this.ctx.fillStyle = color;
    this.ctx.textAlign = alinear;
    this.ctx.fillText(s, x, y + tam * 0.8);
    this.ctx.textAlign = 'left';
    return this.ctx.measureText(s).width;
  }

  /** Texto en varias líneas. Devuelve la altura ocupada. */
  parrafo(s: string, x: number, y: number, ancho: number, tam: number, o: { peso?: Peso; color?: string; maxLineas?: number; interlineado?: number } = {}) {
    const { peso = 400, color = C.texto, maxLineas = 20, interlineado = 1.3 } = o;
    const { lineas } = this.lineas(s, ancho, tam, peso, maxLineas);
    lineas.forEach((l, i) => this.texto(l, x, y + i * tam * interlineado, tam, peso, color));
    return lineas.length * tam * interlineado;
  }

  lineas(s: string, ancho: number, tam: number, peso: Peso, maxLineas: number) {
    this.fuente(tam, peso);
    return partirLineas(s, ancho, maxLineas, (t) => this.ctx.measureText(t).width);
  }

  rect(x: number, y: number, w: number, h: number, r: number, relleno?: string, borde?: string, grosor = 2) {
    const c = this.ctx;
    c.beginPath();
    c.roundRect(x, y, w, h, r);
    if (relleno) { c.fillStyle = relleno; c.fill(); }
    if (borde) { c.strokeStyle = borde; c.lineWidth = grosor; c.stroke(); }
  }

  punto(x: number, y: number, d: number, color: string) {
    this.ctx.beginPath();
    this.ctx.arc(x + d / 2, y + d / 2, d / 2, 0, Math.PI * 2);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  /** Pastilla de color con texto; devuelve su ancho. */
  pastilla(s: string, x: number, y: number, alto: number, tam: number, fondo: string, color = C.blanco, peso: Peso = 700) {
    const pad = Math.round(alto * 0.42);
    const w = this.medir(s, tam, peso) + 2 * pad;
    this.rect(x, y, w, alto, alto / 2, fondo);
    this.texto(s, x + pad, y + (alto - tam) / 2 - tam * 0.05, tam, peso, color);
    return w;
  }

  /** Barra partida en tramos (votos), con las puntas redondeadas. */
  barra(x: number, y: number, w: number, h: number, tramos: { valor: number; color: string }[]) {
    const total = tramos.reduce((a, t) => a + t.valor, 0) || 1;
    const c = this.ctx;
    c.save();
    c.beginPath();
    c.roundRect(x, y, w, h, h / 2);
    c.clip();
    c.fillStyle = C.chip;
    c.fillRect(x, y, w, h);
    let cx = x;
    for (const t of tramos) {
      if (!t.valor) continue;
      const tw = (w * t.valor) / total;
      c.fillStyle = t.color;
      c.fillRect(cx, y, Math.max(0, tw - 3), h);
      cx += tw;
    }
    c.restore();
  }

  /** Cabecera: logo, nombre y dominio. Devuelve la altura. */
  cabecera(logoImg: HTMLImageElement | null, escala = 1) {
    const x = this.m.lados, y = this.m.arriba;
    const lw = LOGO.ancho * escala, lh = LOGO.alto * escala;
    if (logoImg) this.ctx.drawImage(logoImg, x, y, lw, lh);
    this.texto('Congreso Abierto', x + lw + 16 * escala, y + (lh - 32 * escala) / 2, 32 * escala, 800);
    this.texto(DOMINIO, this.ancho - this.m.lados, y + (lh - 26 * escala) / 2, 26 * escala, 700, C.acento, 'right');
    return lh;
  }

  /** Etiqueta naranja de las elecciones. Devuelve la altura (0 si no hay). */
  elecciones(texto: string | null, y: number, escala = 1) {
    if (!texto) return 0;
    const h = 52 * escala, tam = 26 * escala, pad = 24 * escala, d = 12 * escala;
    const w = this.medir(texto, tam, 700) + 2 * pad + d + 12 * escala;
    this.rect(this.m.lados, y, w, h, h / 2, C.naranja);
    this.punto(this.m.lados + pad, y + (h - d) / 2, d, C.blanco);
    this.texto(texto, this.m.lados + pad + d + 12 * escala, y + (h - tam) / 2 - tam * 0.05, tam, 700, C.blanco);
    return h;
  }

  /** Pie con la fuente y la dirección, pegado abajo. Devuelve dónde empieza (y). */
  pie(fuente: string, ruta: string) {
    const enFila = this.formato === 'horizontal';
    const tam = enFila ? 20 : 24;
    const alto = enFila ? 22 + tam * 1.3 : 22 + 2 * tam * 1.3 + 6;
    const y = this.alto - this.m.abajo - alto;
    this.ctx.fillStyle = C.borde;
    this.ctx.fillRect(this.m.lados, y, this.util, 2);
    const dir = `${DOMINIO}${ruta}`;
    if (enFila) {
      this.texto(fuente, this.m.lados, y + 22, tam, 400, C.apagado);
      this.texto(dir, this.ancho - this.m.lados, y + 22, tam, 700, C.acento, 'right');
    } else {
      this.texto(fuente, this.m.lados, y + 22, tam, 400, C.apagado);
      this.texto(dir, this.m.lados, y + 22 + tam * 1.3 + 6, tam, 700, C.acento);
    }
    return y;
  }

  png(): Promise<Blob> {
    return new Promise((ok, mal) => this.canvas.toBlob((b) => (b ? ok(b) : mal(new Error('png'))), 'image/png'));
  }
}
