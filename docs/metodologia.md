# Metodología

La versión legible está en la propia web (`/metodologia`, fichero `src/pages/metodologia.astro`). Aquí, el detalle técnico.

## Fuentes (XV Legislatura)

| Dato | Fuente | Cómo se obtiene |
|---|---|---|
| Diputados | Buscador de diputados de congreso.es | `scripts/browser/descargar-datos.js` |
| Cargos | Ficha de cada diputado | idem |
| Patrimonio | Declaración de Bienes y Rentas (PDF escaneado) | Transcripción con `scripts/browser/visor-declaraciones.js` |
| Votaciones | Datos abiertos de votaciones (JSON) y BOE | `window._votacion()` |
| Retribuciones | https://www.congreso.es/es/cem/regecodip (2026) | `scripts/retribuciones.ts` |

## Patrimonio

- Se usa la última declaración publicada. Si es una **modificación parcial** (solo comunica un cambio), se combina con la última declaración completa anterior (`esModificacionParcial` en la transcripción).
- Vivienda: descripción con vivienda, piso, casa, chalet, apartamento, ático, dúplex, estudio, unifamiliar o residencial (también en suelo rústico). No cuentan garajes, trasteros, locales, solares, naves ni fincas.
- Filas con varias unidades («2 PISOS», «3 VIVIENDAS») cuentan todas.
- Se cuenta cada vivienda declarada, se posea entera o en parte. El porcentaje y el derecho se muestran literalmente.
- Inmuebles de sociedades: se listan aparte y no se suman.

### Control de calidad

1. Primera transcripción literal de las 429 declaraciones (últimas y anteriores) por lectura visual del PDF.
2. Segunda revisión completa e independiente de las 429, fila a fila, incluidas las OBSERVACIONES de la página 4 y su posible continuación en la página 5. Resultado en `data/raw/patrimonio/revisado.jsonl`.
3. Solo se excluye un bien cuando una declaración oficial posterior comunica su venta o baja; cada exclusión está en `data/manual/correcciones.json` con su motivo y se muestra en la ficha.
4. No se publican matrículas (el propio formulario oficial pide no indicarlas).

## Retribución

Se muestran solo importes mensuales oficiales: asignación + complementos por cargo (el mayor de Mesa/Junta de Portavoces y el mayor de Comisiones, porque no son acumulables dentro de cada grupo) + indemnización. No se estiman pagas anuales. No incluye sueldos de miembros del Gobierno, transporte ni dietas de viajes oficiales.

## Votaciones

Formato compacto en `data/raw/votaciones/votaciones-compactas.txt`: voto mayoritario de cada grupo + excepciones por diputado. `-` indica que esa persona aún no era diputada en la fecha de la votación. El hemiciclo es ilustrativo (ordenado por grupos), no el plano real de escaños.
