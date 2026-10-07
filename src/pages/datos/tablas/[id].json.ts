import type { APIRoute } from 'astro';
import { filasTabla, tablasUnicas, generado } from '../../../lib/datos/filas';
import type { FicheroTabla } from '../../../lib/datos/tablas';

/** Cada tabla descargable completa, en JSON compacto (columnas + filas). La página Datos la filtra en el navegador. */
export function getStaticPaths() {
  return tablasUnicas().map((t) => ({ params: { id: t.id }, props: { t } }));
}

export const GET: APIRoute = ({ props }) => {
  const { t } = props as { t: ReturnType<typeof tablasUnicas>[number] };
  const fichero: FicheroTabla = { tabla: t.id, generado: generado(), columnas: t.columnas.map((c) => c.id), filas: filasTabla(t) };
  return new Response(JSON.stringify(fichero), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
