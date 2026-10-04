# Metodología

La versión legible está en la propia web (`/metodologia`, fichero `src/pages/metodologia.astro`). Aquí, el detalle técnico.

## Fuentes (XV Legislatura)

| Dato | Fuente | Cómo se obtiene |
|---|---|---|
| Diputados | Buscador de diputados de congreso.es | `scripts/browser/descargar-datos.js` |
| Cargos | Ficha de cada diputado | idem |
| Patrimonio | Declaración de Bienes y Rentas (PDF escaneado) | Transcripción con `scripts/browser/visor-declaraciones.js` |
| Votaciones | Datos abiertos de votaciones (JSON) | `window._votacion()` |
| Textos votados | BOE (decretos-leyes), BOCG (proposiciones) y Diario de Sesiones | Enlaces y extractos literales en `data/manual/votaciones-clave.json` |
| Retribuciones | https://www.congreso.es/es/cem/regecodip (2026) | `scripts/retribuciones.ts` |

## Formación y trayectoria

- Fuente: «Ficha personal» de cada diputado en congreso.es, descargada con `scripts/browser/fichas-personales.js` → `data/raw/fichas-personales.jsonl`. No se guardan datos familiares (estado civil, hijos).
- `scripts/perfil.ts` copia las líneas literalmente y las separa en formación (títulos y estudios) y trayectoria. Una frase de empleo no cuenta como estudio aunque cite una universidad.
- Tipo de universidad (pública/privada): solo si la línea nombra el centro, según el RUCT del Ministerio (`data/manual/universidades.json`, con alias en otras lenguas, siglas y centros adscritos). Los centros fuera del RUCT se marcan sin clasificar.
- Línea de tiempo: legislaturas (fechas oficiales), cargos actuales con su fecha, líneas de trayectoria que citan un año y declaraciones de bienes e intereses económicos de la XV Legislatura.

## Patrimonio

- Se usa la última declaración publicada. Si es una **modificación parcial** (solo comunica un cambio), se combina con la última declaración completa anterior (`esModificacionParcial` en la transcripción).
- Propiedad: cada fila de inmuebles urbanos o rústicos a nombre del diputado, en propiedad total o parcial. Una fila con varias unidades («5 PLAZAS DE GARAJE», «18 FINCAS») cuenta todas.
- Vivienda: descripción con vivienda, piso, casa, chalet, apartamento, ático, dúplex, estudio, unifamiliar o residencial (también en suelo rústico). No cuentan garajes, trasteros, locales, solares, naves ni fincas.
- Filas con varias unidades («2 PISOS», «3 VIVIENDAS») cuentan todas.
- Se cuenta cada vivienda declarada, se posea entera o en parte. El porcentaje y el derecho se muestran literalmente.
- Inmuebles de sociedades: se listan aparte y no se suman.
- Grupo y candidatura: el hemiciclo ordena por el grupo parlamentario actual; si la candidatura con la que fue elegido es distinta (p. ej. Grupo Mixto), se indica entre paréntesis.

### Control de calidad

1. Primera transcripción literal de las 429 declaraciones (últimas y anteriores) por lectura visual del PDF.
2. Segunda revisión completa e independiente de las 429, fila a fila, incluidas las OBSERVACIONES de la página 4 y su posible continuación en la página 5. Resultado en `data/raw/patrimonio/revisado.jsonl`.
3. Solo se excluye un bien cuando una declaración oficial posterior comunica su venta o baja; cada exclusión está en `data/manual/correcciones.json` con su motivo y se muestra en la ficha.
4. No se publican matrículas (el propio formulario oficial pide no indicarlas).

## Deudas y préstamos

- Fuente: apartado «Deudas y obligaciones patrimoniales» (pág. 4) de las declaraciones de bienes. Transcripción literal en `data/raw/deudas/revisado.jsonl` (instrucciones en `data/raw/deudas/INSTRUCCIONES.md`), con dos transcripciones independientes y las diferencias resueltas contra el PDF.
- `scripts/deudas.ts`: el importe se lee como número solo si el formato no deja dudas (grupos de miles de 3 cifras; 1 o 2 cifras tras el último separador = decimales). Si no, se muestra el texto y el total se marca «al menos».
- Total: suma de saldos pendientes de la tabla de préstamos de la declaración más reciente que rellena el apartado (entre las que forman su patrimonio vigente). No se suman declaraciones distintas.
- Nombres de particulares que no son el diputado → «[nombre omitido]».
- Lecturas no confirmadas al 100 % o datos incoherentes del original: aviso público por declaración en `data/raw/deudas/avisos.json` (clave: nombre del PDF), que la ficha muestra como «Lectura no confirmada» con enlace al PDF. Si un saldo está en blanco o no se puede leer, el total se marca «al menos».

## Retribución

Se muestran solo importes mensuales oficiales: asignación + complementos por cargo (el mayor de Mesa/Junta de Portavoces y el mayor de Comisiones, porque no son acumulables dentro de cada grupo) + indemnización. No se estiman pagas anuales. No incluye sueldos de miembros del Gobierno, transporte ni dietas de viajes oficiales.

## Votaciones

Formato compacto en `data/raw/votaciones/votaciones-compactas.txt`: voto mayoritario de cada grupo + excepciones por diputado. `-` indica que esa persona aún no era diputada en la fecha de la votación. El hemiciclo es ilustrativo (ordenado por grupos), no el plano real de escaños.

Para cada votación se muestran los documentos oficiales (texto de la iniciativa, publicación del resultado, Diario de Sesiones, PDF y JSON de la votación) y su contenido: títulos de los artículos o extractos literales del texto oficial. En las proposiciones no de ley votadas con una enmienda transaccional se muestra el texto efectivamente votado. Las votaciones por llamamiento cuyo voto nominal aún no está en datos abiertos aparecen como pendientes (`data/manual/votaciones-pendientes.json`).
