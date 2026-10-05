# Transcripción de las Declaraciones de Intereses Económicos (Congreso, XV Legislatura)

Precisión ante todo: estos datos se publican sobre personas reales. Nunca adivines. Si algo no se lee con seguridad, escribe "?" en ese carácter o celda y explícalo en `dudas`.

Para cada PDF se preparan dos recortes del mismo PDF:
- `p1.png`: página 1, con la cabecera (casillas «DECLARACIÓN INICIAL» / «MODIFICACIÓN DE LA DECLARACIÓN»), el apartado «I. Actividades desarrolladas en los cinco años anteriores a la obtención del mandato parlamentario…» (tabla Período / Empleador / Sector / Breve descripción) y apartado «II. Donaciones, obsequios y beneficios no remunerados…» (Benefactor / Breve descripción).
- `p2.png`: página 2, apartado «III. Fundaciones y otras asociaciones a las que haya contribuido…» (Destinatario / Breve descripción) y «IV. Otros intereses a declarar / observaciones».
Si no ves ninguna marca en las casillas de la cabecera, deja `tipo` en "".
El sello vertical del registro («C.DIP …») a la izquierda no forma parte de la tabla: no lo copies.

Copia literalmente (mismas mayúsculas, tildes, puntuación y erratas) cada fila rellena:
- `tipo`: "inicial" si está marcada «DECLARACIÓN INICIAL», "modificacion" si está marcada «MODIFICACIÓN DE LA DECLARACIÓN».
- `actividades`: filas del apartado I: `{"periodo": "...", "empleador": "...", "sector": "...", "descripcion": "..."}`. Celda vacía = "".
  Si una celda ocupa varias líneas, únelas con un espacio (dos fechas del período en dos líneas quedan «01/04/2022 24/07/2023»). Si una palabra está partida entre dos líneas (NOVIEM / BRE), únela sin espacio.
  Una celda con descripción rellena pero benefactor/destinatario en blanco se copia con "" en la celda vacía.
  Trazos a mano (rayas, «/» para anular filas vacías) no se copian.
- `donaciones`: filas del apartado II: `{"benefactor": "...", "descripcion": "..."}`.
- `fundaciones`: filas del apartado III: `{"destinatario": "...", "descripcion": "..."}`.
- `otros`: texto del apartado IV, "" si está en blanco.
- `dudas`: lecturas inseguras, celdas cortadas por el recorte, filas que siguen en otra página. "" si no hay.

Reglas:
- Copia solo lo que está escrito. No resumas, no corrijas, no completes siglas.
- Si una celda dice «NINGUNA», «NO», «—» o similar, cópiala como fila (es lo que declara).
- No crees filas vacías.
- Privacidad: el nombre de una persona particular que no sea el diputado (familiares, amigos, un particular como empleador o benefactor) se sustituye por «[nombre omitido]». Los nombres de empresas, administraciones, partidos, asociaciones, fundaciones, colegios profesionales y universidades sí se copian. Números de cuenta, NIF, DNI o teléfonos: «[número omitido]».
- Si el recorte corta una tabla, lee la página entera con `pdftoppm -f N -l N -r 110 -gray` y conviértela a .png.

Formato de salida: una línea JSON por PDF, en el fichero que te indiquen, por ejemplo:
{"pdf":"000014_001_e_0000060_20230802.pdf","cod":12,"tipo":"inicial","actividades":[{"periodo":"2019-2023","empleador":"CORTES GENERALES","sector":"PÚBLICO","descripcion":"DIPUTADO EN EL CONGRESO"}],"donaciones":[{"benefactor":"FAMILIA Y AMIGOS","descripcion":"DE POCO VALOR Y EXCLUSIVAMENTE EN EL ÁMBITO FAMILIAR O SOCIAL"}],"fundaciones":[{"destinatario":"PARTIDO POPULAR","descripcion":"CUOTA MENSUAL"}],"otros":"","dudas":""}

