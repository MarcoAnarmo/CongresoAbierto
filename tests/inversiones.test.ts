import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mencionaValor, resumenInversiones } from '../src/lib/inversiones.ts';

test('acciones y fondos según la descripción del diputado, sin suponer', () => {
  assert.deepEqual(mencionaValor('81 acciones de Telefonica SA'), { acciones: true, fondos: false });
  assert.deepEqual(mencionaValor('Fondos de ahorro e inversión Bankinter'), { acciones: false, fondos: true });
  assert.deepEqual(mencionaValor('F.I. HORIZONTE 2027 (valoración agosto 2023)'), { acciones: false, fondos: true });
  assert.deepEqual(mencionaValor('Acciones, participaciones y fondos de inversión con cotización oficial'), { acciones: true, fondos: true });
  assert.deepEqual(mencionaValor('FONDO PENSIONES'), { acciones: false, fondos: false });
  assert.deepEqual(mencionaValor('PLAN DE PENSIONES'), { acciones: false, fondos: false });
  assert.deepEqual(mencionaValor('TELEFONICA'), { acciones: false, fondos: false });
  assert.deepEqual(mencionaValor('25% PARTICIPACIONES DE LA SOCIEDAD AUTOLAVADOS HUESCA, S.L.'), { acciones: true, fondos: false });
});

test('suma solo importes legibles; una fila mixta cuenta en las dos', () => {
  const r = resumenInversiones([
    { texto: 'Acciones BBVA', euros: 100.4 },
    { texto: 'Fondo CaixaBank', euros: 50 },
    { texto: 'Acciones y fondos', euros: 10 },
    { texto: 'Acciones Santander', euros: null },
  ]);
  assert.deepEqual(r, { acciones: 110, fondos: 60, nAcciones: 3, nFondos: 2 });
});
