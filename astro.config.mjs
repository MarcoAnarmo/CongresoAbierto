// @ts-check
import { defineConfig } from 'astro/config';

// Web estática: se genera HTML en build y se puede desplegar en Vercel,
// Netlify, Cloudflare Pages o GitHub Pages sin servidor.
export default defineConfig({
  output: 'static',
  site: 'https://congresoabierto.vercel.app',
  trailingSlash: 'ignore',
});
