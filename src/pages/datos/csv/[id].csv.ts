import type { APIRoute } from 'astro';
import { filasTabla, tablasUnicas } from '../../../lib/datos/filas';
import { aCsv } from '../../../lib/datos/csv';

/** Tablas completas en CSV estándar (separador «,», UTF-8), con los nombres de columna fijos de tablas.ts. */
export function getStaticPaths() {
  return tablasUnicas().filter((t) => t.csvFijo).map((t) => ({ params: { id: t.id }, props: { t } }));
}

export const GET: APIRoute = ({ props }) => {
  const { t } = props as { t: ReturnType<typeof tablasUnicas>[number] };
  const csv = aCsv(t.columnas.map((c) => c.id), t.columnas.map((c) => c.tipo), filasTabla(t), { formato: 'csv' });
  return new Response(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8' } });
};
