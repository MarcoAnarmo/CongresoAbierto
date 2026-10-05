/** Lógica de cliente de las cajas de compartir (.compartir) y de la ventana emergente de compartir. */
export interface DatosCompartir {
  /** Imagen vertical, horizontal (rutas ya con la base), nombre del fichero sin extensión. */
  historia: string; horizontal: string; nombre: string;
  /** Enlace absoluto de la página y texto que lo acompaña. */
  enlace: string; texto: string; titulo: string;
}

const prueba = typeof File !== 'undefined' ? new File([new Blob()], 'x.png', { type: 'image/png' }) : null;
const puedeImagen = () => !!(prueba && navigator.canShare?.({ files: [prueba] }));
/** Móvil o tableta con menú de compartir que acepta imágenes: ahí se comparte la tarjeta vertical. */
const movil = () => matchMedia('(pointer: coarse)').matches && puedeImagen();

/** Texto completo que se pega o se manda: el texto de la tarjeta y el enlace. */
export const textoConEnlace = (texto: string, enlace: string) => `${texto} ${enlace}`;

export const enlacesRedes = (texto: string, enlace: string) => ({
  whatsapp: `https://wa.me/?text=${encodeURIComponent(textoConEnlace(texto, enlace))}`,
  x: `https://x.com/intent/post?text=${encodeURIComponent(texto)}&url=${encodeURIComponent(enlace)}`,
});

/*
 * Las imágenes se descargan antes de pulsar: el menú de compartir del móvil (sobre todo en iPhone) solo se abre
 * si se llama justo al pulsar; si antes hay que esperar a descargar la imagen, el navegador lo bloquea.
 */
const listos = new Map<string, File>();
const cargando = new Map<string, Promise<File | null>>();
function precargar(ruta: string, nombre: string): Promise<File | null> {
  if (!ruta) return Promise.resolve(null);
  const hecho = listos.get(ruta);
  if (hecho) return Promise.resolve(hecho);
  let p = cargando.get(ruta);
  if (!p) {
    p = fetch(ruta)
      .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
      .then((b) => { const f = new File([b], nombre, { type: 'image/png' }); listos.set(ruta, f); return f; })
      .catch(() => { cargando.delete(ruta); return null; });
    cargando.set(ruta, p);
  }
  return p;
}

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
  if (movil()) void precargar(d.historia, `${d.nombre}.png`);
}

/** Activa los botones de una caja. Lee sus datos en el momento del clic, así sirve aunque se rellene después. */
export function prepararCaja(caja: HTMLElement) {
  if (caja.dataset.lista) return;
  caja.dataset.lista = '1';
  const aviso = caja.querySelector<HTMLElement>('.c-aviso')!;
  const avisar = (t: string) => { aviso.textContent = t; };
  const datos = () => caja.dataset as { historia: string; nombre: string; enlace: string; texto: string };
  const descargar = () => {
    const a = Object.assign(document.createElement('a'), { href: datos().historia, download: datos().nombre });
    document.body.append(a); a.click(); a.remove();
  };

  // En el móvil, la imagen se prepara en cuanto la caja se ve o se toca
  if (movil()) {
    const pre = () => void precargar(datos().historia, datos().nombre);
    caja.addEventListener('pointerdown', pre, { passive: true });
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { pre(); io.disconnect(); } }, { rootMargin: '200px' });
      io.observe(caja);
    }
  }

  // La miniatura mide lo mismo que la columna de botones y textos (proporción 9:16)
  const mini = caja.querySelector<HTMLElement>('.miniatura');
  const acciones = caja.querySelector<HTMLElement>('.acciones');
  if (mini && acciones && 'ResizeObserver' in window) {
    new ResizeObserver(() => { mini.style.width = `${Math.round((acciones.offsetHeight * 9) / 16)}px`; }).observe(acciones);
  }

  /**
   * Abre el menú de compartir del móvil con la tarjeta vertical (y, si se pide, el texto con el enlace).
   * Devuelve false si no se pudo, para que quien llama use otra vía.
   */
  async function compartirImagen(conTexto: boolean): Promise<boolean> {
    const { historia, nombre, texto, enlace } = datos();
    let fichero = listos.get(historia);
    let esperado = false;
    if (!fichero) {
      avisar('Preparando la imagen…');
      fichero = (await precargar(historia, nombre)) ?? undefined;
      esperado = true;
      if (!fichero) { avisar(''); return false; }
    }
    let envio: ShareData = conTexto ? { files: [fichero], text: textoConEnlace(texto, enlace) } : { files: [fichero] };
    if (navigator.canShare && !navigator.canShare(envio)) envio = { files: [fichero] };
    try {
      await navigator.share(envio);
      avisar('');
    } catch (e) {
      const n = (e as Error).name;
      if (n === 'AbortError') { avisar(''); return true; }
      // Si hubo que esperar a la imagen, el navegador ya no deja abrir el menú: el segundo toque sí funciona
      if (n === 'NotAllowedError' && esperado) { avisar('La imagen ya está lista: vuelve a pulsar el botón.'); return true; }
      avisar('');
      return false;
    }
    return true;
  }

  caja.querySelector('.c-historia')!.addEventListener('click', async () => {
    if (movil()) {
      if (await compartirImagen(false)) return;
      descargar();
      avisar('No se pudo abrir el menú de compartir; la imagen se ha descargado para que la subas a tu historia.');
      return;
    }
    if (matchMedia('(pointer: coarse)').matches) {
      // Navegador dentro de una app (Instagram, WhatsApp…) sin menú de compartir: se abre la imagen para guardarla
      window.open(datos().historia, '_blank', 'noopener');
      avisar('Mantén pulsada la imagen para guardarla y súbela a tu historia. Si abres esta página en el navegador del móvil, este botón la manda directamente.');
      return;
    }
    descargar();
    avisar('Imagen descargada. Súbela a tu historia desde Instagram; desde el móvil este botón la manda directamente.');
  });

  // WhatsApp y X: en el móvil, la tarjeta vertical con el texto y el enlace; en el ordenador, el enlace con su vista previa
  caja.querySelectorAll<HTMLAnchorElement>('.c-whatsapp, .c-x').forEach((a) => {
    a.addEventListener('click', async (e) => {
      if (!movil()) return;
      e.preventDefault();
      if (!(await compartirImagen(true))) window.open(a.href, '_blank', 'noopener');
    });
  });

  caja.querySelector('.c-copiar')!.addEventListener('click', async () => {
    const t = textoConEnlace(datos().texto, datos().enlace);
    try { await navigator.clipboard.writeText(t); avisar('Texto y enlace copiados. Pégalos donde quieras.'); }
    catch { avisar(t); }
  });

  const mas = caja.querySelector<HTMLButtonElement>('.c-mas')!;
  if (navigator.share) {
    mas.hidden = false;
    mas.addEventListener('click', async () => {
      if (movil() && (await compartirImagen(true))) return;
      navigator.share({ text: datos().texto, url: datos().enlace }).catch(() => {});
    });
  }
}
