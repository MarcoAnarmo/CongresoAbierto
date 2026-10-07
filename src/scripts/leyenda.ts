/**
 * Leyenda en escala de menos a más (hemiciclo y mapa por provincias): una barra de tramos con su cifra debajo.
 * Cada tramo es un botón (data-f = índice del tramo, -1 sin datos) para resaltar solo lo de ese color.
 * Estilos en global.css (.escala, .tramo).
 */
export interface Escala {
  colores: string[];
  etiquetas: readonly string[];
  /** Texto para lectores de pantalla de cada tramo (con su cifra). */
  aria: (i: number) => string;
  /** Tramo «sin datos» al final, solo si hay alguno. */
  sinDatos?: { aria: string; texto: string } | null;
}
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export const escalaHtml = ({ colores, etiquetas, aria, sinDatos }: Escala) =>
  `<div class="escala">${colores.map((c, i) => `<button type="button" class="tramo filtro" data-f="${i}" aria-pressed="false" aria-label="${esc(aria(i))}"><i style="background:${c}"></i><span>${esc(etiquetas[i])}</span></button>`).join('')}`
  + (sinDatos ? `<button type="button" class="tramo filtro sd" data-f="-1" aria-pressed="false" aria-label="${esc(sinDatos.aria)}"><i></i><span>${esc(sinDatos.texto)}</span></button>` : '')
  + '</div>';

