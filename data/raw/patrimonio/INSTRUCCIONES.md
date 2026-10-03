# Transcripción de declaraciones de bienes (Congreso, XV Legislatura)

Precisión ante todo: estos datos se publican sobre personas reales. Nunca adivinar; si algo no se lee, poner "?" y explicarlo en `dudas`.

Cada línea del lote: `cod|nombre|urlPdf|tipo` (tipo = `ultima` o `anterior`).

Por cada PDF:
1. `await window._compose(COD, 'URL')` en la pestaña propia (requiere haber cargado scripts/browser/visor-declaraciones.js).
2. Captura de pantalla de esa pestaña: cabecera roja con el cod, tabla "BIENES PATRIMONIALES" (pág. 2: urbana, rústica, inmuebles de sociedades) y, bajo la línea roja, "VEHÍCULOS" (pág. 3).
3. Si algo queda cortado, o la tabla remite a observaciones/anexo, o la tabla de inmuebles está vacía en una declaración de tipo `ultima`, revisar la página 4 (OBSERVACIONES) con `await window._page('URL', 4)` + captura.
4. Transcribir literalmente cada fila rellena (no las vacías).

Salida JSONL (una línea por PDF):
{"cod":134,"tipo":"ultima","pdf":"000124_001_e_0122621_20260715.pdf","urbana":[{"desc":"CASA","sit":"SANTA CRUZ DE TENERIFE","anio":"2021","derecho":"PLENO DOMINIO AL 50%","titulo":"COMPRAVENTA"}],"rustica":[],"sociedad":[],"vehiculos":[{"anio":"2016","desc":"AUTOMÓVIL RENAULT CAPTUR"}],"esModificacionParcial":false,"obs":"","dudas":""}

- `pdf`: nombre del fichero (última parte de la URL).
- `derecho` = derecho sobre el bien (PLENO DOMINIO, NUDA PROPIEDAD, USUFRUCTO, GANANCIAL, 50%...); `titulo` = título de adquisición (COMPRAVENTA, HERENCIA, DONACIÓN...). Si no se puede separar, todo en `derecho`.
- `esModificacionParcial`: true si la declaración solo comunica un cambio (p. ej. "modificación por adquisición de vehículo") y NO repite todo el patrimonio.
- `obs`: notas relevantes sobre inmuebles o vehículos fuera de las tablas (observaciones de pág. 4).
