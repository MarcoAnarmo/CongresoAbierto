/**
 * Diseño común de las tarjetas para compartir: colores, formatos y márgenes.
 * Lo usan las dos formas de dibujarlas, para que salgan iguales:
 *  - en la build, con satori (src/lib/og.ts y src/lib/tarjetas.ts): resúmenes, fichas, provincias y votaciones clave;
 *  - en el navegador, con canvas (src/scripts/tarjetas/): la tarjeta de cualquier votación y las comparaciones.
 * Sin dependencias: se puede importar desde el navegador.
 */
export const C = {
  fondo: '#f7f6f2', texto: '#15171c', apagado: '#555c68', borde: '#e2dfd8', acento: '#c2410c', naranja: '#f26a1b',
  acentoSuave: '#fff3ea', acentoBorde: '#f7c9a6', blanco: '#ffffff', chip: '#ecebe6',
  si: '#2e7d32', no: '#c62828', abs: '#e0a100', novota: '#a9adb5',
} as const;

export const FORMATOS = { historia: { ancho: 1080, alto: 1920 }, horizontal: { ancho: 1200, alto: 630 } } as const;
export type Formato = keyof typeof FORMATOS;

/** Márgenes de cada formato. En historias se deja libre la zona de Instagram de arriba y de abajo. */
export const MARGEN: Record<Formato, { arriba: number; lados: number; abajo: number }> = {
  historia: { arriba: 200, lados: 80, abajo: 230 },
  horizontal: { arriba: 52, lados: 64, abajo: 52 },
};
/** Franja naranja de arriba. */
export const FRANJA = 14;
/** Logo (hemiciclo) en la cabecera: tamaño a escala 1. */
export const LOGO = { ancho: 103, alto: 50 };
export const DOMINIO = 'congresoabierto.org';
