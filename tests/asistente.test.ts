import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pasoInicial, mover, filtrosAplicados, quitarFiltro } from '../src/lib/datos/asistente';
import type { DefFiltro } from '../src/lib/datos/tablas';

test('paso inicial: el de la dirección, el 4 si ya elige tabla, si no el 1', () => {
  assert.equal(pasoInicial(new URLSearchParams('paso=3')), 3);
  assert.equal(pasoInicial(new URLSearchParams('tabla=votos&paso=2')), 2);
  assert.equal(pasoInicial(new URLSearchParams('tabla=votos-grupo&temas=vivienda')), 4);
  assert.equal(pasoInicial(new URLSearchParams('')), 1);
  assert.equal(pasoInicial(new URLSearchParams('paso=9')), 1);
  assert.equal(pasoInicial(new URLSearchParams('paso=abc')), 1);
});

test('mover no se sale de los pasos', () => {
  assert.equal(mover(1, -1), 1);
  assert.equal(mover(1, 1), 2);
  assert.equal(mover(4, 1), 4);
});

const FILTROS: DefFiltro[] = [
  { id: 'fechas', tipo: 'fechas', columna: 'fecha' },
  { id: 'grupo', tipo: 'valores', columna: 'grupo' },
  { id: 'buscar', tipo: 'texto', columnas: ['titulo'] },
];
const nombres: Record<string, string> = { grupo: 'Grupo', buscar: 'Buscar', fechas: 'Fechas' };
const estado = { valores: { grupo: ['PSOE', 'PP'] }, desde: '2024-01-01', hasta: '', texto: 'vivienda' };

test('filtros aplicados en el orden de la tabla, con su texto', () => {
  const r = filtrosAplicados(estado, FILTROS, (id) => nombres[id], (_, v) => v, { desde: 'Desde', hasta: 'Hasta' });
  assert.deepEqual(r.map((x) => x.texto), ['Desde: 2024-01-01', 'Grupo: PSOE', 'Grupo: PP', 'Buscar: «vivienda»']);
});

test('quitar un filtro deja los demás y no cambia el estado de entrada', () => {
  const sinPp = quitarFiltro(estado, { filtro: 'grupo', valor: 'PP' });
  assert.deepEqual(sinPp.valores.grupo, ['PSOE']);
  assert.deepEqual(estado.valores.grupo, ['PSOE', 'PP']);
  assert.equal(quitarFiltro(estado, { filtro: 'fechas', campo: 'desde' }).desde, '');
  assert.equal(quitarFiltro(estado, { filtro: 'buscar', campo: 'texto' }).texto, '');
});
