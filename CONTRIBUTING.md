# Cómo contribuir

Gracias por ayudar. Este proyecto vive de que cada dato sea **exacto y verificable**.

## Cómo proponer cambios

- **Sugerencias e ideas:** [abre una sugerencia](https://github.com/MarcoAnarmo/CongresoAbierto/issues/new?template=sugerencia.yml).
- **Errores en los datos:** [avisa de un error](https://github.com/MarcoAnarmo/CongresoAbierto/issues/new?template=error-en-un-dato.yml) con el enlace al documento oficial.
- **Cambios en el código o los datos:** haz un *fork*, crea una rama y abre un *pull request* contra `main`. Nadie publica directamente en `main`: todo pasa por revisión.
- Usa [Conventional Commits](https://www.conventionalcommits.org/es/) en los mensajes (`feat:`, `fix:`, `docs:`, `chore:`…).

## Principios

1. **Solo fuentes oficiales.** Cada dato debe poder comprobarse en un documento público (congreso.es, BOE, parlamentos autonómicos).
2. **Literalidad.** Se transcribe lo que pone el documento, sin interpretar. Las interpretaciones (qué cuenta como vivienda, porcentajes) están en `scripts/patrimonio.ts` y documentadas en `docs/metodologia.md`.
3. **Sin interpretaciones.** Los textos de las votaciones son los oficiales del Congreso; no se añaden resúmenes ni valoraciones.

## Corregir un dato

- Abre una *issue* con: diputado, dato erróneo, valor correcto y enlace al PDF oficial (con número de página).
- O corrige la fila en `data/raw/patrimonio/revisado.jsonl` (copia literal del PDF). Si una declaración posterior comunica la venta o baja de un bien, añade la exclusión en `data/manual/correcciones.json` citando esa declaración:

```json
"145": { "excluirInmuebles": [{ "contiene": "ISLAS BALEARES", "motivo": "La declaración de 19/03/2026 comunica la venta del piso." }] }
```

## Mantener los datos al día

Cuando un diputado presente una nueva declaración o haya altas y bajas en la Cámara, hay que descargarla, transcribirla literalmente y revisarla. Las fichas marcadas con * en el ranking tienen alguna lectura dudosa que conviene comprobar.

## Añadir un parlamento autonómico

El esquema (`src/lib/types.ts`) ya tiene el campo `camara`. Propón primero en una *issue* la fuente oficial de ese parlamento (lista de diputados, declaraciones de bienes, votaciones) para acordar el formato.

## Desarrollo

```bash
npm install
npm run data:build
npm run dev
```

Antes de enviar cambios: `npm run build` (incluye `astro check`).
