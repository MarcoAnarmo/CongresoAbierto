import type { APIRoute } from 'astro';
import { diputados, slug, circunscripciones } from '../lib/data';
import { IDIOMAS, enlace } from '../i18n';

/** Mapa del sitio para buscadores: cada página en los cinco idiomas, con sus alternativas (hreflang). */
export const GET: APIRoute = ({ site }) => {
  const rutas = ['/', '/diputados', '/votaciones', '/estadisticas', '/datos', '/metodologia', '/colabora', '/tarjetas', ...circunscripciones.map((c) => `/provincia/${c.id}`), ...diputados.map((d) => `/diputado/${slug(d)}`)];
  const abs = (p: string) => new URL(p, site).href;
  const urls = rutas.flatMap((r) => IDIOMAS.map((l) => {
    const alternativas = IDIOMAS.map((o) => `<xhtml:link rel="alternate" hreflang="${o}" href="${abs(enlace(r, o))}"/>`).join('')
      + `<xhtml:link rel="alternate" hreflang="x-default" href="${abs(enlace(r, 'es'))}"/>`;
    return `<url><loc>${abs(enlace(r, l))}</loc>${alternativas}</url>`;
  }));
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
