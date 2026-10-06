import { test } from 'node:test';
import assert from 'node:assert/strict';
import { origen, tituloSinFormula, partirLineas } from '../src/lib/tarjetas/votacion';

test('quién lo propuso, según el título oficial', () => {
  assert.deepEqual(origen('Proposición de Ley del Grupo Parlamentario VOX, Orgánica de modificación de la Ley Orgánica 4/2000.', 'pl'), { tipo: 'grupos', grupos: ['VOX'], clase: 'pl' });
  assert.deepEqual(origen('Proposición de Ley de los Grupos Parlamentarios Plurinacional SUMAR y Mixto, por la que se reforma la Ley 53/2007.', 'pl'), { tipo: 'grupos', grupos: ['SUMAR', 'Mixto'], clase: 'pl' });
  assert.deepEqual(origen('Proposición no de Ley del Grupo Parlamentario SUMAR, relativa a la reducción de la jornada.', 'pnl'), { tipo: 'grupos', grupos: ['SUMAR'], clase: 'pnl' });
  // Una enmienda de los grupos a un proyecto del Gobierno es de los grupos
  assert.deepEqual(origen('Votación conjunta de las enmiendas a la totalidad de devolución al Proyecto de Ley para la reducción de la jornada, presentadas por los Grupos Parlamentarios Junts per Catalunya, VOX y Popular en el Congreso.', 'leg'),
    { tipo: 'grupos', grupos: ['PP', 'VOX', 'Junts'], clase: 'enmienda' });
  assert.deepEqual(origen('Real Decreto-ley 8/2026, de 20 de marzo, de medidas en el alquiler.', 'rdl'), { tipo: 'decreto' });
  assert.deepEqual(origen('Proyecto de Ley de presupuestos.', 'leg'), { tipo: 'proyecto' });
  assert.deepEqual(origen('Proposición de reforma del Reglamento del Congreso de los Diputados.', 'otro'), { tipo: 'otro' });
});

test('título sin la fórmula del principio (lo que queda es literal)', () => {
  assert.equal(tituloSinFormula('Proposición de Ley del Grupo Parlamentario Mixto, para la reducción de la duración máxima de la jornada ordinaria de trabajo a 35 horas semanales.'),
    'Para la reducción de la duración máxima de la jornada ordinaria de trabajo a 35 horas semanales');
  assert.equal(tituloSinFormula('Proposición de Ley para una regularización extraordinaria para personas extranjeras en España (corresponde al número de expediente 120/000026/0000 de la XIV Legislatura).'),
    'Para una regularización extraordinaria para personas extranjeras en España');
  assert.equal(tituloSinFormula('Votación conjunta de las enmiendas a la totalidad de devolución al Proyecto de Ley X.'), 'Enmiendas a la totalidad de devolución al Proyecto de Ley X');
  assert.equal(tituloSinFormula('Real Decreto-ley 8/2026, de medidas en el alquiler.'), 'Real Decreto-ley 8/2026, de medidas en el alquiler');
});

test('partir en líneas con «…» si no cabe', () => {
  const medir = (s: string) => s.length; // una letra = 1
  assert.deepEqual(partirLineas('uno dos tres cuatro', 8, 3, medir), { lineas: ['uno dos', 'tres', 'cuatro'], cortado: false });
  const r = partirLineas('uno dos tres cuatro cinco', 8, 2, medir);
  assert.equal(r.cortado, true);
  assert.equal(r.lineas.length, 2);
  assert.ok(r.lineas[1].endsWith('…') && r.lineas[1].length <= 8);
  // Una palabra más larga que la línea se corta
  assert.deepEqual(partirLineas('abcdefghij', 4, 5, medir).lineas, ['abcd', 'efgh', 'ij']);
});
