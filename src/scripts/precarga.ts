/**
 * Precarga de páginas para que abrir una ficha o una votación sea casi instantáneo, también en el móvil y en los
 * navegadores internos de Instagram o WhatsApp: se pide la página en cuanto el dedo toca el enlace (antes del «click»)
 * o, en la ficha rápida del hemiciclo, en cuanto se abre. Solo HTML de la propia web; nada de /datos ni imágenes.
 */
const hechas = new Set<string>();

export function precargar(href: string) {
  let u: URL;
  try { u = new URL(href, location.href); } catch { return; }
  if (u.origin !== location.origin || /^\/(datos|tarjetas)\//.test(u.pathname.replace(/^\/(ca|eu|gl|en)(?=\/)/, '')) || /\.\w+$/.test(u.pathname)) return;
  const clave = u.pathname + u.search;
  if (clave === location.pathname + location.search || hechas.has(clave)) return;
  hechas.add(clave);
  const l = document.createElement('link');
  l.rel = 'prefetch';
  l.href = clave;
  document.head.append(l);
}

export function precargarAlTocar() {
  const alTocar = (e: Event) => {
    const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (a && !a.target && !a.hasAttribute('download')) precargar(a.href);
  };
  document.addEventListener('touchstart', alTocar, { passive: true, capture: true });
  document.addEventListener('mousedown', alTocar, { passive: true, capture: true });
}
