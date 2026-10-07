# Metodología

La versión legible está en la propia web (`/metodologia`, fichero `src/pages/metodologia.astro`). Aquí, el detalle técnico.

## Fuentes (XV Legislatura)

| Dato | Fuente | Cómo se obtiene |
|---|---|---|
| Diputados | Buscador de diputados de congreso.es | `scripts/browser/descargar-datos.js` |
| Cargos | Ficha de cada diputado | idem |
| Patrimonio | Declaración de Bienes y Rentas (PDF escaneado) | Transcripción con `scripts/browser/visor-declaraciones.js` |
| Votaciones | Datos abiertos de votaciones (JSON) | `scripts/browser/votaciones-pleno.js` + `npm run data:votaciones` (todas las del Pleno); `window._votacion()` (votaciones clave) |
| Formación y trayectoria | Ficha personal de cada diputado | `scripts/browser/fichas-personales.js` |
| Deudas | Declaración de Bienes y Rentas (pág. 4) | Transcripción según `data/raw/deudas/INSTRUCCIONES.md` |
| Fotos | Foto oficial de cada ficha | `scripts/browser/fotos.js` + `scripts/fotos.ts` |
| Textos votados | BOE (decretos-leyes), BOCG (proposiciones) y Diario de Sesiones | Enlaces y extractos literales en `data/manual/votaciones-clave.json` |
| Retribuciones | https://www.congreso.es/es/cem/regecodip (2026) | `scripts/retribuciones.ts` |
| Acuerdos de compatibilidad | BOCG, serie D (PDF con texto) | `scripts/extraer-compatibilidad.py` |
| Empresas y entidades | Textos de los documentos anteriores | `scripts/vinculos-textos.ts` + extracción con LLM comprobada (`data/raw/vinculos/entidades.jsonl`) + `scripts/vinculos.ts` |
| Cargos en sociedades | BORME, Sección A (XML de datos abiertos del BOE) | `scripts/browser/borme.js` + `scripts/borme-clasificar.py` |

## Proceso y verificación

Regla: solo se publica lo que se puede comprobar en un documento oficial. Lo que está en el documento pero tiene una lectura no confirmada al 100 % se publica con el aviso «Lectura no confirmada». Lo que ningún documento oficial confirma no se publica.

| Fuente | Formato original | Extracción | Comprobación |
|---|---|---|---|
| Buscador y fichas de congreso.es | HTML / JSON | Scripts en el navegador (`scripts/browser/`) | Copia literal de campos oficiales |
| Declaraciones de bienes y rentas | PDF escaneado (imagen) | Transcripción con un modelo de lenguaje con visión siguiendo `data/raw/*/INSTRUCCIONES.md` (literal, sin adivinar, «?» en lo dudoso) | Bienes: segunda revisión completa e independiente. Deudas: dos transcripciones independientes, diferencias resueltas con el PDF. Rentas, cuentas y acciones: comparación con OCR independiente (tesseract, spa) y revisión en el PDF ampliado de todo desacuerdo |
| Declaraciones de intereses económicos | PDF escaneado | Igual que las rentas | Igual que las rentas |
| Registro de Intereses - Actividades y acuerdos de compatibilidad (BOCG D) | PDF con texto | `pdftotext` + scripts, sin LLM | Texto del propio PDF; acuerdos asignados solo por nombre exacto |
| Votaciones | JSON de datos abiertos | Scripts, sin LLM | Datos oficiales; temas por palabras (`data/manual/temas.json`) |
| Empresas y entidades | Textos anteriores | Un LLM señala los nombres de entidades (tipo y relación) | `esLiteral()`: cada nombre debe aparecer letra a letra en su texto oficial o se descarta; sin particulares; uniones en `data/manual/entidades.json` |
| BORME | XML de datos abiertos del BOE (9,6 M de actos desde 2009) | Búsqueda exacta del nombre completo, sin LLM | Solo se publica si otro documento oficial lo confirma (empresa declarada, empresa pública de una administración donde declara un cargo, o sociedad con su nombre en su provincia). 77 de 662 casos publicados; el resto queda fuera del repositorio |

El LLM ayuda a transcribir PDF escaneados, a localizar nombres en textos libres, a traducir la web y a programar. No decide qué se publica: todo lo que produce se comprueba con otro método contra el documento oficial.

## Formación y trayectoria

- Fuente: «Ficha personal» de cada diputado en congreso.es, descargada con `scripts/browser/fichas-personales.js` → `data/raw/fichas-personales.jsonl`. No se guardan datos familiares (estado civil, hijos).
- `scripts/perfil.ts` copia las líneas literalmente y las separa en formación (títulos y estudios) y trayectoria. Una frase de empleo no cuenta como estudio aunque cite una universidad.
- Tipo de universidad (pública/privada): solo si la línea nombra el centro, según el RUCT del Ministerio (`data/manual/universidades.json`, con alias en otras lenguas, siglas y centros adscritos). Los centros fuera del RUCT se marcan sin clasificar.
- Línea de tiempo: legislaturas (fechas oficiales), cargos en la fecha de consulta con su fecha de inicio, líneas de trayectoria que citan un año y declaraciones de bienes e intereses económicos de la XV Legislatura.

## Patrimonio

- Se usa la última declaración publicada. Si es una **modificación parcial** (solo comunica un cambio), se combina con la última declaración completa anterior (`esModificacionParcial` en la transcripción).
- Propiedad: cada fila de inmuebles urbanos o rústicos a nombre del diputado, en propiedad total o parcial. Una fila con varias unidades («5 PLAZAS DE GARAJE», «18 FINCAS») cuenta todas.
- Vivienda: descripción con vivienda, piso, casa, chalet, apartamento, ático, dúplex, estudio, adosado, unifamiliar, bungaló o residencial (también en suelo rústico). No cuentan las que solo se describen como garaje, plaza de aparcamiento, cochera, trastero, local, oficina, almacén, nave, solar, parcela, terreno o finca rústica (`esVivienda` en `scripts/patrimonio.ts`).
- Se cuenta cada vivienda declarada, se posea entera o en parte. El porcentaje y el derecho se muestran literalmente.
- Inmuebles de sociedades: se listan aparte y no se suman.
- Grupo y candidatura: el hemiciclo ordena por el grupo parlamentario en la fecha de consulta; si la candidatura con la que fue elegido es distinta (p. ej. Grupo Mixto), se indica entre paréntesis.

### Control de calidad

1. Primera transcripción literal de las 429 declaraciones (últimas y anteriores) a partir de la imagen del PDF, con un modelo de lenguaje con visión.
2. Segunda revisión completa e independiente de las 429, fila a fila, incluidas las OBSERVACIONES de la página 4 y su posible continuación en la página 5. Resultado en `data/raw/patrimonio/revisado.jsonl`.
3. Solo se excluye un bien cuando una declaración oficial posterior comunica su venta o baja; cada exclusión está en `data/manual/correcciones.json` con su motivo y se muestra en la ficha.
4. No se publican matrículas (el propio formulario oficial pide no indicarlas).

## Deudas y préstamos

- Fuente: apartado «Deudas y obligaciones patrimoniales» (pág. 4) de las declaraciones de bienes. Transcripción literal en `data/raw/deudas/revisado.jsonl` (instrucciones en `data/raw/deudas/INSTRUCCIONES.md`), con dos transcripciones independientes y las diferencias resueltas contra el PDF.
- `scripts/deudas.ts`: el importe se lee como número solo si el formato no deja dudas (grupos de miles de 3 cifras; 1 o 2 cifras tras el último separador = decimales). Si no, se muestra el texto y el total se marca «al menos».
- Total: suma de saldos pendientes de la tabla de préstamos de la declaración más reciente que rellena el apartado (entre las que forman su patrimonio vigente). No se suman declaraciones distintas.
- Nombres de particulares que no son el diputado → «[nombre omitido]».
- Lecturas no confirmadas al 100 % o datos incoherentes del original: aviso público por declaración en `data/raw/deudas/avisos.json` (clave: nombre del PDF), que la ficha muestra como «Lectura no confirmada» con enlace al PDF. Si un saldo está en blanco o no se puede leer, el total se marca «al menos».

## Rentas, cuentas y acciones

- Páginas 1 a 3 de las declaraciones de bienes: rentas del año anterior (sin el sueldo del Congreso), cuota de IRPF, saldo de depósitos, deuda pública, acciones y participaciones, sociedades participadas en más de un 5 % y otros bienes o derechos.
- Transcripción literal (`data/raw/rentas/revisado.jsonl`, instrucciones en `data/raw/rentas/INSTRUCCIONES.md`), comparada con un OCR independiente; los importes que no coinciden se revisan otra vez en el PDF ampliado.
- Cada tabla se toma de la declaración más reciente que la rellena. Las sumas solo incluyen importes que se pueden leer como número sin interpretar («al menos» si falta alguno). Sin medias.

## Cargos y actividades

- Registro de Intereses - Actividades (`data/raw/intereses/actividades.jsonl`), extraído con `scripts/extraer-actividades.py` de los PDF oficiales con capa de texto. Secciones A a H, texto literal y fecha del acuerdo del Pleno.

## Trabajos anteriores e intereses

- Declaraciones de Intereses Económicos (`data/raw/intereses/economicos.jsonl`, instrucciones en `data/raw/intereses/INSTRUCCIONES.md`): actividades de los cinco años anteriores, donaciones, contribuciones a fundaciones y asociaciones y otros intereses. Misma revisión con OCR que las rentas.

## Sus votos en el Pleno

- Todas las votaciones del Pleno con voto nominal (`data/raw/votaciones/pleno.jsonl`). Por diputado: votaciones con escaño, sí, no, abstención y no vota.
- Voto distinto de su grupo (campo `di`, calculado en `scripts/importar-votaciones.ts`): votó sí, no o abstención y la opción mayoritaria de su grupo en esa votación (grupo publicado por el Congreso en esa fecha) fue otra. Sin el Grupo Mixto ni empates.

## Retribución

Se muestran solo importes mensuales oficiales: asignación + complementos por cargo (el mayor de Mesa/Junta de Portavoces y el mayor de Comisiones, porque no son acumulables dentro de cada bloque) + indemnización. No se estiman pagas anuales. No incluye sueldos de miembros del Gobierno, transporte ni dietas de viajes oficiales.

## Votaciones

Formato compacto en `data/raw/votaciones/votaciones-compactas.txt`: voto mayoritario de cada grupo + excepciones por diputado. `-` indica que esa persona aún no era diputada en la fecha de la votación. El hemiciclo es ilustrativo (ordenado por grupos), no el plano real de escaños.

Para cada votación se muestran los documentos oficiales (texto de la iniciativa, publicación del resultado, Diario de Sesiones, PDF y JSON de la votación) y su contenido: títulos de los artículos o extractos literales del texto oficial. En las proposiciones no de ley votadas con una enmienda transaccional se muestra el texto efectivamente votado. Las votaciones por llamamiento cuyo voto nominal aún no está en datos abiertos aparecen como pendientes (`data/manual/votaciones-pendientes.json`).

## Empresas y entidades

- `scripts/vinculos-textos.ts` reúne los textos oficiales de cada diputado (registro de actividades, acuerdos de compatibilidad, todas las declaraciones de intereses económicos, valores y sociedades de la declaración de bienes y trayectoria de la ficha) en `data/raw/vinculos/textos.jsonl`.
- `data/raw/vinculos/entidades.jsonl`: entidades de cada texto (nombre literal, tipo y relación). Las extrajo un LLM con las reglas de la sección «Proceso y verificación»; `scripts/vinculos.ts` descarta cualquier nombre que no sea literal.
- `data/manual/entidades.json`: nombres que son la misma entidad, exclusiones y tipos corregidos a mano.

## Registro Mercantil (BORME)

- `scripts/browser/borme.js` (en una pestaña de boe.es): recorre el sumario de cada día desde 2009 y el XML de la Sección A de cada provincia, y guarda los actos donde aparece el nombre completo de un diputado.
- `scripts/borme-clasificar.py`: confirma cada coincidencia con otro documento oficial (`declarada`, `cargo-publico`, `apellido`) → `data/raw/borme/vinculos-borme.jsonl`. El resto va a `data/raw/borme/pendientes.json`, que no se publica ni se sube (`.gitignore`) porque la mayoría son homónimos.
- `data/raw/borme/rareza.json` (frecuencia de nombres y apellidos del INE) solo sirve para revisar los pendientes.
