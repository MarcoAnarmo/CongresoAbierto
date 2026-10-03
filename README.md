# Congreso Abierto

**https://congresoabierto.pages.dev**

Web estática, ligera y de código abierto que acerca a la ciudadanía los datos **públicos** de los 350 diputados del Congreso:

- **Hemiciclo interactivo**: grupo, propiedades y viviendas de cada escaño, y su voto en las votaciones clave.
- **Propiedades, viviendas y vehículos** que cada diputado declara en su *Declaración de Bienes y Rentas*.
- **Retribución mensual** de cada diputado según los importes oficiales del régimen económico de la Cámara (2026).
- **Votaciones sobre vivienda**, con el contenido literal de cada texto, sus documentos oficiales y filtros.
- **Ranking** de propiedades y viviendas por diputado y por grupo parlamentario.

**Principio:** solo información oficial del Estado (Congreso de los Diputados, BOE y Boletín Oficial de las Cortes Generales), sin interpretaciones ni opiniones. Cada dato enlaza a su documento original para que cada persona juzgue por sí misma.

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
    previas.tsv          declaraciones anteriores de cada diputado
    patrimonio/revisado.jsonl  transcripción literal y revisada de cada declaración de bienes
    pdf/                 PDFs oficiales descargados (no se suben al repositorio)
    votaciones/          votaciones clave (formato compacto)
  manual/              datos editados a mano: grupos, votaciones clave y pendientes, correcciones
  congreso/            JSON finales que lee la web (generados, no editar)
scripts/
  build-data.ts        une todo y genera data/congreso/*.json
  retribuciones.ts     tablas oficiales y cálculo de retribuciones
  patrimonio.ts        reglas para contar propiedades y viviendas
  browser/             utilidades para ejecutar en la consola de congreso.es
src/                   web (Astro + TypeScript)
public/                logo, iconos y cabeceras HTTP (_headers)
docs/                  metodología técnica
.github/               plantillas de issues y pull requests, y comprobación automática (CI)
```

## Actualizar los datos

congreso.es bloquea muchas descargas automáticas, así que la descarga se hace **desde el navegador**:

1. Abre https://www.congreso.es/es/opendata/votaciones y la consola (F12).
2. Pega `scripts/browser/descargar-datos.js`: descarga `diputados_base.tsv`, `fichas.tsv` y `previas.tsv`. Cópialos a `data/raw/`.
3. Para añadir **todas las votaciones del Pleno** de un día: pega `scripts/browser/votaciones-pleno.js`, elige el día en el calendario de la página y ejecuta `await window._bajarVotaciones()`. Copia los `votaciones-AAAAMMDD.jsonl` a `data/raw/votaciones/descargas/` y ejecuta `npm run data:votaciones && npm run data:build`. Los temas se asignan con `data/manual/temas.json` (correcciones puntuales en `data/manual/temas-correcciones.json`).
4. Para añadir una votación **clave** (con documentos y contenido revisados): en la misma consola, `await window._votacion('mi-id', 'SesionNNN/AAAAMMDD/VotacionNNN/VOT_xxxxxxxx')` y pega la línea en `data/raw/votaciones/votaciones-compactas.txt`. Añade en `data/manual/votaciones-clave.json` el texto oficial del expediente, su tipo, sus documentos oficiales (BOE, BOCG, Diario de Sesiones, PDF de la votación) y su contenido: títulos de artículos o extractos literales del texto oficial, sin resúmenes propios.
5. Para transcribir una declaración de bienes nueva, pega `scripts/browser/visor-declaraciones.js` y usa `await window._compose(cod, urlPdf)`, que muestra la tabla de inmuebles y la de vehículos en una sola imagen. Sigue `data/raw/patrimonio/INSTRUCCIONES.md`.
6. `npm run data:build && npm run build`.

## Despliegue

La web se publica en **Cloudflare Pages**, conectada a este repositorio: https://congresoabierto.pages.dev

- Cada *merge* en `main` publica la web en producción.
- Cada *pull request* desde una rama de este repositorio genera una vista previa con su propia URL. Los que llegan desde un *fork* no la tienen, pero GitHub Actions comprueba que la web compila en todos.
- Configuración: comando `npm run build`, carpeta `dist`, Node 22 (`.node-version`). Las cabeceras de caché y seguridad están en `public/_headers`.

Es una web 100 % estática, así que también funciona en cualquier otro hosting estático con el mismo comando y carpeta.

## Contacto

congresoabierto.help@gmail.com. Para errores en los datos o sugerencias, mejor abre una *issue* para que quede pública.

## Licencia

Código bajo licencia MIT. Los datos y las fotografías proceden de fuentes públicas oficiales (Congreso de los Diputados, BOE y BOCG); las fotos se cargan directamente desde congreso.es.
