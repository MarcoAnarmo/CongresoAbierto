/** Lógica de cliente de las cajas de compartir (.compartir) y de la ventana emergente de compartir. */
export interface DatosCompartir {
  /** Imagen vertical, horizontal (rutas ya con la base), nombre del fichero sin extensión. */
  historia: string; horizontal: string; nombre: string;
  /** Enlace absoluto de la página y texto que lo acompaña. */
  enlace: string; texto: string; titulo: string;
}

const prueba = typeof File !== 'undefined' ? new File([new Blob()], 'x.png', { type: 'image/png' }) : null;
const puedeImagen = () => !!(prueba && navigator.canShare?.({ files: [prueba] }));

export const enlacesRedes = (texto: string, enlace: string) => ({
  whatsapp: `https://wa.me/?text=${encodeURIComponent(`${texto} ${enlace}`)}`,
  x: `https://x.com/intent/post?text=${encodeURIComponent(texto)}&url=${encodeURIComponent(enlace)}`,
});

/** Cambia el contenido de una caja (se usa en la ventana emergente, que es una sola por página). */
export function rellenarCaja(caja: HTMLElement, d: DatosCompartir) {
  Object.assign(caja.dataset, { historia: d.historia, nombre: `${d.nombre}.png`, enlace: d.enlace, texto: d.texto });
  const r = enlacesRedes(d.texto, d.enlace);
  caja.querySelector<HTMLAnchorElement>('.c-whatsapp')!.href = r.whatsapp;
  caja.querySelector<HTMLAnchorElement>('.c-x')!.href = r.x;
  const [vert, hor] = caja.querySelectorAll<HTMLAnchorElement>('.c-descargas a');
  Object.assign(vert, { href: d.historia, download: `${d.nombre}.png` });
  Object.assign(hor, { href: d.horizontal, download: `${d.nombre}-horizontal.png` });
  const mini = caja.querySelector<HTMLAnchorElement>('.miniatura');
  if (mini) { mini.href = d.historia; mini.querySelector('img')!.src = d.historia; }
  const titulo = caja.querySelector<HTMLElement>('.c-titulo');
  if (titulo) titulo.textContent = d.titulo;
  caja.querySelector<HTMLElement>('.c-aviso')!.textContent = '';
}

/** Activa los botones de una caja. Lee sus datos en el momento del clic, así sirve aunque se rellene después. */
export function prepararCaja(caja: HTMLElement) {
  if (caja.dataset.lista) return;
  caja.dataset.lista = '1';
  const aviso = caja.querySelector<HTMLElement>('.c-aviso')!;
  const avisar = (t: string) => { aviso.textContent = t; };
  const descargar = () => {
    const a = Object.assign(document.createElement('a'), { href: caja.dataset.historia!, download: caja.dataset.nombre! });
    document.body.append(a); a.click(); a.remove();
  };

  // La miniatura mide lo mismo que la columna de botones y textos (proporción 9:16)
  const mini = caja.querySelector<HTMLElement>('.miniatura');
  const acciones = caja.querySelector<HTMLElement>('.acciones');
  if (mini && acciones && 'ResizeObserver' in window) {
    new ResizeObserver(() => { mini.style.width = `${Math.round((acciones.offsetHeight * 9) / 16)}px`; }).observe(acciones);
  }

  caja.querySelector('.c-historia')!.addEventListener('click', async () => {
    if (!puedeImagen()) {
      descargar();
      avisar('Imagen descargada. Súbela a tu historia desde Instagram; desde el móvil este botón la manda directamente.');
      return;
    }
    try {
      const r = await fetch(caja.dataset.historia!);
      const fichero = new File([await r.blob()], caja.dataset.nombre!, { type: 'image/png' });
      // Solo la imagen: así el móvil ofrece Instagram (Historias), WhatsApp (Estado)…
      await navigator.share({ files: [fichero] });
    } catch (e) {
      if ((e as Error).name !== 'AbortError') { descargar(); avisar('No se pudo abrir el menú de compartir; la imagen se ha descargado.'); }
    }
  });

  caja.querySelector('.c-copiar')!.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(caja.dataset.enlace!); avisar('Enlace copiado.'); }
    catch { avisar(caja.dataset.enlace!); }
  });

  const mas = caja.querySelector<HTMLButtonElement>('.c-mas')!;
  if (navigator.share) {
    mas.hidden = false;
    mas.addEventListener('click', () => navigator.share({ text: caja.dataset.texto, url: caja.dataset.enlace }).catch(() => {}));
  }
}
