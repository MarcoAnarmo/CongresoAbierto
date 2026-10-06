import { test } from 'node:test';
import assert from 'node:assert/strict';
import { votoMayoritario, esRentaDeAlquiler, tramoDe } from '../src/lib/datos/derivados';

test('voto mayoritario de un grupo', () => {
  assert.equal(votoMayoritario(10, 2, 1), 'Sí');
  assert.equal(votoMayoritario(0, 3, 5), 'Abstención');
  assert.equal(votoMayoritario(4, 4, 1), 'Empate');
  assert.equal(votoMayoritario(0, 0, 0), null);
});

test('rentas de alquiler por el concepto declarado', () => {
  assert.ok(esRentaDeAlquiler({ texto: 'ALQUILER DE VIVIENDA AL 50%', tipo: 'otras' }));
  assert.ok(esRentaDeAlquiler({ texto: 'Rendimientos del capital inmobiliario', tipo: 'otras' }));
  assert.ok(esRentaDeAlquiler({ texto: 'Arrendamiento de piso', tipo: 'otras' }));
  // Una empresa con «arrendamientos» en el nombre que paga dividendos no es un alquiler
  assert.ok(!esRentaDeAlquiler({ texto: 'DIVIDENDOS ESTACIONES Y ARRENDAMIENTOS S.A.', tipo: 'dividendos' }));
  assert.ok(!esRentaDeAlquiler({ texto: 'Nómina Xunta de Galicia', tipo: 'salariales' }));
});

test('tramos', () => {
  const cortes = [20000, 50000];
  assert.equal(tramoDe(0, cortes), 0);
  assert.equal(tramoDe(19999.99, cortes), 0);
  assert.equal(tramoDe(20000, cortes), 1);
  assert.equal(tramoDe(80000, cortes), 2);
});
