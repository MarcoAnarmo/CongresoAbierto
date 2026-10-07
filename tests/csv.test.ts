import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aCsv, celdaCsv } from '../src/lib/datos/csv';

test('Excel: punto y coma, coma decimal, BOM y CRLF', () => {
  const s = aCsv(['Nombre', 'Importe'], ['texto', 'decimal'], [['Ana', 1234.5]], { formato: 'excel', booleanos: ['Sí', 'No'] });
  assert.equal(s, '\uFEFFNombre;Importe\r\nAna;1234,5\r\n');
});

test('CSV estándar: comas y punto decimal, sin BOM', () => {
  assert.equal(aCsv(['a', 'b'], ['texto', 'decimal'], [['x', 1.5]], { formato: 'csv' }), 'a,b\nx,1.5\n');
});

test('entrecomilla separadores, comillas y saltos de línea', () => {
  assert.equal(celdaCsv('Madrid, centro', 'texto', { formato: 'csv' }), '"Madrid, centro"');
  assert.equal(celdaCsv('dijo "sí"', 'texto', { formato: 'csv' }), '"dijo ""sí"""');
  assert.equal(celdaCsv('a;b', 'texto', { formato: 'excel' }), '"a;b"');
  assert.equal(celdaCsv('a;b', 'texto', { formato: 'csv' }), 'a;b');
});

test('protege el texto que Excel ejecutaría como fórmula', () => {
  assert.equal(celdaCsv('=HYPERLINK("x")', 'texto', { formato: 'csv' }), '"\'=HYPERLINK(""x"")"');
  assert.equal(celdaCsv('+34', 'texto', { formato: 'csv' }), "'+34");
  // Los números negativos no son texto: no se tocan
  assert.equal(celdaCsv(-5, 'decimal', { formato: 'csv' }), '-5');
});

test('vacíos y booleanos', () => {
  assert.equal(celdaCsv(null, 'texto', { formato: 'csv' }), '');
  assert.equal(celdaCsv(true, 'booleano', { formato: 'csv' }), 'true');
  assert.equal(celdaCsv(false, 'booleano', { formato: 'excel', booleanos: ['Sí', 'No'] }), 'No');
});
