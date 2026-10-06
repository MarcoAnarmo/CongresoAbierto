/**
 * Cálculos sencillos sobre los datos oficiales que se usan en las estadísticas y en las descargas.
 * Funciones puras, sin dependencias: se prueban en tests/.
 */

export type Posicion = 'Sí' | 'No' | 'Abstención' | 'Empate';

/**
 * Voto mayoritario de un grupo en una votación: el más votado entre sí, no y abstención (los que no votan no cuentan).
 * 'Empate' si los dos primeros empatan; null si nadie del grupo votó.
 */
export function votoMayoritario(si: number, no: number, abstencion: number): Posicion | null {
  const v: [Posicion, number][] = [['Sí', si], ['No', no], ['Abstención', abstencion]];
  v.sort((a, b) => b[1] - a[1]);
  if (v[0][1] === 0) return null;
  return v[0][1] === v[1][1] ? 'Empate' : v[0][0];
}

/** Concepto de renta que menciona un alquiler o arrendamiento (en el texto tal como lo escribe el diputado). */
const ALQUILER = /\b(alquiler|alquileres|arrendamiento|arrendamientos|arrendaticio|rendimientos? (?:netos? )?(?:del? )?capital inmobiliario)\b/i;
export const esRentaDeAlquiler = (fila: { texto: string; tipo: string }) => fila.tipo !== 'dividendos' && fila.tipo !== 'intereses' && ALQUILER.test(fila.texto);

/** Tramo de una cantidad: el índice del primer corte que no supera (cortes ascendentes); el último tramo es «más de». */
export const tramoDe = (n: number, cortes: number[]) => {
  const i = cortes.findIndex((c) => n < c);
  return i === -1 ? cortes.length : i;
};
