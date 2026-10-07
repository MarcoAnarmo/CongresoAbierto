import type { APIRoute } from 'astro';
import { TABLAS, type IndiceTablas } from '../../../lib/datos/tablas';
import { filasTabla, aniosVotos, filasVotos, generado } from '../../../lib/datos/filas';

/** Cuántas filas tiene cada tabla y qué años hay en las anuales (para la página Datos y para quien use los ficheros). */
export const GET: APIRoute = () => {
  const indice: IndiceTablas = { generado: generado(), tablas: {} };
  for (const t of TABLAS) {
    if (t.particion === 'unica') indice.tablas[t.id] = { filas: filasTabla(t).length };
    else {
      indice.tablas[t.id] = { filas: filasVotos(), anios: aniosVotos() };
    }
  }
  return new Response(JSON.stringify(indice), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
