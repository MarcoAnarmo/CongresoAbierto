# Congreso Abierto

Web estática, ligera y de código abierto que acerca a la ciudadanía los datos **públicos** de los 350 diputados del Congreso:

- **Retribución mensual** de cada diputado según los importes oficiales del régimen económico de la Cámara (2026).
- **Viviendas y vehículos** que cada diputado declara en su *Declaración de Bienes y Rentas*.
- **Votaciones clave** (de momento, vivienda) voto a voto, en un hemiciclo interactivo.
- **Ranking** de viviendas por diputado y por grupo parlamentario.

**Principio:** solo información oficial del Estado (Congreso de los Diputados y BOE), sin interpretaciones ni opiniones. Cada dato enlaza a su documento original para que cada persona juzgue por sí misma.

> Las 429 declaraciones de bienes (PDF escaneados) se han copiado literalmente y revisado dos veces contra el original. Ver [docs/metodologia.md](docs/metodologia.md).

## Colabora

El proyecto es público y cualquiera puede ayudar, sepa o no programar. Todos los cambios llegan mediante *pull request* y se revisan antes de publicarse.

- [Avisar de un error en un dato](https://github.com/MarcoAnarmo/CongresoAbierto/issues/new?template=error-en-un-dato.yml)
- [Hacer una sugerencia](https://github.com/MarcoAnarmo/CongresoAbierto/issues/new?template=sugerencia.yml)
- [Tareas para empezar](https://github.com/MarcoAnarmo/CongresoAbierto/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
- [Guía para colaborar](CONTRIBUTING.md) · [Código de conducta](CODE_OF_CONDUCT.md)

Lo más útil ahora mismo: **revisar fichas** contra su PDF oficial y añadir parlamentos autonómicos.

## Puesta en marcha

Requisitos: Node 22.12 o superior.

```bash
npm install
npm run data:build   # genera data/congreso/*.json a partir de data/raw y data/manual
npm run dev          # http://localhost:4321
npm run build        # web estática en dist/
```

## Estructura

```
data/
  raw/                 datos en bruto descargados del Congreso
    diputados_base.tsv   lista oficial de diputados
    fichas.tsv           cargos y declaración de bienes de cada ficha
    patrimonio/revisado.jsonl  transcripción literal y revisada de cada declaración de bienes
    pdf/                 PDFs oficiales descargados (no se suben al repositorio)
    votaciones/          votaciones clave (formato compacto)
  manual/              datos editados a mano: grupos, votaciones clave, correcciones
  congreso/            JSON finales que lee la web (generados, no editar)
scripts/
  build-data.ts        une todo y genera data/congreso/*.json
  retribuciones.ts     tablas oficiales y cálculo de retribuciones
  patrimonio.ts        reglas para contar viviendas y porcentajes
  browser/             utilidades para ejecutar en la consola de congreso.es
src/                   web (Astro + TypeScript)
```

## Actualizar los datos

congreso.es bloquea muchas descargas automáticas, así que la descarga se hace **desde el navegador**:

1. Abre https://www.congreso.es/es/opendata/votaciones y la consola (F12).
2. Pega `scripts/browser/descargar-datos.js`: descarga `diputados_base.tsv`, `fichas.tsv` y `previas.tsv`. Cópialos a `data/raw/`.
3. Para añadir una votación: en la misma consola, `await window._votacion('mi-id', 'SesionNNN/AAAAMMDD/VotacionNNN/VOT_xxxxxxxx')` y pega la línea en `data/raw/votaciones/votaciones-compactas.txt`. Añade en `data/manual/votaciones-clave.json` el texto oficial del expediente, su tipo y el enlace oficial (sin resúmenes propios).
4. Para transcribir una declaración de bienes nueva, pega `scripts/browser/visor-declaraciones.js` y usa `await window._compose(cod, urlPdf)`, que muestra la tabla de inmuebles y la de vehículos en una sola imagen. Sigue `data/raw/patrimonio/INSTRUCCIONES.md`.
5. `npm run data:build && npm run build`.

## Desplegar gratis

Es una web 100 % estática (`dist/`), así que funciona en cualquier hosting estático:

- **Vercel**: importa el repositorio de GitHub; detecta Astro solo (build `npm run build`, salida `dist`).
- **Cloudflare Pages** o **Netlify**: mismo comando y carpeta.
- **GitHub Pages**: con la acción oficial `withastro/action`.

## Licencia

Código bajo licencia MIT. Los datos proceden de fuentes públicas oficiales del Congreso de los Diputados.
