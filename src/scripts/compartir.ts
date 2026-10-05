/** Lógica de cliente de las cajas de compartir (.compartir) y de la ventana emergente de compartir. */
export interface DatosCompartir {
  /** Imagen vertical, horizontal (rutas ya con la base), nombre del fichero sin extensión. */
  historia: string; horizontal: string; nombre: string;
  /** Enlace absoluto de la página y texto que lo acompaña. */
  enlace: string; texto: string; titulo: string;
}

/*
 * Una web no puede publicar por sí sola en una historia de Instagram: Instagram solo acepta imágenes que le llegan
 * desde el menú de compartir del sistema. Así que el botón abre ese menú con la tarjeta vertical ya puesta, y ahí
 * se elige Instagram → Historia. Nunca se descarga nada por este camino: descargar solo lo hacen los enlaces de
 * descarga y la miniatura.
 */
// PNG de 1×1 para preguntar al navegador si sabe compartir imágenes (con un fichero vacío Safari dice que no)
const PNG_PRUEBA = Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='), (c) => c.charCodeAt(0));
let prueba: File | null = null;
try { prueba = new File([PNG_PRUEBA], 'prueba.png', { type: 'image/png' }); } catch { /* navegador antiguo */ }
// Si el navegador tiene menú de compartir pero no canShare (algunas versiones de Firefox para Android), se intenta igualmente
const puedeImagen = (f: File | null = prueba) => {
  if (!f || typeof navigator.share !== 'function') return false;
  if (typeof navigator.canShare !== 'function') return true;
  try { return navigator.canShare({ files: [f] }); } catch { return false; }
};
const tactil = () => matchMedia('(pointer: coarse)').matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
/** Móvil o tableta con menú de compartir que acepta imágenes: ahí se comparte la tarjeta vertical. */
const movil = () => tactil() && puedeImagen();
/** Navegador dentro de una app (Instagram, Facebook, TikTok…), que no tiene menú de compartir. */
const dentroDeApp = () => /Instagram|FBAN|FBAV|FB_IAB|TikTok|musical_ly|BytedanceWebview|LinkedInApp|Line\//i.test(navigator.userAgent);

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
    if (navigator.canShare && !navigator.canShare(envio)) { avisar(''); return false; }
    try {
      await navigator.share(envio);
      avisar('');
    } catch (e) {
      const n = (e as Error).name;
      if (n === 'AbortError') { avisar(''); return true; }
      // Si hubo que esperar a la imagen, el navegador ya no deja abrir el menú: el segundo toque sí funciona
      if (n === 'NotAllowedError' && esperado) { avisar('La imagen ya está lista: vuelve a pulsar el botón.'); return true; }
      console.warn('[compartir]', n, (e as Error).message);
      avisar('');
      return false;
    }
    return true;
  }

  // Historia de Instagram: abre el menú de compartir del móvil con la tarjeta vertical (Instagram → Historia).
  // No descarga nada: si este navegador no puede, explica cómo hacerlo.
  caja.querySelector('.c-historia')!.addEventListener('click', async () => {
    if (dentroDeApp()) {
      avisar('Instagram y otras apps no dejan compartir imágenes desde su navegador interno. Abre esta página en Safari o Chrome (menú ··· → «Abrir en el navegador») y vuelve a pulsar: se abrirá Instagram con la imagen lista para tu historia.');
      return;
    }
    if (movil()) {
      if (await compartirImagen(false)) return;
      avisar(/Firefox|FxiOS/i.test(navigator.userAgent)
        ? 'Esta versión de Firefox no deja compartir imágenes desde una web. Actualízalo o abre la página en Chrome (Android) o Safari (iPhone), o descarga la imagen vertical aquí debajo.'
        : 'Este navegador no ha dejado abrir el menú de compartir con la imagen. Prueba en Safari (iPhone) o Chrome (Android), o descarga la imagen vertical aquí debajo.');
      return;
    }
    if (tactil()) {
      avisar(/Firefox|FxiOS/i.test(navigator.userAgent)
        ? 'Esta versión de Firefox no permite compartir imágenes desde una web. Actualízalo o abre la página en Chrome (Android) o Safari (iPhone) para mandarla a tu historia, o descarga la imagen vertical aquí debajo.'
        : 'Este navegador no permite compartir imágenes. Abre la página en Safari (iPhone) o Chrome (Android) para mandarla directamente a tu historia, o descarga la imagen vertical aquí debajo.');
      return;
    }
    avisar('Las historias de Instagram se publican desde el móvil: abre esta página en tu móvil y pulsa este botón; se abrirá Instagram con la imagen. Desde el ordenador puedes descargarla aquí debajo.');
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
