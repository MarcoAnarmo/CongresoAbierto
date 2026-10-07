import { area } from '..';

/**
 * Página de metodología. Cada sección es HTML con marcadores que se sustituyen con f():
 * {fecha} fecha de consulta · {pdfs} {conDecl} {ultima} declaraciones · {fuenteRetribuciones} {asignacion} {indemOtras}
 * {indemMadrid} {cargos} (lista <li>) retribuciones · {votaciones} {error} {colabora} enlaces.
 * Los nombres oficiales de documentos, registros y normas se dejan en castellano (con una glosa si ayuda).
 * Los identificadores de las secciones (#propiedades, #retribuciones…) son los mismos en todos los idiomas.
 */
const es = {
  titulo: 'Metodología',
  descripcion: 'De dónde salen los datos de Congreso Abierto y cómo se presentan, sin interpretaciones.',
  h1: 'Fuentes y método',
  indice: 'Índice de la página',
  enPagina: 'En esta página',
  /** Aviso en los idiomas distintos del castellano. En castellano queda vacío. */
  nota: '',
  secciones: {
    principio: 'Principio',
    fuentes: 'Fuentes oficiales',
    revision: 'Cómo se han obtenido y comprobado los datos',
    perfil: 'Formación y trayectoria',
    propiedades: 'Propiedades y viviendas',
    vehiculos: 'Vehículos',
    deudas: 'Deudas y préstamos',
    rentas: 'Rentas, cuentas y acciones',
    actividades: 'Cargos y actividades',
    intereses: 'Trabajos anteriores e intereses',
    entidades: 'Empresas y entidades',
    borme: 'Registro Mercantil (BORME)',
    retribuciones: 'Retribuciones',
    votaciones: 'Votaciones',
    participacion: 'Sus votos en el Pleno',
    temas: 'Temas de las votaciones',
    avisoLegal: 'Uso de los datos y aviso legal',
    errores: '¿Has visto un error?',
  },
  html: {
    principio: `<p>Aquí solo hay información oficial del Estado, presentada tal y como la publica la institución que la produce. No hacemos interpretaciones ni valoraciones: ordenamos y simplificamos para que cualquiera pueda consultarla y sacar sus propias conclusiones. Si algo no coincide con el documento oficial, prevalece el documento oficial.</p>`,
    fuentes: `<ul>
<li><strong>Diputados, grupos y cargos:</strong> buscador y fichas oficiales de <a href="https://www.congreso.es/es/busqueda-de-diputados">congreso.es</a> (XV Legislatura). Consultados el {fecha}.</li>
<li><strong>Propiedades y vehículos:</strong> las <em>Declaraciones de Bienes y Rentas</em> que cada diputado presenta ante el Congreso y que este publica en su ficha: {pdfs} documentos de {conDecl} diputados; el más reciente es del {ultima}.</li>
<li><strong>Rentas, cuentas, acciones y sociedades:</strong> páginas 1 a 3 de esas mismas declaraciones de bienes.</li>
<li><strong>Cargos, actividades, trabajos anteriores y donaciones:</strong> el <em>Registro de Intereses - Actividades</em> y las <em>Declaraciones de Intereses Económicos</em> que el Congreso publica en la ficha de cada diputado.</li>
<li><strong>Votaciones:</strong> <a href="https://www.congreso.es/es/opendata/votaciones">datos abiertos de votaciones</a> del Congreso, con el texto oficial de cada expediente.</li>
<li><strong>Normas:</strong> <a href="https://www.boe.es">Boletín Oficial del Estado</a> (decretos-leyes y acuerdos de convalidación o derogación).</li>
<li><strong>Retribuciones:</strong> <a href="{fuenteRetribuciones}">Régimen económico y ayudas de los miembros de la Cámara</a>, importes de 2026.</li>
<li><strong>Empresas y entidades:</strong> además, los acuerdos de la Comisión del Estatuto de los Diputados sobre sus actividades, publicados en el <a href="https://www.congreso.es/es/cem/dictamenes_actividades_xvleg">Boletín Oficial de las Cortes Generales (serie D)</a>.</li>
<li><strong>Cargos en sociedades:</strong> <a href="https://www.boe.es/datosabiertos/">datos abiertos del BORME</a> (Boletín Oficial del Registro Mercantil), desde 2009.</li>
</ul>
<p><strong>Grupo y candidatura.</strong> El Congreso registra dos datos distintos: la candidatura con la que cada diputado fue elegido en las elecciones y el grupo parlamentario al que pertenece en la fecha de consulta. Pueden no coincidir: quien deja su grupo pasa al Grupo Mixto aunque fuera elegido en otra lista. El hemiciclo ordena por ese grupo parlamentario; cuando la candidatura es distinta, se indica entre paréntesis.</p>`,
    perfil: `<p>Salen de la <em>Ficha personal</em> de cada diputado en <a href="https://www.congreso.es/es/busqueda-de-diputados">congreso.es</a>, un texto que redacta el propio diputado. Se copia literalmente, línea a línea, y solo se separa en dos bloques:</p>
<ul>
<li><strong>Formación:</strong> las líneas que hablan de títulos o estudios (licenciado, grado, máster, doctor, diplomado, ingeniero, curso, programa…). El resto es <strong>trayectoria</strong>. Una frase de empleo (profesor, investigador, director…) no cuenta como estudio aunque nombre una universidad.</li>
<li><strong>Universidad pública o privada:</strong> solo cuando la línea nombra el centro. El tipo es el que figura en el <a href="https://www.educacion.gob.es/ruct/consultauniversidades?actual=universidades">Registro de Universidades, Centros y Títulos (RUCT)</a> del Ministerio. Se reconocen también otras formas de nombrarla (en otras lenguas oficiales, siglas como UCM o UNED, y centros que forman parte de una universidad, como ICADE, ESADE o IESE). La lista está en <code>data/manual/universidades.json</code>.</li>
<li>Si nombra un centro que no está en el RUCT (por ejemplo, una universidad extranjera), se indica así, sin clasificarlo. Si no nombra el centro, se dice que la ficha no lo indica: no se deduce nada.</li>
<li>No se recogen datos familiares (estado civil, hijos) aunque aparezcan en la ficha.</li>
<li><strong>Línea de tiempo:</strong> las legislaturas en las que ha sido diputado (con sus fechas oficiales), sus cargos en la Cámara en la fecha de consulta, con la fecha de inicio, las líneas de su trayectoria que citan un año y sus declaraciones de bienes y de intereses económicos de esta legislatura, cada una con su PDF.</li>
</ul>`,
    propiedades: `<p>Se usan las tablas de «Bienes inmuebles» de cada declaración, copiadas literalmente. Cada ficha enlaza a sus PDF originales.</p>
<ul>
<li><strong>Propiedades:</strong> todos los inmuebles urbanos y rústicos que el diputado declara a su nombre, en propiedad total o parcial: viviendas, garajes, trasteros, locales, naves, solares, fincas… Cada línea de la tabla oficial cuenta como una propiedad; si la línea indica un número de unidades («16 viviendas», «8 fincas rústicas», «piso y dos plazas de garaje»), se cuentan esas unidades.</li>
<li><strong>Viviendas:</strong> de esas propiedades, las que el propio diputado describe como vivienda, piso, casa, chalet, apartamento, ático, dúplex, estudio, adosado, unifamiliar, bungaló o residencial, también en suelo rústico. No cuentan como vivienda los que solo se describen como garaje, plaza de aparcamiento, cochera, trastero, local, oficina, almacén, nave, solar, parcela, terreno o finca rústica.</li>
<li>Se muestran el porcentaje y el tipo de derecho (pleno dominio, nuda propiedad, ganancial…) tal y como los escribe el diputado.</li>
<li>Los inmuebles de sociedades en las que participa el diputado se listan aparte en su ficha y no se suman.</li>
<li>Si la última declaración solo comunica un cambio (por ejemplo, una compra), se muestra junto a la declaración completa anterior. Un bien solo deja de contarse cuando una declaración oficial posterior comunica su venta o baja; la ficha indica cuál.</li>
<li>Las declaraciones reflejan el patrimonio en la fecha en que se presentaron.</li>
</ul>`,
    vehiculos: `<p>Se copian de la tabla «Vehículos, embarcaciones y aeronaves». No se publican matrículas, porque el propio formulario oficial pide no indicarlas.</p>`,
    deudas: `<p>Se copian del apartado «Deudas y obligaciones patrimoniales» (página 4) de las mismas declaraciones de bienes que se usan para las propiedades.</p>
<ul>
<li>Cada préstamo se publica con su descripción y acreedor, fecha de concesión, importe concedido y saldo pendiente, <strong>tal y como los escribe el diputado</strong> (formato, erratas y todo).</li>
<li>El saldo pendiente total es la suma de la tabla de préstamos de su declaración más reciente que rellena el apartado. Si algún importe no se puede leer como número sin interpretarlo (un dígito ilegible en el escaneo, un formato imposible), no se suma y se indica «al menos».</li>
<li>No se suman préstamos de declaraciones distintas, porque el mismo préstamo puede repetirse. Las anteriores que siguen vigentes se muestran aparte.</li>
<li>«Otras deudas y obligaciones» (pensiones, avales, financiaciones…) y las observaciones del diputado sobre sus deudas se copian literalmente y no se suman.</li>
<li>El nombre de personas particulares que no son el diputado (por ejemplo, hijos) se sustituye por «[nombre omitido]».</li>
<li>Si una lectura no se ha podido confirmar al 100 % (una cifra tapada o cortada en el escaneo, un separador casi invisible) o el original trae un dato incoherente (una fecha imposible o posterior a la declaración), la ficha lo indica con un aviso de <strong>lectura no confirmada</strong>, un enlace al PDF y otro para avisarnos si alguien puede confirmarlo.</li>
<li>El saldo es el de la fecha que indica el formulario oficial: a 31 de diciembre del año anterior a la declaración o en el mes anterior a presentarla.</li>
</ul>`,
    rentas: `<p>Se copian de las páginas 1 a 3 de las declaraciones de bienes, con el texto y el importe <strong>tal y como los escribe el diputado</strong>:</p>
<ul>
<li><strong>Rentas:</strong> las que percibió en el año anterior a la declaración (sueldos, honorarios, dividendos, intereses, alquileres, ventas y otras), y la cuota de IRPF que pagó ese año. El sueldo del Congreso no se declara aquí porque ya lo publica la Cámara (ver <a href="#retribuciones">Retribuciones</a>); por eso muchas tablas aparecen vacías aunque el diputado declare el IRPF.</li>
<li><strong>Cuentas y depósitos:</strong> el saldo de todos sus depósitos en la fecha que indica el formulario. Los números de cuenta no se publican.</li>
<li><strong>Acciones, fondos y sociedades:</strong> deuda pública, acciones y participaciones, sociedades participadas en más de un 5 % por sus sociedades, y otros bienes o derechos (seguros de vida, planes de pensiones…), con el valor que declara.</li>
<li>Cada tabla se toma de la declaración más reciente que la rellena, y la ficha indica su fecha. Las modificaciones que solo comunican otros cambios (por ejemplo, un vehículo) no la sustituyen.</li>
<li>Las cifras grandes de la ficha son la suma de cada tabla. Si un importe no se puede leer como número sin interpretarlo (formatos como «47.268.27» o un texto en lugar de una cifra), no se suma y se indica «al menos». No se calculan medias.</li>
<li>El nombre de personas particulares que no son el diputado se sustituye por «[nombre omitido]».</li>
</ul>
<p><strong>Filtrar y ordenar por acciones y fondos</strong> (página Diputados): el total es la suma de su tabla «Deuda pública, obligaciones, acciones y participaciones». Una fila cuenta como acciones o como fondos solo si la descripción del propio diputado lo dice (acciones, participaciones, porcentaje de una sociedad; fondo, F.I., SICAV). Si no lo dice (por ejemplo, solo «TELEFONICA» o «Valores Caixabank»), cuenta en el total pero no se clasifica; los planes de pensiones no cuentan como fondos de inversión. Una fila que menciona acciones y fondos cuenta en los dos.</p>`,
    actividades: `<p>Del <em>Registro de Intereses - Actividades</em>: cargos públicos, actividades públicas a las que ha renunciado, pensiones, docencia, cargos en partidos, colaboraciones, actividades privadas autorizadas y otras. Es lo que cada diputado declara y el Pleno del Congreso considera compatible con el escaño. El texto se extrae automáticamente del PDF oficial (tiene capa de texto) y se publica literalmente, con la fecha del acuerdo del Pleno. Si el Pleno aún no se ha pronunciado, el Congreso no publica el contenido y la ficha lo indica.</p>`,
    intereses: `<p>De las <em>Declaraciones de Intereses Económicos</em> (Código de Conducta de las Cortes Generales): actividades de los cinco años anteriores al escaño que le dieron ingresos o pueden condicionar su actividad política (período, empleador, sector y descripción), donaciones y obsequios recibidos, fundaciones y asociaciones a las que contribuye y otros intereses. Se toma cada apartado de la declaración más reciente que lo rellena. El nombre de un particular (por ejemplo, un familiar como benefactor) se sustituye por «[nombre omitido]».</p>`,
    entidades: `<p>Cada ficha lista las empresas, administraciones, fundaciones, asociaciones, partidos y otras entidades que nombran los documentos oficiales del diputado, con el texto literal y el enlace a cada documento:</p>
<ul>
<li>Los <strong>acuerdos de la Comisión del Estatuto de los Diputados</strong> sobre sus declaraciones de actividades, aprobados por el Pleno y publicados en el <a href="https://www.congreso.es/es/cem/dictamenes_actividades_xvleg">Boletín Oficial de las Cortes Generales (serie D)</a>: qué actividad declara, en qué empresa o entidad, y si el Congreso la declara compatible, la autoriza o toma conocimiento.</li>
<li>El <em>Registro de Intereses - Actividades</em>.</li>
<li>Todas sus <em>Declaraciones de Intereses Económicos</em> de la legislatura (no solo la más reciente): empleadores de los cinco años anteriores, donaciones y contribuciones.</li>
<li>Las acciones, participaciones y sociedades de su declaración de bienes.</li>
<li>La trayectoria de su ficha oficial en congreso.es.</li>
</ul>
<p>Los textos son libres, así que los nombres se han localizado con ayuda de un asistente de inteligencia artificial y con reglas estrictas: solo nombres que aparecen <strong>literalmente</strong> en el texto (una comprobación automática lo verifica uno a uno), nunca personas particulares y nunca referencias genéricas («una empresa privada»). Las variantes de un mismo nombre (mayúsculas, tildes, «S.A.» o «SA») se agrupan; las uniones hechas a mano están en <a href="https://github.com/MarcoAnarmo/CongresoAbierto/blob/main/data/manual/entidades.json">data/manual/entidades.json</a>. El tipo (empresa, sector público, fundación…) solo sirve para ordenar la lista.</p>
<p><strong>Tipo de relación.</strong> Cada vez que un documento nombra una entidad se indica qué relación describe, según la sección oficial del documento (en el Registro de Intereses, los apartados A a H; en la declaración de intereses económicos, trabajos anteriores, donaciones recibidas o contribuciones) o, en los acuerdos del Congreso, según el artículo de la ley electoral (LOREG) que cita el acuerdo. No se deduce del nombre de la entidad. Así se distinguen, por ejemplo, un cargo en una empresa autorizado por el Congreso, unas acciones, una cuota a una ONG o un trabajo de hace cinco años.</p>
<p><strong>Remuneración.</strong> Solo se indica lo que dice el propio documento: «sin remuneración», «solo dietas, indemnizaciones o gastos», «solo complemento por antigüedad» (funcionarios en servicios especiales) o «con remuneración». Si el documento no lo dice, la web no lo supone. En los acuerdos del Congreso no se tiene en cuenta la fórmula fija «sin la posibilidad de percibir remuneración del sector público», que es una condición del acuerdo y no una descripción de la actividad.</p>
<p><strong>Para hacer estadísticas con estos datos</strong> (tabla «Empresas y entidades» en Datos): hay que contar cada tipo de relación por separado y no sumar como si fueran iguales un cargo, unas acciones, una aportación o un regalo. «No consta» no significa que cobre. Una misma entidad puede aparecer en varios documentos del mismo diputado: para contar entidades hay que contar nombres distintos, no filas.</p>
<p><strong>Que una entidad aparezca no implica ninguna irregularidad ni conflicto de intereses:</strong> es lo que consta en esos documentos. Tampoco es una lista completa de sus relaciones, sino de lo que está por escrito en documentos oficiales.</p>`,
    borme: `<p>El <a href="https://www.boe.es/diario_borme/">Boletín Oficial del Registro Mercantil (BORME)</a> publica cada día los actos inscritos de las sociedades: constituciones, nombramientos y ceses de administradores, consejeros y apoderados, socios únicos… El BOE los ofrece como <a href="https://www.boe.es/datosabiertos/">datos abiertos</a> desde 2009.</p>
<ul>
<li>Se han revisado todos los actos inscritos desde enero de 2009 (unos 9,6 millones en más de 126.000 boletines provinciales) buscando el nombre completo de cada diputado tal como lo escribe el BORME (apellidos y nombre).</li>
<li><strong>El BORME no publica el DNI.</strong> Que el nombre coincida no demuestra que sea la misma persona: en España hay nombres que comparten cientos de personas. Por eso <strong>solo se publica una coincidencia cuando otro documento oficial la confirma</strong>:
<ul>
<li>la misma empresa aparece en sus declaraciones, en los acuerdos del Congreso sobre sus actividades o en su ficha;</li>
<li>es una empresa pública (municipal, provincial, insular…) de un lugar o una administración en la que el diputado declara un cargo, como un concejal en el consejo de una empresa de su ayuntamiento;</li>
<li>la sociedad lleva su nombre y apellido y está inscrita en la provincia de su circunscripción.</li>
</ul></li>
<li>Las coincidencias que no se pueden confirmar así <strong>no se publican</strong>, aunque el nombre sea poco frecuente. Para estimar cuántas personas se llaman igual se usan las estadísticas de <a href="https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736177009&menu=resultados&idp=1254734710990">nombres y apellidos del INE</a>, pero solo como ayuda para revisarlas, nunca para publicarlas.</li>
<li>Cada acto enlaza a su anuncio oficial en boe.es. Los nombres de las sociedades, los actos y los cargos se copian tal cual, con las abreviaturas del BORME («Adm. Unico» es administrador único; «Apo.Man.Soli», apoderado mancomunado y solidario).</li>
<li>Un cargo en el BORME no indica si se cobraba ni si sigue vigente: muestra la fecha de cada acto publicado. El BORME empieza en 2009; lo anterior no está.</li>
</ul>
<p>El código que lo hace es público: <a href="https://github.com/MarcoAnarmo/CongresoAbierto/blob/main/scripts/browser/borme.js">scripts/browser/borme.js</a> (búsqueda) y <a href="https://github.com/MarcoAnarmo/CongresoAbierto/blob/main/scripts/borme-clasificar.py">scripts/borme-clasificar.py</a> (confirmación). Las coincidencias sin confirmar no se suben al repositorio, porque en su mayoría son de otras personas.</p>`,
    revision: `<p>Todo lo que hay en esta web sale de documentos oficiales que cualquiera puede abrir. Aquí se explica, fuente a fuente, en qué formato publica cada institución sus datos, cómo se han pasado a la web y cómo se ha comprobado que lo publicado coincide con el original.</p>
<h3>La regla: solo se publica lo que se puede comprobar</h3>
<ul>
<li><strong>Se publica</strong> lo que está escrito en un documento oficial y se ha comprobado contra él. Cada dato enlaza a su documento, para que cualquiera pueda verificarlo.</li>
<li><strong>Se publica con aviso</strong> («Lectura no confirmada») lo que sí está en el documento pero tiene alguna lectura que no se ha podido confirmar al 100 %, por ejemplo una cifra borrosa en un escaneo. El aviso enlaza al PDF y pide ayuda para confirmarlo.</li>
<li><strong>No se publica</strong> lo que ningún documento oficial confirma, aunque parezca probable. Por ejemplo, una persona del Registro Mercantil que se llama igual que un diputado, si no hay otro documento que demuestre que es la misma persona. Tampoco se publican nombres de particulares, números de cuenta, NIF ni matrículas.</li>
<li><strong>No se interpreta.</strong> Los textos se copian literalmente, con sus erratas, y las cifras son sumas de lo declarado: nunca medias ni estimaciones. Si algo no coincide con el documento oficial, prevalece el documento oficial.</li>
</ul>
<h3>De dónde sale cada dato y cómo se ha comprobado</h3>
<ul>
<li><strong>Diputados, grupos, cargos, formación y trayectoria.</strong> <em>Formato:</em> páginas y buscador de congreso.es. <em>Cómo se extrae:</em> unos programas copian los campos tal cual. <em>Comprobación:</em> no hay transcripción; el texto es el oficial. El tipo de universidad (pública o privada) es el del registro oficial de universidades (RUCT).</li>
<li><strong>Declaraciones de bienes y rentas</strong> ({pdfs} documentos). <em>Formato:</em> PDF escaneados, es decir, imágenes sin un texto que un ordenador pueda leer. <em>Cómo se extrae:</em> cada página se ha transcrito con ayuda de un modelo de lenguaje con visión (inteligencia artificial), siguiendo unas instrucciones públicas: copiar literalmente, no adivinar nunca y marcar con «?» lo que no se lea bien. <em>Comprobación:</em>
<ul>
<li>inmuebles y vehículos: una segunda revisión completa e independiente, fila a fila;</li>
<li>deudas: dos transcripciones independientes, y cada diferencia se resuelve mirando el PDF;</li>
<li>rentas, cuentas y acciones: cada cifra y cada palabra se compara con una lectura automática independiente (OCR), y todo lo que no coincide se vuelve a mirar en el PDF ampliado.</li>
</ul></li>
<li><strong>Declaraciones de intereses económicos.</strong> <em>Formato:</em> PDF escaneados. Mismo método y misma comprobación que las rentas.</li>
<li><strong>Registro de Intereses - Actividades</strong> y <strong>acuerdos de la Comisión del Estatuto</strong> (Boletín Oficial de las Cortes Generales, serie D). <em>Formato:</em> PDF con texto. <em>Cómo se extrae:</em> un programa copia el texto literal de cada apartado, sin inteligencia artificial. <em>Comprobación:</em> es el texto del propio PDF. Cada acuerdo se asigna a un diputado solo si su nombre coincide exactamente con el de la lista oficial; los de quienes ya no tienen escaño no se usan.</li>
<li><strong>Votaciones.</strong> <em>Formato:</em> datos abiertos del Congreso (JSON) con el voto de cada diputado. <em>Cómo se extrae:</em> con programas, sin inteligencia artificial. Los temas se asignan por palabras del título oficial, con una lista pública.</li>
<li><strong>Retribuciones.</strong> Importes oficiales que publica el Congreso.</li>
<li><strong>Empresas y entidades.</strong> <em>Formato:</em> los textos de los documentos anteriores. <em>Cómo se extrae:</em> un modelo de lenguaje ha señalado en cada texto los nombres de empresas, administraciones, fundaciones y otras entidades. <em>Comprobación:</em> un programa verifica que cada nombre aparece letra a letra en su texto oficial; si no aparece, se descarta. Nunca se recogen nombres de particulares. Los nombres distintos de una misma entidad se agrupan con una lista pública.</li>
<li><strong>Registro Mercantil (BORME).</strong> <em>Formato:</em> datos abiertos del BOE (XML), unos 9,6 millones de actos desde 2009. <em>Cómo se extrae:</em> un programa busca el nombre completo exacto de cada diputado, sin inteligencia artificial. <em>Comprobación:</em> como el BORME no publica el DNI, una coincidencia solo se publica si otro documento oficial la confirma (ver <a href="#borme">Registro Mercantil</a>). De 662 casos en los que una empresa tiene un cargo con el mismo nombre que un diputado, se publican 77; los otros 585 no, porque no se pueden confirmar.</li>
</ul>
<h3>Qué ha hecho la inteligencia artificial y qué no</h3>
<ul>
<li><strong>Ha ayudado a</strong> transcribir los PDF escaneados, que no tienen texto; a localizar los nombres de entidades en textos libres; a traducir la web a otras lenguas; y a programar.</li>
<li><strong>No decide qué se publica.</strong> Todo lo que transcribe o señala se comprueba contra el documento oficial con otro método: una segunda lectura, un OCR independiente o una comprobación automática de que el texto es literal. Lo que no se puede comprobar se marca con un aviso o no se publica.</li>
<li><strong>No resume, no interpreta y no clasifica a nadie.</strong> Las cifras las calcula el código a partir de lo transcrito, y los textos oficiales se muestran tal cual, en castellano.</li>
</ul>
<p>El código, los datos transcritos y las instrucciones de transcripción son públicos en <a href="https://github.com/MarcoAnarmo/CongresoAbierto">GitHub</a>, para que cualquiera pueda repetir el proceso o encontrar un error.</p>`,
    retribuciones: `<p>Se muestran los importes mensuales oficiales de 2026 que corresponden a cada diputado durante su mandato, según su circunscripción y sus cargos:</p>
<ul>
<li>Asignación constitucional, igual para todos: {asignacion}.</li>
<li>Indemnización por gastos, exenta de IRPF: {indemOtras} (fuera de Madrid) o {indemMadrid} (electos por Madrid).</li>
<li>Complementos por cargo, no acumulables dentro de cada bloque (Mesa y Junta de Portavoces; Comisiones):<ul>{cargos}</ul></li>
</ul>
<p>Los cargos salen de la ficha oficial de cada diputado. No se incluyen el transporte (lo paga el Congreso directamente) ni los sueldos de quienes además son miembros del Gobierno, que se rigen por los Presupuestos Generales del Estado.</p>`,
    votaciones: `<p>Cada votación muestra el texto oficial del expediente, el tipo de votación, el resultado, el voto de cada grupo (con el grupo de cada diputado en la fecha de la votación) y el voto de cada diputado según los datos abiertos del Congreso. El hemiciclo es un gráfico ordenado por grupos parlamentarios; no reproduce el plano real de asientos. Las votaciones por llamamiento (en voz alta) tardan más en publicarse en datos abiertos; se añaden cuando aparecen. Con las Cortes disueltas, los decretos-leyes los convalida o deroga la Diputación Permanente (art. 78 de la Constitución). Cuando el Congreso solo publica los totales de una votación, sin el voto de cada diputado (por ejemplo, en una votación secreta), la web muestra solo esos totales y lo indica. <a href="{votaciones}">Ver votaciones</a>.</p>`,
    participacion: `<p>Para cada diputado se cuentan todas las votaciones del Pleno de la XV Legislatura con voto nominal publicado en las que tenía escaño: cuántas veces votó sí, no o abstención y cuántas no votó (por ausencia o porque no emitió voto). No se incluyen las votaciones secretas, porque no hay voto de cada diputado.</p>
<p><strong>Voto distinto de su grupo:</strong> se cuenta cuando votó sí, no o abstención y la mayoría de su grupo en esa votación (con el grupo que publica el Congreso para esa fecha) votó otra cosa. No cuenta «no vota», ni las votaciones en las que su grupo empató, ni el Grupo Mixto, donde conviven varios partidos.</p>`,
    temas: `<p>La página de votaciones recoge todas las votaciones del Pleno de la XV Legislatura publicadas en datos abiertos (desde septiembre de 2023). Las votaciones por llamamiento, como las investiduras, no tienen el voto de cada diputado en datos abiertos y no aparecen. Las <strong>votaciones clave</strong> llevan además documentos oficiales (BOE, BOCG, Diario de Sesiones) y extractos literales del texto, revisados a mano; las demás muestran el título oficial, los totales, el voto por grupo y el JSON y el PDF oficiales.</p>
<p>El Congreso no clasifica sus votaciones por temas. Para poder filtrarlas, cada votación recibe uno o varios temas según las palabras que aparecen en su título oficial (por ejemplo, «alquiler» o «vivienda» → Vivienda). Es una ayuda para buscar, no una valoración: la lista completa de palabras está en <a href="https://github.com/MarcoAnarmo/CongresoAbierto/blob/main/data/manual/temas.json">data/manual/temas.json</a> y cualquiera puede proponer cambios. Si una votación no encaja en ningún tema, aparece en «Otros».</p>
<p>El resultado se calcula con los totales oficiales: mayoría simple (más síes que noes), salvo en la votación de conjunto de una ley orgánica, que necesita 176 votos a favor (art. 81 de la Constitución). En los decretos-leyes, «convalidado» o «derogado».</p>`,
    avisoLegal: `<p>Congreso Abierto es un proyecto ciudadano, sin ánimo de lucro e independiente: no tiene relación con el Congreso de los Diputados, con el Gobierno ni con ningún partido.</p>
<ul>
<li><strong>Solo datos públicos.</strong> La web reúne y presenta información que publican instituciones oficiales (Congreso, Boletín Oficial de las Cortes Generales, Boletín Oficial del Estado) y que cualquiera puede consultar en su origen. Cada dato enlaza al documento del que sale. Si algo no coincide, prevalece el documento oficial.</li>
<li><strong>Sin interpretaciones.</strong> Los textos se copian literalmente. La web no afirma que exista ningún conflicto de intereses ni ninguna irregularidad: muestra lo que dicen los documentos.</li>
<li><strong>Datos personales.</strong> Solo se publican datos que las propias instituciones hacen públicos sobre los diputados por su cargo. Se omiten los nombres de particulares que no son el diputado, los números de cuenta, el NIF y las matrículas. Para pedir una corrección o ejercer tus derechos, escribe a <a href="mailto:ayuda@congresoabierto.org">ayuda@congresoabierto.org</a>.</li>
<li><strong>Reutilización.</strong> Los datos descargables se publican con licencia <a href="https://creativecommons.org/licenses/by/4.0/deed.es">CC BY 4.0</a> y el código con licencia MIT. Se ofrecen tal cual, sin garantías. Congreso Abierto no se hace responsable del uso que otras personas hagan de los datos ni de las conclusiones que saquen de ellos; quien los reutilice debe citar la fuente y respetar la ley, también la de protección de datos.</li>
</ul>`,
    errores: `<p><a href="{error}" rel="noopener">Avisa del error en GitHub</a> con el diputado, el dato y el enlace al documento oficial (con la página). Solo se aceptan correcciones respaldadas por un documento oficial.</p>
<p>El proyecto es público y cualquiera puede proponer cambios, sepa o no programar. En <a href="{colabora}">Colabora</a> se explica cómo.</p>`,
  },
};

export default area(es, {
  ca: {
    titulo: 'Metodologia',
    descripcion: 'D’on surten les dades de Congreso Abierto i com es presenten, sense interpretacions.',
    h1: 'Fonts i mètode',
    indice: 'Índex de la pàgina',
    enPagina: 'En aquesta pàgina',
    nota: 'Els documents i les dades oficials els publica el Congrés en castellà, i aquí es mostren tal com es publiquen.',
    secciones: {
      principio: 'Principi',
      fuentes: 'Fonts oficials',
      revision: 'Com s’han obtingut i comprovat les dades',
      perfil: 'Formació i trajectòria',
      propiedades: 'Propietats i habitatges',
      vehiculos: 'Vehicles',
      deudas: 'Deutes i préstecs',
      rentas: 'Rendes, comptes i accions',
      actividades: 'Càrrecs i activitats',
      intereses: 'Feines anteriors i interessos',
      entidades: 'Empreses i entitats',
      borme: 'Registre Mercantil (BORME)',
      retribuciones: 'Retribucions',
      votaciones: 'Votacions',
      participacion: 'Els seus vots al Ple',
      temas: 'Temes de les votacions',
      avisoLegal: 'Ús de les dades i avís legal',
      errores: 'Has vist un error?',
    },
    html: {
      principio: `<p>Aquí només hi ha informació oficial de l’Estat, presentada tal com la publica la institució que la produeix. No fem interpretacions ni valoracions: ordenem i simplifiquem perquè qualsevol persona la pugui consultar i en pugui treure les seves pròpies conclusions. Si alguna cosa no coincideix amb el document oficial, preval el document oficial.</p>`,
      fuentes: `<ul>
<li><strong>Diputats, grups i càrrecs:</strong> cercador i fitxes oficials de <a href="https://www.congreso.es/es/busqueda-de-diputados">congreso.es</a> (XV legislatura). Data de consulta: {fecha}.</li>
<li><strong>Propietats i vehicles:</strong> les <em>Declaraciones de Bienes y Rentas</em> (declaracions de béns i rendes) que cada diputat presenta davant el Congrés i que aquest publica a la seva fitxa: {pdfs} documents de {conDecl} diputats; el més recent és de data {ultima}.</li>
<li><strong>Rendes, comptes, accions i societats:</strong> pàgines 1 a 3 d’aquestes mateixes declaracions de béns.</li>
<li><strong>Càrrecs, activitats, feines anteriors i donacions:</strong> el <em>Registro de Intereses - Actividades</em> (registre d’interessos – activitats) i les <em>Declaraciones de Intereses Económicos</em> (declaracions d’interessos econòmics) que el Congrés publica a la fitxa de cada diputat.</li>
<li><strong>Votacions:</strong> <a href="https://www.congreso.es/es/opendata/votaciones">dades obertes de votacions</a> del Congrés, amb el text oficial de cada expedient.</li>
<li><strong>Normes:</strong> <a href="https://www.boe.es">Boletín Oficial del Estado</a> (decrets llei i acords de convalidació o derogació).</li>
<li><strong>Retribucions:</strong> <a href="{fuenteRetribuciones}">Régimen económico y ayudas de los miembros de la Cámara</a>, imports del 2026.</li>
<li><strong>Empreses i entitats:</strong> a més, els acords de la Comissió de l’Estatut dels Diputats sobre les seves activitats, publicats al <a href="https://www.congreso.es/es/cem/dictamenes_actividades_xvleg">Butlletí Oficial de les Corts Generals (sèrie D)</a>.</li>
<li><strong>Càrrecs en societats:</strong> <a href="https://www.boe.es/datosabiertos/">dades obertes del BORME</a> (Butlletí Oficial del Registre Mercantil), des del 2009.</li>
</ul>
<p><strong>Grup i candidatura.</strong> El Congrés registra dues dades diferents: la candidatura amb què cada diputat va ser elegit a les eleccions i el grup parlamentari al qual pertany en la data de consulta. Poden no coincidir: qui deixa el seu grup passa al Grupo Mixto encara que hagués estat elegit en una altra llista. L’hemicicle ordena per aquest grup parlamentari; quan la candidatura és diferent, s’indica entre parèntesis.</p>`,
      perfil: `<p>Surten de la <em>Ficha personal</em> (fitxa personal) de cada diputat a <a href="https://www.congreso.es/es/busqueda-de-diputados">congreso.es</a>, un text que redacta el mateix diputat. Es copia literalment, línia a línia, i només se separa en dos blocs:</p>
<ul>
<li><strong>Formació:</strong> les línies que parlen de títols o estudis (llicenciat, grau, màster, doctor, diplomat, enginyer, curs, programa…). La resta és <strong>trajectòria</strong>. Una frase de feina (professor, investigador, director…) no compta com a estudi encara que esmenti una universitat.</li>
<li><strong>Universitat pública o privada:</strong> només quan la línia esmenta el centre. El tipus és el que consta al <a href="https://www.educacion.gob.es/ruct/consultauniversidades?actual=universidades">Registro de Universidades, Centros y Títulos (RUCT)</a> del Ministeri. També es reconeixen altres maneres d’anomenar-la (en altres llengües oficials, sigles com UCM o UNED, i centres que formen part d’una universitat, com ICADE, ESADE o IESE). La llista és a <code>data/manual/universidades.json</code>.</li>
<li>Si esmenta un centre que no és al RUCT (per exemple, una universitat estrangera), s’indica així, sense classificar-lo. Si no esmenta el centre, es diu que la fitxa no ho indica: no se’n dedueix res.</li>
<li>No es recullen dades familiars (estat civil, fills) encara que apareguin a la fitxa.</li>
<li><strong>Línia de temps:</strong> les legislatures en què ha estat diputat (amb les dates oficials), els seus càrrecs a la Cambra en la data de consulta, amb la data d’inici, les línies de la seva trajectòria que citen un any i les seves declaracions de béns i d’interessos econòmics d’aquesta legislatura, cadascuna amb el seu PDF.</li>
</ul>`,
      propiedades: `<p>S’utilitzen les taules de «Bienes inmuebles» (béns immobles) de cada declaració, copiades literalment. Cada fitxa enllaça als seus PDF originals.</p>
<ul>
<li><strong>Propietats:</strong> tots els immobles urbans i rústics que el diputat declara al seu nom, en propietat total o parcial: habitatges, garatges, trasters, locals, naus, solars, finques… Cada línia de la taula oficial compta com una propietat; si la línia indica un nombre d’unitats («16 viviendas», «8 fincas rústicas», «piso y dos plazas de garaje»), es compten aquestes unitats.</li>
<li><strong>Habitatges:</strong> d’aquestes propietats, les que el mateix diputat descriu com a habitatge, pis, casa, xalet, apartament, àtic, dúplex, estudi, adossat, unifamiliar, bungalou o residencial, també en sòl rústic. No compten com a habitatge les que només es descriuen com a garatge, plaça d’aparcament, cotxera, traster, local, oficina, magatzem, nau, solar, parcel·la, terreny o finca rústica.</li>
<li>Es mostren el percentatge i el tipus de dret (pleno dominio, nuda propiedad, ganancial…) tal com els escriu el diputat.</li>
<li>Els immobles de societats en què participa el diputat es llisten a part a la seva fitxa i no se sumen.</li>
<li>Si l’última declaració només comunica un canvi (per exemple, una compra), es mostra al costat de la declaració completa anterior. Un bé només deixa de comptar-se quan una declaració oficial posterior en comunica la venda o la baixa; la fitxa indica quina.</li>
<li>Les declaracions reflecteixen el patrimoni en la data en què es van presentar.</li>
</ul>`,
      vehiculos: `<p>Es copien de la taula «Vehículos, embarcaciones y aeronaves» (vehicles, embarcacions i aeronaus). No es publiquen matrícules, perquè el mateix formulari oficial demana que no s’indiquin.</p>`,
      deudas: `<p>Es copien de l’apartat «Deudas y obligaciones patrimoniales» (deutes i obligacions patrimonials, pàgina 4) de les mateixes declaracions de béns que s’utilitzen per a les propietats.</p>
<ul>
<li>Cada préstec es publica amb la descripció i el creditor, la data de concessió, l’import concedit i el saldo pendent, <strong>tal com els escriu el diputat</strong> (format, errates i tot).</li>
<li>El saldo pendent total és la suma de la taula de préstecs de la seva declaració més recent que emplena l’apartat. Si algun import no es pot llegir com a número sense interpretar-lo (un dígit il·legible a l’escaneig, un format impossible), no se suma i s’indica «almenys».</li>
<li>No se sumen préstecs de declaracions diferents, perquè el mateix préstec es pot repetir. Els anteriors que continuen vigents es mostren a part.</li>
<li>«Otras deudas y obligaciones» (altres deutes i obligacions: pensions, avals, finançaments…) i les observacions del diputat sobre els seus deutes es copien literalment i no se sumen.</li>
<li>El nom de persones particulars que no són el diputat (per exemple, fills) se substitueix per «[nombre omitido]» (nom omès).</li>
<li>Si una lectura no s’ha pogut confirmar al 100 % (una xifra tapada o tallada a l’escaneig, un separador gairebé invisible) o l’original conté una dada incoherent (una data impossible o posterior a la declaració), la fitxa ho indica amb un avís de <strong>lectura no confirmada</strong>, un enllaç al PDF i un altre perquè ens avisis si algú ho pot confirmar.</li>
<li>El saldo és el de la data que indica el formulari oficial: a 31 de desembre de l’any anterior a la declaració o el mes anterior a presentar-la.</li>
</ul>`,
      rentas: `<p>Es copien de les pàgines 1 a 3 de les declaracions de béns, amb el text i l’import <strong>tal com els escriu el diputat</strong>:</p>
<ul>
<li><strong>Rendes:</strong> les que va percebre l’any anterior a la declaració (sous, honoraris, dividends, interessos, lloguers, vendes i altres) i la quota d’IRPF que va pagar aquell any. El sou del Congrés no es declara aquí perquè ja el publica la Cambra (consulta <a href="#retribuciones">Retribucions</a>); per això moltes taules apareixen buides encara que el diputat declari l’IRPF.</li>
<li><strong>Comptes i dipòsits:</strong> el saldo de tots els seus dipòsits en la data que indica el formulari. Els números de compte no es publiquen.</li>
<li><strong>Accions, fons i societats:</strong> deute públic, accions i participacions, societats participades en més d’un 5 % per les seves societats, i altres béns o drets (assegurances de vida, plans de pensions…), amb el valor que declara.</li>
<li>Cada taula es pren de la declaració més recent que l’emplena, i la fitxa n’indica la data. Les modificacions que només comuniquen altres canvis (per exemple, un vehicle) no la substitueixen.</li>
<li>Les xifres grans de la fitxa són la suma de cada taula. Si un import no es pot llegir com a número sense interpretar-lo (formats com «47.268.27» o un text en lloc d’una xifra), no se suma i s’indica «almenys». No es calculen mitjanes.</li>
<li>El nom de persones particulars que no són el diputat se substitueix per «[nombre omitido]».</li>
</ul>
<p><strong>Filtrar i ordenar per accions i fons</strong> (pàgina Diputats): el total és la suma de la seva taula «Deuda pública, obligaciones, acciones y participaciones». Una fila compta com a accions o com a fons només si la descripció del mateix diputat ho diu (accions, participacions, percentatge d’una societat; fons, F.I., SICAV). Si no ho diu (per exemple, només «TELEFONICA» o «Valores Caixabank»), compta en el total però no es classifica; els plans de pensions no compten com a fons d’inversió. Una fila que esmenta accions i fons compta en els dos.</p>`,
      actividades: `<p>Del <em>Registro de Intereses - Actividades</em>: càrrecs públics, activitats públiques a què ha renunciat, pensions, docència, càrrecs en partits, col·laboracions, activitats privades autoritzades i altres. És el que cada diputat declara i el Ple del Congrés considera compatible amb l’escó. El text s’extreu automàticament del PDF oficial (té capa de text) i es publica literalment, amb la data de l’acord del Ple. Si el Ple encara no s’hi ha pronunciat, el Congrés no en publica el contingut i la fitxa ho indica.</p>`,
      intereses: `<p>De les <em>Declaraciones de Intereses Económicos</em> (Código de Conducta de las Cortes Generales): activitats dels cinc anys anteriors a l’escó que li van donar ingressos o que poden condicionar la seva activitat política (període, ocupador, sector i descripció), donacions i obsequis rebuts, fundacions i associacions a què contribueix i altres interessos. Cada apartat es pren de la declaració més recent que l’emplena. El nom d’un particular (per exemple, un familiar com a benefactor) se substitueix per «[nombre omitido]».</p>`,
      entidades: `<p>Cada fitxa recull les empreses, administracions, fundacions, associacions, partits i altres entitats que esmenten els documents oficials del diputat, amb el text literal i l’enllaç a cada document:</p>
<ul>
<li>Els <strong>acords de la Comissió de l’Estatut dels Diputats</strong> sobre les seves declaracions d’activitats, aprovats pel Ple i publicats al <a href="https://www.congreso.es/es/cem/dictamenes_actividades_xvleg">Butlletí Oficial de les Corts Generals (sèrie D)</a>: quina activitat declara, en quina empresa o entitat, i si el Congrés la declara compatible, l’autoritza o en pren coneixement.</li>
<li>El <em>Registro de Intereses - Actividades</em>.</li>
<li>Totes les seves <em>Declaraciones de Intereses Económicos</em> de la legislatura (no només la més recent): ocupadors dels cinc anys anteriors, donacions i contribucions.</li>
<li>Les accions, participacions i societats de la seva declaració de béns.</li>
<li>La trajectòria de la seva fitxa oficial a congreso.es.</li>
</ul>
<p>Els textos són lliures, així que els noms s’han localitzat amb l’ajuda d’un assistent d’intel·ligència artificial i amb regles estrictes: només noms que apareixen <strong>literalment</strong> al text (una comprovació automàtica ho verifica un per un), mai persones particulars i mai referències genèriques («una empresa privada»). Les variants d’un mateix nom (majúscules, accents, «S.A.» o «SA») s’agrupen; les unions fetes a mà són a <a href="https://github.com/MarcoAnarmo/CongresoAbierto/blob/main/data/manual/entidades.json">data/manual/entidades.json</a>. El tipus (empresa, sector públic, fundació…) només serveix per ordenar la llista.</p>
<p><strong>Tipus de relació.</strong> Cada vegada que un document esmenta una entitat s’indica quina relació descriu, segons la secció oficial del document (al Registre d’Interessos, els apartats A a H; a la declaració d’interessos econòmics, feines anteriors, donacions rebudes o contribucions) o, als acords del Congrés, segons l’article de la llei electoral (LOREG) que cita l’acord. No es dedueix del nom de l’entitat. Així es distingeixen, per exemple, un càrrec en una empresa autoritzat pel Congrés, unes accions, una quota a una ONG o una feina de fa cinc anys.</p>
<p><strong>Remuneració.</strong> Només s’indica el que diu el mateix document: «sense remuneració», «només dietes, indemnitzacions o despeses», «només complement d’antiguitat» (funcionaris en serveis especials) o «amb remuneració». Si el document no ho diu, el web no ho suposa. Als acords del Congrés no es té en compte la fórmula fixa «sin la posibilidad de percibir remuneración del sector público», que és una condició de l’acord i no una descripció de l’activitat.</p>
<p><strong>Per fer estadístiques amb aquestes dades</strong> (taula «Empreses i entitats» a Dades): cal comptar cada tipus de relació per separat i no sumar com si fossin iguals un càrrec, unes accions, una aportació o un regal. «No consta» no vol dir que cobri. Una mateixa entitat pot aparèixer en diversos documents del mateix diputat: per comptar entitats cal comptar noms diferents, no files.</p>
<p><strong>Que hi aparegui una entitat no implica cap irregularitat ni conflicte d’interessos:</strong> és el que consta en aquests documents. Tampoc no és una llista completa de les seves relacions, sinó del que és per escrit en documents oficials.</p>`,
      borme: `<p>El <a href="https://www.boe.es/diario_borme/">Butlletí Oficial del Registre Mercantil (BORME)</a> publica cada dia els actes inscrits de les societats: constitucions, nomenaments i cessaments d’administradors, consellers i apoderats, socis únics… El BOE els ofereix com a <a href="https://www.boe.es/datosabiertos/">dades obertes</a> des del 2009.</p>
<ul>
<li>S’han revisat tots els actes inscrits des del gener del 2009 (uns 9,6 milions en més de 126.000 butlletins provincials) buscant el nom complet de cada diputat tal com l’escriu el BORME (cognoms i nom).</li>
<li><strong>El BORME no publica el DNI.</strong> Que el nom coincideixi no demostra que sigui la mateixa persona: a Espanya hi ha noms que comparteixen centenars de persones. Per això <strong>només es publica una coincidència quan un altre document oficial la confirma</strong>:
<ul>
<li>la mateixa empresa apareix a les seves declaracions, als acords del Congrés sobre les seves activitats o a la seva fitxa;</li>
<li>és una empresa pública (municipal, provincial, insular…) d’un lloc o una administració on el diputat declara un càrrec, com un regidor al consell d’una empresa del seu ajuntament;</li>
<li>la societat porta el seu nom i cognom i està inscrita a la província de la seva circumscripció.</li>
</ul></li>
<li>Les coincidències que no es poden confirmar així <strong>no es publiquen</strong>, encara que el nom sigui poc freqüent. Per estimar quantes persones es diuen igual es fan servir les estadístiques de <a href="https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736177009&menu=resultados&idp=1254734710990">noms i cognoms de l’INE</a>, però només com a ajuda per revisar-les, mai per publicar-les.</li>
<li>Cada acte enllaça al seu anunci oficial a boe.es. Els noms de les societats, els actes i els càrrecs es copien tal com són, amb les abreviatures del BORME («Adm. Unico» és administrador únic; «Apo.Man.Soli», apoderat mancomunat i solidari).</li>
<li>Un càrrec al BORME no indica si es cobrava ni si continua vigent: mostra la data de cada acte publicat. El BORME comença el 2009; el que és anterior no hi és.</li>
</ul>
<p>El codi que ho fa és públic: <a href="https://github.com/MarcoAnarmo/CongresoAbierto/blob/main/scripts/browser/borme.js">scripts/browser/borme.js</a> (cerca) i <a href="https://github.com/MarcoAnarmo/CongresoAbierto/blob/main/scripts/borme-clasificar.py">scripts/borme-clasificar.py</a> (confirmació). Les coincidències sense confirmar no es pugen al repositori, perquè la majoria són d’altres persones.</p>`,
      revision: `<p>Tot el que hi ha en aquest web surt de documents oficials que qualsevol pot obrir. Aquí s’explica, font a font, en quin format publica cada institució les seves dades, com s’han passat al web i com s’ha comprovat que el que es publica coincideix amb l’original.</p>
<h3>La regla: només es publica el que es pot comprovar</h3>
<ul>
<li><strong>Es publica</strong> el que és escrit en un document oficial i s’ha comprovat amb aquest document. Cada dada enllaça al seu document, perquè qualsevol la pugui verificar.</li>
<li><strong>Es publica amb avís</strong> («Lectura no confirmada») el que sí que és al document però té alguna lectura que no s’ha pogut confirmar al 100 %, per exemple una xifra borrosa en un escaneig. L’avís enllaça al PDF i demana ajuda per confirmar-ho.</li>
<li><strong>No es publica</strong> el que cap document oficial confirma, encara que sembli probable. Per exemple, una persona del Registre Mercantil que es diu igual que un diputat, si no hi ha cap altre document que demostri que és la mateixa persona. Tampoc es publiquen noms de particulars, números de compte, NIF ni matrícules.</li>
<li><strong>No s’interpreta.</strong> Els textos es copien literalment, amb les seves errades, i les xifres són sumes del que s’ha declarat: mai mitjanes ni estimacions. Si alguna cosa no coincideix amb el document oficial, preval el document oficial.</li>
</ul>
<h3>D’on surt cada dada i com s’ha comprovat</h3>
<ul>
<li><strong>Diputats, grups, càrrecs, formació i trajectòria.</strong> <em>Format:</em> pàgines i cercador de congreso.es. <em>Com s’extreu:</em> uns programes copien els camps tal com són. <em>Comprovació:</em> no hi ha transcripció; el text és l’oficial. El tipus d’universitat (pública o privada) és el del registre oficial d’universitats (RUCT).</li>
<li><strong>Declaracions de béns i rendes</strong> ({pdfs} documents). <em>Format:</em> PDF escanejats, és a dir, imatges sense un text que un ordinador pugui llegir. <em>Com s’extreu:</em> cada pàgina s’ha transcrit amb l’ajuda d’un model de llenguatge amb visió (intel·ligència artificial), seguint unes instruccions públiques: copiar literalment, no endevinar mai i marcar amb «?» el que no es llegeixi bé. <em>Comprovació:</em>
<ul>
<li>immobles i vehicles: una segona revisió completa i independent, fila a fila;</li>
<li>deutes: dues transcripcions independents, i cada diferència es resol mirant el PDF;</li>
<li>rendes, comptes i accions: cada xifra i cada paraula es compara amb una lectura automàtica independent (OCR), i tot el que no coincideix es torna a mirar al PDF ampliat.</li>
</ul></li>
<li><strong>Declaracions d’interessos econòmics.</strong> <em>Format:</em> PDF escanejats. Mateix mètode i mateixa comprovació que les rendes.</li>
<li><strong>Registre d’Interessos - Activitats</strong> i <strong>acords de la Comissió de l’Estatut</strong> (Butlletí Oficial de les Corts Generals, sèrie D). <em>Format:</em> PDF amb text. <em>Com s’extreu:</em> un programa copia el text literal de cada apartat, sense intel·ligència artificial. <em>Comprovació:</em> és el text del mateix PDF. Cada acord s’assigna a un diputat només si el seu nom coincideix exactament amb el de la llista oficial; els de qui ja no té escó no es fan servir.</li>
<li><strong>Votacions.</strong> <em>Format:</em> dades obertes del Congrés (JSON) amb el vot de cada diputat. <em>Com s’extreu:</em> amb programes, sense intel·ligència artificial. Els temes s’assignen per paraules del títol oficial, amb una llista pública.</li>
<li><strong>Retribucions.</strong> Imports oficials que publica el Congrés.</li>
<li><strong>Empreses i entitats.</strong> <em>Format:</em> els textos dels documents anteriors. <em>Com s’extreu:</em> un model de llenguatge ha assenyalat en cada text els noms d’empreses, administracions, fundacions i altres entitats. <em>Comprovació:</em> un programa verifica que cada nom apareix lletra per lletra al seu text oficial; si no hi apareix, es descarta. Mai no es recullen noms de particulars. Els noms diferents d’una mateixa entitat s’agrupen amb una llista pública.</li>
<li><strong>Registre Mercantil (BORME).</strong> <em>Format:</em> dades obertes del BOE (XML), uns 9,6 milions d’actes des del 2009. <em>Com s’extreu:</em> un programa busca el nom complet exacte de cada diputat, sense intel·ligència artificial. <em>Comprovació:</em> com que el BORME no publica el DNI, una coincidència només es publica si un altre document oficial la confirma (vegeu <a href="#borme">Registre Mercantil</a>). De 662 casos en què una empresa té un càrrec amb el mateix nom que un diputat, se’n publiquen 77; els altres 585 no, perquè no es poden confirmar.</li>
</ul>
<h3>Què ha fet la intel·ligència artificial i què no</h3>
<ul>
<li><strong>Ha ajudat a</strong> transcriure els PDF escanejats, que no tenen text; a localitzar els noms d’entitats en textos lliures; a traduir el web a altres llengües; i a programar.</li>
<li><strong>No decideix què es publica.</strong> Tot el que transcriu o assenyala es comprova amb el document oficial amb un altre mètode: una segona lectura, un OCR independent o una comprovació automàtica que el text és literal. El que no es pot comprovar es marca amb un avís o no es publica.</li>
<li><strong>No resumeix, no interpreta i no classifica ningú.</strong> Les xifres les calcula el codi a partir del que s’ha transcrit, i els textos oficials es mostren tal com són, en castellà.</li>
</ul>
<p>El codi, les dades transcrites i les instruccions de transcripció són públics a <a href="https://github.com/MarcoAnarmo/CongresoAbierto">GitHub</a>, perquè qualsevol pugui repetir el procés o trobar-hi un error.</p>`,
      retribuciones: `<p>Es mostren els imports mensuals oficials del 2026 que corresponen a cada diputat durant el seu mandat, segons la seva circumscripció i els seus càrrecs:</p>
<ul>
<li>Assignació constitucional, igual per a tothom: {asignacion}.</li>
<li>Indemnització per despeses, exempta d’IRPF: {indemOtras} (fora de Madrid) o {indemMadrid} (elegits per Madrid).</li>
<li>Complements per càrrec, no acumulables dins de cada bloc (Mesa i Junta de Portaveus; comissions):<ul>{cargos}</ul></li>
</ul>
<p>Els càrrecs surten de la fitxa oficial de cada diputat. No s’hi inclouen el transport (el paga directament el Congrés) ni els sous dels qui, a més, són membres del Govern, que es regeixen pels Presupuestos Generales del Estado.</p>`,
      votaciones: `<p>Cada votació mostra el text oficial de l’expedient, el tipus de votació, el resultat, el vot de cada grup (amb el grup de cada diputat en la data de la votació) i el vot de cada diputat segons les dades obertes del Congrés. L’hemicicle és un gràfic ordenat per grups parlamentaris; no reprodueix el plànol real dels escons. Les votacions per crida (en veu alta) triguen més a publicar-se en dades obertes; s’afegeixen quan apareixen. Amb les Corts dissoltes, els decrets llei els convalida o els deroga la Diputació Permanent (art. 78 de la Constitució). Quan el Congrés només publica els totals d’una votació, sense el vot de cada diputat (per exemple, en una votació secreta), el web mostra només aquests totals i ho indica. <a href="{votaciones}">Mostra les votacions</a>.</p>`,
      participacion: `<p>Per a cada diputat es compten totes les votacions del Ple de la XV legislatura amb vot nominal publicat en què tenia escó: quantes vegades va votar sí, no o abstenció i quantes no va votar (per absència o perquè no va emetre el vot). No s’hi inclouen les votacions secretes, perquè no hi consta el vot de cada diputat.</p>
<p><strong>Vot diferent del seu grup:</strong> es compta quan va votar sí, no o abstenció i la majoria del seu grup en aquella votació (amb el grup que publica el Congrés per a aquella data) va votar una altra cosa. No compta «no vota», ni les votacions en què el seu grup va empatar, ni el Grupo Mixto, on conviuen diversos partits.</p>`,
      temas: `<p>La pàgina de votacions recull totes les votacions del Ple de la XV legislatura publicades en dades obertes (des del setembre del 2023). Les votacions per crida, com les investidures, no tenen el vot de cada diputat en dades obertes i no hi apareixen. Les <strong>votacions clau</strong> inclouen, a més, documents oficials (BOE, BOCG, Diario de Sesiones) i extractes literals del text, revisats a mà; les altres mostren el títol oficial, els totals, el vot per grup i el JSON i el PDF oficials.</p>
<p>El Congrés no classifica les seves votacions per temes. Per poder-les filtrar, cada votació rep un o diversos temes segons les paraules que apareixen en el seu títol oficial (per exemple, «alquiler» o «vivienda» → Habitatge). És una ajuda per cercar, no una valoració: la llista completa de paraules és a <a href="https://github.com/MarcoAnarmo/CongresoAbierto/blob/main/data/manual/temas.json">data/manual/temas.json</a> i qualsevol persona hi pot proposar canvis. Si una votació no encaixa en cap tema, apareix a «Altres».</p>
<p>El resultat es calcula amb els totals oficials: majoria simple (més sís que nos), excepte en la votació de conjunt d’una llei orgànica, que necessita 176 vots a favor (art. 81 de la Constitució). En els decrets llei, «convalidat» o «derogat».</p>`,
      avisoLegal: `<p>Congreso Abierto és un projecte ciutadà, sense ànim de lucre i independent: no té relació amb el Congrés dels Diputats, amb el Govern ni amb cap partit.</p>
<ul>
<li><strong>Només dades públiques.</strong> El web reuneix i presenta informació que publiquen institucions oficials (Congrés, Butlletí Oficial de les Corts Generals, Butlletí Oficial de l’Estat) i que qualsevol pot consultar a l’origen. Cada dada enllaça al document d’on surt. Si alguna cosa no coincideix, preval el document oficial.</li>
<li><strong>Sense interpretacions.</strong> Els textos es copien literalment. El web no afirma que hi hagi cap conflicte d’interessos ni cap irregularitat: mostra el que diuen els documents.</li>
<li><strong>Dades personals.</strong> Només es publiquen dades que les mateixes institucions fan públiques sobre els diputats pel seu càrrec. S’ometen els noms de particulars que no són el diputat, els números de compte, el NIF i les matrícules. Per demanar una correcció o exercir els teus drets, escriu a <a href="mailto:ayuda@congresoabierto.org">ayuda@congresoabierto.org</a>.</li>
<li><strong>Reutilització.</strong> Les dades descarregables es publiquen amb llicència <a href="https://creativecommons.org/licenses/by/4.0/deed.ca">CC BY 4.0</a> i el codi amb llicència MIT. S’ofereixen tal com són, sense garanties. Congreso Abierto no es fa responsable de l’ús que altres persones facin de les dades ni de les conclusions que en treguin; qui les reutilitzi ha de citar la font i respectar la llei, també la de protecció de dades.</li>
</ul>`,
      errores: `<p><a href="{error}" rel="noopener">Avisa de l’error a GitHub</a> amb el diputat, la dada i l’enllaç al document oficial (amb la pàgina). Només s’accepten correccions avalades per un document oficial.</p>
<p>El projecte és públic i qualsevol persona hi pot proposar canvis, en sàpiga o no de programar. A <a href="{colabora}">Col·labora</a> s’explica com.</p>`,
    },
  },
  eu: {
    titulo: 'Metodologia',
    descripcion: 'Nondik datozen Congreso Abiertoko datuak eta nola aurkezten diren, interpretaziorik gabe.',
    h1: 'Iturriak eta metodoa',
    indice: 'Orriaren aurkibidea',
    enPagina: 'Orri honetan',
    nota: 'Dokumentu eta datu ofizialak Kongresuak gaztelaniaz argitaratzen ditu, eta hemen argitaratzen diren bezala erakusten dira.',
    secciones: {
      principio: 'Printzipioa',
      fuentes: 'Iturri ofizialak',
      revision: 'Nola lortu eta egiaztatu diren datuak',
      perfil: 'Prestakuntza eta ibilbidea',
      propiedades: 'Jabetzak eta etxebizitzak',
      vehiculos: 'Ibilgailuak',
      deudas: 'Zorrak eta maileguak',
      rentas: 'Errentak, kontuak eta akzioak',
      actividades: 'Karguak eta jarduerak',
      intereses: 'Aurreko lanak eta interesak',
      entidades: 'Enpresak eta erakundeak',
      borme: 'Merkataritza Erregistroa (BORME)',
      retribuciones: 'Ordainsariak',
      votaciones: 'Bozketak',
      participacion: 'Haren botoak Osoko Bilkuran',
      temas: 'Bozketen gaiak',
      avisoLegal: 'Datuen erabilera eta lege-oharra',
      errores: 'Akatsen bat ikusi duzu?',
    },
    html: {
      principio: `<p>Hemen Estatuaren informazio ofiziala baino ez dago, hura sortzen duen erakundeak argitaratzen duen bezala aurkeztua. Ez dugu interpretaziorik ez baloraziorik egiten: ordenatu eta sinplifikatu egiten dugu, edonork kontsulta dezan eta bere ondorioak atera ditzan. Zerbait dokumentu ofizialarekin bat ez badator, dokumentu ofizialak du lehentasuna.</p>`,
      fuentes: `<ul>
<li><strong>Diputatuak, taldeak eta karguak:</strong> <a href="https://www.congreso.es/es/busqueda-de-diputados">congreso.es</a> webguneko bilatzailea eta fitxa ofizialak (XV. legegintzaldia). Kontsulta-data: {fecha}.</li>
<li><strong>Jabetzak eta ibilgailuak:</strong> diputatu bakoitzak Kongresuan aurkezten dituen eta Kongresuak haren fitxan argitaratzen dituen <em>Declaraciones de Bienes y Rentas</em> (ondasun- eta errenta-aitorpenak): {conDecl} diputaturen {pdfs} dokumentu; berrienaren data: {ultima}.</li>
<li><strong>Errentak, kontuak, akzioak eta sozietateak:</strong> ondasun-aitorpen horien 1. orritik 3.era bitartekoak.</li>
<li><strong>Karguak, jarduerak, aurreko lanak eta dohaintzak:</strong> Kongresuak diputatu bakoitzaren fitxan argitaratzen dituen <em>Registro de Intereses - Actividades</em> (interesen erregistroa – jarduerak) eta <em>Declaraciones de Intereses Económicos</em> (interes ekonomikoen aitorpenak).</li>
<li><strong>Bozketak:</strong> Kongresuaren <a href="https://www.congreso.es/es/opendata/votaciones">bozketen datu irekiak</a>, espediente bakoitzaren testu ofizialarekin.</li>
<li><strong>Arauak:</strong> <a href="https://www.boe.es">Boletín Oficial del Estado</a> (lege-dekretuak eta baliozkotze- edo indargabetze-erabakiak).</li>
<li><strong>Ordainsariak:</strong> <a href="{fuenteRetribuciones}">Régimen económico y ayudas de los miembros de la Cámara</a>, 2026ko zenbatekoak.</li>
<li><strong>Enpresak eta erakundeak:</strong> gainera, Diputatuen Estatutuaren Batzordeak haien jarduerei buruz hartutako erabakiak, <a href="https://www.congreso.es/es/cem/dictamenes_actividades_xvleg">Gorte Nagusien Aldizkari Ofizialean (D seriea)</a> argitaratuak.</li>
<li><strong>Karguak sozietateetan:</strong> <a href="https://www.boe.es/datosabiertos/">BORMEren datu irekiak</a> (Merkataritza Erregistroko Aldizkari Ofiziala), 2009tik.</li>
</ul>
<p><strong>Taldea eta hautagaitza.</strong> Kongresuak bi datu desberdin erregistratzen ditu: diputatu bakoitza hauteskundeetan zein hautagaitzarekin hautatu zuten, eta kontsulta-datan zein talde parlamentariotakoa den. Baliteke bat ez etortzea: bere taldea uzten duena Grupo Mixtora pasatzen da, beste zerrenda batean hautatua izan bazen ere. Hemizikloak talde parlamentario horren arabera ordenatzen ditu diputatuak; hautagaitza desberdina denean, parentesi artean adierazten da.</p>`,
      perfil: `<p>Diputatu bakoitzak <a href="https://www.congreso.es/es/busqueda-de-diputados">congreso.es</a> webgunean duen <em>Ficha personal</em> delakotik (fitxa pertsonala) ateratzen dira; diputatuak berak idazten duen testua da. Hitzez hitz kopiatzen da, lerroz lerro, eta bi multzotan bereizten da soilik:</p>
<ul>
<li><strong>Prestakuntza:</strong> tituluez edo ikasketez ari diren lerroak (lizentziatua, gradua, masterra, doktorea, diplomatua, ingeniaria, ikastaroa, programa…). Gainerakoa <strong>ibilbidea</strong> da. Lan bati buruzko esaldi bat (irakaslea, ikertzailea, zuzendaria…) ez da ikasketatzat hartzen, unibertsitate bat aipatu arren.</li>
<li><strong>Unibertsitate publikoa edo pribatua:</strong> lerroak zentroa aipatzen duenean bakarrik. Mota Ministerioaren <a href="https://www.educacion.gob.es/ruct/consultauniversidades?actual=universidades">Registro de Universidades, Centros y Títulos (RUCT)</a> erregistroan agertzen dena da. Unibertsitatea izendatzeko beste modu batzuk ere ezagutzen dira (beste hizkuntza ofizial batzuetan, UCM edo UNED bezalako siglak, eta unibertsitate baten parte diren zentroak, hala nola ICADE, ESADE edo IESE). Zerrenda <code>data/manual/universidades.json</code> fitxategian dago.</li>
<li>RUCTen ez dagoen zentro bat aipatzen badu (adibidez, atzerriko unibertsitate bat), hala adierazten da, sailkatu gabe. Zentroa aipatzen ez badu, fitxak ez duela adierazten esaten da: ez da ezer ondorioztatzen.</li>
<li>Ez dira familia-datuak jasotzen (egoera zibila, seme-alabak), fitxan agertu arren.</li>
<li><strong>Denbora-lerroa:</strong> diputatu izan den legegintzaldiak (beren data ofizialekin), Ganberan kontsulta-datan dituen karguak, hasiera-datarekin, urte bat aipatzen duten ibilbideko lerroak, eta legegintzaldi honetako ondasun-aitorpenak eta interes ekonomikoen aitorpenak, bakoitza bere PDFarekin.</li>
</ul>`,
      propiedades: `<p>Aitorpen bakoitzeko «Bienes inmuebles» (ondasun higiezinak) taulak erabiltzen dira, hitzez hitz kopiatuta. Fitxa bakoitzak jatorrizko PDFetarako estekak ditu.</p>
<ul>
<li><strong>Jabetzak:</strong> diputatuak bere izenean aitortzen dituen hiriko eta landako higiezin guztiak, jabetza osoan edo partzialean: etxebizitzak, garajeak, trastelekuak, lokalak, pabiloiak, orubeak, finkak… Taula ofizialeko lerro bakoitza jabetza bat da; lerroak unitate kopuru bat adierazten badu («16 viviendas», «8 fincas rústicas», «piso y dos plazas de garaje»), unitate horiek zenbatzen dira.</li>
<li><strong>Etxebizitzak:</strong> jabetza horietatik, diputatuak berak etxebizitza, pisu, etxe, txalet, apartamentu, attiko, duplex, estudio, etxe atxiki, familia bakarreko etxe, bungalow edo bizitegi gisa deskribatzen dituenak, baita landa-lurzoruan daudenak ere. Ez dira etxebizitzatzat hartzen garaje, aparkaleku, kotxetegi, trasteleku, lokal, bulego, biltegi, pabiloi, orube, partzela, lursail edo landa-finka gisa soilik deskribatzen direnak.</li>
<li>Ehunekoa eta eskubide mota (pleno dominio, nuda propiedad, ganancial…) diputatuak idazten dituen bezala erakusten dira.</li>
<li>Diputatuak parte hartzen duen sozietateen higiezinak aparte zerrendatzen dira haren fitxan, eta ez dira batzen.</li>
<li>Azken aitorpenak aldaketa bat baino ez badu jakinarazten (adibidez, erosketa bat), aurreko aitorpen osoarekin batera erakusten da. Ondasun bat ez da zenbatzeari uzten ondorengo aitorpen ofizial batek haren salmenta edo baja jakinarazten duen arte; fitxak zein den adierazten du.</li>
<li>Aitorpenek aurkeztu ziren egunean zegoen ondarea islatzen dute.</li>
</ul>`,
      vehiculos: `<p>«Vehículos, embarcaciones y aeronaves» (ibilgailuak, ontziak eta aireontziak) taulatik kopiatzen dira. Ez dira matrikulak argitaratzen, inprimaki ofizialak berak ez adierazteko eskatzen duelako.</p>`,
      deudas: `<p>Jabetzetarako erabiltzen diren ondasun-aitorpen horietako «Deudas y obligaciones patrimoniales» (zorrak eta ondare-betebeharrak) ataletik kopiatzen dira (4. orria).</p>
<ul>
<li>Mailegu bakoitza bere deskribapenarekin eta hartzekodunarekin, emate-datarekin, emandako zenbatekoarekin eta ordaintzeko dagoen saldoarekin argitaratzen da, <strong>diputatuak idazten dituen bezala</strong> (formatua, akatsak eta guzti).</li>
<li>Ordaintzeko dagoen saldo osoa atala betetzen duen aitorpen berrienaren mailegu-taularen batura da. Zenbatekoren bat ezin bada zenbaki gisa irakurri interpretatu gabe (eskaneatzean irakurtezina den digitu bat, formatu ezinezko bat), ez da batzen eta «gutxienez» adierazten da.</li>
<li>Ez dira aitorpen desberdinetako maileguak batzen, mailegu bera errepika daitekeelako. Indarrean jarraitzen duten aurrekoak aparte erakusten dira.</li>
<li>«Otras deudas y obligaciones» (beste zor eta betebehar batzuk: pentsioak, abalak, finantzaketak…) eta diputatuak bere zorrei buruz egindako oharrak hitzez hitz kopiatzen dira, eta ez dira batzen.</li>
<li>Diputatua ez diren partikularren izena (adibidez, seme-alabena) «[nombre omitido]» (izena ezabatuta) testuarekin ordezten da.</li>
<li>Irakurketa bat % 100ean berretsi ezin izan bada (eskaneatzean estalita edo moztuta dagoen zifra bat, ia ikusezina den bereizle bat) edo jatorrizkoak datu inkoherente bat badakar (data ezinezko bat edo aitorpena baino geroagokoa), fitxak <strong>irakurketa berretsi gabea</strong> abisuarekin adierazten du, PDFrako esteka batekin eta, norbaitek berretsi badezake, guri jakinarazteko beste esteka batekin.</li>
<li>Saldoa inprimaki ofizialak adierazten duen datakoa da: aitorpenaren aurreko urteko abenduaren 31koa edo aitorpena aurkeztu aurreko hilabetekoa.</li>
</ul>`,
      rentas: `<p>Ondasun-aitorpenen 1. orritik 3.era bitartekoetatik kopiatzen dira, testua eta zenbatekoa <strong>diputatuak idazten dituen bezala</strong>:</p>
<ul>
<li><strong>Errentak:</strong> aitorpenaren aurreko urtean jaso zituenak (soldatak, ordainsari profesionalak, dibidenduak, interesak, alokairuak, salmentak eta bestelakoak), eta urte hartan ordaindu zuen PFEZaren (IRPF) kuota. Kongresuko soldata ez da hemen aitortzen, Ganberak dagoeneko argitaratzen duelako (ikus <a href="#retribuciones">Ordainsariak</a>); horregatik, taula asko hutsik agertzen dira, diputatuak PFEZa aitortu arren.</li>
<li><strong>Kontuak eta gordailuak:</strong> bere gordailu guztien saldoa, inprimakiak adierazten duen datan. Kontu-zenbakiak ez dira argitaratzen.</li>
<li><strong>Akzioak, funtsak eta sozietateak:</strong> zor publikoa, akzioak eta partaidetzak, bere sozietateek % 5etik gora partaidetzen dituzten sozietateak, eta beste ondasun edo eskubide batzuk (bizitza-aseguruak, pentsio-planak…), aitortzen duen balioarekin.</li>
<li>Taula bakoitza hura betetzen duen aitorpen berrienetik hartzen da, eta fitxak haren data adierazten du. Beste aldaketa batzuk baino jakinarazten ez dituzten aldaketek (adibidez, ibilgailu bat) ez dute ordezten.</li>
<li>Fitxako zifra handiak taula bakoitzaren batura dira. Zenbateko bat ezin bada zenbaki gisa irakurri interpretatu gabe («47.268.27» bezalako formatuak edo zifra baten ordez testu bat), ez da batzen eta «gutxienez» adierazten da. Ez da batez bestekorik kalkulatzen.</li>
<li>Diputatua ez diren partikularren izena «[nombre omitido]» testuarekin ordezten da.</li>
</ul>
<p><strong>Akzio eta funtsen arabera iragazi eta ordenatu</strong> (Diputatuak orria): guztizkoa «Deuda pública, obligaciones, acciones y participaciones» taularen batura da. Errenkada bat akzio edo funts gisa zenbatzen da diputatuaren beraren deskribapenak hala dioenean bakarrik (akzioak, partaidetzak, sozietate baten ehunekoa; funtsa, F.I., SICAV). Esaten ez badu (adibidez, «TELEFONICA» edo «Valores Caixabank» bakarrik), guztizkoan zenbatzen da, baina ez da sailkatzen; pentsio-planak ez dira inbertsio-funts gisa zenbatzen. Akzioak eta funtsak aipatzen dituen errenkada bat bietan zenbatzen da.</p>`,
      actividades: `<p><em>Registro de Intereses - Actividades</em> delakotik: kargu publikoak, uko egin dien jarduera publikoak, pentsioak, irakaskuntza, alderdietako karguak, lankidetzak, baimendutako jarduera pribatuak eta bestelakoak. Diputatu bakoitzak aitortzen duena da, eta Kongresuko Osoko Bilkurak eserlekuarekin bateragarritzat jotzen duena. Testua PDF ofizialetik automatikoki ateratzen da (testu-geruza du) eta hitzez hitz argitaratzen da, Osoko Bilkuraren erabakiaren datarekin. Osoko Bilkurak oraindik erabakirik hartu ez badu, Kongresuak ez du edukia argitaratzen, eta fitxak hala adierazten du.</p>`,
      intereses: `<p><em>Declaraciones de Intereses Económicos</em> delakoetatik (Código de Conducta de las Cortes Generales): eserlekua lortu aurreko bost urteetako jarduerak, diru-sarrerak eman zizkiotenak edo haren jarduera politikoa baldintza dezaketenak (aldia, enplegatzailea, sektorea eta deskribapena), jasotako dohaintzak eta opariak, ekarpenak egiten dizkien fundazioak eta elkarteak, eta beste interes batzuk. Atal bakoitza hura betetzen duen aitorpen berrienetik hartzen da. Partikular baten izena (adibidez, onuragile gisa ageri den senide batena) «[nombre omitido]» testuarekin ordezten da.</p>`,
      entidades: `<p>Fitxa bakoitzak diputatuaren dokumentu ofizialek aipatzen dituzten enpresak, administrazioak, fundazioak, elkarteak, alderdiak eta beste erakunde batzuk biltzen ditu, testu literalarekin eta dokumentu bakoitzerako estekarekin:</p>
<ul>
<li><strong>Diputatuen Estatutuaren Batzordearen erabakiak</strong> haren jardueren adierazpenei buruz, Osoko Bilkurak onartuak eta <a href="https://www.congreso.es/es/cem/dictamenes_actividades_xvleg">Gorte Nagusien Aldizkari Ofizialean (D seriea)</a> argitaratuak: zer jarduera adierazten duen, zer enpresa edo erakundetan, eta Kongresuak bateragarritzat jotzen duen, baimentzen duen edo jakinaren gainean geratzen den.</li>
<li><em>Registro de Intereses - Actividades</em> delakoa.</li>
<li>Legegintzaldiko <em>Declaraciones de Intereses Económicos</em> guztiak (ez bakarrik berriena): aurreko bost urteetako enplegatzaileak, dohaintzak eta ekarpenak.</li>
<li>Ondasunen adierazpeneko akzioak, partaidetzak eta sozietateak.</li>
<li>congreso.es-eko fitxa ofizialeko ibilbidea.</li>
</ul>
<p>Testuak libreak direnez, izenak adimen artifizialeko laguntzaile baten laguntzaz eta arau zorrotzekin aurkitu dira: testuan <strong>hitzez hitz</strong> agertzen diren izenak bakarrik (egiaztapen automatiko batek banan-banan egiaztatzen du), inoiz ez partikularrak eta inoiz ez aipamen orokorrak («enpresa pribatu bat»). Izen beraren aldaerak (maiuskulak, azentuak, «S.A.» edo «SA») elkartu egiten dira; eskuz egindako elkarketak <a href="https://github.com/MarcoAnarmo/CongresoAbierto/blob/main/data/manual/entidades.json">data/manual/entidades.json</a> fitxategian daude. Mota (enpresa, sektore publikoa, fundazioa…) zerrenda ordenatzeko baino ez da.</p>
<p><strong>Harreman mota.</strong> Dokumentu batek erakunde bat aipatzen duen bakoitzean, zer harreman deskribatzen duen adierazten da, dokumentuaren atal ofizialaren arabera (Interesen Erregistroan, A-H atalak; interes ekonomikoen adierazpenean, aurreko lanak, jasotako dohaintzak edo ekarpenak) edo, Kongresuaren erabakietan, erabakiak aipatzen duen hauteskunde-legearen (LOREG) artikuluaren arabera. Ez da erakundearen izenetik ondorioztatzen. Horrela bereizten dira, adibidez, Kongresuak baimendutako kargu bat enpresa batean, akzio batzuk, GKE bati ordaindutako kuota bat edo duela bost urteko lan bat.</p>
<p><strong>Ordainsaria.</strong> Dokumentuak berak dioena bakarrik adierazten da: «ordainsaririk gabe», «dietak, kalte-ordainak edo gastuak bakarrik», «antzinatasun-osagarria bakarrik» (zerbitzu berezietan dauden funtzionarioak) edo «ordainsariarekin». Dokumentuak esaten ez badu, webguneak ez du suposatzen. Kongresuaren erabakietan ez da kontuan hartzen «sin la posibilidad de percibir remuneración del sector público» formula finkoa, erabakiaren baldintza bat baita, ez jardueraren deskribapena.</p>
<p><strong>Datu hauekin estatistikak egiteko</strong> (Datuak orriko «Enpresak eta erakundeak» taula): harreman mota bakoitza bereiz zenbatu behar da, eta ez dira batu behar berdinak balira bezala kargu bat, akzio batzuk, ekarpen bat edo opari bat. «Ez da jasotzen» ez du esan nahi kobratzen duenik. Erakunde bera diputatu beraren hainbat dokumentutan ager daiteke: erakundeak zenbatzeko izen desberdinak zenbatu behar dira, ez errenkadak.</p>
<p><strong>Erakunde bat agertzeak ez du esan nahi irregulartasunik edo interes-gatazkarik dagoenik:</strong> dokumentu horietan jasota dagoena da. Ez da haren harreman guztien zerrenda ere, dokumentu ofizialetan idatzita dagoenarena baizik.</p>`,
      borme: `<p><a href="https://www.boe.es/diario_borme/">Merkataritza Erregistroko Aldizkari Ofizialak (BORME)</a> egunero argitaratzen ditu sozietateen egintza inskribatuak: eraketak, administratzaile, kontseilari eta ahaldunen izendapenak eta kargu-uzteak, bazkide bakarrak… BOEk <a href="https://www.boe.es/datosabiertos/">datu ireki</a> gisa eskaintzen ditu 2009tik.</p>
<ul>
<li>2009ko urtarriletik inskribatutako egintza guztiak berrikusi dira (9,6 milioi inguru, 126.000 probintzia-aldizkari baino gehiagotan), diputatu bakoitzaren izen osoa bilatuz, BORMEk idazten duen bezala (abizenak eta izena).</li>
<li><strong>BORMEk ez du NANa argitaratzen.</strong> Izena bat etortzeak ez du frogatzen pertsona bera denik: Espainian ehunka pertsonak partekatzen dituzten izenak daude. Horregatik, <strong>beste dokumentu ofizial batek baieztatzen duenean bakarrik argitaratzen da kointzidentzia bat</strong>:
<ul>
<li>enpresa bera bere adierazpenetan, Kongresuak bere jarduerei buruz hartutako erabakietan edo bere fitxan agertzen da;</li>
<li>diputatuak kargu bat adierazten duen leku edo administrazio bateko enpresa publikoa da (udalekoa, probintziakoa, uhartekoa…), adibidez zinegotzi bat bere udaleko enpresa baten kontseiluan;</li>
<li>sozietateak bere izena eta abizena darama eta bere hauteskunde-barrutiko probintzian dago inskribatuta.</li>
</ul></li>
<li>Horrela baieztatu ezin diren kointzidentziak <strong>ez dira argitaratzen</strong>, izena gutxitan errepikatzen bada ere. Zenbat pertsonak izen bera duten kalkulatzeko <a href="https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736177009&menu=resultados&idp=1254734710990">INEren izen eta abizenen estatistikak</a> erabiltzen dira, baina berrikusteko laguntza gisa bakarrik, inoiz ez argitaratzeko.</li>
<li>Egintza bakoitzak boe.es-eko iragarki ofizialera eramaten du. Sozietateen izenak, egintzak eta karguak dauden bezala kopiatzen dira, BORMEren laburdurekin («Adm. Unico» administratzaile bakarra da; «Apo.Man.Soli», ahaldun mankomunatu eta solidarioa).</li>
<li>BORMEko kargu batek ez du adierazten ordaintzen zen edo indarrean jarraitzen duen: argitaratutako egintza bakoitzaren data erakusten du. BORME 2009an hasten da; aurrekoa ez dago.</li>
</ul>
<p>Hori egiten duen kodea publikoa da: <a href="https://github.com/MarcoAnarmo/CongresoAbierto/blob/main/scripts/browser/borme.js">scripts/browser/borme.js</a> (bilaketa) eta <a href="https://github.com/MarcoAnarmo/CongresoAbierto/blob/main/scripts/borme-clasificar.py">scripts/borme-clasificar.py</a> (baieztapena). Baieztatu gabeko kointzidentziak ez dira biltegira igotzen, gehienak beste pertsona batzuenak direlako.</p>`,
      revision: `<p>Webgune honetako guztia edonork ireki ditzakeen dokumentu ofizialetatik dator. Hemen azaltzen da, iturriz iturri, erakunde bakoitzak zer formatutan argitaratzen dituen bere datuak, nola ekarri diren webgunera eta nola egiaztatu den argitaratutakoa jatorrizkoarekin bat datorrela.</p>
<h3>Araua: egiaztatu daitekeena bakarrik argitaratzen da</h3>
<ul>
<li><strong>Argitaratzen da</strong> dokumentu ofizial batean idatzita dagoena eta harekin egiaztatu dena. Datu bakoitzak bere dokumentura eramaten du, edonork egiazta dezan.</li>
<li><strong>Abisuarekin argitaratzen da</strong> («Irakurketa berretsi gabea») dokumentuan badagoena baina % 100ean berretsi ezin izan den irakurketaren bat duena, adibidez eskaneatze batean lausotuta dagoen zifra bat. Abisuak PDFra eramaten du eta hura berresteko laguntza eskatzen du.</li>
<li><strong>Ez da argitaratzen</strong> inongo dokumentu ofizialek berresten ez duena, nahiz eta litekeena iruditu. Adibidez, Merkataritza Erregistroko pertsona bat, diputatu baten izen bera duena, pertsona bera dela frogatzen duen beste dokumenturik ez badago. Ez dira argitaratzen partikularren izenak, kontu-zenbakiak, IFZ edo matrikulak ere.</li>
<li><strong>Ez da interpretatzen.</strong> Testuak hitzez hitz kopiatzen dira, akatsak barne, eta zifrak adierazitakoaren baturak dira: inoiz ez batez bestekoak edo kalkulu estimatuak. Zerbait dokumentu ofizialarekin bat ez badator, dokumentu ofizialak du lehentasuna.</li>
</ul>
<h3>Nondik datorren datu bakoitza eta nola egiaztatu den</h3>
<ul>
<li><strong>Diputatuak, taldeak, karguak, prestakuntza eta ibilbidea.</strong> <em>Formatua:</em> congreso.es-eko orriak eta bilatzailea. <em>Nola ateratzen den:</em> programa batzuek eremuak dauden bezala kopiatzen dituzte. <em>Egiaztapena:</em> ez dago transkripziorik; testua ofiziala da. Unibertsitate mota (publikoa edo pribatua) unibertsitateen erregistro ofizialetik (RUCT) hartzen da.</li>
<li><strong>Ondasunen eta errenten adierazpenak</strong> ({pdfs} dokumentu). <em>Formatua:</em> PDF eskaneatuak, hau da, ordenagailu batek irakur dezakeen testurik gabeko irudiak. <em>Nola ateratzen den:</em> orri bakoitza ikusmena duen hizkuntza-eredu baten laguntzaz (adimen artifiziala) transkribatu da, jarraibide publiko batzuei jarraituz: hitzez hitz kopiatu, inoiz ez asmatu eta ondo irakurtzen ez dena «?» ikurrarekin markatu. <em>Egiaztapena:</em>
<ul>
<li>higiezinak eta ibilgailuak: bigarren berrikuspen oso eta independente bat, errenkadaz errenkada;</li>
<li>zorrak: bi transkripzio independente, eta alde bakoitza PDFa begiratuta ebazten da;</li>
<li>errentak, kontuak eta akzioak: zifra eta hitz bakoitza irakurketa automatiko independente batekin (OCR) alderatzen da, eta bat ez datorren guztia berriro begiratzen da PDF handituan.</li>
</ul></li>
<li><strong>Interes ekonomikoen adierazpenak.</strong> <em>Formatua:</em> PDF eskaneatuak. Errenten metodo eta egiaztapen bera.</li>
<li><strong>Interesen Erregistroa - Jarduerak</strong> eta <strong>Estatutuaren Batzordearen erabakiak</strong> (Gorte Nagusien Aldizkari Ofiziala, D seriea). <em>Formatua:</em> testua duten PDFak. <em>Nola ateratzen den:</em> programa batek atal bakoitzaren testu literala kopiatzen du, adimen artifizialik gabe. <em>Egiaztapena:</em> PDFaren beraren testua da. Erabaki bakoitza diputatu bati esleitzen zaio haren izena zerrenda ofizialekoarekin zehatz-mehatz bat datorrenean bakarrik; eserlekurik ez dutenenak ez dira erabiltzen.</li>
<li><strong>Bozketak.</strong> <em>Formatua:</em> Kongresuaren datu irekiak (JSON), diputatu bakoitzaren botoarekin. <em>Nola ateratzen den:</em> programekin, adimen artifizialik gabe. Gaiak titulu ofizialeko hitzen arabera esleitzen dira, zerrenda publiko batekin.</li>
<li><strong>Ordainsariak.</strong> Kongresuak argitaratzen dituen zenbateko ofizialak.</li>
<li><strong>Enpresak eta erakundeak.</strong> <em>Formatua:</em> aurreko dokumentuetako testuak. <em>Nola ateratzen den:</em> hizkuntza-eredu batek testu bakoitzean enpresen, administrazioen, fundazioen eta beste erakunde batzuen izenak seinalatu ditu. <em>Egiaztapena:</em> programa batek egiaztatzen du izen bakoitza letraz letra agertzen dela bere testu ofizialean; agertzen ez bada, baztertu egiten da. Ez da inoiz partikularren izenik jasotzen. Erakunde beraren izen desberdinak zerrenda publiko batekin elkartzen dira.</li>
<li><strong>Merkataritza Erregistroa (BORME).</strong> <em>Formatua:</em> BOEren datu irekiak (XML), 9,6 milioi egintza inguru 2009tik. <em>Nola ateratzen den:</em> programa batek diputatu bakoitzaren izen osoa bilatzen du, zehatz-mehatz, adimen artifizialik gabe. <em>Egiaztapena:</em> BORMEk NANa argitaratzen ez duenez, kointzidentzia bat beste dokumentu ofizial batek berresten duenean bakarrik argitaratzen da (ikus <a href="#borme">Merkataritza Erregistroa</a>). Enpresa batean diputatu baten izen bera duen kargu bat agertzen den 662 kasuetatik 77 argitaratzen dira; beste 585ak ez, ezin direlako berretsi.</li>
</ul>
<h3>Zer egin duen adimen artifizialak eta zer ez</h3>
<ul>
<li><strong>Lagundu du</strong> testurik ez duten PDF eskaneatuak transkribatzen, testu libreetan erakundeen izenak aurkitzen, webgunea beste hizkuntza batzuetara itzultzen eta programatzen.</li>
<li><strong>Ez du erabakitzen zer argitaratzen den.</strong> Transkribatzen edo seinalatzen duen guztia dokumentu ofizialarekin egiaztatzen da beste metodo batekin: bigarren irakurketa bat, OCR independente bat edo testua literala dela egiaztatzen duen azterketa automatiko bat. Egiaztatu ezin dena abisu batekin markatzen da edo ez da argitaratzen.</li>
<li><strong>Ez du laburtzen, ez du interpretatzen eta ez du inor sailkatzen.</strong> Zifrak kodeak kalkulatzen ditu transkribatutakotik abiatuta, eta testu ofizialak dauden bezala erakusten dira, gaztelaniaz.</li>
</ul>
<p>Kodea, transkribatutako datuak eta transkripzio-jarraibideak publikoak dira <a href="https://github.com/MarcoAnarmo/CongresoAbierto">GitHub</a>-en, edonork prozesua errepika dezan edo akatsen bat aurki dezan.</p>`,
      retribuciones: `<p>Diputatu bakoitzari bere agintaldian dagozkion 2026ko hileko zenbateko ofizialak erakusten dira, haren barrutiaren eta karguen arabera:</p>
<ul>
<li>Konstituzio-esleipena (asignación constitucional), guztientzat berdina: {asignacion}.</li>
<li>Gastuengatiko kalte-ordaina, PFEZetik (IRPF) salbuetsia: {indemOtras} (Madriletik kanpo) edo {indemMadrid} (Madrilen hautatuak).</li>
<li>Karguagatiko osagarriak, bloke bakoitzaren barruan metagarriak ez direnak (Mahaia eta Bozeramaileen Batzordea; batzordeak):<ul>{cargos}</ul></li>
</ul>
<p>Karguak diputatu bakoitzaren fitxa ofizialetik ateratzen dira. Ez dira sartzen garraioa (Kongresuak zuzenean ordaintzen du) ezta Gobernuko kide ere badirenen soldatak ere; horiek Presupuestos Generales del Estado (Estatuko Aurrekontu Orokorrak) delakoaren arabera arautzen dira.</p>`,
      votaciones: `<p>Bozketa bakoitzak espedientearen testu ofiziala, bozketa mota, emaitza, talde bakoitzaren botoa (diputatu bakoitzak bozketaren egunean zuen taldearekin) eta diputatu bakoitzaren botoa erakusten ditu, Kongresuaren datu irekien arabera. Hemizikloa talde parlamentarioen arabera ordenatutako grafiko bat da; ez du eserlekuen benetako planoa erreproduzitzen. Deiketa bidezko bozketak (ozenki egiten direnak) beranduago argitaratzen dira datu irekietan; agertzen direnean gehitzen dira. Gorteak desegin direnean, lege-dekretuak Diputazio Iraunkorrak baliozkotzen edo indargabetzen ditu (Konstituzioaren 78. art.). Kongresuak bozketa baten guztizkoak soilik argitaratzen dituenean, diputatu bakoitzaren botorik gabe (adibidez, bozketa sekretu batean), webguneak guztizko horiek baino ez ditu erakusten, eta hala adierazten du. <a href="{votaciones}">Ikusi bozketak</a>.</p>`,
      participacion: `<p>Diputatu bakoitzeko, XV. legegintzaldiko Osoko Bilkuraren bozketa guztiak zenbatzen dira, boto izenduna argitaratuta dutenak eta haietan eserlekua zuenean: zenbat aldiz bozkatu zuen baietz, ezetz edo abstentzioa, eta zenbat aldiz ez zuen bozkatu (ez zegoelako edo botorik eman ez zuelako). Bozketa sekretuak ez dira sartzen, ez baitago diputatu bakoitzaren botorik.</p>
<p><strong>Bere taldeaz bestelako botoa:</strong> baietz, ezetz edo abstentzioa bozkatu zuenean eta bozketa horretan bere taldearen gehiengoak (Kongresuak data horretarako argitaratzen duen taldearekin) beste zerbait bozkatu zuenean zenbatzen da. Ez dira kontuan hartzen «Ez du bozkatzen», bere taldea berdinduta geratu zen bozketak, ezta Grupo Mixtoa ere, alderdi batzuk elkarrekin baitaude bertan.</p>`,
      temas: `<p>Bozketen orriak datu irekietan argitaratutako XV. legegintzaldiko Osoko Bilkuraren bozketa guztiak biltzen ditu (2023ko irailetik aurrera). Deiketa bidezko bozketek, inbestidurek adibidez, ez dute diputatu bakoitzaren botoa datu irekietan, eta ez dira agertzen. <strong>Funtsezko bozketek</strong> dokumentu ofizialak (BOE, BOCG, Diario de Sesiones) eta testuaren pasarte literalak ere badituzte, eskuz berrikusiak; gainerakoek titulu ofiziala, guztizkoak, taldekako botoa eta JSON eta PDF ofizialak erakusten dituzte.</p>
<p>Kongresuak ez ditu bere bozketak gaika sailkatzen. Iragazi ahal izateko, bozketa bakoitzari gai bat edo gehiago esleitzen zaizkio, bere titulu ofizialean agertzen diren hitzen arabera (adibidez, «alquiler» (alokairua) edo «vivienda» (etxebizitza) → Etxebizitza). Bilatzeko laguntza bat da, ez balorazio bat: hitzen zerrenda osoa <a href="https://github.com/MarcoAnarmo/CongresoAbierto/blob/main/data/manual/temas.json">data/manual/temas.json</a> fitxategian dago, eta edonork proposa ditzake aldaketak. Bozketa bat inongo gaitan sartzen ez bada, «Besteak» atalean agertzen da.</p>
<p>Emaitza guztizko ofizialekin kalkulatzen da: gehiengo soila (baiezko gehiago ezezkoak baino), lege organiko baten osotasunaren gaineko bozketan izan ezik, horrek 176 aldeko boto behar baititu (Konstituzioaren 81. art.). Lege-dekretuetan, «baliozkotua» edo «indargabetua».</p>`,
      avisoLegal: `<p>Congreso Abierto herritarren proiektu bat da, irabazi-asmorik gabea eta independentea: ez du zerikusirik Diputatuen Kongresuarekin, Gobernuarekin ezta inongo alderdirekin ere.</p>
<ul>
<li><strong>Datu publikoak bakarrik.</strong> Webguneak erakunde ofizialek (Kongresua, Gorte Nagusien Aldizkari Ofiziala, Estatuko Aldizkari Ofiziala) argitaratzen duten eta edonork jatorrian kontsulta dezakeen informazioa biltzen eta aurkezten du. Datu bakoitzak bere jatorrizko dokumentura eramaten du. Zerbait bat ez badator, dokumentu ofizialak du lehentasuna.</li>
<li><strong>Interpretaziorik gabe.</strong> Testuak hitzez hitz kopiatzen dira. Webguneak ez du baieztatzen interes-gatazkarik edo irregulartasunik dagoenik: dokumentuek diotena erakusten du.</li>
<li><strong>Datu pertsonalak.</strong> Erakundeek beraiek diputatuei buruz karguagatik argitaratzen dituzten datuak bakarrik argitaratzen dira. Diputatua ez diren partikularren izenak, kontu-zenbakiak, IFZ eta matrikulak ez dira argitaratzen. Zuzenketa bat eskatzeko edo zure eskubideak erabiltzeko, idatzi <a href="mailto:ayuda@congresoabierto.org">ayuda@congresoabierto.org</a> helbidera.</li>
<li><strong>Berrerabilera.</strong> Deskarga daitezkeen datuak <a href="https://creativecommons.org/licenses/by/4.0/deed.eu">CC BY 4.0</a> lizentziarekin argitaratzen dira, eta kodea MIT lizentziarekin. Dauden bezala eskaintzen dira, bermerik gabe. Congreso Abierto ez da arduratzen beste pertsona batzuek datuei ematen dieten erabileraz ezta ateratzen dituzten ondorioez ere; berrerabiltzen dituenak iturria aipatu eta legea errespetatu behar du, baita datuen babesari buruzkoa ere.</li>
</ul>`,
      errores: `<p><a href="{error}" rel="noopener">Jakinarazi akatsa GitHub-en</a>, diputatua, datua eta dokumentu ofizialerako esteka (orrialdearekin) adierazita. Dokumentu ofizial batek babestutako zuzenketak baino ez dira onartzen.</p>
<p>Proiektua publikoa da, eta edonork proposa ditzake aldaketak, programatzen jakin ala ez. <a href="{colabora}">Lagundu</a> atalean azaltzen da nola.</p>`,
    },
  },
  gl: {
    titulo: 'Metodoloxía',
    descripcion: 'De onde saen os datos de Congreso Abierto e como se presentan, sen interpretacións.',
    h1: 'Fontes e método',
    indice: 'Índice da páxina',
    enPagina: 'Nesta páxina',
    nota: 'Os documentos e os datos oficiais publícaos o Congreso en castelán, e aquí móstranse tal como se publican.',
    secciones: {
      principio: 'Principio',
      fuentes: 'Fontes oficiais',
      revision: 'Como se obtiveron e comprobaron os datos',
      perfil: 'Formación e traxectoria',
      propiedades: 'Propiedades e vivendas',
      vehiculos: 'Vehículos',
      deudas: 'Débedas e préstamos',
      rentas: 'Rendas, contas e accións',
      actividades: 'Cargos e actividades',
      intereses: 'Traballos anteriores e intereses',
      entidades: 'Empresas e entidades',
      borme: 'Rexistro Mercantil (BORME)',
      retribuciones: 'Retribucións',
      votaciones: 'Votacións',
      participacion: 'Os seus votos no Pleno',
      temas: 'Temas das votacións',
      avisoLegal: 'Uso dos datos e aviso legal',
      errores: 'Viches un erro?',
    },
    html: {
      principio: `<p>Aquí só hai información oficial do Estado, presentada tal e como a publica a institución que a produce. Non facemos interpretacións nin valoracións: ordenamos e simplificamos para que calquera poida consultala e tirar as súas propias conclusións. Se algo non coincide co documento oficial, prevalece o documento oficial.</p>`,
      fuentes: `<ul>
<li><strong>Deputados, grupos e cargos:</strong> buscador e fichas oficiais de <a href="https://www.congreso.es/es/busqueda-de-diputados">congreso.es</a> (XV Lexislatura). Consultados o {fecha}.</li>
<li><strong>Propiedades e vehículos:</strong> as <em>Declaraciones de Bienes y Rentas</em> (declaracións de bens e rendas) que cada deputado presenta ante o Congreso e que este publica na súa ficha: {pdfs} documentos de {conDecl} deputados; o máis recente é do {ultima}.</li>
<li><strong>Rendas, contas, accións e sociedades:</strong> páxinas 1 a 3 desas mesmas declaracións de bens.</li>
<li><strong>Cargos, actividades, traballos anteriores e doazóns:</strong> o <em>Registro de Intereses - Actividades</em> (rexistro de intereses – actividades) e as <em>Declaraciones de Intereses Económicos</em> (declaracións de intereses económicos) que o Congreso publica na ficha de cada deputado.</li>
<li><strong>Votacións:</strong> <a href="https://www.congreso.es/es/opendata/votaciones">datos abertos de votacións</a> do Congreso, co texto oficial de cada expediente.</li>
<li><strong>Normas:</strong> <a href="https://www.boe.es">Boletín Oficial del Estado</a> (decretos leis e acordos de convalidación ou derrogación).</li>
<li><strong>Retribucións:</strong> <a href="{fuenteRetribuciones}">Régimen económico y ayudas de los miembros de la Cámara</a>, importes de 2026.</li>
<li><strong>Empresas e entidades:</strong> ademais, os acordos da Comisión do Estatuto dos Deputados sobre as súas actividades, publicados no <a href="https://www.congreso.es/es/cem/dictamenes_actividades_xvleg">Boletín Oficial das Cortes Xerais (serie D)</a>.</li>
<li><strong>Cargos en sociedades:</strong> <a href="https://www.boe.es/datosabiertos/">datos abertos do BORME</a> (Boletín Oficial do Rexistro Mercantil), desde 2009.</li>
</ul>
<p><strong>Grupo e candidatura.</strong> O Congreso rexistra dous datos distintos: a candidatura coa que cada deputado foi elixido nas eleccións e o grupo parlamentario ao que pertence na data de consulta. Poden non coincidir: quen deixa o seu grupo pasa ao Grupo Mixto aínda que fose elixido noutra lista. O hemiciclo ordena por ese grupo parlamentario; cando a candidatura é distinta, indícase entre parénteses.</p>`,
      perfil: `<p>Saen da <em>Ficha personal</em> de cada deputado en <a href="https://www.congreso.es/es/busqueda-de-diputados">congreso.es</a>, un texto que redacta o propio deputado. Cópiase literalmente, liña a liña, e só se separa en dous bloques:</p>
<ul>
<li><strong>Formación:</strong> as liñas que falan de títulos ou estudos (licenciado, grao, máster, doutor, diplomado, enxeñeiro, curso, programa…). O resto é <strong>traxectoria</strong>. Unha frase de emprego (profesor, investigador, director…) non conta como estudo aínda que nomee unha universidade.</li>
<li><strong>Universidade pública ou privada:</strong> só cando a liña nomea o centro. O tipo é o que figura no <a href="https://www.educacion.gob.es/ruct/consultauniversidades?actual=universidades">Registro de Universidades, Centros y Títulos (RUCT)</a> do Ministerio. Recoñécense tamén outras formas de nomeala (noutras linguas oficiais, siglas como UCM ou UNED, e centros que forman parte dunha universidade, como ICADE, ESADE ou IESE). A lista está en <code>data/manual/universidades.json</code>.</li>
<li>Se nomea un centro que non está no RUCT (por exemplo, unha universidade estranxeira), indícase así, sen clasificalo. Se non nomea o centro, dise que a ficha non o indica: non se deduce nada.</li>
<li>Non se recollen datos familiares (estado civil, fillos) aínda que aparezan na ficha.</li>
<li><strong>Liña do tempo:</strong> as lexislaturas nas que foi deputado (coas súas datas oficiais), os seus cargos na Cámara na data de consulta, coa data de inicio, as liñas da súa traxectoria que citan un ano e as súas declaracións de bens e de intereses económicos desta lexislatura, cada unha co seu PDF.</li>
</ul>`,
      propiedades: `<p>Úsanse as táboas de «Bienes inmuebles» (bens inmobles) de cada declaración, copiadas literalmente. Cada ficha enlaza cos seus PDF orixinais.</p>
<ul>
<li><strong>Propiedades:</strong> todos os inmobles urbanos e rústicos que o deputado declara ao seu nome, en propiedade total ou parcial: vivendas, garaxes, rochos, locais, naves, soares, fincas… Cada liña da táboa oficial conta como unha propiedade; se a liña indica un número de unidades («16 viviendas», «8 fincas rústicas», «piso y dos plazas de garaje»), cóntanse esas unidades.</li>
<li><strong>Vivendas:</strong> desas propiedades, as que o propio deputado describe como vivenda, piso, casa, chalé, apartamento, ático, dúplex, estudio, casa adosada, unifamiliar, bungaló ou residencial, tamén en solo rústico. Non contan como vivenda as que só se describen como garaxe, praza de aparcamento, cocheira, rocho, local, oficina, almacén, nave, soar, parcela, terreo ou finca rústica.</li>
<li>Móstranse a porcentaxe e o tipo de dereito (pleno dominio, nuda propiedad, ganancial…) tal e como os escribe o deputado.</li>
<li>Os inmobles de sociedades nas que participa o deputado lístanse á parte na súa ficha e non se suman.</li>
<li>Se a última declaración só comunica un cambio (por exemplo, unha compra), móstrase xunto á declaración completa anterior. Un ben só deixa de contarse cando unha declaración oficial posterior comunica a súa venda ou baixa; a ficha indica cal.</li>
<li>As declaracións reflicten o patrimonio na data en que se presentaron.</li>
</ul>`,
      vehiculos: `<p>Cópianse da táboa «Vehículos, embarcaciones y aeronaves» (vehículos, embarcacións e aeronaves). Non se publican matrículas, porque o propio formulario oficial pide non indicalas.</p>`,
      deudas: `<p>Cópianse do apartado «Deudas y obligaciones patrimoniales» (débedas e obrigas patrimoniais, páxina 4) das mesmas declaracións de bens que se usan para as propiedades.</p>
<ul>
<li>Cada préstamo publícase coa súa descrición e acredor, data de concesión, importe concedido e saldo pendente, <strong>tal e como os escribe o deputado</strong> (formato, erratas e todo).</li>
<li>O saldo pendente total é a suma da táboa de préstamos da súa declaración máis recente que enche o apartado. Se algún importe non se pode ler como número sen interpretalo (un díxito ilexible na dixitalización, un formato imposible), non se suma e indícase «polo menos».</li>
<li>Non se suman préstamos de declaracións distintas, porque o mesmo préstamo pode repetirse. Os anteriores que seguen vixentes móstranse á parte.</li>
<li>«Otras deudas y obligaciones» (outras débedas e obrigas: pensións, avais, financiamentos…) e as observacións do deputado sobre as súas débedas cópianse literalmente e non se suman.</li>
<li>O nome de persoas particulares que non son o deputado (por exemplo, fillos) substitúese por «[nombre omitido]» (nome omitido).</li>
<li>Se unha lectura non se puido confirmar ao 100 % (unha cifra tapada ou cortada na dixitalización, un separador case invisible) ou o orixinal trae un dato incoherente (unha data imposible ou posterior á declaración), a ficha indícao cun aviso de <strong>lectura non confirmada</strong>, unha ligazón ao PDF e outra para avisarnos se alguén pode confirmalo.</li>
<li>O saldo é o da data que indica o formulario oficial: a 31 de decembro do ano anterior á declaración ou no mes anterior a presentala.</li>
</ul>`,
      rentas: `<p>Cópianse das páxinas 1 a 3 das declaracións de bens, co texto e o importe <strong>tal e como os escribe o deputado</strong>:</p>
<ul>
<li><strong>Rendas:</strong> as que percibiu no ano anterior á declaración (soldos, honorarios, dividendos, xuros, alugueiros, vendas e outras), e a cota do IRPF que pagou ese ano. O soldo do Congreso non se declara aquí porque xa o publica a Cámara (consulta <a href="#retribuciones">Retribucións</a>); por iso moitas táboas aparecen baleiras aínda que o deputado declare o IRPF.</li>
<li><strong>Contas e depósitos:</strong> o saldo de todos os seus depósitos na data que indica o formulario. Os números de conta non se publican.</li>
<li><strong>Accións, fondos e sociedades:</strong> débeda pública, accións e participacións, sociedades participadas en máis dun 5 % polas súas sociedades, e outros bens ou dereitos (seguros de vida, plans de pensións…), co valor que declara.</li>
<li>Cada táboa tómase da declaración máis recente que a enche, e a ficha indica a súa data. As modificacións que só comunican outros cambios (por exemplo, un vehículo) non a substitúen.</li>
<li>As cifras grandes da ficha son a suma de cada táboa. Se un importe non se pode ler como número sen interpretalo (formatos como «47.268.27» ou un texto no canto dunha cifra), non se suma e indícase «polo menos». Non se calculan medias.</li>
<li>O nome de persoas particulares que non son o deputado substitúese por «[nombre omitido]».</li>
</ul>
<p><strong>Filtrar e ordenar por accións e fondos</strong> (páxina Deputados): o total é a suma da súa táboa «Deuda pública, obligaciones, acciones y participaciones». Unha fila conta como accións ou como fondos só se a descrición do propio deputado o di (accións, participacións, porcentaxe dunha sociedade; fondo, F.I., SICAV). Se non o di (por exemplo, só «TELEFONICA» ou «Valores Caixabank»), conta no total pero non se clasifica; os plans de pensións non contan como fondos de investimento. Unha fila que menciona accións e fondos conta nos dous.</p>`,
      actividades: `<p>Do <em>Registro de Intereses - Actividades</em>: cargos públicos, actividades públicas ás que renunciou, pensións, docencia, cargos en partidos, colaboracións, actividades privadas autorizadas e outras. É o que cada deputado declara e o Pleno do Congreso considera compatible co escano. O texto extráese automaticamente do PDF oficial (ten capa de texto) e publícase literalmente, coa data do acordo do Pleno. Se o Pleno aínda non se pronunciou, o Congreso non publica o contido e a ficha indícao.</p>`,
      intereses: `<p>Das <em>Declaraciones de Intereses Económicos</em> (Código de Conducta de las Cortes Generales): actividades dos cinco anos anteriores ao escano que lle deron ingresos ou poden condicionar a súa actividade política (período, empregador, sector e descrición), doazóns e agasallos recibidos, fundacións e asociacións ás que contribúe e outros intereses. Tómase cada apartado da declaración máis recente que o enche. O nome dun particular (por exemplo, un familiar como benfeitor) substitúese por «[nombre omitido]».</p>`,
      entidades: `<p>Cada ficha recolle as empresas, administracións, fundacións, asociacións, partidos e outras entidades que nomean os documentos oficiais do deputado, co texto literal e a ligazón a cada documento:</p>
<ul>
<li>Os <strong>acordos da Comisión do Estatuto dos Deputados</strong> sobre as súas declaracións de actividades, aprobados polo Pleno e publicados no <a href="https://www.congreso.es/es/cem/dictamenes_actividades_xvleg">Boletín Oficial das Cortes Xerais (serie D)</a>: que actividade declara, en que empresa ou entidade, e se o Congreso a declara compatible, a autoriza ou toma coñecemento.</li>
<li>O <em>Registro de Intereses - Actividades</em>.</li>
<li>Todas as súas <em>Declaraciones de Intereses Económicos</em> da lexislatura (non só a máis recente): empregadores dos cinco anos anteriores, doazóns e contribucións.</li>
<li>As accións, participacións e sociedades da súa declaración de bens.</li>
<li>A traxectoria da súa ficha oficial en congreso.es.</li>
</ul>
<p>Os textos son libres, así que os nomes localizáronse coa axuda dun asistente de intelixencia artificial e con regras estritas: só nomes que aparecen <strong>literalmente</strong> no texto (unha comprobación automática verifícao un a un), nunca persoas particulares e nunca referencias xenéricas («unha empresa privada»). As variantes dun mesmo nome (maiúsculas, tiles, «S.A.» ou «SA») agrúpanse; as unións feitas a man están en <a href="https://github.com/MarcoAnarmo/CongresoAbierto/blob/main/data/manual/entidades.json">data/manual/entidades.json</a>. O tipo (empresa, sector público, fundación…) só serve para ordenar a lista.</p>
<p><strong>Tipo de relación.</strong> Cada vez que un documento nomea unha entidade indícase que relación describe, segundo a sección oficial do documento (no Rexistro de Intereses, os apartados A a H; na declaración de intereses económicos, traballos anteriores, doazóns recibidas ou contribucións) ou, nos acordos do Congreso, segundo o artigo da lei electoral (LOREG) que cita o acordo. Non se deduce do nome da entidade. Así distínguense, por exemplo, un cargo nunha empresa autorizado polo Congreso, unhas accións, unha cota a unha ONG ou un traballo de hai cinco anos.</p>
<p><strong>Remuneración.</strong> Só se indica o que di o propio documento: «sen remuneración», «só dietas, indemnizacións ou gastos», «só complemento por antigüidade» (funcionarios en servizos especiais) ou «con remuneración». Se o documento non o di, a web non o supón. Nos acordos do Congreso non se ten en conta a fórmula fixa «sin la posibilidad de percibir remuneración del sector público», que é unha condición do acordo e non unha descrición da actividade.</p>
<p><strong>Para facer estatísticas con estes datos</strong> (táboa «Empresas e entidades» en Datos): hai que contar cada tipo de relación por separado e non sumar como se fosen iguais un cargo, unhas accións, unha achega ou un agasallo. «Non consta» non significa que cobre. Unha mesma entidade pode aparecer en varios documentos do mesmo deputado: para contar entidades hai que contar nomes distintos, non filas.</p>
<p><strong>Que apareza unha entidade non implica ningunha irregularidade nin conflito de intereses:</strong> é o que consta nesos documentos. Tampouco é unha lista completa das súas relacións, senón do que está por escrito en documentos oficiais.</p>`,
      borme: `<p>O <a href="https://www.boe.es/diario_borme/">Boletín Oficial do Rexistro Mercantil (BORME)</a> publica cada día os actos inscritos das sociedades: constitucións, nomeamentos e cesamentos de administradores, conselleiros e apoderados, socios únicos… O BOE ofréceos como <a href="https://www.boe.es/datosabiertos/">datos abertos</a> desde 2009.</p>
<ul>
<li>Revisáronse todos os actos inscritos desde xaneiro de 2009 (uns 9,6 millóns en máis de 126.000 boletíns provinciais) buscando o nome completo de cada deputado tal como o escribe o BORME (apelidos e nome).</li>
<li><strong>O BORME non publica o DNI.</strong> Que o nome coincida non demostra que sexa a mesma persoa: en España hai nomes que comparten centos de persoas. Por iso <strong>só se publica unha coincidencia cando outro documento oficial a confirma</strong>:
<ul>
<li>a mesma empresa aparece nas súas declaracións, nos acordos do Congreso sobre as súas actividades ou na súa ficha;</li>
<li>é unha empresa pública (municipal, provincial, insular…) dun lugar ou dunha administración na que o deputado declara un cargo, como un concelleiro no consello dunha empresa do seu concello;</li>
<li>a sociedade leva o seu nome e apelido e está inscrita na provincia da súa circunscrición.</li>
</ul></li>
<li>As coincidencias que non se poden confirmar así <strong>non se publican</strong>, aínda que o nome sexa pouco frecuente. Para estimar cantas persoas se chaman igual úsanse as estatísticas de <a href="https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736177009&menu=resultados&idp=1254734710990">nomes e apelidos do INE</a>, pero só como axuda para revisalas, nunca para publicalas.</li>
<li>Cada acto leva ao seu anuncio oficial en boe.es. Os nomes das sociedades, os actos e os cargos cópianse tal cal, coas abreviaturas do BORME («Adm. Unico» é administrador único; «Apo.Man.Soli», apoderado mancomunado e solidario).</li>
<li>Un cargo no BORME non indica se se cobraba nin se segue vixente: mostra a data de cada acto publicado. O BORME comeza en 2009; o anterior non está.</li>
</ul>
<p>O código que o fai é público: <a href="https://github.com/MarcoAnarmo/CongresoAbierto/blob/main/scripts/browser/borme.js">scripts/browser/borme.js</a> (busca) e <a href="https://github.com/MarcoAnarmo/CongresoAbierto/blob/main/scripts/borme-clasificar.py">scripts/borme-clasificar.py</a> (confirmación). As coincidencias sen confirmar non se soben ao repositorio, porque na súa maioría son doutras persoas.</p>`,
      revision: `<p>Todo o que hai nesta web sae de documentos oficiais que calquera pode abrir. Aquí explícase, fonte a fonte, en que formato publica cada institución os seus datos, como se pasaron á web e como se comprobou que o publicado coincide co orixinal.</p>
<h3>A regra: só se publica o que se pode comprobar</h3>
<ul>
<li><strong>Publícase</strong> o que está escrito nun documento oficial e se comprobou contra el. Cada dato leva ao seu documento, para que calquera o poida verificar.</li>
<li><strong>Publícase con aviso</strong> («Lectura non confirmada») o que si está no documento pero ten algunha lectura que non se puido confirmar ao 100 %, por exemplo unha cifra borrosa nun escaneo. O aviso leva ao PDF e pide axuda para confirmalo.</li>
<li><strong>Non se publica</strong> o que ningún documento oficial confirma, aínda que pareza probable. Por exemplo, unha persoa do Rexistro Mercantil que se chama igual ca un deputado, se non hai outro documento que demostre que é a mesma persoa. Tampouco se publican nomes de particulares, números de conta, NIF nin matrículas.</li>
<li><strong>Non se interpreta.</strong> Os textos cópianse literalmente, coas súas erratas, e as cifras son sumas do declarado: nunca medias nin estimacións. Se algo non coincide co documento oficial, prevalece o documento oficial.</li>
</ul>
<h3>De onde sae cada dato e como se comprobou</h3>
<ul>
<li><strong>Deputados, grupos, cargos, formación e traxectoria.</strong> <em>Formato:</em> páxinas e buscador de congreso.es. <em>Como se extrae:</em> uns programas copian os campos tal cal. <em>Comprobación:</em> non hai transcrición; o texto é o oficial. O tipo de universidade (pública ou privada) é o do rexistro oficial de universidades (RUCT).</li>
<li><strong>Declaracións de bens e rendas</strong> ({pdfs} documentos). <em>Formato:</em> PDF escaneados, é dicir, imaxes sen un texto que un ordenador poida ler. <em>Como se extrae:</em> cada páxina transcribiuse coa axuda dun modelo de linguaxe con visión (intelixencia artificial), seguindo unhas instrucións públicas: copiar literalmente, non adiviñar nunca e marcar con «?» o que non se lea ben. <em>Comprobación:</em>
<ul>
<li>inmobles e vehículos: unha segunda revisión completa e independente, fila a fila;</li>
<li>débedas: dúas transcricións independentes, e cada diferenza resólvese mirando o PDF;</li>
<li>rendas, contas e accións: cada cifra e cada palabra compárase cunha lectura automática independente (OCR), e todo o que non coincide vólvese mirar no PDF ampliado.</li>
</ul></li>
<li><strong>Declaracións de intereses económicos.</strong> <em>Formato:</em> PDF escaneados. Mesmo método e mesma comprobación que as rendas.</li>
<li><strong>Rexistro de Intereses - Actividades</strong> e <strong>acordos da Comisión do Estatuto</strong> (Boletín Oficial das Cortes Xerais, serie D). <em>Formato:</em> PDF con texto. <em>Como se extrae:</em> un programa copia o texto literal de cada apartado, sen intelixencia artificial. <em>Comprobación:</em> é o texto do propio PDF. Cada acordo asígnase a un deputado só se o seu nome coincide exactamente co da lista oficial; os de quen xa non ten escano non se usan.</li>
<li><strong>Votacións.</strong> <em>Formato:</em> datos abertos do Congreso (JSON) co voto de cada deputado. <em>Como se extrae:</em> con programas, sen intelixencia artificial. Os temas asígnanse por palabras do título oficial, cunha lista pública.</li>
<li><strong>Retribucións.</strong> Importes oficiais que publica o Congreso.</li>
<li><strong>Empresas e entidades.</strong> <em>Formato:</em> os textos dos documentos anteriores. <em>Como se extrae:</em> un modelo de linguaxe sinalou en cada texto os nomes de empresas, administracións, fundacións e outras entidades. <em>Comprobación:</em> un programa verifica que cada nome aparece letra a letra no seu texto oficial; se non aparece, descártase. Nunca se recollen nomes de particulares. Os nomes distintos dunha mesma entidade agrúpanse cunha lista pública.</li>
<li><strong>Rexistro Mercantil (BORME).</strong> <em>Formato:</em> datos abertos do BOE (XML), uns 9,6 millóns de actos desde 2009. <em>Como se extrae:</em> un programa busca o nome completo exacto de cada deputado, sen intelixencia artificial. <em>Comprobación:</em> como o BORME non publica o DNI, unha coincidencia só se publica se outro documento oficial a confirma (ver <a href="#borme">Rexistro Mercantil</a>). De 662 casos nos que unha empresa ten un cargo co mesmo nome ca un deputado, publícanse 77; os outros 585 non, porque non se poden confirmar.</li>
</ul>
<h3>Que fixo a intelixencia artificial e que non</h3>
<ul>
<li><strong>Axudou a</strong> transcribir os PDF escaneados, que non teñen texto; a localizar os nomes de entidades en textos libres; a traducir a web a outras linguas; e a programar.</li>
<li><strong>Non decide que se publica.</strong> Todo o que transcribe ou sinala compróbase contra o documento oficial con outro método: unha segunda lectura, un OCR independente ou unha comprobación automática de que o texto é literal. O que non se pode comprobar márcase cun aviso ou non se publica.</li>
<li><strong>Non resume, non interpreta e non clasifica a ninguén.</strong> As cifras calcúlaas o código a partir do transcrito, e os textos oficiais móstranse tal cal, en castelán.</li>
</ul>
<p>O código, os datos transcritos e as instrucións de transcrición son públicos en <a href="https://github.com/MarcoAnarmo/CongresoAbierto">GitHub</a>, para que calquera poida repetir o proceso ou atopar un erro.</p>`,
      retribuciones: `<p>Móstranse os importes mensuais oficiais de 2026 que lle corresponden a cada deputado durante o seu mandato, segundo a súa circunscrición e os seus cargos:</p>
<ul>
<li>Asignación constitucional, igual para todos: {asignacion}.</li>
<li>Indemnización por gastos, exenta de IRPF: {indemOtras} (fóra de Madrid) ou {indemMadrid} (electos por Madrid).</li>
<li>Complementos por cargo, non acumulables dentro de cada bloque (Mesa e Xunta de Portavoces; comisións):<ul>{cargos}</ul></li>
</ul>
<p>Os cargos saen da ficha oficial de cada deputado. Non se inclúen o transporte (págao o Congreso directamente) nin os soldos de quen ademais son membros do Goberno, que se rexen polos Presupuestos Generales del Estado.</p>`,
      votaciones: `<p>Cada votación mostra o texto oficial do expediente, o tipo de votación, o resultado, o voto de cada grupo (co grupo de cada deputado na data da votación) e o voto de cada deputado segundo os datos abertos do Congreso. O hemiciclo é un gráfico ordenado por grupos parlamentarios; non reproduce o plano real dos asentos. As votacións por chamamento (en voz alta) tardan máis en publicarse en datos abertos; engádense cando aparecen. Coas Cortes disoltas, os decretos leis convalídaos ou derrógaos a Deputación Permanente (art. 78 da Constitución). Cando o Congreso só publica os totais dunha votación, sen o voto de cada deputado (por exemplo, nunha votación secreta), a web mostra só eses totais e indícao. <a href="{votaciones}">Ver votacións</a>.</p>`,
      participacion: `<p>Para cada deputado cóntanse todas as votacións do Pleno da XV Lexislatura con voto nominal publicado nas que tiña escano: cantas veces votou si, non ou abstención e cantas non votou (por ausencia ou porque non emitiu voto). Non se inclúen as votacións secretas, porque non hai voto de cada deputado.</p>
<p><strong>Voto distinto do seu grupo:</strong> cóntase cando votou si, non ou abstención e a maioría do seu grupo nesa votación (co grupo que publica o Congreso para esa data) votou outra cousa. Non conta «non vota», nin as votacións nas que o seu grupo empatou, nin o Grupo Mixto, onde conviven varios partidos.</p>`,
      temas: `<p>A páxina de votacións recolle todas as votacións do Pleno da XV Lexislatura publicadas en datos abertos (desde setembro de 2023). As votacións por chamamento, como as investiduras, non teñen o voto de cada deputado en datos abertos e non aparecen. As <strong>votacións clave</strong> levan ademais documentos oficiais (BOE, BOCG, Diario de Sesiones) e extractos literais do texto, revisados a man; as demais mostran o título oficial, os totais, o voto por grupo e o JSON e o PDF oficiais.</p>
<p>O Congreso non clasifica as súas votacións por temas. Para poder filtralas, cada votación recibe un ou varios temas segundo as palabras que aparecen no seu título oficial (por exemplo, «alquiler» ou «vivienda» → Vivenda). É unha axuda para buscar, non unha valoración: a lista completa de palabras está en <a href="https://github.com/MarcoAnarmo/CongresoAbierto/blob/main/data/manual/temas.json">data/manual/temas.json</a> e calquera pode propoñer cambios. Se unha votación non encaixa en ningún tema, aparece en «Outros».</p>
<p>O resultado calcúlase cos totais oficiais: maioría simple (máis votos a favor ca en contra), agás na votación de conxunto dunha lei orgánica, que precisa 176 votos a favor (art. 81 da Constitución). Nos decretos leis, «convalidado» ou «derrogado».</p>`,
      avisoLegal: `<p>Congreso Abierto é un proxecto cidadán, sen ánimo de lucro e independente: non ten relación co Congreso dos Deputados, co Goberno nin con ningún partido.</p>
<ul>
<li><strong>Só datos públicos.</strong> A web reúne e presenta información que publican institucións oficiais (Congreso, Boletín Oficial das Cortes Xerais, Boletín Oficial do Estado) e que calquera pode consultar na súa orixe. Cada dato leva ao documento do que sae. Se algo non coincide, prevalece o documento oficial.</li>
<li><strong>Sen interpretacións.</strong> Os textos cópianse literalmente. A web non afirma que exista ningún conflito de intereses nin ningunha irregularidade: mostra o que din os documentos.</li>
<li><strong>Datos persoais.</strong> Só se publican datos que as propias institucións fan públicos sobre os deputados polo seu cargo. Omítense os nomes de particulares que non son o deputado, os números de conta, o NIF e as matrículas. Para pedir unha corrección ou exercer os teus dereitos, escribe a <a href="mailto:ayuda@congresoabierto.org">ayuda@congresoabierto.org</a>.</li>
<li><strong>Reutilización.</strong> Os datos descargables publícanse con licenza <a href="https://creativecommons.org/licenses/by/4.0/deed.gl">CC BY 4.0</a> e o código con licenza MIT. Ofrécense tal cal, sen garantías. Congreso Abierto non se fai responsable do uso que outras persoas fagan dos datos nin das conclusións que tiren deles; quen os reutilice debe citar a fonte e respectar a lei, tamén a de protección de datos.</li>
</ul>`,
      errores: `<p><a href="{error}" rel="noopener">Avisa do erro en GitHub</a> co deputado, o dato e a ligazón ao documento oficial (coa páxina). Só se aceptan correccións respaldadas por un documento oficial.</p>
<p>O proxecto é público e calquera pode propoñer cambios, saiba ou non programar. En <a href="{colabora}">Colabora</a> explícase como.</p>`,
    },
  },
  en: {
    titulo: 'Methodology',
    descripcion: 'Where the data on Congreso Abierto come from and how they are presented, without interpretation.',
    h1: 'Sources and method',
    indice: 'Page contents',
    enPagina: 'On this page',
    nota: 'The official documents and data are published by the Congress in Spanish and are shown here as published.',
    secciones: {
      principio: 'Principle',
      fuentes: 'Official sources',
      revision: 'How the data were obtained and checked',
      perfil: 'Education and career',
      propiedades: 'Property and homes',
      vehiculos: 'Vehicles',
      deudas: 'Debts and loans',
      rentas: 'Income, accounts and shares',
      actividades: 'Positions and activities',
      intereses: 'Previous jobs and interests',
      entidades: 'Companies and organisations',
      borme: 'Companies Register (BORME)',
      retribuciones: 'Pay',
      votaciones: 'Votes',
      participacion: 'Their votes in plenary',
      temas: 'Vote topics',
      avisoLegal: 'Use of the data and legal notice',
      errores: 'Spotted a mistake?',
    },
    html: {
      principio: `<p>This site contains only official information from the Spanish state, presented exactly as the institution that produces it publishes it. We make no interpretations or judgements: we organise and simplify it so that anyone can look it up and draw their own conclusions. If anything differs from the official document, the official document prevails.</p>`,
      fuentes: `<ul>
<li><strong>Deputies, groups and positions:</strong> the official search tool and profiles on <a href="https://www.congreso.es/es/busqueda-de-diputados">congreso.es</a> (15th term, XV Legislatura). Consulted on {fecha}.</li>
<li><strong>Property and vehicles:</strong> the <em>Declaraciones de Bienes y Rentas</em> (asset and income declarations) that each deputy files with the Congress and that the Congress publishes on their profile: {pdfs} documents from {conDecl} deputies; the most recent is dated {ultima}.</li>
<li><strong>Income, accounts, shares and companies:</strong> pages 1 to 3 of those same asset declarations.</li>
<li><strong>Positions, activities, previous jobs and donations:</strong> the <em>Registro de Intereses - Actividades</em> (register of interests – activities) and the <em>Declaraciones de Intereses Económicos</em> (declarations of economic interests) that the Congress publishes on each deputy’s profile.</li>
<li><strong>Votes:</strong> the Congress’s <a href="https://www.congreso.es/es/opendata/votaciones">open voting data</a>, with the official text of each item.</li>
<li><strong>Legislation:</strong> <a href="https://www.boe.es">Boletín Oficial del Estado</a> (Spain’s official gazette: decree-laws and decisions to ratify or repeal them).</li>
<li><strong>Pay:</strong> <a href="{fuenteRetribuciones}">Régimen económico y ayudas de los miembros de la Cámara</a> (pay and allowances of members of the Chamber), 2026 amounts.</li>
<li><strong>Companies and organisations:</strong> also the decisions of the Committee on Members’ Status on their activities, published in the <a href="https://www.congreso.es/es/cem/dictamenes_actividades_xvleg">Official Gazette of the Cortes Generales (series D)</a>.</li>
<li><strong>Company positions:</strong> <a href="https://www.boe.es/datosabiertos/">BORME open data</a> (Official Gazette of the Companies Register), since 2009.</li>
</ul>
<p><strong>Group and electoral list.</strong> The Congress records two different things: the electoral list (candidatura) on which each deputy was elected and the parliamentary group they belong to on the date of consultation. They may differ: anyone who leaves their group moves to the Grupo Mixto (mixed group), even if they were elected on another list. The chamber chart is ordered by parliamentary group; where the electoral list is different, it is shown in brackets.</p>`,
      perfil: `<p>These come from each deputy’s <em>Ficha personal</em> (personal profile) on <a href="https://www.congreso.es/es/busqueda-de-diputados">congreso.es</a>, a text written by the deputy themselves. It is copied word for word, line by line, and only split into two blocks:</p>
<ul>
<li><strong>Education:</strong> lines about degrees or studies (bachelor’s degree, master’s, doctorate, diploma, engineering, course, programme…). Everything else is <strong>career</strong>. A sentence about a job (lecturer, researcher, director…) does not count as education even if it names a university.</li>
<li><strong>Public or private university:</strong> only when the line names the institution. The type is the one listed in the Ministry’s <a href="https://www.educacion.gob.es/ruct/consultauniversidades?actual=universidades">Registro de Universidades, Centros y Títulos (RUCT)</a> (register of universities, centres and degrees). Other ways of naming it are also recognised (in Spain’s other official languages, abbreviations such as UCM or UNED, and schools that are part of a university, such as ICADE, ESADE or IESE). The list is in <code>data/manual/universidades.json</code>.</li>
<li>If it names an institution that is not in the RUCT (for example, a foreign university), this is stated, without classifying it. If it does not name the institution, the page says that the profile does not specify it: nothing is inferred.</li>
<li>Family details (marital status, children) are not collected, even if they appear in the profile.</li>
<li><strong>Timeline:</strong> the terms in which they have been a deputy (with their official dates), their positions in the Chamber on the date of consultation, with their start date, the lines of their career that mention a year, and their asset declarations and declarations of economic interests for this term, each with its PDF.</li>
</ul>`,
      propiedades: `<p>The “Bienes inmuebles” (real estate) tables in each declaration are used, copied word for word. Each profile links to its original PDFs.</p>
<ul>
<li><strong>Properties:</strong> all urban and rural real estate that the deputy declares in their own name, in full or partial ownership: homes, garages, storage rooms, commercial premises, industrial buildings, building plots, rural estates… Each line of the official table counts as one property; if the line gives a number of units (“16 viviendas”, “8 fincas rústicas”, “piso y dos plazas de garaje”), those units are counted.</li>
<li><strong>Homes:</strong> of those properties, the ones the deputy describes as a home, flat, house, chalet, apartment, penthouse, duplex, studio, terraced house, single-family house, bungalow or residential, including on rural land. Properties described only as a garage, parking space, carport, storage room, commercial premises, office, warehouse, industrial building, building plot, parcel, land or rural estate do not count as homes.</li>
<li>The percentage and the type of right (pleno dominio, nuda propiedad, ganancial…) are shown as the deputy writes them.</li>
<li>Real estate owned by companies in which the deputy has a stake is listed separately on their profile and is not added in.</li>
<li>If the latest declaration only reports a change (for example, a purchase), it is shown alongside the previous full declaration. An asset only stops being counted when a later official declaration reports its sale or removal; the profile shows which one.</li>
<li>Declarations reflect the deputy’s assets on the date they were filed.</li>
</ul>`,
      vehiculos: `<p>Copied from the “Vehículos, embarcaciones y aeronaves” (vehicles, boats and aircraft) table. Number plates are not published, because the official form itself asks for them not to be given.</p>`,
      deudas: `<p>Copied from the “Deudas y obligaciones patrimoniales” (debts and financial obligations) section (page 4) of the same asset declarations used for property.</p>
<ul>
<li>Each loan is published with its description and lender, the date it was granted, the amount granted and the outstanding balance, <strong>exactly as the deputy writes them</strong> (format, typos and all).</li>
<li>The total outstanding balance is the sum of the loans table in their most recent declaration that fills in this section. If an amount cannot be read as a number without interpreting it (a digit that is illegible in the scan, an impossible format), it is not added and “at least” is shown.</li>
<li>Loans from different declarations are not added together, because the same loan may be repeated. Earlier ones that are still in force are shown separately.</li>
<li>“Otras deudas y obligaciones” (other debts and obligations: pensions, guarantees, financing…) and the deputy’s remarks about their debts are copied word for word and are not added up.</li>
<li>The names of private individuals other than the deputy (for example, children) are replaced with “[nombre omitido]” (name omitted).</li>
<li>If a reading could not be fully confirmed (a figure covered or cut off in the scan, an almost invisible separator) or the original contains inconsistent data (an impossible date, or one later than the declaration), the profile flags it with an <strong>unconfirmed reading</strong> notice, a link to the PDF and another link to let us know if anyone can confirm it.</li>
<li>The balance is as of the date set by the official form: 31 December of the year before the declaration, or the month before it was filed.</li>
</ul>`,
      rentas: `<p>Copied from pages 1 to 3 of the asset declarations, with the text and amount <strong>exactly as the deputy writes them</strong>:</p>
<ul>
<li><strong>Income:</strong> what they received in the year before the declaration (salaries, fees, dividends, interest, rents, sales and other income), and the personal income tax (IRPF) they paid that year. Their salary from the Congress is not declared here because the Chamber already publishes it (see <a href="#retribuciones">Pay</a>); that is why many tables appear empty even though the deputy declares their IRPF.</li>
<li><strong>Accounts and deposits:</strong> the balance of all their deposits on the date set by the form. Account numbers are not published.</li>
<li><strong>Shares, funds and companies:</strong> government debt, shares and holdings, companies in which their companies hold more than 5%, and other assets or rights (life insurance, pension plans…), at the value they declare.</li>
<li>Each table is taken from the most recent declaration that fills it in, and the profile shows its date. Amendments that only report other changes (for example, a vehicle) do not replace it.</li>
<li>The large figures on the profile are the total of each table. If an amount cannot be read as a number without interpreting it (formats such as “47.268.27”, or text instead of a figure), it is not added and “at least” is shown. No averages are calculated.</li>
<li>The names of private individuals other than the deputy are replaced with “[nombre omitido]”.</li>
</ul>
<p><strong>Filtering and sorting by shares and funds</strong> (Members page): the total is the sum of their “Deuda pública, obligaciones, acciones y participaciones” table. A row counts as shares or funds only if the member’s own description says so (shares, holdings, a percentage of a company; fund, F.I., SICAV). If it does not (for example, just “TELEFONICA” or “Valores Caixabank”), it counts in the total but is not classified; pension plans do not count as investment funds. A row mentioning both shares and funds counts in both.</p>`,
      actividades: `<p>From the <em>Registro de Intereses - Actividades</em>: public offices, public activities they have given up, pensions, teaching, party positions, collaborations, authorised private activities and others. This is what each deputy declares and what the plenary of the Congress considers compatible with their seat. The text is extracted automatically from the official PDF (it has a text layer) and published word for word, with the date of the plenary decision. If the plenary has not yet ruled, the Congress does not publish the content and the profile says so.</p>`,
      intereses: `<p>From the <em>Declaraciones de Intereses Económicos</em> (Código de Conducta de las Cortes Generales, the code of conduct of the Spanish Parliament): activities in the five years before taking their seat that gave them income or could influence their political activity (period, employer, sector and description), donations and gifts received, foundations and associations they contribute to, and other interests. Each section is taken from the most recent declaration that fills it in. The name of a private individual (for example, a relative named as a benefactor) is replaced with “[nombre omitido]”.</p>`,
      entidades: `<p>Each profile lists the companies, public bodies, foundations, associations, parties and other organisations named in the member’s official documents, with the original text and a link to each document:</p>
<ul>
<li>The <strong>decisions of the Committee on Members’ Status</strong> on their declarations of activities, approved by the plenary and published in the <a href="https://www.congreso.es/es/cem/dictamenes_actividades_xvleg">Official Gazette of the Cortes Generales (series D)</a>: which activity they declare, in which company or organisation, and whether Congress declares it compatible, authorises it or takes note of it.</li>
<li>The <em>Registro de Intereses - Actividades</em> (register of interests).</li>
<li>All their <em>Declaraciones de Intereses Económicos</em> (economic interests) in this term, not just the latest: employers in the previous five years, donations and contributions.</li>
<li>The shares, holdings and companies in their declaration of assets.</li>
<li>The career section of their official profile on congreso.es.</li>
</ul>
<p>These are free texts, so the names were located with the help of an artificial intelligence assistant under strict rules: only names that appear <strong>word for word</strong> in the text (an automatic check verifies each one), never private individuals and never generic references (“a private company”). Variants of the same name (capitals, accents, “S.A.” or “SA”) are grouped; manual merges are listed in <a href="https://github.com/MarcoAnarmo/CongresoAbierto/blob/main/data/manual/entidades.json">data/manual/entidades.json</a>. The type (company, public sector, foundation…) is only used to sort the list.</p>
<p><strong>Type of relationship.</strong> Each time a document names an organisation, the relationship it describes is shown, based on the official section of the document (in the Register of Interests, sections A to H; in the declaration of economic interests, previous jobs, donations received or contributions) or, in Congress decisions, on the article of the electoral law (LOREG) cited in the decision. It is not inferred from the organisation’s name. This separates, for example, a company position authorised by Congress, some shares, a fee to an NGO or a job from five years ago.</p>
<p><strong>Pay.</strong> Only what the document itself says is shown: “unpaid”, “only allowances, attendance fees or expenses”, “only a seniority supplement” (civil servants on special service) or “paid”. If the document does not say, the site does not assume. In Congress decisions, the standard wording “sin la posibilidad de percibir remuneración del sector público” (without being able to receive public-sector pay) is ignored, because it is a condition of the decision, not a description of the activity.</p>
<p><strong>To compute statistics with this data</strong> (the “Companies and organisations” table in Data): count each type of relationship separately and do not add up a position, some shares, a contribution and a gift as if they were the same. “Not stated” does not mean paid. The same organisation can appear in several documents for the same member: to count organisations, count distinct names, not rows.</p>
<p><strong>An organisation appearing here does not imply any wrongdoing or conflict of interest:</strong> it is what those documents state. Nor is it a complete list of their relationships, only of what is written in official documents.</p>`,
      borme: `<p>The <a href="https://www.boe.es/diario_borme/">Official Gazette of the Companies Register (BORME)</a> publishes the registered acts of companies every day: incorporations, appointments and resignations of directors, board members and attorneys, sole shareholders… The Official State Gazette provides them as <a href="https://www.boe.es/datosabiertos/">open data</a> from 2009.</p>
<ul>
<li>All registered acts since January 2009 (about 9.6 million in over 126,000 provincial gazettes) were searched for each member’s full name as the BORME writes it (surnames and first name).</li>
<li><strong>The BORME does not publish ID numbers.</strong> A matching name does not prove it is the same person: in Spain some names are shared by hundreds of people. That is why <strong>a match is only published when another official document confirms it</strong>:
<ul>
<li>the same company appears in their declarations, in Congress decisions on their activities or in their profile;</li>
<li>it is a public company (municipal, provincial, island…) of a place or administration where the member declares a position, such as a councillor on the board of a company owned by their town hall;</li>
<li>the company bears their name and surname and is registered in the province of their constituency.</li>
</ul></li>
<li>Matches that cannot be confirmed this way <strong>are not published</strong>, even if the name is rare. The <a href="https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736177009&menu=resultados&idp=1254734710990">National Statistics Institute’s name and surname statistics</a> are used to estimate how many people share a name, but only to help review them, never to publish them.</li>
<li>Each act links to its official notice on boe.es. Company names, acts and positions are copied as published, with the BORME’s abbreviations (in Spanish: “Adm. Unico” is sole director; “Apo.Man.Soli”, joint and several attorney).</li>
<li>A BORME position does not show whether it was paid or is still current: it shows the date of each published act. The BORME starts in 2009; earlier acts are not included.</li>
</ul>
<p>The code is public: <a href="https://github.com/MarcoAnarmo/CongresoAbierto/blob/main/scripts/browser/borme.js">scripts/browser/borme.js</a> (search) and <a href="https://github.com/MarcoAnarmo/CongresoAbierto/blob/main/scripts/borme-clasificar.py">scripts/borme-clasificar.py</a> (confirmation). Unconfirmed matches are not uploaded to the repository, because most of them belong to other people.</p>`,
      revision: `<p>Everything on this site comes from official documents that anyone can open. This section explains, source by source, the format in which each institution publishes its data, how it was brought into the site and how it was checked that what is published matches the original.</p>
<h3>The rule: only what can be checked is published</h3>
<ul>
<li><strong>Published:</strong> what is written in an official document and has been checked against it. Every data point links to its document so anyone can verify it.</li>
<li><strong>Published with a notice</strong> (“Unconfirmed reading”): what is in the document but includes a reading that could not be confirmed 100%, for example a blurred figure in a scan. The notice links to the PDF and asks for help to confirm it.</li>
<li><strong>Not published:</strong> anything no official document confirms, however likely it seems. For example, a person in the Companies Register with the same name as a member, unless another document shows it is the same person. Names of private individuals, account numbers, tax IDs and number plates are not published either.</li>
<li><strong>No interpretation.</strong> Texts are copied word for word, typos included, and figures are sums of what was declared: never averages or estimates. If anything does not match the official document, the official document prevails.</li>
</ul>
<h3>Where each data point comes from and how it was checked</h3>
<ul>
<li><strong>Members, groups, positions, education and career.</strong> <em>Format:</em> congreso.es pages and search engine. <em>How it is extracted:</em> scripts copy the fields as they are. <em>Check:</em> there is no transcription; the text is the official one. The type of university (public or private) is taken from the official register of universities (RUCT).</li>
<li><strong>Declarations of assets and income</strong> ({pdfs} documents). <em>Format:</em> scanned PDFs, that is, images without text a computer can read. <em>How it is extracted:</em> each page was transcribed with the help of a vision-capable language model (artificial intelligence), following public instructions: copy word for word, never guess and mark with “?” anything that cannot be read clearly. <em>Check:</em>
<ul>
<li>property and vehicles: a second complete, independent review, row by row;</li>
<li>debts: two independent transcriptions, with every difference resolved by looking at the PDF;</li>
<li>income, accounts and shares: every figure and word is compared with an independent automatic reading (OCR), and anything that does not match is checked again in the enlarged PDF.</li>
</ul></li>
<li><strong>Declarations of economic interests.</strong> <em>Format:</em> scanned PDFs. Same method and same checks as income.</li>
<li><strong>Register of Interests - Activities</strong> and <strong>decisions of the Committee on Members’ Status</strong> (Official Gazette of the Cortes Generales, series D). <em>Format:</em> PDFs with text. <em>How it is extracted:</em> a script copies the literal text of each section, without artificial intelligence. <em>Check:</em> it is the PDF’s own text. Each decision is assigned to a member only if the name exactly matches the official list; those of people who no longer hold a seat are not used.</li>
<li><strong>Votes.</strong> <em>Format:</em> Congress open data (JSON) with each member’s vote. <em>How it is extracted:</em> with scripts, without artificial intelligence. Topics are assigned from words in the official title, using a public list.</li>
<li><strong>Pay.</strong> Official amounts published by Congress.</li>
<li><strong>Companies and organisations.</strong> <em>Format:</em> the texts of the documents above. <em>How it is extracted:</em> a language model marked the names of companies, public bodies, foundations and other organisations in each text. <em>Check:</em> a script verifies that every name appears letter for letter in its official text; if it does not, it is discarded. Names of private individuals are never collected. Different names for the same organisation are grouped using a public list.</li>
<li><strong>Companies Register (BORME).</strong> <em>Format:</em> Official State Gazette open data (XML), about 9.6 million acts since 2009. <em>How it is extracted:</em> a script searches for each member’s exact full name, without artificial intelligence. <em>Check:</em> since the BORME does not publish ID numbers, a match is only published if another official document confirms it (see <a href="#borme">Companies Register</a>). Of 662 cases in which a company has a position held by someone with a member’s name, 77 are published; the other 585 are not, because they cannot be confirmed.</li>
</ul>
<h3>What artificial intelligence did and did not do</h3>
<ul>
<li><strong>It helped</strong> to transcribe the scanned PDFs, which have no text; to find the names of organisations in free text; to translate the site into other languages; and to write code.</li>
<li><strong>It does not decide what is published.</strong> Everything it transcribes or marks is checked against the official document by another method: a second reading, an independent OCR or an automatic check that the text is literal. Anything that cannot be checked is flagged with a notice or not published.</li>
<li><strong>It does not summarise, interpret or classify anyone.</strong> Figures are calculated by code from the transcriptions, and official texts are shown as they are, in Spanish.</li>
</ul>
<p>The code, the transcribed data and the transcription instructions are public on <a href="https://github.com/MarcoAnarmo/CongresoAbierto">GitHub</a>, so anyone can repeat the process or spot a mistake.</p>`,
      retribuciones: `<p>This shows the official 2026 monthly amounts that correspond to each deputy during their term of office, according to their constituency and positions:</p>
<ul>
<li>Constitutional allowance (asignación constitucional), the same for everyone: {asignacion}.</li>
<li>Expenses allowance, exempt from IRPF: {indemOtras} (outside Madrid) or {indemMadrid} (deputies elected for Madrid).</li>
<li>Supplements for positions, not cumulative within each block (Bureau and Board of Spokespersons; committees):<ul>{cargos}</ul></li>
</ul>
<p>Positions are taken from each deputy’s official profile. This does not include transport (paid directly by the Congress) or the salaries of those who are also members of the Government, which are governed by the Presupuestos Generales del Estado (state budget).</p>`,
      votaciones: `<p>Each vote shows the official text of the item, the type of vote, the result, how each group voted (with each deputy’s group on the date of the vote) and how each deputy voted, according to the Congress’s open data. The chamber chart is a graphic ordered by parliamentary group; it does not reproduce the real seating plan. Roll-call votes (cast aloud) take longer to appear in the open data; they are added when they appear. When the Cortes are dissolved, decree-laws are ratified or repealed by the Diputación Permanente, the standing committee (art. 78 of the Constitution). When the Congress publishes only the totals of a vote, without each deputy’s vote (for example, in a secret ballot), the site shows only those totals and says so. <a href="{votaciones}">See votes</a>.</p>`,
      participacion: `<p>For each deputy, we count all plenary votes in the 15th term (XV Legislatura) with published individual votes in which they held a seat: how many times they voted yes, no or abstain, and how many times they did not vote (because they were absent or did not cast a vote). Secret ballots are not included, because there is no individual vote for each deputy.</p>
<p><strong>Voted differently from their group:</strong> counted when they voted yes, no or abstain and the majority of their group in that vote (using the group the Congress publishes for that date) voted otherwise. “Did not vote” does not count, nor do votes in which their group was tied, nor does the Grupo Mixto, which brings together several parties.</p>`,
      temas: `<p>The votes page includes all plenary votes in the 15th term published in the open data (since September 2023). Roll-call votes, such as investiture votes, do not have each deputy’s vote in the open data and do not appear. <strong>Key votes</strong> also include official documents (BOE, BOCG, Diario de Sesiones) and verbatim extracts of the text, checked by hand; the others show the official title, the totals, the vote by group and the official JSON and PDF.</p>
<p>The Congress does not classify its votes by topic. To make them filterable, each vote is given one or more topics based on the words in its official title (for example, “alquiler” [rent] or “vivienda” [housing] → Housing). It is a search aid, not a judgement: the full list of words is in <a href="https://github.com/MarcoAnarmo/CongresoAbierto/blob/main/data/manual/temas.json">data/manual/temas.json</a> and anyone can suggest changes. If a vote does not fit any topic, it appears under “Other”.</p>
<p>The result is calculated from the official totals: simple majority (more yes than no votes), except in the vote on an organic law as a whole, which needs 176 votes in favour (art. 81 of the Constitution). For decree-laws, “ratified” or “repealed”.</p>`,
      avisoLegal: `<p>Congreso Abierto is an independent, non-profit citizen project. It has no connection with the Congress of Deputies, the Government or any party.</p>
<ul>
<li><strong>Public data only.</strong> The site gathers and presents information published by official institutions (Congress, the Official Gazette of the Cortes Generales, the Official State Gazette) that anyone can check at the source. Every data point links to the document it comes from. If something does not match, the official document prevails.</li>
<li><strong>No interpretation.</strong> Texts are copied word for word. The site does not claim that any conflict of interest or wrongdoing exists: it shows what the documents say.</li>
<li><strong>Personal data.</strong> Only data that the institutions themselves publish about members in their official capacity is shown. Names of private individuals other than the member, account numbers, tax IDs and number plates are omitted. To request a correction or exercise your rights, write to <a href="mailto:ayuda@congresoabierto.org">ayuda@congresoabierto.org</a>.</li>
<li><strong>Reuse.</strong> Downloadable data is published under a <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a> licence and the code under the MIT licence. It is provided as is, without warranty. Congreso Abierto is not responsible for how others use the data or for the conclusions they draw from it; anyone reusing it must credit the source and comply with the law, including data protection law.</li>
</ul>`,
      errores: `<p><a href="{error}" rel="noopener">Report the mistake on GitHub</a> with the deputy, the data point and the link to the official document (with the page number). Only corrections backed by an official document are accepted.</p>
<p>The project is public and anyone can suggest changes, whether or not they can code. <a href="{colabora}">Contribute</a> explains how.</p>`,
    },
  },
});
