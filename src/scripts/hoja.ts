/**
 * Hojas que suben desde abajo en el móvil (compartir, filtros, detalle de la ficha, ficha rápida del hemiciclo):
 * se cierran arrastrándolas hacia abajo con el dedo, como en las apps.
 * Solo empieza el arrastre si el contenido de la hoja está arriba del todo, para no estorbar al desplazamiento.
 */
interface Opciones {
  /** Cierra la hoja (dialog.close(), ocultar el aviso…). */
  cerrar: () => void;
  /** Cuándo la ventana se ve como hoja (por defecto, pantallas de hasta 720 px). */
  medio?: string;
}

const UMBRAL = 90; // px arrastrados para cerrar
const RAPIDO = 0.55; // px/ms: un gesto rápido cierra aunque sea corto

/** Elemento desplazable más cercano dentro de la hoja (o null si no hay). */
function desplazable(desde: Element | null, hoja: HTMLElement): HTMLElement | null {
  for (let el = desde as HTMLElement | null; el && el !== hoja.parentElement; el = el.parentElement) {
    if (el.scrollHeight > el.clientHeight + 1 && /(auto|scroll)/.test(getComputedStyle(el).overflowY)) return el;
    if (el === hoja) break;
  }
  return null;
}

export function deslizarParaCerrar(hoja: HTMLElement, { cerrar, medio = '(max-width: 720px)' }: Opciones) {
  if (hoja.dataset.deslizar) return;
  hoja.dataset.deslizar = '1';
  const mq = matchMedia(medio);
  // Asa visible arriba, que indica que se puede arrastrar
  const asa = document.createElement('span');
  asa.className = 'asa-hoja';
  asa.setAttribute('aria-hidden', 'true');
  hoja.prepend(asa);
  const marcar = () => hoja.classList.toggle('es-hoja', mq.matches);
  marcar();
  mq.addEventListener?.('change', marcar);

  let y0 = 0, t0 = 0, dy = 0, arrastrando = false, posible = false;
  const soltar = (cerrando: boolean) => {
    hoja.style.transition = 'transform .2s ease-out';
    hoja.style.transform = cerrando ? 'translateY(110%)' : '';
    const fin = () => {
      hoja.removeEventListener('transitionend', fin);
      hoja.style.transition = '';
      if (cerrando) { cerrar(); hoja.style.transform = ''; }
    };
    hoja.addEventListener('transitionend', fin);
    setTimeout(fin, 260); // por si no llega transitionend (movimiento reducido)
  };

  hoja.addEventListener('touchstart', (e) => {
    if (!mq.matches || e.touches.length !== 1) { posible = false; return; }
    const t = e.target as Element;
    // Dentro de un control que se arrastra en horizontal o de un desplegable, no
    if (t.closest('input, select, textarea, [data-sin-deslizar]')) { posible = false; return; }
    const s = desplazable(t, hoja);
    posible = !s || s.scrollTop <= 0;
    y0 = e.touches[0].clientY; t0 = e.timeStamp; dy = 0; arrastrando = false;
  }, { passive: true });

  hoja.addEventListener('touchmove', (e) => {
    if (!posible) return;
    dy = e.touches[0].clientY - y0;
    if (!arrastrando) {
      if (dy < 0) { posible = false; return; } // hacia arriba: desplazamiento normal
      if (dy < 6) return;
      arrastrando = true;
      hoja.style.transition = 'none';
    }
    e.preventDefault();
    hoja.style.transform = `translateY(${Math.max(0, dy)}px)`;
  }, { passive: false });

  const terminar = (e: TouchEvent) => {
    if (!arrastrando) return;
    arrastrando = false; posible = false;
    const v = dy / Math.max(1, e.timeStamp - t0);
    soltar(dy > UMBRAL || (dy > 30 && v > RAPIDO));
  };
  hoja.addEventListener('touchend', terminar);
  hoja.addEventListener('touchcancel', () => { if (arrastrando) { arrastrando = false; soltar(false); } });
}
