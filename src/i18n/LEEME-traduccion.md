# Cómo está traducida la web (guía para quien toque textos)

Idiomas: `es` (castellano, raíz `/`), `ca` (català/valencià, `/ca/`), `eu` (euskara, `/eu/`), `gl` (galego, `/gl/`), `en` (English, `/en/`).

## Rutas
- Todas las páginas viven en `src/pages/[...lang]/`. `lang` es `undefined` en castellano y `ca|eu|gl|en` en el resto.
- Páginas simples: `export const getStaticPaths = rutasIdioma; const lang = idiomaDe(Astro.params.lang);`
- Rutas con más parámetros: `getStaticPaths() { return conIdiomas([...]) }` → `Astro.props.lang`.
- En componentes (sin params): `const lang = idiomaDeUrl(Astro.url.pathname);`
- Enlaces internos en el servidor: `enlace('/diputados', lang)` (de `src/i18n`), NUNCA `url()` para páginas. `url()` sigue valiendo para ficheros comunes a todos los idiomas (`/datos/…`, `/logo.svg`, fotos).
- Las tarjetas PNG tienen una versión por idioma: `/ca/tarjetas/historia/diputado/<slug>.png`.

## Textos
- Un fichero por área en `src/i18n/textos/<area>.ts`, con los cinco idiomas:
  ```ts
  import { area } from '..';
  const es = { titulo: 'Diputados', cuenta: (n: number) => `${n} diputados`, cliente: { buscar: 'Buscar…', viviendas: ['{n} vivienda', '{n} viviendas'] } };
  export default area(es, { ca: {...}, eu: {...}, gl: {...}, en: {...} });
  ```
  TypeScript exige las mismas claves en todos los idiomas.
- Uso: `import textos from '../i18n/textos/diputados'; const t = textos[lang];`
- Textos comunes (menú, pie, voto Sí/No…, temas, elecciones, plurales básicos): `src/i18n/textos/comun.ts`.
- Plurales e interpolación: `f(plantilla, {n})` y `pl(n, [uno, varios], lang)` de `src/i18n`.
- Números, importes y fechas: `formatos(lang)` → `{ eur, eur2, num, fecha, fechaCorta, comparar }`.

## Scripts del navegador
- Solo pueden recibir cadenas: la parte `cliente` de cada área (cadenas con `{n}` y pares `[singular, plural]`).
- El componente la pinta: `<script type="application/json" data-textos="diputados" set:html={JSON.stringify(t.cliente)} />`
- El script la lee con `textos<T>('diputados')` y usa `f`, `pl`, `fmtNum`, `fmtEur`, `fmtFecha`, `locale()`, `prefijo()` (enlaces a páginas: `${prefijo()}/diputado/…`) y `base()` (ficheros comunes: `${base()}/datos/…`) de `src/i18n/cliente.ts`.

## Qué NO se traduce
Los datos oficiales, tal como los publica el Congreso: nombres, partidos y grupos, circunscripciones, títulos y tipos de
votaciones, cargos, estudios y trayectoria, textos literales de las declaraciones, nombres de documentos. Sí se traducen
las etiquetas, explicaciones, botones y categorías propias de la web.

## Estilo
- Tuteo (castellano «tú», català «tu», galego «ti», euskara «zu»), frases cortas y claras, sin interpretaciones.
- Català estándar (válido también en valenciano). Euskara batua.
- Lema y subtítulo siempre sin punto final. Nunca la media: totales.
- Glosario: diputado/a → diputat/da · diputatua · deputado/a · deputy; Congreso → Congrés · Kongresua · Congreso · Congress;
  Pleno → Ple · Osoko Bilkura · Pleno · plenary; votación → votació · bozketa · votación · vote; grupo parlamentario → grup
  parlamentari · talde parlamentarioa · grupo parlamentario · parliamentary group; propiedad → propietat · jabetza ·
  propiedade · property; vivienda → habitatge · etxebizitza · vivenda · home; vehículo → vehicle · ibilgailua · vehículo ·
  vehicle; declaración de bienes → declaració de béns · ondasun-aitorpena · declaración de bens · asset declaration;
  retribución → retribució · ordainsaria · retribución · pay; legislatura → legislatura · legegintzaldia · lexislatura · term;
  ficha → fitxa · fitxa · ficha · profile; hemiciclo → hemicicle · hemizikloa · hemiciclo · chamber; tarjeta → targeta ·
  txartela · tarxeta · card; circunscripción/provincia → circumscripció · barrutia · circunscrición · constituency;
  «Lectura no confirmada» → «Lectura no confirmada» · «Irakurketa berretsi gabea» · «Lectura non confirmada» · «Unconfirmed reading».
