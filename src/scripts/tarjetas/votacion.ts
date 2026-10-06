/**
 * Tarjetas de votaciones creadas en el navegador, para cualquier votación del Pleno:
 *  - «una votación»: qué se votó, quién lo propuso, el resultado y cuántos diputados de cada grupo votaron sí, no o abstención;
 *  - «comparación»: hasta 7 votaciones, con el voto de la mayoría de cada grupo en cada una.
 * Cada una en formato historia (1080×1920) y horizontal (1200×630). Diseño: Congreso Abierto · Tarjetas de estadísticas.
 */
import type { ItemVotacion } from '../../lib/votaciones';
import { C } from '../../lib/tarjetas/diseno';
import { origen, tituloSinFormula } from '../../lib/tarjetas/votacion';
import { votoMayoritario, type Posicion } from '../../lib/datos/derivados';
import type textosTarjeta from '../../i18n/textos/tarjeta-votacion';
import { f, pl } from '../../i18n/cliente';
import { Lienzo, cargarFuentes, cargarLogo } from './lienzo';

export type TextosTarjeta = (typeof textosTarjeta)['es'];
export interface ConfigTarjeta {
  tx: TextosTarjeta;
  /** Base de la web (para el logo) y textos comunes de las tarjetas. */
  base: string;
  pie: string;
  elecciones: string | null;
  colores: Record<string, string>;
  /** Grupos en el orden del hemiciclo. */
  grupos: string[];
  /** Resultado oficial → texto en el idioma de la página. */
  resultados: Record<string, string>;
  /** Rótulos cortos de las votaciones clave (con palabras de su título oficial). */
  rotulos: Record<string, { corto: string; quien: string }>;
  fecha: (iso: string) => string;
  /** Fecha corta (29/11/2026), para las filas de la comparación. */
  fechaCorta: (iso: string) => string;
}

const favorable = (r: string) => /Aprobad|Convalidad/.test(r);
const lista = (xs: string[], y: string) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} ${y} ${xs[xs.length - 1]}`);

/** Quién lo propuso, en el idioma de la página («Propuesta de SUMAR», «Decreto ley del Gobierno»…). */
export function quien(i: ItemVotacion, cfg: ConfigTarjeta): string {
  const r = cfg.rotulos[i.id];
  if (r) return r.quien;
  const o = origen(i.t, i.k);
  const tx = cfg.tx;
  if (o.tipo === 'decreto') return tx.decreto;
  if (o.tipo === 'proyecto') return tx.proyecto;
  if (o.tipo === 'grupos') return f({ pl: tx.propuesta, pnl: tx.pnl, mocion: tx.mocion, enmienda: tx.enmienda }[o.clase], { quien: lista(o.grupos, tx.y) });
  return i.tp.replace(/\.\s*$/, '');
}
/** Título de la tarjeta: el rótulo curado o el título oficial sin su fórmula inicial (literal). */
const titulo = (i: ItemVotacion, cfg: ConfigTarjeta) => cfg.rotulos[i.id]?.corto ?? tituloSinFormula(i.t);

const COLOR: Record<Posicion, string> = { 'Sí': C.si, 'No': C.no, 'Abstención': C.abs, 'Empate': C.novota };
const nombreCorto = (g: string) => (g === 'EH Bildu' ? 'Bildu' : g);

async function preparar(cfg: ConfigTarjeta) {
  const [, logo] = await Promise.all([cargarFuentes(), cargarLogo(cfg.base).catch(() => null)]);
  return logo;
}

/** Busca el tamaño de letra más grande con el que el texto cabe en `alto`; si no cabe ni con el menor, se corta con «…». */
function ajustar(l: Lienzo, s: string, ancho: number, alto: number, tamanos: number[], peso: 700 | 800 = 800, interlineado = 1.08) {
  for (const t of tamanos) {
    const max = Math.max(1, Math.floor(alto / (t * interlineado)));
    const r = l.lineas(s, ancho, t, peso, max);
    if (!r.cortado) return { tam: t, lineas: r.lineas };
  }
  const t = tamanos[tamanos.length - 1];
  return { tam: t, lineas: l.lineas(s, ancho, t, peso, Math.max(1, Math.floor(alto / (t * interlineado)))).lineas };
}

/* ======================= Una votación ======================= */

interface Columna { clave: 'si' | 'no' | 'abstencion'; color: string; textoColor: string; total: number; grupos: [string, number][] }
function columnas(i: ItemVotacion, cfg: ConfigTarjeta): Columna[] {
  const g = i.g ?? [];
  const col = (k: Columna['clave'], idx: 1 | 2 | 3, color: string, textoColor: string, total: number): Columna => ({
    clave: k, color, textoColor, total,
    grupos: g.filter((x) => x[idx] > 0).map((x) => [x[0], x[idx]] as [string, number]).sort((a, b) => b[1] - a[1] || cfg.grupos.indexOf(a[0]) - cfg.grupos.indexOf(b[0])),
  });
  return [col('si', 1, C.si, C.blanco, i.to[0]), col('no', 2, C.no, C.blanco, i.to[1]), col('abstencion', 3, C.abs, C.texto, i.to[2])].filter((c) => c.total > 0 || c.clave !== 'abstencion');
}

function notaVotaron(i: ItemVotacion, cfg: ConfigTarjeta) {
  const v = i.to[0] + i.to[1] + i.to[2];
  return i.to[3] ? f(cfg.tx.votaron, { v, nv: i.to[3] }) : f(cfg.tx.votaronTodos, { v });
}

function dibujarMedidaHistoria(i: ItemVotacion, cfg: ConfigTarjeta, logo: HTMLImageElement | null) {
  const l = new Lienzo('historia');
  const { tx } = cfg;
  const x = l.m.lados, w = l.util;
  let y = l.m.arriba + l.cabecera(logo) + 28;
  const he = l.elecciones(cfg.elecciones, y);
  if (he) y += he + 28;
  const pieY = l.pie(cfg.pie, '/votaciones');

  // Resultado y quién lo propuso
  const res = cfg.resultados[i.r] ?? i.r;
  const pw = l.pastilla(res, x, y, 44, 24, favorable(i.r) ? C.si : C.no);
  const meta = `${quien(i, cfg)} · ${cfg.fecha(i.f)}`;
  const hm = l.parrafo(meta, x + pw + 16, y + 6, w - pw - 16, 26, { color: C.apagado, maxLineas: 2, interlineado: 1.3 });
  y += Math.max(44, hm) + 26;

  // Lo que se vota (abajo, de abajo arriba: nota, tarjeta con los grupos)
  const cols = columnas(i, cfg);
  const filas = Math.max(1, ...cols.map((c) => c.grupos.length));
  const altoTarjeta = 34 + 26 + 26 + 132 + 14 + filas * 44 + 26;
  const nota = notaVotaron(i, cfg);
  const altoNota = l.lineas(nota, w, 22, 400, 4).lineas.length * 22 * 1.4;
  const libre = pieY - 34 - y;

  // Título: rótulo curado (con el título oficial debajo) o título oficial
  const curado = !!cfg.rotulos[i.id];
  const sub = curado ? `${tx.tituloOficial}: «${tituloSinFormula(i.t)}»` : i.d ?? '';
  const altoSub = sub ? Math.min(3, l.lineas(sub, w, 26, 400, 3).lineas.length) * 26 * 1.35 + 18 : 0;
  const resto = 36 + altoTarjeta + 24 + altoNota;
  const { tam, lineas } = ajustar(l, `«${titulo(i, cfg)}»`, w, libre - resto - altoSub, curado ? [84, 76, 68, 60] : [72, 64, 56, 50, 44, 40]);
  // El bloque (título, tarjeta y nota) va centrado en el espacio libre
  const altoBloque = lineas.length * tam * 1.08 + altoSub + resto;
  y += Math.max(0, (libre - altoBloque) / 2);
  lineas.forEach((s, k) => l.texto(s, x, y + k * tam * 1.08, tam, 800));
  y += lineas.length * tam * 1.08 + 18;
  if (sub) l.parrafo(sub, x, y, w, 26, { color: C.apagado, maxLineas: 3, interlineado: 1.35 });
  const yTarjeta = y - 18 + altoSub + 36;

  // Tarjeta blanca: barra de totales y una columna por voto
  const ty = yTarjeta, pad = 32;
  l.rect(x, ty, w, altoTarjeta, 24, C.blanco, C.borde);
  l.barra(x + pad, ty + 34, w - 2 * pad, 26, [{ valor: i.to[0], color: C.si }, { valor: i.to[1], color: C.no }, { valor: i.to[2], color: C.abs }, { valor: i.to[3], color: C.novota }]);
  const gap = 22, cw = (w - 2 * pad - gap * (cols.length - 1)) / cols.length;
  cols.forEach((c, k) => {
    const cx = x + pad + k * (cw + gap), cy = ty + 34 + 26 + 26;
    l.rect(cx, cy, cw, 132, 18, c.color);
    l.texto(tx[c.clave], cx + 22, cy + 16, 30, 800, c.textoColor);
    l.texto(String(c.total), cx + 22, cy + 56, 64, 800, c.textoColor);
    c.grupos.forEach(([g, n], j) => {
      const ry = cy + 132 + 14 + j * 44;
      l.punto(cx + 2, ry + 9, 16, cfg.colores[g] ?? C.novota);
      l.texto(g, cx + 28, ry, 26, 700);
      l.texto(String(n), cx + cw - 2, ry, 26, 400, C.apagado, 'right');
    });
  });
  l.parrafo(nota, x, ty + altoTarjeta + 24, w, 22, { color: C.apagado, maxLineas: 4, interlineado: 1.4 });
  return l.png();
}

function dibujarMedidaHorizontal(i: ItemVotacion, cfg: ConfigTarjeta, logo: HTMLImageElement | null) {
  const l = new Lienzo('horizontal');
  const { tx } = cfg;
  const x = l.m.lados;
  const top = l.m.arriba + l.cabecera(logo, 0.8) + 26;
  const pieY = l.pie(cfg.pie, '/votaciones');
  const izq = 500, der = l.util - izq - 40, xd = x + izq + 40;

  // Izquierda: resultado, quién y título
  const res = cfg.resultados[i.r] ?? i.r;
  const pw = l.pastilla(res, x, top, 34, 18, favorable(i.r) ? C.si : C.no);
  l.parrafo(`${quien(i, cfg)} · ${cfg.fecha(i.f)}`, x + pw + 12, top + 6, izq - pw - 12, 18, { color: C.apagado, maxLineas: 2 });
  const ty = top + 34 + 22;
  const { tam, lineas } = ajustar(l, `«${titulo(i, cfg)}»`, izq, pieY - 24 - ty, cfg.rotulos[i.id] ? [52, 46, 40] : [44, 38, 34, 30, 26]);
  lineas.forEach((s, k) => l.texto(s, x, ty + k * tam * 1.08, tam, 800));

  // Derecha: totales y grupos
  l.barra(xd, top + 4, der, 18, [{ valor: i.to[0], color: C.si }, { valor: i.to[1], color: C.no }, { valor: i.to[2], color: C.abs }, { valor: i.to[3], color: C.novota }]);
  const cols = columnas(i, cfg);
  const gap = 14, cw = (der - gap * (cols.length - 1)) / cols.length;
  const filas = Math.max(1, ...cols.map((c) => c.grupos.length));
  const fila = Math.min(30, (pieY - 20 - (top + 40 + 76 + 8)) / filas);
  cols.forEach((c, k) => {
    const cx = xd + k * (cw + gap), cy = top + 40;
    l.rect(cx, cy, cw, 76, 14, c.color);
    l.texto(tx[c.clave], cx + 14, cy + 10, 18, 800, c.textoColor);
    l.texto(String(c.total), cx + 14, cy + 32, 36, 800, c.textoColor);
    c.grupos.forEach(([g, n], j) => {
      const ry = cy + 76 + 8 + j * fila;
      const t = Math.min(19, fila * 0.66);
      l.punto(cx + 2, ry + t * 0.28, t * 0.6, cfg.colores[g] ?? C.novota);
      l.texto(g, cx + 2 + t * 0.6 + 8, ry, t, 700);
      l.texto(String(n), cx + cw - 2, ry, t, 400, C.apagado, 'right');
    });
  });
  return l.png();
}

/* ======================= Comparación ======================= */

function dibujarComparacionHistoria(items: ItemVotacion[], cfg: ConfigTarjeta, logo: HTMLImageElement | null) {
  const l = new Lienzo('historia');
  const { tx } = cfg;
  const x = l.m.lados, w = l.util;
  let y = l.m.arriba + l.cabecera(logo) + 28;
  const he = l.elecciones(cfg.elecciones, y);
  if (he) y += he + 28;
  const pieY = l.pie(cfg.pie, '/votaciones');
  // El título cabe en una o dos líneas según el idioma («Talde bakoitzak zer bozkatu zuen»)
  const enUna = [76, 66, 58].find((t) => l.medir(tx.queVoto, t, 800) <= w);
  const tt2 = enUna ? { tam: enUna, lineas: [tx.queVoto] } : ajustar(l, tx.queVoto, w, 2 * 64 * 1.08, [64, 56]);
  tt2.lineas.forEach((s, k) => l.texto(s, x, y + k * tt2.tam * 1.08, tt2.tam, 800));
  y += tt2.lineas.length * tt2.tam * 1.08 + 14;
  y += l.parrafo(pl(items.length, tx.compSub), x, y, w, 30, { color: C.apagado, maxLineas: 2, interlineado: 1.3 }) + 30;

  // Tabla: una fila por votación, una columna por grupo
  const padX = 22, cw = 54, nG = cfg.grupos.length;
  const etiqueta = w - 2 * padX - nG * cw - 10;
  const cabecera = 62;
  const disponible = pieY - 36 - y - cabecera - 24;
  // Cuántas líneas de título caben por fila: se prueba de más a menos (y con letra algo menor antes de quitar líneas)
  let tamT = 25;
  const altoFila = (n: number) => 18 + n * tamT * 1.16 + 6 + 20 + 18;
  const lineasDe = (it: ItemVotacion, m: number) => l.lineas(`«${titulo(it, cfg)}»`, etiqueta, tamT, 800, m).lineas;
  let maxL = 1;
  for (const [m, t] of [[4, 25], [3, 25], [3, 22], [2, 22], [2, 20], [1, 20]] as const) {
    tamT = t; maxL = m;
    if (items.reduce((a, it) => a + altoFila(lineasDe(it, m).length), 0) <= disponible) break;
  }
  const filas = items.map((it) => ({ it, lineas: lineasDe(it, maxL) }));
  const altoTabla = cabecera + filas.reduce((a, r) => a + altoFila(r.lineas.length), 0) + 16;
  // La tabla va centrada en el espacio que queda
  y += Math.max(0, (pieY - 36 - y - altoTabla) / 2);
  l.rect(x, y, w, altoTabla, 24, C.blanco, C.borde);

  // Cabecera de grupos
  const x0 = x + w - padX - nG * cw;
  cfg.grupos.forEach((g, k) => {
    const cx = x0 + k * cw + cw / 2;
    l.punto(cx - 8, y + 18, 16, cfg.colores[g] ?? C.novota);
    l.texto(nombreCorto(g), cx, y + 40, 14, 700, C.apagado, 'center');
  });
  let ry = y + cabecera;
  l.ctx.fillStyle = C.borde;
  l.ctx.fillRect(x + padX, ry, w - 2 * padX, 2);
  for (const { it, lineas } of filas) {
    const h = altoFila(lineas.length);
    const cy = ry + 18;
    lineas.forEach((s, k) => l.texto(s, x + padX, cy + k * tamT * 1.16, tamT, 800));
    const my = cy + lineas.length * tamT * 1.16 + 6;
    const res = cfg.resultados[it.r] ?? it.r;
    const meta = `${quien(it, cfg)} · ${cfg.fechaCorta(it.f)}`;
    const ml = l.lineas(meta, etiqueta - l.medir(res, 16, 700) - 34, 18, 400, 1).lineas[0] ?? '';
    const mw = l.texto(ml, x + padX, my, 18, 400, C.apagado);
    l.pastilla(res, x + padX + mw + 10, my - 3, 26, 16, favorable(it.r) ? C.si : C.no);
    // Voto de la mayoría de cada grupo
    const porGrupo = new Map((it.g ?? []).map((r) => [r[0], votoMayoritario(r[1], r[2], r[3])]));
    cfg.grupos.forEach((g, k) => {
      const p = porGrupo.get(g);
      if (!p) return;
      const cx = x0 + k * cw + (cw - 48) / 2, cyc = ry + (h - 40) / 2;
      l.rect(cx, cyc, 48, 40, 10, COLOR[p]);
      const et = p === 'Sí' ? tx.si : p === 'No' ? tx.no : p === 'Abstención' ? tx.abst : tx.empate.slice(0, 4) + '.';
      const tam = l.medir(et, 19, 800) > 42 ? 14 : p === 'Abstención' ? 16 : 19;
      l.texto(et, cx + 24, cyc + (40 - tam) / 2 - tam * 0.05, tam, 800, p === 'Abstención' ? C.texto : C.blanco, 'center');
    });
    ry += h;
    l.ctx.fillStyle = C.borde;
    l.ctx.fillRect(x + padX, ry, w - 2 * padX, 2);
  }
  return l.png();
}

function dibujarComparacionHorizontal(items: ItemVotacion[], cfg: ConfigTarjeta, logo: HTMLImageElement | null) {
  const l = new Lienzo('horizontal');
  const { tx } = cfg;
  const x = l.m.lados, w = l.util;
  const top = l.m.arriba + l.cabecera(logo, 0.8) + 20;
  const pieY = l.pie(cfg.pie, '/votaciones');
  const nG = cfg.grupos.length, cw = 56, x0 = x + w - nG * cw;
  const tamTit = [34, 30, 26, 22].find((t) => l.medir(tx.queVoto, t, 800) <= x0 - x - 16) ?? 22;
  l.texto(tx.queVoto, x, top + (34 - tamTit) / 2, tamTit, 800);
  cfg.grupos.forEach((g, k) => {
    const cx = x0 + k * cw + cw / 2;
    l.punto(cx - 6, top + 2, 12, cfg.colores[g] ?? C.novota);
    l.texto(nombreCorto(g), cx, top + 20, 13, 700, C.apagado, 'center');
  });
  const y0 = top + 46;
  const fila = Math.min(56, (pieY - 16 - y0) / items.length);
  const etiqueta = x0 - x - 16;
  items.forEach((it, j) => {
    const ry = y0 + j * fila;
    l.ctx.fillStyle = C.borde;
    l.ctx.fillRect(x, ry, w, 1.5);
    const tamT = Math.min(20, fila * 0.38);
    l.texto(l.lineas(`«${titulo(it, cfg)}»`, etiqueta, tamT, 800, 1).lineas[0] ?? '', x, ry + fila * 0.14, tamT, 800);
    const meta = `${quien(it, cfg)} · ${cfg.fechaCorta(it.f)} · ${cfg.resultados[it.r] ?? it.r}`;
    l.texto(l.lineas(meta, etiqueta, tamT * 0.75, 400, 1).lineas[0] ?? '', x, ry + fila * 0.14 + tamT * 1.25, tamT * 0.75, 400, C.apagado);
    const porGrupo = new Map((it.g ?? []).map((r) => [r[0], votoMayoritario(r[1], r[2], r[3])]));
    cfg.grupos.forEach((g, k) => {
      const p = porGrupo.get(g);
      if (!p) return;
      const ch = Math.min(32, fila - 14), cwc = 46;
      const cx = x0 + k * cw + (cw - cwc) / 2, cy = ry + (fila - ch) / 2;
      l.rect(cx, cy, cwc, ch, 8, COLOR[p]);
      const et = p === 'Sí' ? tx.si : p === 'No' ? tx.no : p === 'Abstención' ? tx.abst : tx.empate.slice(0, 4) + '.';
      const tam = l.medir(et, 15, 800) > 40 ? 12 : 15;
      l.texto(et, cx + cwc / 2, cy + (ch - tam) / 2 - tam * 0.05, tam, 800, p === 'Abstención' ? C.texto : C.blanco, 'center');
    });
  });
  return l.png();
}

/* ======================= Entrada ======================= */

export interface Tarjeta { historia: Blob; horizontal: Blob }

export async function tarjetaVotacion(i: ItemVotacion, cfg: ConfigTarjeta): Promise<Tarjeta> {
  const logo = await preparar(cfg);
  const [historia, horizontal] = await Promise.all([dibujarMedidaHistoria(i, cfg, logo), dibujarMedidaHorizontal(i, cfg, logo)]);
  return { historia, horizontal };
}

export async function tarjetaComparacion(items: ItemVotacion[], cfg: ConfigTarjeta): Promise<Tarjeta> {
  const logo = await preparar(cfg);
  const [historia, horizontal] = await Promise.all([dibujarComparacionHistoria(items, cfg, logo), dibujarComparacionHorizontal(items, cfg, logo)]);
  return { historia, horizontal };
}
