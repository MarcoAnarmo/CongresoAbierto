import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  porGrupo, declaraRentas, masRentas, tiposDeRenta, totalesInversion, masValores, relacionesConEmpresas,
  remuneracionDiputados, conRemuneracion, masNombradas, aportaAOng, cargoEnOng, esOng,
} from '../src/lib/estadisticas-dinero';
import type { Diputado } from '../src/lib/types';

const ap = (relacion: string, remuneracion: string | null = null) => ({ fuente: 'registro', apartado: 'G', relacion, remuneracion, rol: '', texto: '', fecha: null, periodo: null, url: '' });
const ent = (slug: string, tipo: string, ...apariciones: ReturnType<typeof ap>[]) => ({ slug, nombre: slug.toUpperCase(), tipo, apariciones });
const dip = (x: { g?: string; ap?: string; rentas?: { total: number; totalIncompleto?: boolean; filas?: { tipo: string; euros: number | null }[] } | null; valores?: { texto: string; euros: number }[]; entidades?: ReturnType<typeof ent>[]; sinDecl?: boolean }) => ({
  grupoCorto: x.g ?? 'X', apellidos: x.ap ?? 'A',
  finanzas: x.sinDecl ? null : {
    rentas: x.rentas === undefined ? null : x.rentas && { filas: [], totalIncompleto: false, ...x.rentas },
    valores: x.valores ? { filas: x.valores, total: x.valores.reduce((a, f) => a + f.euros, 0), totalIncompleto: false } : null,
  },
  vinculos: { entidades: x.entidades ?? [], borme: [], porTipo: {} },
}) as unknown as Diputado;

test('por grupo: cuenta de cuántos, solo con declaración si se pide', () => {
  const ds = [dip({ g: 'X', rentas: { total: 10 } }), dip({ g: 'X', rentas: { total: 0 } }), dip({ g: 'X', sinDecl: true }), dip({ g: 'Y', rentas: { total: 5 } })];
  assert.deepEqual(porGrupo(ds, ['X', 'Y', 'Z'], declaraRentas, (d) => !!d.finanzas), [{ g: 'X', n: 1, de: 2 }, { g: 'Y', n: 1, de: 1 }]);
});

test('rentas: un importe ilegible cuenta como que declara y se marca «al menos»', () => {
  const ds = [dip({ ap: 'B', rentas: { total: 100 } }), dip({ ap: 'A', rentas: { total: 300, totalIncompleto: true } }), dip({ rentas: { total: 0 } })];
  const top = masRentas(ds);
  assert.deepEqual(top.map((x) => [x.euros, x.alMenos]), [[300, true], [100, false]]);
  assert.equal(ds.filter(declaraRentas).length, 2);
});

test('tipos de renta: una persona cuenta una vez por tipo; las filas a 0 € no cuentan', () => {
  const ds = [dip({ rentas: { total: 5, filas: [{ tipo: 'dividendos', euros: 2 }, { tipo: 'dividendos', euros: 3 }, { tipo: 'intereses', euros: 0 }] } }), dip({ rentas: { total: 1, filas: [{ tipo: 'dividendos', euros: null }] } })];
  const r = tiposDeRenta(ds);
  assert.equal(r.get('dividendos'), 2);
  assert.equal(r.get('intereses'), 0);
});

test('acciones y fondos: una fila mixta cuenta en los dos; los planes de pensiones no son fondos', () => {
  const ds = [
    dip({ valores: [{ texto: 'Acciones Telefónica', euros: 100 }, { texto: 'Plan de pensiones', euros: 50 }] }),
    dip({ valores: [{ texto: 'Acciones y fondos de inversión', euros: 40 }] }),
    dip({}),
  ];
  const t = totalesInversion(ds);
  assert.deepEqual([t.valores, t.acciones, t.fondos, t.eurosValores, t.eurosAcciones, t.eurosFondos], [2, 2, 1, 190, 140, 40]);
  assert.deepEqual(masValores(ds).map((x) => x.euros), [150, 40]);
});

test('empresas: relaciones por diputado, remuneración solo si el documento lo dice', () => {
  const ds = [
    dip({ entidades: [ent('telefonica', 'empresa', ap('acciones')), ent('santander', 'empresa', ap('acciones'), ap('trabajo-anterior'))] }),
    dip({ entidades: [ent('vox', 'partido', ap('partido', 'si')), ent('ayto', 'publica', ap('cargo-publico', 'dietas'), ap('cargo-publico', 'no'))] }),
    dip({ entidades: [ent('uni', 'educacion', ap('autorizada'))] }),
  ];
  assert.deepEqual(relacionesConEmpresas(ds), [{ relacion: 'acciones', n: 1 }, { relacion: 'trabajo-anterior', n: 1 }]);
  const r = remuneracionDiputados(ds);
  assert.deepEqual([r.get('si'), r.get('dietas'), r.get('no'), r.get('complemento')], [1, 1, 1, 0]);
  assert.deepEqual(conRemuneracion(ds).map((x) => x.entidades.map((e) => e.nombre)), [['VOX']]);
});

test('ONG: aportar no es tener un cargo; cada diputado cuenta una vez por entidad', () => {
  const ds = [
    dip({ entidades: [ent('cruz-roja', 'asociacion', ap('aportacion'), ap('aportacion'))] }),
    dip({ entidades: [ent('cruz-roja', 'asociacion', ap('aportacion')), ent('fundacion-x', 'fundacion', ap('otras'))] }),
  ];
  assert.equal(ds.filter(aportaAOng).length, 2);
  assert.equal(ds.filter(cargoEnOng).length, 1);
  assert.deepEqual(masNombradas(ds, (e, a) => esOng(e.tipo) && a.relacion === 'aportacion'), [{ nombre: 'CRUZ-ROJA', tipo: 'asociacion', n: 2 }]);
});
