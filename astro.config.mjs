// @ts-check
import { defineConfig } from 'astro/config';

// Web estática: se genera HTML en build y se despliega en Cloudflare Pages
// (sirve igual en cualquier hosting estático).
export default defineConfig({
  output: 'static',
  site: 'https://congresoabierto.pages.dev',
  trailingSlash: 'ignore',
});
