/**
 * Páginas Votaciones y Tarjetas («Crea la tuya»): «Crear tarjeta» de cualquier votación y comparación de hasta 7
 * votaciones en una tarjeta. El HTML que necesita (configuración y barra de comparación) lo pinta TarjetasVotacion.astro.
 * Este fichero es pequeño; el que dibuja (fuentes incluidas) se descarga solo al pulsar «Crear tarjeta».
 * La selección para comparar va en la dirección (?comparar=id,id…), para poder compartir el enlace.
 */
import { MAX_COMPARAR, type ItemVotacion } from '../lib/votaciones';
import type { ConfigTarjeta, Tarjeta } from './tarjetas/votacion';
import type { DatosCompartir } from './compartir';
import { f, pl, fmtFecha, fmtFechaCorta } from '../i18n/cliente';

export { MAX_COMPARAR };
type Cfg = Omit<ConfigTarjeta, 'fecha' | 'fechaCorta'>;
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export function iniciarTarjetasVotacion(o: { buscar: (id: string) => ItemVotacion | undefined; prefijo: string; textoCompartir: (i: ItemVotacion) => string }) {
  const cfg: ConfigTarjeta = { ...(JSON.parse(document.getElementById('tarjeta-cfg')!.textContent!) as Cfg), fecha: (iso) => fmtFecha(iso), fechaCorta: (iso) => fmtFechaCorta(iso) };
  const tx = cfg.tx;
  const sitio = location.origin;
  let seleccion = (new URLSearchParams(location.search).get('comparar') ?? '').split(',').filter(Boolean).slice(0, MAX_COMPARAR);
  let urls: string[] = [];

  // ---------- Barra de comparación ----------
  const barra = document.getElementById('v-comparar')!;
  const cuenta = barra.querySelector<HTMLElement>('.vc-n')!;
  const crear = barra.querySelector<HTMLButtonElement>('.vc-crear')!;
  const aviso = barra.querySelector<HTMLElement>('.vc-aviso')!;
  function guardar() {
    const u = new URL(location.href);
    if (seleccion.length) u.searchParams.set('comparar', seleccion.join(',')); else u.searchParams.delete('comparar');
    if (u.href !== location.href) history.replaceState(history.state, '', u);
  }
  function pintarBarra() {
    barra.hidden = seleccion.length === 0;
    document.documentElement.classList.toggle('con-comparar', seleccion.length > 0);
    cuenta.textContent = pl(seleccion.length, tx.barra);
    crear.disabled = seleccion.length < 2;
    aviso.textContent = seleccion.length === 1 ? tx.minimo : '';
    document.querySelectorAll<HTMLButtonElement>('[data-comparar]').forEach((b) => marcar(b));
  }
  function marcar(b: HTMLButtonElement) {
    const dentro = seleccion.includes(b.dataset.comparar!);
    b.setAttribute('aria-pressed', String(dentro));
    b.querySelector('span')!.textContent = dentro ? tx.enComparacion : tx.comparar;
    b.title = dentro ? tx.quitarComparar : tx.comparar;
  }
  barra.querySelector('.vc-vaciar')!.addEventListener('click', () => { seleccion = []; guardar(); pintarBarra(); });
  /** Crea la tarjeta que compara `ids` (de la más antigua a la más reciente, como se leen) y abre la ventana de compartir. */
  function comparar(ids: string[], boton: HTMLButtonElement, avisoEl: HTMLElement) {
    const items = ids.map(o.buscar).filter((x): x is ItemVotacion => !!x)
      .sort((a, b) => a.f.localeCompare(b.f) || a.s - b.s || a.n - b.n);
    if (items.length < 2) { avisoEl.textContent = tx.minimo; return; }
    void generar(boton, avisoEl, async (m) => m.tarjetaComparacion(items, cfg), {
      nombre: 'congreso-abierto-comparacion',
      enlace: `${sitio}${o.prefijo}/votaciones?comparar=${items.map((i) => i.id).join(',')}`,
      texto: f(tx.textoComparacion, { n: items.length }),
      titulo: tx.tituloDialogoComparacion,
    });
  }
  crear.addEventListener('click', () => comparar(seleccion, crear, aviso));
  // El detalle de una votación usa el historial (atrás lo cierra): la selección se vuelve a poner en la dirección
  addEventListener('popstate', () => guardar());
  pintarBarra();

  // ---------- Crear la tarjeta (descarga el dibujo solo ahora) ----------
  async function generar(boton: HTMLButtonElement, avisoEl: HTMLElement, hacer: (m: typeof import('./tarjetas/votacion')) => Promise<Tarjeta>, datos: Omit<DatosCompartir, 'historia' | 'horizontal'>) {
    boton.disabled = true;
    boton.setAttribute('aria-busy', 'true');
    avisoEl.textContent = tx.creando;
    try {
      const m = await import('./tarjetas/votacion');
      const t = await hacer(m);
      urls.forEach((u) => URL.revokeObjectURL(u));
      urls = [URL.createObjectURL(t.historia), URL.createObjectURL(t.horizontal)];
      avisoEl.textContent = '';
      document.dispatchEvent(new CustomEvent<DatosCompartir>('compartir:abrir', { detail: { ...datos, historia: urls[0], horizontal: urls[1] } }));
    } catch {
      avisoEl.textContent = tx.error;
    } finally {
      boton.disabled = boton.classList.contains('vc-crear') ? seleccion.length < 2 : false;
      boton.removeAttribute('aria-busy');
    }
  }

  return {
    comparar,
    /** Votaciones elegidas para comparar (también las que llegan en la dirección). */
    seleccion: () => [...seleccion],
    /** Vuelve a pintar la barra (p. ej. cuando ya se han cargado las votaciones elegidas). */
    pintarBarra,
    /** Botones para el detalle de una votación (solo si hay voto por grupo). */
    botones(i: ItemVotacion) {
      if (!i.g?.length || i.pe) return '';
      return `<div class="d-tarjetas"><button class="btn d-crear" type="button" data-tarjeta="${esc(i.id)}">${esc(tx.crear)}</button>`
        + `<button class="btn d-comparar" type="button" data-comparar="${esc(i.id)}" aria-pressed="false"><span>${esc(tx.comparar)}</span></button></div>`
        + '<p class="small c-aviso" data-aviso-tarjeta role="status"></p>';
    },
    /** Activa los botones que se acaban de pintar en `raiz`. */
    conectar(raiz: HTMLElement) {
      const avisoEl = raiz.querySelector<HTMLElement>('[data-aviso-tarjeta]');
      raiz.querySelectorAll<HTMLButtonElement>('[data-tarjeta]').forEach((b) => b.addEventListener('click', () => {
        const i = o.buscar(b.dataset.tarjeta!);
        if (!i || !avisoEl) return;
        void generar(b, avisoEl, (m) => m.tarjetaVotacion(i, cfg), {
          nombre: `congreso-abierto-votacion-${i.id}`,
          enlace: `${sitio}${o.prefijo}/votaciones?v=${encodeURIComponent(i.id)}`,
          texto: o.textoCompartir(i),
          titulo: cfg.rotulos[i.id]?.corto ?? tx.crear,
        });
      }));
      raiz.querySelectorAll<HTMLButtonElement>('[data-comparar]').forEach((b) => {
        marcar(b);
        b.addEventListener('click', () => {
          const id = b.dataset.comparar!;
          if (seleccion.includes(id)) seleccion = seleccion.filter((x) => x !== id);
          else if (seleccion.length >= MAX_COMPARAR) { if (avisoEl) avisoEl.textContent = f(tx.maximo, { n: MAX_COMPARAR }); return; }
          else seleccion = [...seleccion, id];
          if (avisoEl) avisoEl.textContent = '';
          guardar();
          pintarBarra();
        });
      });
    },
  };
}
