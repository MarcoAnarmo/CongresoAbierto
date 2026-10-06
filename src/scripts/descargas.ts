/**
 * Página Datos: asistente de cuatro pasos para elegir tabla, filtrar, elegir columnas y descargar CSV, todo en el
 * navegador (la web es estática). Se ve un paso cada vez; el paso va en la dirección y en el historial, así que el
 * botón «atrás» del navegador vuelve al paso anterior.
 *
 * Cada tabla se recorre fila a fila sin copiarla entera: así contar, ver las primeras filas o descargar
 * 700.000 votos no llena la memoria del móvil. Las tablas anuales (votos) solo descargan los años que pide el filtro.
 * El estado (tabla, filtros, columnas y formato) va en la dirección, para poder compartir una descarga concreta.
 */
import { TABLAS, SEP_LISTA, rutaTabla, type Celda, type DefTabla, type FicheroTabla } from '../lib/datos/tablas';
import { celdaCsv, type FormatoCsv } from '../lib/datos/csv';
import { pasoInicial, mover, filtrosAplicados, quitarFiltro, TOTAL_PASOS, type Paso, type Aplicado } from '../lib/datos/asistente';
import { sinTildes } from '../lib/texto';
import { f, pl, fmtNum } from '../i18n/cliente';

interface Config {
  base: string;
  filas: Record<string, number>;
  anios: number[];
  /** Orden de los grupos (hemiciclo) y de los temas, y nombres para mostrar. */
  grupos: string[];
  temas: Record<string, string>;
  tx: Record<string, string>;
  plFilas: [string, string];
  /** Nombre de cada paso del asistente. */
  pasos: string[];
  nombresColumnas: Record<string, string>;
  nombresTablas: Record<string, string>;
  nombresFiltros: Record<string, string>;
}
const cfg = JSON.parse(document.getElementById('datos-config')!.textContent!) as Config;
const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const norm = (s: string) => sinTildes(s).toLowerCase();

// ---------- Estado ----------
type Estado = { tabla: DefTabla; valores: Record<string, string[]>; desde: string; hasta: string; texto: string; columnas: string[]; formato: FormatoCsv };
const params = new URLSearchParams(location.search);
const defecto = (t: DefTabla) => t.columnas.filter((c) => c.defecto).map((c) => c.id);
function leerEstado(): Estado {
  const tabla = TABLAS.find((t) => t.id === params.get('tabla')) ?? TABLAS[0];
  const valores: Record<string, string[]> = {};
  for (const fi of tabla.filtros) if (fi.tipo === 'valores' && params.get(fi.id)) valores[fi.id] = params.get(fi.id)!.split(',').filter(Boolean);
  const cols = (params.get('cols') ?? '').split(',').filter((c) => tabla.columnas.some((x) => x.id === c));
  return {
    tabla, valores, desde: params.get('desde') ?? '', hasta: params.get('hasta') ?? '', texto: params.get('buscar') ?? '',
    columnas: cols.length ? cols : defecto(tabla), formato: params.get('formato') === 'csv' ? 'csv' : 'excel',
  };
}
let e = leerEstado();
let paso: Paso = pasoInicial(params);
function direccion(p0: Paso = paso) {
  const p = new URLSearchParams();
  p.set('paso', String(p0));
  p.set('tabla', e.tabla.id);
  for (const [k, v] of Object.entries(e.valores)) if (v.length) p.set(k, v.join(','));
  if (e.desde) p.set('desde', e.desde);
  if (e.hasta) p.set('hasta', e.hasta);
  if (e.texto) p.set('buscar', e.texto);
  if (e.columnas.join(',') !== defecto(e.tabla).join(',')) p.set('cols', e.columnas.join(','));
  if (e.formato === 'csv') p.set('formato', 'csv');
  return `${location.pathname}?${p}${location.hash}`;
}
const guardarEstado = () => history.replaceState(history.state, '', direccion());

// ---------- Datos: carga y recorrido ----------
const cache = new Map<string, Promise<unknown>>();
const cargar = <T>(ruta: string) => {
  if (!cache.has(ruta)) cache.set(ruta, fetch(cfg.base + ruta).then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); }).catch((err) => { cache.delete(ruta); throw err; }));
  return cache.get(ruta) as Promise<T>;
};

/** Una fuente sabe recorrer sus filas ya filtradas, como objetos {columna: valor}. */
type Fila = Record<string, Celda>;
type Recorrer = (visita: (fila: Fila) => boolean | void) => void;

/** Comprueba los filtros de la tabla en una fila (las columnas que no estén en la fila no filtran). */
function pasa(fila: Fila, t: DefTabla): boolean {
  for (const fi of t.filtros) {
    if (fi.tipo === 'valores') {
      const sel = e.valores[fi.id];
      if (!sel?.length || !(fi.columna in fila)) continue;
      const v = fila[fi.columna];
      const vs = v === null ? [] : typeof v === 'string' && t.columnas.find((c) => c.id === fi.columna)?.tipo === 'lista' ? v.split(SEP_LISTA) : [String(v)];
      if (!vs.some((x) => sel.includes(x))) return false;
    } else if (fi.tipo === 'fechas') {
      const v = fila[fi.columna] as string | null;
      if (v === undefined) continue;
      if (e.desde && (!v || v < e.desde)) return false;
      if (e.hasta && (!v || v > e.hasta)) return false;
    } else if (e.texto && fi.columnas.some((c) => c in fila)) {
      const q = norm(e.texto);
      if (!fi.columnas.some((c) => typeof fila[c] === 'string' && norm(fila[c] as string).includes(q))) return false;
    }
  }
  return true;
}

async function fuenteUnica(t: DefTabla): Promise<Recorrer> {
  const fich = await cargar<FicheroTabla>(rutaTabla(t));
  return (visita) => {
    for (const r of fich.filas) {
      const fila: Fila = {};
      fich.columnas.forEach((c, i) => { fila[c] = r[i]; });
      if (pasa(fila, t) && visita(fila) === false) return;
    }
  };
}

/** Votos nominales: votaciones de los años del filtro × diputados de la tabla de diputados. */
const LETRA: Record<string, string> = { S: 'Sí', N: 'No', A: 'Abstención', X: 'No vota' };
type VotosAnio = { votaciones: [string, string, string, Record<string, string>][] };
async function fuenteVotos(t: DefTabla): Promise<Recorrer> {
  const anios = cfg.anios.filter((y) => (!e.desde || String(y) >= e.desde.slice(0, 4)) && (!e.hasta || String(y) <= e.hasta.slice(0, 4)));
  const [dips, ...porAnio] = await Promise.all([cargar<FicheroTabla>(rutaTabla(TABLAS.find((x) => x.id === 'diputados')!)), ...anios.map((y) => cargar<VotosAnio>(rutaTabla(t, y)))]);
  const col = (c: string) => dips.columnas.indexOf(c);
  const [iId, iN, iA, iG, iC] = ['id', 'nombre', 'apellidos', 'grupo', 'circunscripcion'].map(col);
  const porCod = new Map(dips.filas.map((r) => [String(r[iId]), { diputado_id: r[iId], diputado: `${r[iN]} ${r[iA]}`, grupo: r[iG], circunscripcion: r[iC] }]));
  // Las votaciones más recientes primero, como en el resto de la web
  const votaciones = porAnio.flatMap((x) => x.votaciones).sort((a, b) => b[1].localeCompare(a[1]) || b[0].localeCompare(a[0], undefined, { numeric: true }));
  return (visita) => {
    for (const [id, fecha, temas, votos] of votaciones) {
      const cab: Fila = { votacion_id: id, fecha, temas: temas || null };
      if (!pasa(cab, t)) continue;
      for (const [l, cods] of Object.entries(votos)) {
        for (const cod of cods.split(' ')) {
          const d = porCod.get(cod);
          if (!d) continue;
          const fila: Fila = { ...cab, ...d, voto: LETRA[l] ?? l };
          if (pasa(fila, t) && visita(fila) === false) return;
        }
      }
    }
  };
}
const fuente = (t: DefTabla) => (t.particion === 'anual' ? fuenteVotos(t) : fuenteUnica(t));

// ---------- Filtros ----------
const nombreValor = (fi: string, v: string) =>
  fi === 'temas' ? cfg.temas[v] ?? v
  : v === 'true' ? cfg.tx.verdadero : v === 'false' ? cfg.tx.falso
  : fi === 'genero' ? (v === 'F' ? cfg.tx.mujer : v === 'M' ? cfg.tx.hombre : v)
  : fi === 'titular' ? (cfg.tx[v] ?? v)
  : v;

/** Valores posibles de un filtro: de los datos cargados, en un orden útil (grupos como en el hemiciclo, temas como en la web). */
async function opciones(t: DefTabla, columna: string, filtro: string): Promise<string[]> {
  if (filtro === 'temas') return Object.keys(cfg.temas);
  if (filtro === 'voto') return ['Sí', 'No', 'Abstención', 'No vota'];
  const origen = t.particion === 'anual' ? TABLAS.find((x) => x.id === 'diputados')! : t;
  const fich = await cargar<FicheroTabla>(rutaTabla(origen));
  const i = fich.columnas.indexOf(columna);
  const vs = [...new Set(fich.filas.map((r) => r[i]).filter((v) => v !== null).map(String))];
  if (columna === 'grupo') return vs.sort((a, b) => (cfg.grupos.indexOf(a) + 1 || 99) - (cfg.grupos.indexOf(b) + 1 || 99) || a.localeCompare(b, 'es'));
  return vs.sort((a, b) => a.localeCompare(b, 'es'));
}

const cajaFiltros = $('d-filtros');
async function pintarFiltros() {
  const t = e.tabla;
  const partes = await Promise.all(t.filtros.map(async (fi) => {
    const nombre = cfg.nombresFiltros[fi.id] ?? fi.id;
    if (fi.tipo === 'texto') {
      return `<label class="f-texto"><span>${esc(nombre)}</span><input type="search" data-f-texto value="${esc(e.texto)}" placeholder="${esc(cfg.tx.buscar)}" autocomplete="off" /></label>`;
    }
    if (fi.tipo === 'fechas') {
      return `<fieldset class="f-fechas"><legend>${esc(nombre)}</legend>`
        + `<label><span>${esc(cfg.tx.desde)}</span><input type="date" data-f-desde value="${esc(e.desde)}" min="2023-01-01" /></label>`
        + `<label><span>${esc(cfg.tx.hasta)}</span><input type="date" data-f-hasta value="${esc(e.hasta)}" min="2023-01-01" /></label></fieldset>`;
    }
    const ops = await opciones(t, fi.columna, fi.id);
    const sel = e.valores[fi.id] ?? [];
    const resumen = sel.length ? sel.map((v) => nombreValor(fi.id, v)).join(', ') : cfg.tx.todos;
    return `<details class="f-valores${sel.length ? ' con-valor' : ''}" data-f="${esc(fi.id)}"><summary><span class="f-nombre">${esc(nombre)}</span><span class="f-resumen">${esc(resumen)}</span></summary>`
      + `<div class="f-chips">${ops.map((v) => `<label class="chip"><input type="checkbox" value="${esc(v)}" ${sel.includes(v) ? 'checked' : ''} /><span>${esc(nombreValor(fi.id, v))}</span></label>`).join('')}</div></details>`;
  }));
  cajaFiltros.innerHTML = partes.join('');
  pintarAplicados();
}
/** Filtros aplicados, como chips que se quitan al pulsarlos (paso 2), y su resumen (panel «Tu descarga»). */
let aplicados: Aplicado[] = [];
function pintarAplicados() {
  aplicados = filtrosAplicados(e, e.tabla.filtros, (id) => cfg.nombresFiltros[id] ?? id, nombreValor, { desde: cfg.tx.desde, hasta: cfg.tx.hasta });
  $('d-aplicados').hidden = !aplicados.length;
  $('d-aplicados').querySelector('ul')!.innerHTML = aplicados.map((a, i) => `<li><button type="button" data-quitar="${i}" aria-label="${esc(f(cfg.tx.quitarFiltro, { nombre: a.texto }))}">${esc(a.texto)}<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M7 7l10 10M17 7 7 17"/></svg></button></li>`).join('');
  $('d-r-2').textContent = aplicados.length ? aplicados.map((a) => a.texto).join(' · ') : cfg.tx.sinFiltros;
}
$('d-aplicados').addEventListener('click', (ev) => {
  const b = (ev.target as Element).closest<HTMLElement>('[data-quitar]');
  if (!b) return;
  e = quitarFiltro(e, aplicados[Number(b.dataset.quitar)]);
  pintarFiltros();
  cambio();
});
const hayFiltros = () => Object.values(e.valores).some((v) => v.length) || !!e.desde || !!e.hasta || !!e.texto;

cajaFiltros.addEventListener('change', (ev) => {
  const el = ev.target as HTMLInputElement;
  const det = el.closest<HTMLElement>('[data-f]');
  if (det) {
    e.valores[det.dataset.f!] = [...det.querySelectorAll<HTMLInputElement>('input:checked')].map((x) => x.value);
    const sel = e.valores[det.dataset.f!];
    det.querySelector('.f-resumen')!.textContent = sel.length ? sel.map((v) => nombreValor(det.dataset.f!, v)).join(', ') : cfg.tx.todos;
    det.classList.toggle('con-valor', sel.length > 0);
  } else if (el.matches('[data-f-desde]')) e.desde = el.value;
  else if (el.matches('[data-f-hasta]')) e.hasta = el.value;
  else return;
  pintarAplicados();
  cambio();
});
let esperaTexto = 0;
cajaFiltros.addEventListener('input', (ev) => {
  const el = ev.target as HTMLInputElement;
  if (!el.matches('[data-f-texto]')) return;
  clearTimeout(esperaTexto);
  esperaTexto = window.setTimeout(() => { e.texto = el.value.trim(); pintarAplicados(); cambio(); }, 250);
});
$('d-quitar').addEventListener('click', () => { e.valores = {}; e.desde = ''; e.hasta = ''; e.texto = ''; pintarFiltros(); cambio(); });

// ---------- Columnas ----------
const cajaCols = $('d-columnas');
function pintarColumnas() {
  const t = e.tabla;
  cajaCols.innerHTML = t.columnas.map((c) => `<label class="chip"><input type="checkbox" value="${c.id}" ${e.columnas.includes(c.id) ? 'checked' : ''} /><span>${esc(cfg.nombresColumnas[c.id] ?? c.id)}</span></label>`).join('');
  resumenColumnas();
}
function resumenColumnas() {
  const texto = f(cfg.tx.columnasN, { n: e.columnas.length, total: e.tabla.columnas.length });
  $('d-cols-n').textContent = texto;
  $('d-r-3').textContent = texto;
  const ids = e.columnas.join(',');
  $('d-cols-defecto').setAttribute('aria-pressed', String(ids === defecto(e.tabla).join(',')));
  $('d-cols-todas').setAttribute('aria-pressed', String(ids === e.tabla.columnas.map((c) => c.id).join(',')));
}
cajaCols.addEventListener('change', () => {
  // Se respeta el orden de la tabla, no el de los clics
  const marcadas = new Set([...cajaCols.querySelectorAll<HTMLInputElement>('input:checked')].map((x) => x.value));
  e.columnas = e.tabla.columnas.map((c) => c.id).filter((c) => marcadas.has(c));
  resumenColumnas();
  cambio(false);
});
$('d-cols-todas').addEventListener('click', () => { e.columnas = e.tabla.columnas.map((c) => c.id); pintarColumnas(); cambio(false); });
$('d-cols-defecto').addEventListener('click', () => { e.columnas = defecto(e.tabla); pintarColumnas(); cambio(false); });

// ---------- Resultado: recuento, vista previa y descarga ----------
const PREVIA = 8;
const GRANDE = 150000;
let turno = 0;
async function resultado() {
  const mio = ++turno;
  const estado = $('d-estado'), previa = $('d-previa');
  const cifras = document.querySelectorAll<HTMLElement>('[data-filas]');
  const botones = document.querySelectorAll<HTMLButtonElement>('[data-descargar]');
  cifras.forEach((x) => { x.textContent = cfg.tx.cargando; });
  estado.textContent = '';
  botones.forEach((b) => { b.disabled = true; });
  try {
    const recorrer = await fuente(e.tabla);
    if (mio !== turno) return;
    let n = 0;
    const primeras: Fila[] = [];
    recorrer((fila) => { if (n < PREVIA) primeras.push(fila); n++; });
    cifras.forEach((x) => { x.textContent = pl(n, cfg.plFilas); });
    estado.textContent = !n ? cfg.tx.sinFilas : n > GRANDE ? cfg.tx.grande : '';
    botones.forEach((b) => { b.disabled = n === 0 || e.columnas.length === 0; });
    if (!n) { previa.innerHTML = `<p class="muted">${esc(cfg.tx.sinFilas)}</p>`; return; }
    const cols = e.columnas;
    previa.innerHTML = `<p class="small muted">${esc(f(cfg.tx.vistaPrevia, { n: Math.min(PREVIA, n) }))}</p><div class="table-scroll"><table><thead><tr>${cols.map((c) => `<th>${esc(cfg.nombresColumnas[c] ?? c)}</th>`).join('')}</tr></thead><tbody>`
      + primeras.map((fi) => `<tr>${cols.map((c) => `<td>${esc(mostrar(fi[c]))}</td>`).join('')}</tr>`).join('') + '</tbody></table></div>';
  } catch {
    if (mio !== turno) return;
    estado.textContent = cfg.tx.error;
    cifras.forEach((x) => { x.textContent = '—'; });
    previa.innerHTML = '';
  }
}
const mostrar = (v: Celda | undefined) => (v === null || v === undefined ? '' : typeof v === 'boolean' ? (v ? cfg.tx.verdadero : cfg.tx.falso) : typeof v === 'number' ? fmtNum(v) : v.length > 80 ? `${v.slice(0, 78)}…` : v);

async function descargar(boton: HTMLButtonElement) {
  boton.disabled = true;
  boton.setAttribute('aria-busy', 'true');
  try {
    const recorrer = await fuente(e.tabla);
    const cols = e.columnas.map((id) => e.tabla.columnas.find((c) => c.id === id)!);
    const op = { formato: e.formato, booleanos: e.formato === 'excel' ? [cfg.tx.verdadero, cfg.tx.falso] as [string, string] : undefined };
    const sep = e.formato === 'excel' ? ';' : ',';
    const salto = e.formato === 'excel' ? '\r\n' : '\n';
    // Cabecera: nombres en el idioma de la página para Excel; ids fijos para el CSV estándar
    const cab = cols.map((c) => celdaCsv(e.formato === 'excel' ? cfg.nombresColumnas[c.id] ?? c.id : c.id, 'texto', op)).join(sep);
    // Por trozos: un Blob con miles de partes no necesita una sola cadena gigante
    const partes: string[] = [e.formato === 'excel' ? '\uFEFF' : '', cab, salto];
    let trozo: string[] = [];
    recorrer((fila) => {
      trozo.push(cols.map((c) => celdaCsv(fila[c.id] ?? null, c.tipo, op)).join(sep));
      if (trozo.length === 5000) { partes.push(trozo.join(salto), salto); trozo = []; }
    });
    if (trozo.length) partes.push(trozo.join(salto), salto);
    const blob = new Blob(partes, { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `congreso-abierto-${e.tabla.id}${hayFiltros() ? '-filtrado' : ''}.csv`;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 30000);
  } catch {
    $('d-estado').textContent = cfg.tx.error;
  } finally {
    boton.disabled = false;
    boton.removeAttribute('aria-busy');
  }
}
document.querySelectorAll<HTMLButtonElement>('[data-descargar]').forEach((b) => b.addEventListener('click', () => descargar(b)));

// ---------- Tabla y formato ----------
function elegirTabla(id: string) {
  const t = TABLAS.find((x) => x.id === id)!;
  if (t === e.tabla) return;
  e = { ...e, tabla: t, valores: {}, desde: '', hasta: '', texto: '', columnas: defecto(t) };
  document.querySelectorAll<HTMLElement>('[data-nota-tabla]').forEach((n) => { n.hidden = n.dataset.notaTabla !== t.id; });
  resumenTabla();
  pintarFiltros();
  pintarColumnas();
  cambio();
}
document.querySelectorAll<HTMLInputElement>('input[name="d-tabla"]').forEach((r) => {
  r.checked = r.value === e.tabla.id;
  r.addEventListener('change', () => r.checked && elegirTabla(r.value));
});
document.querySelectorAll<HTMLInputElement>('input[name="d-formato"]').forEach((r) => {
  r.checked = r.value === e.formato;
  r.addEventListener('change', () => { if (r.checked) { e.formato = r.value as FormatoCsv; resumenFormato(); guardarEstado(); } });
});
function resumenTabla() {
  $('d-r-1').textContent = cfg.nombresTablas[e.tabla.id] ?? e.tabla.id;
  $('d-dic').dataset.info = `dic-${e.tabla.id}`;
}
const resumenFormato = () => { $('d-r-4').textContent = e.formato === 'excel' ? cfg.tx.excel : cfg.tx.csv; };

// ---------- Pasos del asistente ----------
const asistente = $('descargas');
const marcadores = [...document.querySelectorAll<HTMLButtonElement>('.pasos-barra [data-ir-paso]')];
const atras = asistente.querySelector<HTMLButtonElement>('.b-atras')!;
const siguiente = asistente.querySelector<HTMLButtonElement>('.b-sig')!;
const bajar = asistente.querySelector<HTMLButtonElement>('.b-descargar')!;
const quieto = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
/** Muestra el paso `p`. `empujar` lo guarda en el historial (el «atrás» del navegador vuelve al anterior). */
function irA(p: Paso, { empujar = true, foco = true } = {}) {
  const cambia = p !== paso;
  paso = p;
  asistente.dataset.paso = String(p);
  asistente.querySelectorAll<HTMLElement>('.paso').forEach((x) => x.toggleAttribute('data-activo', Number(x.dataset.paso) === p));
  marcadores.forEach((m) => {
    const n = Number(m.dataset.irPaso);
    if (n === p) m.setAttribute('aria-current', 'step'); else m.removeAttribute('aria-current');
    m.toggleAttribute('data-hecho', n < p);
  });
  atras.disabled = p === 1;
  siguiente.hidden = p === TOTAL_PASOS;
  bajar.hidden = p !== TOTAL_PASOS;
  $('d-sig').textContent = `${cfg.tx.siguiente}: ${cfg.pasos[p] ?? ''}`;
  if (empujar && cambia) history.pushState({ paso: p }, '', direccion(p));
  if (foco && cambia) {
    // Al principio del asistente si se había bajado, y el foco en el título del paso (lectores de pantalla)
    if (asistente.getBoundingClientRect().top < 0) asistente.scrollIntoView({ block: 'start', behavior: quieto() ? 'auto' : 'smooth' });
    asistente.querySelector<HTMLElement>(`.paso[data-paso="${p}"] .paso-tit`)?.focus({ preventScroll: true });
  }
}
asistente.addEventListener('click', (ev) => {
  const b = (ev.target as Element).closest<HTMLElement>('[data-ir-paso], [data-mover]');
  if (!b) return;
  irA(b.dataset.irPaso ? (Number(b.dataset.irPaso) as Paso) : mover(paso, Number(b.dataset.mover)));
});
addEventListener('popstate', () => {
  const p = pasoInicial(new URLSearchParams(location.search));
  irA(p, { empujar: false, foco: true });
  // La entrada del historial puede tener filtros antiguos: la dirección refleja siempre lo elegido
  guardarEstado();
});

/** Algo cambió: se guarda en la dirección y se recalcula (en el siguiente fotograma, para que el toque responda ya). */
function cambio(recalcular = true) {
  guardarEstado();
  if (recalcular) requestAnimationFrame(() => resultado());
  else resultado();
}

document.querySelectorAll<HTMLElement>('[data-nota-tabla]').forEach((n) => { n.hidden = n.dataset.notaTabla !== e.tabla.id; });
resumenTabla();
resumenFormato();
pintarAplicados();
pintarFiltros().catch(() => { $('d-estado').textContent = cfg.tx.error; });
pintarColumnas();
irA(paso, { empujar: false, foco: false });
guardarEstado();
resultado();
