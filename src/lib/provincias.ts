/**
 * Circunscripciones del Congreso en un mapa de cuadrícula: una casilla por provincia,
 * colocada de forma aproximada según su posición geográfica (no es un mapa a escala).
 * `cp` son las dos primeras cifras del código postal, que coinciden con el código INE de la provincia.
 */
export interface CasillaProvincia { nombre: string; abrev: string; col: number; fila: number; cp: number }

export const COLUMNAS = 11;
export const FILAS = 9;

export const PROVINCIAS: CasillaProvincia[] = [
  { nombre: 'Coruña (A)', abrev: 'COR', col: 1, fila: 0, cp: 15 },
  { nombre: 'Lugo', abrev: 'LUG', col: 2, fila: 0, cp: 27 },
  { nombre: 'Asturias', abrev: 'AST', col: 3, fila: 0, cp: 33 },
  { nombre: 'Cantabria', abrev: 'CAN', col: 4, fila: 0, cp: 39 },
  { nombre: 'Bizkaia', abrev: 'BIZ', col: 5, fila: 0, cp: 48 },
  { nombre: 'Gipuzkoa', abrev: 'GIP', col: 6, fila: 0, cp: 20 },
  { nombre: 'Pontevedra', abrev: 'PON', col: 1, fila: 1, cp: 36 },
  { nombre: 'Ourense', abrev: 'OUR', col: 2, fila: 1, cp: 32 },
  { nombre: 'León', abrev: 'LEO', col: 3, fila: 1, cp: 24 },
  { nombre: 'Palencia', abrev: 'PAL', col: 4, fila: 1, cp: 34 },
  { nombre: 'Burgos', abrev: 'BUR', col: 5, fila: 1, cp: 9 },
  { nombre: 'Araba/Álava', abrev: 'ALA', col: 6, fila: 1, cp: 1 },
  { nombre: 'Navarra', abrev: 'NAV', col: 7, fila: 1, cp: 31 },
  { nombre: 'Huesca', abrev: 'HUE', col: 8, fila: 1, cp: 22 },
  { nombre: 'Lleida', abrev: 'LLE', col: 9, fila: 1, cp: 25 },
  { nombre: 'Girona', abrev: 'GIR', col: 10, fila: 1, cp: 17 },
  { nombre: 'Zamora', abrev: 'ZAM', col: 2, fila: 2, cp: 49 },
  { nombre: 'Valladolid', abrev: 'VLL', col: 3, fila: 2, cp: 47 },
  { nombre: 'Segovia', abrev: 'SEG', col: 4, fila: 2, cp: 40 },
  { nombre: 'Soria', abrev: 'SOR', col: 5, fila: 2, cp: 42 },
  { nombre: 'Rioja (La)', abrev: 'RIO', col: 6, fila: 2, cp: 26 },
  { nombre: 'Zaragoza', abrev: 'ZAR', col: 7, fila: 2, cp: 50 },
  { nombre: 'Tarragona', abrev: 'TAR', col: 8, fila: 2, cp: 43 },
  { nombre: 'Barcelona', abrev: 'BCN', col: 9, fila: 2, cp: 8 },
  { nombre: 'Salamanca', abrev: 'SAL', col: 2, fila: 3, cp: 37 },
  { nombre: 'Ávila', abrev: 'AVI', col: 3, fila: 3, cp: 5 },
  { nombre: 'Madrid', abrev: 'MAD', col: 4, fila: 3, cp: 28 },
  { nombre: 'Guadalajara', abrev: 'GUA', col: 5, fila: 3, cp: 19 },
  { nombre: 'Teruel', abrev: 'TER', col: 6, fila: 3, cp: 44 },
  { nombre: 'Castellón/Castelló', abrev: 'CAS', col: 7, fila: 3, cp: 12 },
  { nombre: 'Balears (Illes)', abrev: 'BAL', col: 9, fila: 3, cp: 7 },
  { nombre: 'Cáceres', abrev: 'CAC', col: 2, fila: 4, cp: 10 },
  { nombre: 'Toledo', abrev: 'TOL', col: 3, fila: 4, cp: 45 },
  { nombre: 'Ciudad Real', abrev: 'CRE', col: 4, fila: 4, cp: 13 },
  { nombre: 'Cuenca', abrev: 'CUE', col: 5, fila: 4, cp: 16 },
  { nombre: 'Valencia/València', abrev: 'VAL', col: 6, fila: 4, cp: 46 },
  { nombre: 'Badajoz', abrev: 'BAD', col: 2, fila: 5, cp: 6 },
  { nombre: 'Córdoba', abrev: 'COD', col: 3, fila: 5, cp: 14 },
  { nombre: 'Jaén', abrev: 'JAE', col: 4, fila: 5, cp: 23 },
  { nombre: 'Albacete', abrev: 'ALB', col: 5, fila: 5, cp: 2 },
  { nombre: 'Alicante/Alacant', abrev: 'ALI', col: 6, fila: 5, cp: 3 },
  { nombre: 'Huelva', abrev: 'HUL', col: 2, fila: 6, cp: 21 },
  { nombre: 'Sevilla', abrev: 'SEV', col: 3, fila: 6, cp: 41 },
  { nombre: 'Granada', abrev: 'GRA', col: 4, fila: 6, cp: 18 },
  { nombre: 'Murcia', abrev: 'MUR', col: 5, fila: 6, cp: 30 },
  { nombre: 'Cádiz', abrev: 'CAD', col: 3, fila: 7, cp: 11 },
  { nombre: 'Málaga', abrev: 'MAL', col: 4, fila: 7, cp: 29 },
  { nombre: 'Almería', abrev: 'ALM', col: 5, fila: 7, cp: 4 },
  { nombre: 'S/C Tenerife', abrev: 'TFE', col: 0, fila: 8, cp: 38 },
  { nombre: 'Palmas (Las)', abrev: 'LPA', col: 1, fila: 8, cp: 35 },
  { nombre: 'Ceuta', abrev: 'CEU', col: 3, fila: 8, cp: 51 },
  { nombre: 'Melilla', abrev: 'MEL', col: 5, fila: 8, cp: 52 },
];

/** Nombre legible: «Coruña (A)» → «A Coruña», «Palmas (Las)» → «Las Palmas». */
export const nombreLegible = (n: string) =>
  n === 'S/C Tenerife' ? 'Santa Cruz de Tenerife' : n.replace(/^(.+) \((.+)\)$/, '$2 $1');
