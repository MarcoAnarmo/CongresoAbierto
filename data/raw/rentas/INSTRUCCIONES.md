# Transcripción de rentas, cuentas y valores (declaraciones de bienes del Congreso, XV Legislatura)

Precisión ante todo: estos datos se publican sobre personas reales. Nunca adivines. Si algo no se lee con seguridad, escribe "?" en ese carácter o celda y explícalo en `dudas`.

Para cada PDF se preparan tres recortes de un mismo PDF:
- `p1.png`: página 1, tabla «RENTAS PERCIBIDAS POR EL PARLAMENTARIO» y recuadro «CANTIDAD PAGADA POR IRPF».
- `p2.png`: parte baja de la página 2, tabla «DEPÓSITOS EN CUENTAS CORRIENTES O DE AHORRO…» con su «SALDO de TODOS los DEPÓSITOS (€)».
- `p3.png`: página 3, «OTROS BIENES O DERECHOS» (deuda pública, acciones y participaciones; sociedades participadas), vehículos (NO los copies) y «OTROS BIENES, RENTAS O DERECHOS… NO DECLARADOS EN APARTADOS ANTERIORES».

Copia literalmente (mismas mayúsculas, tildes, puntuación, símbolo € y erratas) cada fila rellena:

- `rentas.salariales`: filas de «Percepciones netas de tipo salarial, sueldos, honorarios, aranceles y otras retribuciones».
- `rentas.dividendos`: filas de «Dividendos y participación en beneficios de sociedades…».
- `rentas.intereses`: filas de «Intereses o rendimientos de cuentas, depósitos y activos financieros».
- `rentas.otras`: filas de «OTRAS rentas o percepciones de cualquier clase».
  Cada fila es `{"concepto": "...", "euros": "..."}`, con el importe exactamente como está escrito ("2.791 €", "24390,5", "") .
  Una fila por cada importe. Si una celda tiene varias líneas con un importe cada una, son filas distintas. Si varias líneas comparten un único importe, únelas en un solo concepto con " · " (o con un espacio si es la misma frase que sigue en la línea siguiente).
  Los espacios dobles no importan: usa un solo espacio.
- `irpf`: el importe del recuadro «CANTIDAD PAGADA POR IRPF», literal (sin añadir €, pero copia el € si está escrito dentro del número). "" si está en blanco.
- `depositos`: filas de la tabla de depósitos: `{"descripcion": "...", "saldo": "..."}`. Si hay un solo saldo para varias líneas de descripción, pon una fila con todas las descripciones unidas por " · " y ese saldo.
- `valores`: filas de «Deuda pública, obligaciones… / Acciones y participaciones…» (es una sola celda con una lista): `{"descripcion": "...", "valor": "..."}`.
- `sociedades`: filas de «Sociedades participadas en más de un 5% por otras sociedades…»: `{"descripcion": "...", "valor": "..."}`.
- `otrosBienes`: filas de «OTROS BIENES, RENTAS O DERECHOS DE CONTENIDO ECONÓMICO NO DECLARADOS…»: `{"descripcion": "...", "valor": "..."}`.
- `vacia`: true si las páginas 1 a 3 no tienen ningún dato rellenado en estas tablas (pasa en algunas modificaciones).
- `dudas`: lecturas inseguras, celdas cortadas por el recorte, textos que remiten a otra declaración, importes ilegibles. "" si no hay.

Reglas:
- Copia solo lo que está escrito. No sumes, no conviertas, no corrijas erratas, no completes nombres de bancos.
- Si una celda dice «NO», «NINGUNO», «—», «0» o similar, cópiala tal cual como fila (es lo que declara).
- Celdas vacías: no crees filas vacías.
- Privacidad: el nombre de una persona particular que no sea el diputado (hijos, cónyuge, parientes, inquilinos, pagadores particulares) se sustituye por «[nombre omitido]». Los nombres de empresas, bancos, fondos y organismos sí se copian. Los números de cuenta, IBAN, NIF o matrículas se sustituyen por «[número omitido]».
- Si el recorte corta una tabla (falta una fila arriba o abajo), puedes leer la página entera: `pdftoppm -f N -l N -r 110 -gray pdf/<pdf> /tmp/<algo>` y conviértela a .png. Indícalo en `dudas` solo si sigue sin leerse.

Formato de salida: una línea JSON por PDF, en el fichero que te indiquen, por ejemplo:
{"pdf":"000014_000_e_0001375_20230816.pdf","cod":12,"rentas":{"salariales":[],"dividendos":[{"concepto":"DIVIDENDO DE ACCIONES EN BOLSA E INTERESES CUENTAS","euros":"2.791 €"}],"intereses":[{"concepto":"ALQUILERES BIENES INMUEBLES; Y FINCAS RÚSTICAS ( HERENCIA )","euros":"24.390 €"}],"otras":[{"concepto":"VENTA DE FINCA RÚSITICA ( DE HERENCIA)","euros":"222.320 €"}]},"irpf":"43.418","depositos":[{"descripcion":"SALDO EN CUENTAS CORRIENTES BBVA.SANTANDER. BANKINTER","saldo":"..."}],"valores":[{"descripcion":"QUALITY BBVA FONDO","valor":"12.726 €"}],"sociedades":[],"otrosBienes":[{"descripcion":"MUTUALIDAD DE LA ABOGACÍA ( FONDO )","valor":"28.264 €"}],"vacia":false,"dudas":""}

