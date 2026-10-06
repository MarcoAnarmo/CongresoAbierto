/** Utilidades de texto sin dependencias (sirven en la build y en el navegador). */

/** Quita tildes y diacríticos: «Álava» → «Alava». */
export const sinTildes = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

/** Texto apto para una dirección: «Santa Cruz de Tenerife» → «santa-cruz-de-tenerife». */
export const slugTexto = (s: string) => sinTildes(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
