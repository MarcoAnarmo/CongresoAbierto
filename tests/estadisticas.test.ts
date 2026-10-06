import { test } from 'node:test';
import assert from 'node:assert/strict';
import { votoPorTema, coincidencias, tramosRentas } from '../src/lib/estadisticas';
import type { Diputado } from '../src/lib/types';

const vs = [
  { id: 'a', temas: ['vivienda'], porGrupo: [['X', 5, 0, 0, 0], ['Y', 0, 4, 0, 1]] as [string, number, number, number, number][] },
  { id: 'b', temas: ['vivienda', 'economia'], porGrupo: [['X', 1, 3, 0, 0], ['Y', 0, 4, 0, 0]] as [string, number, number, number, number][] },
  { id: 'c', porGrupo: [['X', 2, 2, 0, 0], ['Y', 3, 0, 0, 0]] as [string, number, number, number, number][] },
];

test('voto por tema: cuenta votaciones, no votos', () => {
  const { porTema, nVotaciones } = votoPorTema(vs, ['X', 'Y']);
  assert.equal(nVotaciones.get('vivienda'), 2);
  assert.equal(nVotaciones.get('otros'), 1);
  assert.deepEqual({ ...porTema.get('vivienda')!.get('X')! }, { 'Sí': 1, 'No': 1, 'Abstención': 0, 'Empate': 0, total: 2 });
  assert.equal(porTema.get('otros')!.get('X')!.Empate, 1);
});

test('coincidencias: sin empates', () => {
  const c = coincidencias(vs, ['X', 'Y']);
  // a: Sí/No, b: No/No, c: empate de X (no cuenta)
  assert.deepEqual(c.get('X')!.get('Y'), { iguales: 1, ambos: 2 });
  assert.deepEqual(c.get('Y')!.get('X'), { iguales: 1, ambos: 2 });
});

test('rentas por tramos: «al menos» cuenta en el tramo de su mínimo', () => {
  const d = (total: number | null, incompleto = false) => ({ finanzas: total === null ? null : { rentas: total === 0 && !incompleto ? null : { total, totalIncompleto: incompleto } } }) as unknown as Diputado;
  const r = tramosRentas([d(0), d(10000), d(30000, true), d(null)]);
  assert.equal(r.tramos[0], 1);
  assert.equal(r.tramos[1], 1);
  assert.equal(r.tramos[2], 1);
  assert.equal(r.alMenos, 1);
  assert.equal(r.sinDeclaracion, 1);
});
