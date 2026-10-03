/**
 * Disposición de escaños en semicírculo (gráfico parlamentario).
 * Cada grupo ocupa su propio sector, separado de los demás por un hueco.
 * Es ilustrativa: no reproduce el plano real de asientos del Congreso.
 */
export interface Escano { x: number; y: number; r: number; ang: number }
export interface Sector { desde: number; hasta: number }

/**
 * @param tamanos  número de escaños de cada grupo, de izquierda a derecha
 * @param filas    número de filas (arcos concéntricos)
 * @param rInt     radio de la fila interior (el exterior es 1)
 * @param hueco    ángulo (radianes) entre sectores de grupos contiguos
 */
export function disponerPorGrupos(tamanos: number[], filas = 12, rInt = 0.38, hueco = 0.035) {
  const total = tamanos.reduce((a, b) => a + b, 0);
  const radios = Array.from({ length: filas }, (_, i) => rInt + ((1 - rInt) * i) / (filas - 1));
  const util = Math.PI - hueco * (tamanos.length - 1);
  const paso = (1 - rInt) / (filas - 1);
  const crudo: { x: number; y: number; ang: number; rad: number }[][] = [];
  const sectores: Sector[] = [];
  let ang0 = Math.PI;
  let minSep = Infinity;
  for (const n of tamanos) {
    const theta = (util * n) / total;
    // Reparto por filas (método de cocientes): cada escaño va a la fila con más hueco libre,
    // así la separación entre escaños es casi igual en todas las filas.
    const m = radios.map(() => 0);
    for (let k = 0; k < n; k++) {
      let mejor = 0, q = -1;
      radios.forEach((r, i) => { const c = r / (m[i] + 1); if (c > q) { q = c; mejor = i; } });
      m[mejor]++;
    }
    const sec: { x: number; y: number; ang: number; rad: number }[] = [];
    radios.forEach((r, i) => {
      if (m[i] > 1) minSep = Math.min(minSep, (theta * r) / m[i]);
      for (let k = 0; k < m[i]; k++) {
        const ang = ang0 - (theta * (k + 0.5)) / m[i];
        sec.push({ x: r * Math.cos(ang), y: r * Math.sin(ang), ang, rad: r });
      }
    });
    // Dentro del grupo: de izquierda a derecha y, a igual ángulo, de dentro a fuera
    sec.sort((a, b) => b.ang - a.ang || a.rad - b.rad);
    crudo.push(sec);
    sectores.push({ desde: ang0, hasta: ang0 - theta });
    ang0 -= theta + hueco;
  }
  const rPunto = 0.49 * Math.min(minSep, paso);
  const escanos: Escano[] = crudo.flat().map(({ x, y, ang }) => ({ x, y, ang, r: rPunto }));
  return { escanos, sectores, rPunto };
}
