# Transcripción de deudas (declaraciones de bienes del Congreso, XV Legislatura)

Precisión ante todo: estos datos se publican sobre personas reales. Nunca adivinar; si algo no se lee, poner "?" y explicarlo en `dudas`.

Fuente: página 4 de cada *Declaración de Bienes y Rentas*, tabla «DEUDAS Y OBLIGACIONES PATRIMONIALES» y recuadro «OBSERVACIONES».
Imágenes de trabajo: `pdftoppm -f 4 -l 4 -r 200 -gray -x 0 -y 90 -W 1654 -H 990` sobre el PDF (y la página entera a 110 ppp si la tabla sale desplazada).

Cada declaración se transcribe dos veces de forma independiente; las diferencias se resuelven mirando el PDF. El resultado final está en `revisado.jsonl` (una línea por PDF).

Por cada PDF, literalmente (mismas mayúsculas, tildes, puntuación, símbolo € y erratas):
- `prestamos`: una entrada por fila rellena de la tabla PRESTAMOS: `desc` (descripción y acreedor), `fecha` (fecha de concesión), `concedido` (importe concedido) y `pendiente` (saldo pendiente). Celda vacía = "".
- `otras`: texto del recuadro «Otras deudas y obligaciones derivadas de contratos, sentencias o cualquier otro título».
- `obs`: texto de OBSERVACIONES solo si habla de deudas, préstamos, hipotecas, créditos, avales u obligaciones.
- `dudas`: lecturas inseguras, celdas cortadas, remisiones a otras declaraciones.

Privacidad: el nombre de una persona particular que no sea el diputado (hijos, parientes, acreedores particulares) se sustituye por «[nombre omitido]». Las matrículas no se copian.

Formato: {"cod":76,"pdf":"000083_000_e_0000357_20230803.pdf","prestamos":[{"desc":"PRÉSTAMO HIPOTECARIO (Para la compra de la vivienda familiar. Bancosantander)","fecha":"16/02/2010","concedido":"600000","pendiente":"225173,84"}],"otras":"","obs":"","dudas":"","revisado":true}
