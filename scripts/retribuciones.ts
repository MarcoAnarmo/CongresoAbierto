/**
 * Cálculo de retribuciones de diputados del Congreso (año 2026).
 *
 * Fuente oficial: https://www.congreso.es/es/cem/regecodip
 * (consultada el 03/10/2026). Todos los importes en EUR/mes.
 *
 * Reglas oficiales:
 *  - Asignación constitucional idéntica para todos.
 *  - Complementos por cargo en la Mesa / Junta de Portavoces de la Cámara
 *    y por cargo en Comisión. "Los de cada grupo no son acumulables":
 *    se toma el mayor de la Cámara y el mayor de Comisión.
 *  - Indemnización (exenta de IRPF) distinta para electos por Madrid.
 *
 * Solo se suman importes mensuales oficiales; no se estiman pagas anuales.
 */

export const FUENTE_RETRIBUCIONES = 'https://www.congreso.es/es/cem/regecodip';
export const ANIO_RETRIBUCIONES = 2026;

export const ASIGNACION = 3366.99;
export const INDEMNIZACION_MADRID = 1032.38;
export const INDEMNIZACION_OTRAS = 2162.85;

interface Complemento {
  etiqueta: string;
  complementoMesa: number;
  gastosRepresentacion: number;
  gastosLibreDisposicion: number;
}

/** Cargos de la Cámara (Mesa y Junta de Portavoces). */
export const CARGOS_CAMARA: Record<string, Complemento> = {
  presidencia: { etiqueta: 'Presidencia del Congreso', complementoMesa: 3683.74, gastosRepresentacion: 4000.26, gastosLibreDisposicion: 3279.85 },
  vicepresidencia: { etiqueta: 'Vicepresidencia de la Mesa', complementoMesa: 1449.9, gastosRepresentacion: 1211.65, gastosLibreDisposicion: 847.57 },
  secretaria: { etiqueta: 'Secretaría de la Mesa', complementoMesa: 1132.08, gastosRepresentacion: 981.04, gastosLibreDisposicion: 811.91 },
  portavoz: { etiqueta: 'Portavoz de grupo', complementoMesa: 0, gastosRepresentacion: 2087.08, gastosLibreDisposicion: 1110.33 },
  portavozAdjunto: { etiqueta: 'Portavoz adjunto/a de grupo', complementoMesa: 0, gastosRepresentacion: 1704.48, gastosLibreDisposicion: 792.57 },
};

/** Cargos en Comisión (solo gastos de representación). */
export const CARGOS_COMISION: Record<string, Complemento> = {
  presidenciaComision: { etiqueta: 'Presidencia de Comisión', complementoMesa: 0, gastosRepresentacion: 1712.5, gastosLibreDisposicion: 0 },
  vicepresidenciaComision: { etiqueta: 'Vicepresidencia de Comisión', complementoMesa: 0, gastosRepresentacion: 1252.04, gastosLibreDisposicion: 0 },
  portavozComision: { etiqueta: 'Portavoz de Comisión', complementoMesa: 0, gastosRepresentacion: 1252.04, gastosLibreDisposicion: 0 },
  secretariaComision: { etiqueta: 'Secretaría de Comisión', complementoMesa: 0, gastosRepresentacion: 834.71, gastosLibreDisposicion: 0 },
  portavozAdjuntoComision: { etiqueta: 'Portavoz adjunto/a de Comisión', complementoMesa: 0, gastosRepresentacion: 834.71, gastosLibreDisposicion: 0 },
};

const total = (c: Complemento) => c.complementoMesa + c.gastosRepresentacion + c.gastosLibreDisposicion;

/** Clasifica un cargo literal de la ficha del Congreso. */
export function clasificarCargo(cargo: string): { ambito: 'camara' | 'comision'; clave: string } | null {
  const c = cargo.trim();
  // Cámara
  if (/^President[ea] del Congreso de los Diputados/.test(c)) return { ambito: 'camara', clave: 'presidencia' };
  if (/^Vicepresident[ea] \w+ de la Mesa del Congreso/.test(c)) return { ambito: 'camara', clave: 'vicepresidencia' };
  if (/^Secretari[oa] \w+ de la Mesa del Congreso/.test(c)) return { ambito: 'camara', clave: 'secretaria' };
  if (/^Portavoz Titular de la Junta de Portavoces/.test(c)) return { ambito: 'camara', clave: 'portavoz' };
  if (/^Portavoz adjunt[oa] de la Junta de Portavoces/.test(c)) return { ambito: 'camara', clave: 'portavozAdjunto' };
  // Comisión (excluye Subcomisiones, Ponencias y órganos internacionales)
  if (!/ de la Comisi[oó]n /.test(c) || /Subcomisi[oó]n|Ponencia/.test(c)) return null;
  if (/^President[ea] de la Comisi/.test(c)) return { ambito: 'comision', clave: 'presidenciaComision' };
  if (/^Vicepresident[ea]( \w+)? de la Comisi/.test(c)) return { ambito: 'comision', clave: 'vicepresidenciaComision' };
  if (/^Secretari[oa]( \w+)? de la Comisi/.test(c)) return { ambito: 'comision', clave: 'secretariaComision' };
  if (/^Portavoz de la Comisi/.test(c)) return { ambito: 'comision', clave: 'portavozComision' };
  if (/^Portavoz adjunt[oa] de la Comisi/.test(c)) return { ambito: 'comision', clave: 'portavozAdjuntoComision' };
  return null;
}

export function calcularRetribucion(cargos: string[], circunscripcion: string) {
  let mejorCamara: Complemento | null = null;
  let mejorComision: Complemento | null = null;
  for (const cargo of cargos) {
    const k = clasificarCargo(cargo);
    if (!k) continue;
    const comp = k.ambito === 'camara' ? CARGOS_CAMARA[k.clave] : CARGOS_COMISION[k.clave];
    if (k.ambito === 'camara') {
      if (!mejorCamara || total(comp) > total(mejorCamara)) mejorCamara = comp;
    } else if (!mejorComision || total(comp) > total(mejorComision)) {
      mejorComision = comp;
    }
  }
  const comps = [mejorCamara, mejorComision].filter((c): c is Complemento => c !== null);
  const mensual = {
    asignacion: ASIGNACION,
    complementoMesa: round(comps.reduce((a, c) => a + c.complementoMesa, 0)),
    gastosRepresentacion: round(comps.reduce((a, c) => a + c.gastosRepresentacion, 0)),
    gastosLibreDisposicion: round(comps.reduce((a, c) => a + c.gastosLibreDisposicion, 0)),
    indemnizacion: circunscripcion === 'Madrid' ? INDEMNIZACION_MADRID : INDEMNIZACION_OTRAS,
  };
  const totalMensual = round(mensual.asignacion + mensual.complementoMesa + mensual.gastosRepresentacion + mensual.gastosLibreDisposicion + mensual.indemnizacion);
  return { mensual, totalMensual, cargosRetribuidos: comps.map((c) => c.etiqueta) };
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}
