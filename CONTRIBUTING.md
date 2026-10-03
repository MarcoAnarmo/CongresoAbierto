# Cómo colaborar con Congreso Abierto

Gracias por querer ayudar. Este proyecto vive de que cada dato sea **exacto y verificable**, y cualquiera puede contribuir, sepa o no programar.

## Formas de colaborar

| Quiero… | Cómo | ¿Hace falta programar? |
| --- | --- | --- |
| Avisar de un dato erróneo | [Formulario de error](https://github.com/MarcoAnarmo/CongresoAbierto/issues/new?template=error-en-un-dato.yml) | No |
| Proponer una mejora o una fuente | [Formulario de sugerencia](https://github.com/MarcoAnarmo/CongresoAbierto/issues/new?template=sugerencia.yml) | No |
| Comentar o votar propuestas | [Issues abiertas](https://github.com/MarcoAnarmo/CongresoAbierto/issues) | No |
| Corregir datos, código o diseño | *Pull request* (ver abajo) | Un poco |

Si es tu primera vez, mira las [tareas para empezar](https://github.com/MarcoAnarmo/CongresoAbierto/contribute) (etiqueta `good first issue`).

Solo necesitas una [cuenta gratuita de GitHub](https://github.com/signup).

## Principios

1. **Solo fuentes oficiales.** Cada dato debe poder comprobarse en un documento público (Congreso, BOE, BOCG, parlamentos autonómicos).
2. **Literalidad.** Se copia lo que pone el documento, sin interpretar. Los criterios de recuento (qué cuenta como vivienda o propiedad) están en `scripts/patrimonio.ts` y documentados en `docs/metodologia.md`.
3. **Sin opiniones.** No se añaden resúmenes propios, valoraciones ni datos de fuentes no oficiales.
4. **Privacidad.** No se publican datos que el propio formulario oficial pide omitir (por ejemplo, matrículas).

## Tu primer pull request, paso a paso

Nadie publica directamente en `main`: todo cambio llega como *pull request* y se revisa antes de aceptarse.

1. Haz un **fork** del repositorio (botón *Fork* arriba a la derecha).
2. Clona tu fork y crea una rama:
   ```bash
   git clone https://github.com/TU-USUARIO/CongresoAbierto.git
   cd CongresoAbierto
   git switch -c fix/ficha-diputado-123
   ```
3. Instala y arranca la web (Node 22.12 o superior):
   ```bash
   npm install
   npm run data:build   # regenera data/congreso/*.json
   npm run dev          # http://localhost:4321
   ```
4. Haz tus cambios y comprueba que todo compila: `npm run build`.
5. Haz commit con [Conventional Commits](https://www.conventionalcommits.org/es/), solo título:
   `fix(datos): corrige la superficie de una vivienda del diputado 123`, `feat: añade filtro por provincia`, `docs: …`, `chore: …`.
6. Sube la rama a tu fork y abre el *pull request* contra `main`. Rellena la plantilla e incluye el enlace al documento oficial si cambias un dato.

Cada *pull request* genera una vista previa de la web para revisar el cambio.

¿Nunca has hecho un *pull request*? La guía de GitHub [Contribuir a un proyecto](https://docs.github.com/es/get-started/exploring-projects-on-github/contributing-to-a-project) lo explica con capturas.

## Corregir un dato

- La transcripción literal de cada declaración está en `data/raw/patrimonio/revisado.jsonl` (una línea por PDF). Corrige la fila y enlaza el PDF con su página en el *pull request*.
- Si una declaración posterior comunica la venta o baja de un bien, añade la exclusión en `data/manual/correcciones.json` citando esa declaración:

```json
"145": { "excluirInmuebles": [{ "contiene": "ISLAS BALEARES", "motivo": "La declaración de 19/03/2026 comunica la venta del piso." }] }
```

## Mantener los datos al día

Cuando un diputado presente una nueva declaración o haya altas y bajas en la Cámara, hay que descargarla, transcribirla literalmente y revisarla. Las fichas marcadas con * en el ranking tienen alguna lectura dudosa que conviene comprobar. Ver `data/raw/patrimonio/INSTRUCCIONES.md`.

## Añadir un parlamento autonómico

El esquema (`src/lib/types.ts`) ya tiene el campo `camara`. Propón primero en una [sugerencia](https://github.com/MarcoAnarmo/CongresoAbierto/issues/new?template=sugerencia.yml) la fuente oficial de ese parlamento (lista de diputados, declaraciones de bienes, votaciones) para acordar el formato.

## Código de conducta

Este proyecto sigue un [código de conducta](CODE_OF_CONDUCT.md). Al participar, te comprometes a respetarlo.
