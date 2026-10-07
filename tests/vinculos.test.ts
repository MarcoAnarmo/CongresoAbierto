import { test } from 'node:test';
import assert from 'node:assert/strict';
import { relacionDe, remuneracionDe, esLiteral, claveEntidad } from '../src/lib/vinculos.ts';

const BOILER = ' Se autoriza en los términos del artículo 159.3. c) de la LOREG, sin la posibilidad de percibir remuneración del sector público y sin poder incurrir en las actividades del artículo 159.2, ni menoscabar el régimen de dedicación absoluta a las tareas parlamentarias establecido en el artículo 157.1, todos ellos de la LOREG.';

test('relación según el artículo que cita el acuerdo del Congreso', () => {
  const c = (texto: string) => relacionDe({ fuente: 'compatibilidad', apartado: 'x', texto });
  assert.equal(c('Consejero en Efriasa S.A., renunciando a las rentas.' + BOILER), 'autorizada');
  assert.equal(c('Alcalde de Centelles, sin percibir ningún tipo de remuneración. Actividad compatible, conforme al art. 157.1 de la LOREG.'), 'cargo-publico');
  assert.equal(c('Vocal de la ejecutiva provincial del PSOE, sin remuneración. Actividad compatible según criterio reiterado en relación con los cargos y actividades en los partidos políticos y grupos parlamentarios.'), 'partido');
  assert.equal(c('Funcionaria, en situación de servicios especiales, percibiendo el correspondiente complemento por antigüedad. La Comisión toma conocimiento.'), 'excedencia');
  assert.equal(c('Cese del cargo de Vicepresidente del partido político VOX. La Comisión toma conocimiento.'), 'cese');
  assert.equal(c('Profesor asociado. Actividad compatible conforme al art. 157.4 de la LOREG.'), 'docencia');
  assert.equal(relacionDe({ fuente: 'registro', apartado: 'G', texto: '' }), 'autorizada');
  assert.equal(relacionDe({ fuente: 'intereses', apartado: 'contribuciones', texto: '' }), 'aportacion');
  assert.equal(relacionDe({ fuente: 'bienes', apartado: 'valores', texto: '' }), 'acciones');
});

test('remuneración: solo lo que dice el documento, nunca la fórmula fija del acuerdo', () => {
  assert.equal(remuneracionDe('Administrador único y propietario del 100 % de las participaciones de Carvajal Agrícola S.L.' + BOILER), null);
  assert.equal(remuneracionDe('Consejero en Efriasa S.A., renunciando a las rentas que pueda obtener.' + BOILER), 'no');
  assert.equal(remuneracionDe('Patrono de la Fundación X, sin remuneración.' + BOILER), 'no');
  assert.equal(remuneracionDe('Concejala, sin percibir ningún tipo de remuneración, salvo indemnización por asistencia a órganos de la Corporación. Actividad compatible, conforme al art. 157.1'), 'dietas');
  assert.equal(remuneracionDe('Funcionaria en servicios especiales, percibiendo el correspondiente complemento por antigüedad. La Comisión toma conocimiento.'), 'complemento');
  assert.equal(remuneracionDe('Colaborador en Al rojo vivo, percibiendo honorarios.' + BOILER), 'si');
  assert.equal(remuneracionDe('CARVAJAL AGRICOLA SL · PRIVADO AGRICOLA · ADMINISTRADOR UNICO'), null);
  assert.equal(remuneracionDe('Accionista minoritario en Roga, S.L. Esta sociedad no contrata con el sector público, ni percibe subvenciones no regladas.'), null);
  assert.equal(remuneracionDe('Administrador Mancomunado de X S.L., no percibiendo ingresos por la condición de administrador.'), 'no');
  assert.equal(remuneracionDe('Renuncia al consejo de SCPSA, sin remuneración salvo las indemnizaciones por asistencia.'), 'dietas');
  assert.equal(remuneracionDe('Presidente del Partido Popular, percibiendo gastos de representación. Actividad compatible según criterio reiterado'), 'dietas');
  assert.equal(remuneracionDe('Alcaldesa de Maella, por el que percibe una retribución por una dedicación parcial, cantidad a la que renuncia.'), 'no');
  assert.equal(remuneracionDe('Patrono de las Fundaciones Pablo Iglesias y Sistema, sin percepción económica.'), 'no');
  assert.equal(remuneracionDe('Partner en la consultora X, sin relación laboral o retribución ninguna.' + BOILER), 'no');
  assert.equal(remuneracionDe('Concejal, sin dedicación exclusiva.'), null);
  assert.equal(remuneracionDe('Vicesecretario Nacional de VOX, con remuneración. Actividad compatible según criterio reiterado'), 'si');
});

test('las entidades son copias literales y sus variantes se agrupan', () => {
  assert.ok(esLiteral('Telefonica SA', '81 acciones de Telefónica SA'));
  assert.ok(!esLiteral('Telefónica Móviles', '81 acciones de Telefonica SA'));
  assert.equal(claveEntidad('Telefónica, S.A.'), claveEntidad('TELEFONICA SA'));
});
