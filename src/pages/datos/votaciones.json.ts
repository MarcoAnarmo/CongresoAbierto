import type { APIRoute } from 'astro';
import { votacionesPleno, pendientes } from '../../lib/data';
import { aItem, itemPendiente, ordenar } from '../../lib/votaciones';

/** Índice de todas las votaciones del Pleno (sin el voto de cada diputado, que está en /datos/votos/<id>.json). */
export const GET: APIRoute = () => new Response(JSON.stringify(ordenar([...pendientes.map(itemPendiente), ...votacionesPleno.map(aItem)])), {
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
});
