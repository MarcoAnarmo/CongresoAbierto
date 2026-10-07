/**
 * Pestañas accesibles con la pestaña en la dirección (#votos, #diputados…), para Estadísticas y Tarjetas.
 *
 * HTML: un `[role="tablist"]` con enlaces `[role="tab"][data-id]` (href="#<id>") y paneles con ese id. El panel activo
 * lleva `data-activo`; con JavaScript, el CSS de la página oculta los demás (sin JavaScript se ven todos y las
 * pestañas son enlaces a cada panel). Una dirección con el id de algo que está dentro de un panel abre ese panel y
 * baja hasta ello (p. ej. enlaces antiguos a #coincidencias).
 */
interface Opciones {
  /** Se llama cada vez que cambia el panel activo (p. ej. para cargar datos la primera vez). */
  alCambiar?: (id: string) => void;
}

const suave = (): ScrollBehavior => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');

export function iniciarPestanas(barra: HTMLElement, { alCambiar }: Opciones = {}) {
  const tabs = [...barra.querySelectorAll<HTMLAnchorElement>('[role="tab"]')];
  const paneles = tabs.map((x) => document.getElementById(x.dataset.id!)!);
  let actual = paneles.find((p) => p.hasAttribute('data-activo'))?.id ?? tabs[0].dataset.id!;
  // La franja que se pega arriba (Pestanas.astro) o, si no hay, la propia barra
  const pegada = barra.closest<HTMLElement>('.pestanas-pegada') ?? barra;
  const tope = () => parseFloat(getComputedStyle(pegada).top) || 0;
  // Sombra solo cuando ya está pegada: lo dice una marca de 1 px justo antes de la franja
  const marca = pegada.previousElementSibling as HTMLElement | null;
  /** Lleva la barra arriba (se desplaza hasta la marca, que no se pega, para que el navegador calcule bien). */
  const subirA = () => (marca ?? pegada).scrollIntoView({ block: 'start', behavior: suave() });
  if (marca?.classList.contains('pestanas-marca') && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => pegada.toggleAttribute('data-pegada', !e.isIntersecting && e.boundingClientRect.top < innerHeight / 2), { rootMargin: `-${Math.round(tope()) + 1}px 0px 0px 0px` }).observe(marca);
  }

  function activar(id: string, { foco = false, subir = false } = {}) {
    tabs.forEach((x) => {
      const si = x.dataset.id === id;
      x.setAttribute('aria-selected', String(si));
      x.tabIndex = si ? 0 : -1;
      if (si && foco) x.focus();
    });
    paneles.forEach((p) => p.toggleAttribute('data-activo', p.id === id));
    // Si la barra ya está pegada arriba, se vuelve al principio del panel
    if (subir && pegada.getBoundingClientRect().top <= tope() + 1) subirA();
    if (id !== actual) { actual = id; alCambiar?.(id); }
  }
  const ir = (id: string, opciones?: { foco?: boolean; subir?: boolean }) => {
    activar(id, opciones);
    history.replaceState(history.state, '', `${location.pathname}${location.search}#${id}`);
  };
  function desdeDireccion() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const destino = document.getElementById(id);
    const panel = paneles.find((p) => p === destino || p.contains(destino));
    if (!panel) return;
    activar(panel.id);
    if (destino && destino !== panel) requestAnimationFrame(() => destino.scrollIntoView({ block: 'start' }));
  }

  tabs.forEach((x, i) => {
    x.addEventListener('click', (e) => { e.preventDefault(); ir(x.dataset.id!, { subir: true }); });
    x.addEventListener('keydown', (e) => {
      const j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null;
      if (j === null) return;
      e.preventDefault();
      ir(tabs[(j + tabs.length) % tabs.length].dataset.id!, { foco: true });
    });
  });
  addEventListener('hashchange', desdeDireccion);
  desdeDireccion();
  return {
    /** Abre un panel desde otro enlace de la página (p. ej. las cifras de arriba) y baja hasta las pestañas. */
    abrir: (id: string) => { ir(id); subirA(); },
    actual: () => actual,
  };
}
