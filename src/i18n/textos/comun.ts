import { area } from '..';

/** Textos comunes: menú, pie, tema, selector de idioma, elecciones y palabras que se repiten en toda la web. */
const es = {
  nav: { estadisticas: 'Estadísticas', datos: 'Datos', descargar: 'Descargar', mas: 'Más', tarjetas: 'Tarjetas', masTitulo: 'Más páginas', seccionDatos: 'Estadísticas y descargas', hemiciclo: 'Hemiciclo', diputados: 'Diputados', votaciones: 'Votaciones', votacionesCorto: 'Votos', metodologia: 'Metodología', metodologiaCorto: 'Método', colabora: 'Colabora' },
  marca: {
    /** Lema y subtítulo: siempre sin punto final. */
    lema: 'Conoce a quien te representa',
    subtitulo: 'Transparencia y acceso fácil a datos oficiales del Congreso',
    descripcion: 'Conoce a quien te representa · Transparencia y acceso fácil a datos oficiales del Congreso: quiénes son los 350 diputados, qué declaran y cómo votan.',
    inicio: 'Congreso Abierto, inicio',
    navPrincipal: 'Principal',
    saltar: 'Saltar al contenido',
    ogAlt: '{titulo}: datos oficiales del Congreso',
  },
  tema: { oscuro: 'Activar modo oscuro', claro: 'Activar modo claro' },
  idioma: {
    boton: 'Idioma: castellano. Cambiar de idioma',
    titulo: 'Idioma',
    /** Aviso en los idiomas distintos del castellano. En castellano queda vacío. */
    datosEnCastellano: '',
  },
  pie: {
    explora: 'Explora',
    participa: 'Participa',
    tarjetas: 'Tarjetas para compartir',
    colabora: '¿Querrías colaborar?',
    avisoLegal: 'Uso de los datos y aviso legal',
    hojaDeRuta: 'Hoja de ruta',
    codigo: 'Código en GitHub',
    sugerencia: 'Hacer una sugerencia',
    error: 'Avisar de un error',
    /** {congreso} y {boe} se sustituyen por los enlaces. */
    fuentes: 'Solo datos oficiales del {congreso} y del {boe}, sin interpretaciones. Cada dato enlaza a su documento original.',
    congreso: 'Congreso de los Diputados',
    independiente: 'Proyecto independiente · Código abierto (MIT)',
    idiomas: 'Idiomas',
  },
  /** Voto de cada diputado: los datos guardan el valor oficial en castellano ('Sí', 'No', 'Abstención', 'No vota'). */
  voto: { 'Sí': 'Sí', 'No': 'No', 'Abstención': 'Abstención', 'No vota': 'No vota' },
  /** Resultado de una votación (valor oficial en castellano). */
  resultado: { Aprobada: 'Aprobada', Rechazada: 'Rechazada', Aprobado: 'Aprobado', Rechazado: 'Rechazado', Convalidado: 'Convalidado', Derogado: 'Derogado' },
  elecciones: {
    texto: 'Elecciones generales el 29 de noviembre de 2026',
    corto: 'elecciones del 29 de noviembre',
    etiqueta: 'Elecciones generales: 29 de noviembre',
    mini: 'Elecciones: 29 de noviembre',
    /** Etiqueta de las tarjetas */
    tarjeta: 'Elecciones generales · 29 de noviembre',
    /** Va delante de los textos para compartir (con espacio final). */
    llamada: 'Antes de votar el 29 de noviembre, conoce a quien te representa. ',
  },
  /** Temas con los que se agrupan las votaciones (data/manual/temas.json). */
  temas: { vivienda: 'Vivienda', economia: 'Economía e impuestos', trabajo: 'Trabajo y pensiones', sanidad: 'Sanidad y cuidados', educacion: 'Educación y cultura', igualdad: 'Igualdad y derechos sociales', justicia: 'Justicia y seguridad', migracion: 'Migración y nacionalidad', exterior: 'Política exterior', defensa: 'Defensa', transporte: 'Transporte e infraestructuras', territorio: 'Comunidades autónomas', 'campo-medioambiente': 'Campo, energía y medio ambiente', instituciones: 'Instituciones y transparencia', otros: 'Otros' } as Record<string, string>,
  /** Grupo actual y candidatura por la que fue elegido/a, cuando no coinciden. */
  candidatura: '{grupo} (candidatura {partido})',
  palabras: {
    diputados: ['{n} diputado', '{n} diputados'],
    propiedades: ['{n} propiedad', '{n} propiedades'],
    viviendas: ['{n} vivienda', '{n} viviendas'],
    vehiculos: ['{n} vehículo', '{n} vehículos'],
    cerrar: 'Cerrar',
    sinDatos: 'sin datos',
    alMes: 'al mes',
    lecturaNoConfirmada: 'Lectura no confirmada',
  },
  noEncontrada: { titulo: 'Página no encontrada', descripcion: 'La página que buscas no existe.', texto: 'La dirección no existe o ha cambiado.', volver: 'Ir al hemiciclo' },
};

export default area(es, {
  ca: {
    nav: { estadisticas: 'Estadístiques', datos: 'Dades', descargar: 'Descarregar', mas: 'Més', tarjetas: 'Targetes', masTitulo: 'Més pàgines', seccionDatos: 'Estadístiques i descàrregues', hemiciclo: 'Hemicicle', diputados: 'Diputats', votaciones: 'Votacions', votacionesCorto: 'Vots', metodologia: 'Metodologia', metodologiaCorto: 'Mètode', colabora: 'Col·labora' },
    marca: {
      lema: 'Coneix qui et representa',
      subtitulo: 'Transparència i accés fàcil a dades oficials del Congrés',
      descripcion: 'Coneix qui et representa · Transparència i accés fàcil a dades oficials del Congrés: qui són els 350 diputats, què declaren i com voten.',
      inicio: 'Congreso Abierto, inici',
      navPrincipal: 'Principal',
      saltar: 'Salta al contingut',
      ogAlt: '{titulo}: dades oficials del Congrés',
    },
    tema: { oscuro: 'Activa el mode fosc', claro: 'Activa el mode clar' },
    idioma: { boton: 'Llengua: català. Canvia de llengua', titulo: 'Llengua', datosEnCastellano: 'Les dades oficials es mostren en castellà, tal com les publica el Congrés.' },
    pie: {
      explora: 'Explora', participa: 'Participa', tarjetas: 'Targetes per compartir', colabora: 'Vols col·laborar?', avisoLegal: 'Ús de les dades i avís legal', hojaDeRuta: 'Full de ruta',
      codigo: 'Codi a GitHub', sugerencia: 'Fes un suggeriment', error: 'Avisa d’un error',
      fuentes: 'Només dades oficials del {congreso} i del {boe}, sense interpretacions. Cada dada enllaça al document original.',
      congreso: 'Congrés dels Diputats', independiente: 'Projecte independent · Codi obert (MIT)', idiomas: 'Llengües',
    },
    voto: { 'Sí': 'Sí', 'No': 'No', 'Abstención': 'Abstenció', 'No vota': 'No vota' },
    resultado: { Aprobada: 'Aprovada', Rechazada: 'Rebutjada', Aprobado: 'Aprovat', Rechazado: 'Rebutjat', Convalidado: 'Convalidat', Derogado: 'Derogat' },
    elecciones: {
      texto: 'Eleccions generals el 29 de novembre de 2026', corto: 'eleccions del 29 de novembre', etiqueta: 'Eleccions generals: 29 de novembre',
      mini: 'Eleccions: 29 de novembre', tarjeta: 'Eleccions generals · 29 de novembre', llamada: 'Abans de votar el 29 de novembre, coneix qui et representa. ',
    },
    temas: { vivienda: 'Habitatge', economia: 'Economia i impostos', trabajo: 'Treball i pensions', sanidad: 'Sanitat i cures', educacion: 'Educació i cultura', igualdad: 'Igualtat i drets socials', justicia: 'Justícia i seguretat', migracion: 'Migració i nacionalitat', exterior: 'Política exterior', defensa: 'Defensa', transporte: 'Transport i infraestructures', territorio: 'Comunitats autònomes', 'campo-medioambiente': 'Camp, energia i medi ambient', instituciones: 'Institucions i transparència', otros: 'Altres' },
    candidatura: '{grupo} (candidatura {partido})',
    palabras: {
      diputados: ['{n} diputat', '{n} diputats'], propiedades: ['{n} propietat', '{n} propietats'], viviendas: ['{n} habitatge', '{n} habitatges'],
      vehiculos: ['{n} vehicle', '{n} vehicles'], cerrar: 'Tanca', sinDatos: 'sense dades', alMes: 'al mes', lecturaNoConfirmada: 'Lectura no confirmada',
    },
    noEncontrada: { titulo: 'Pàgina no trobada', descripcion: 'La pàgina que busques no existeix.', texto: 'L’adreça no existeix o ha canviat.', volver: 'Ves a l’hemicicle' },
  },
  eu: {
    nav: { estadisticas: 'Estatistikak', datos: 'Datuak', descargar: 'Deskargatu', mas: 'Gehiago', tarjetas: 'Txartelak', masTitulo: 'Orrialde gehiago', seccionDatos: 'Estatistikak eta deskargak', hemiciclo: 'Hemizikloa', diputados: 'Diputatuak', votaciones: 'Bozketak', votacionesCorto: 'Botoak', metodologia: 'Metodologia', metodologiaCorto: 'Metodoa', colabora: 'Lagundu' },
    marca: {
      lema: 'Ezagutu zure ordezkaria',
      subtitulo: 'Gardentasuna eta Kongresuko datu ofizialetarako sarbide erraza',
      descripcion: 'Ezagutu zure ordezkaria · Gardentasuna eta Kongresuko datu ofizialetarako sarbide erraza: nor diren 350 diputatuak, zer aitortzen duten eta nola bozkatzen duten.',
      inicio: 'Congreso Abierto, hasiera',
      navPrincipal: 'Nagusia',
      saltar: 'Joan edukira',
      ogAlt: '{titulo}: Kongresuko datu ofizialak',
    },
    tema: { oscuro: 'Aktibatu modu iluna', claro: 'Aktibatu modu argia' },
    idioma: { boton: 'Hizkuntza: euskara. Aldatu hizkuntza', titulo: 'Hizkuntza', datosEnCastellano: 'Datu ofizialak gaztelaniaz agertzen dira, Kongresuak argitaratzen dituen bezala.' },
    pie: {
      explora: 'Arakatu', participa: 'Parte hartu', tarjetas: 'Partekatzeko txartelak', colabora: 'Lagundu nahi duzu?', avisoLegal: 'Datuen erabilera eta lege-oharra', hojaDeRuta: 'Ibilbide-orria',
      codigo: 'Kodea GitHub-en', sugerencia: 'Egin iradokizun bat', error: 'Jakinarazi akats bat',
      fuentes: '{congreso}ren eta {boe}ren datu ofizialak soilik, interpretaziorik gabe. Datu bakoitzak jatorrizko dokumentura eramaten du.',
      congreso: 'Diputatuen Kongresua', independiente: 'Proiektu independentea · Kode irekia (MIT)', idiomas: 'Hizkuntzak',
    },
    voto: { 'Sí': 'Bai', 'No': 'Ez', 'Abstención': 'Abstentzioa', 'No vota': 'Ez du bozkatzen' },
    resultado: { Aprobada: 'Onartua', Rechazada: 'Baztertua', Aprobado: 'Onartua', Rechazado: 'Baztertua', Convalidado: 'Baliozkotua', Derogado: 'Indargabetua' },
    elecciones: {
      texto: 'Hauteskunde orokorrak 2026ko azaroaren 29an', corto: 'azaroaren 29ko hauteskundeak', etiqueta: 'Hauteskunde orokorrak: azaroaren 29a',
      mini: 'Hauteskundeak: azaroaren 29a', tarjeta: 'Hauteskunde orokorrak · azaroaren 29a', llamada: 'Azaroaren 29an bozkatu aurretik, ezagutu zure ordezkaria. ',
    },
    temas: { vivienda: 'Etxebizitza', economia: 'Ekonomia eta zergak', trabajo: 'Lana eta pentsioak', sanidad: 'Osasuna eta zaintzak', educacion: 'Hezkuntza eta kultura', igualdad: 'Berdintasuna eta gizarte-eskubideak', justicia: 'Justizia eta segurtasuna', migracion: 'Migrazioa eta nazionalitatea', exterior: 'Kanpo-politika', defensa: 'Defentsa', transporte: 'Garraioa eta azpiegiturak', territorio: 'Autonomia-erkidegoak', 'campo-medioambiente': 'Landa, energia eta ingurumena', instituciones: 'Erakundeak eta gardentasuna', otros: 'Besteak' },
    candidatura: '{grupo} ({partido} hautagaitza)',
    palabras: {
      diputados: ['{n} diputatu', '{n} diputatu'], propiedades: ['{n} jabetza', '{n} jabetza'], viviendas: ['{n} etxebizitza', '{n} etxebizitza'],
      vehiculos: ['{n} ibilgailu', '{n} ibilgailu'], cerrar: 'Itxi', sinDatos: 'daturik ez', alMes: 'hilean', lecturaNoConfirmada: 'Irakurketa berretsi gabea',
    },
    noEncontrada: { titulo: 'Ez da orria aurkitu', descripcion: 'Bilatzen duzun orria ez dago.', texto: 'Helbidea ez dago edo aldatu egin da.', volver: 'Joan hemizikloara' },
  },
  gl: {
    nav: { estadisticas: 'Estatísticas', datos: 'Datos', descargar: 'Descargar', mas: 'Máis', tarjetas: 'Tarxetas', masTitulo: 'Máis páxinas', seccionDatos: 'Estatísticas e descargas', hemiciclo: 'Hemiciclo', diputados: 'Deputados', votaciones: 'Votacións', votacionesCorto: 'Votos', metodologia: 'Metodoloxía', metodologiaCorto: 'Método', colabora: 'Colabora' },
    marca: {
      lema: 'Coñece a quen te representa',
      subtitulo: 'Transparencia e acceso doado a datos oficiais do Congreso',
      descripcion: 'Coñece a quen te representa · Transparencia e acceso doado a datos oficiais do Congreso: quen son os 350 deputados, que declaran e como votan.',
      inicio: 'Congreso Abierto, inicio',
      navPrincipal: 'Principal',
      saltar: 'Ir ao contido',
      ogAlt: '{titulo}: datos oficiais do Congreso',
    },
    tema: { oscuro: 'Activar o modo escuro', claro: 'Activar o modo claro' },
    idioma: { boton: 'Idioma: galego. Cambiar de idioma', titulo: 'Idioma', datosEnCastellano: 'Os datos oficiais móstranse en castelán, tal como os publica o Congreso.' },
    pie: {
      explora: 'Explora', participa: 'Participa', tarjetas: 'Tarxetas para compartir', colabora: 'Queres colaborar?', avisoLegal: 'Uso dos datos e aviso legal', hojaDeRuta: 'Folla de ruta',
      codigo: 'Código en GitHub', sugerencia: 'Facer unha suxestión', error: 'Avisar dun erro',
      fuentes: 'Só datos oficiais do {congreso} e do {boe}, sen interpretacións. Cada dato liga co seu documento orixinal.',
      congreso: 'Congreso dos Deputados', independiente: 'Proxecto independente · Código aberto (MIT)', idiomas: 'Idiomas',
    },
    voto: { 'Sí': 'Si', 'No': 'Non', 'Abstención': 'Abstención', 'No vota': 'Non vota' },
    resultado: { Aprobada: 'Aprobada', Rechazada: 'Rexeitada', Aprobado: 'Aprobado', Rechazado: 'Rexeitado', Convalidado: 'Convalidado', Derogado: 'Derrogado' },
    elecciones: {
      texto: 'Eleccións xerais o 29 de novembro de 2026', corto: 'eleccións do 29 de novembro', etiqueta: 'Eleccións xerais: 29 de novembro',
      mini: 'Eleccións: 29 de novembro', tarjeta: 'Eleccións xerais · 29 de novembro', llamada: 'Antes de votar o 29 de novembro, coñece a quen te representa. ',
    },
    temas: { vivienda: 'Vivenda', economia: 'Economía e impostos', trabajo: 'Traballo e pensións', sanidad: 'Sanidade e coidados', educacion: 'Educación e cultura', igualdad: 'Igualdade e dereitos sociais', justicia: 'Xustiza e seguridade', migracion: 'Migración e nacionalidade', exterior: 'Política exterior', defensa: 'Defensa', transporte: 'Transporte e infraestruturas', territorio: 'Comunidades autónomas', 'campo-medioambiente': 'Campo, enerxía e medio ambiente', instituciones: 'Institucións e transparencia', otros: 'Outros' },
    candidatura: '{grupo} (candidatura {partido})',
    palabras: {
      diputados: ['{n} deputado', '{n} deputados'], propiedades: ['{n} propiedade', '{n} propiedades'], viviendas: ['{n} vivenda', '{n} vivendas'],
      vehiculos: ['{n} vehículo', '{n} vehículos'], cerrar: 'Pechar', sinDatos: 'sen datos', alMes: 'ao mes', lecturaNoConfirmada: 'Lectura non confirmada',
    },
    noEncontrada: { titulo: 'Páxina non atopada', descripcion: 'A páxina que buscas non existe.', texto: 'O enderezo non existe ou cambiou.', volver: 'Ir ao hemiciclo' },
  },
  en: {
    nav: { estadisticas: 'Statistics', datos: 'Data', descargar: 'Download', mas: 'More', tarjetas: 'Cards', masTitulo: 'More pages', seccionDatos: 'Statistics and downloads', hemiciclo: 'Chamber', diputados: 'Deputies', votaciones: 'Votes', votacionesCorto: 'Votes', metodologia: 'Methodology', metodologiaCorto: 'Method', colabora: 'Contribute' },
    marca: {
      lema: 'Know who represents you',
      subtitulo: 'Transparency and easy access to official data from the Spanish Congress',
      descripcion: 'Know who represents you · Transparency and easy access to official data from the Spanish Congress: who the 350 deputies are, what they declare and how they vote.',
      inicio: 'Congreso Abierto, home',
      navPrincipal: 'Main',
      saltar: 'Skip to content',
      ogAlt: '{titulo}: official data from the Spanish Congress',
    },
    tema: { oscuro: 'Switch to dark mode', claro: 'Switch to light mode' },
    idioma: { boton: 'Language: English. Change language', titulo: 'Language', datosEnCastellano: 'Official data are shown in Spanish, exactly as the Congress publishes them.' },
    pie: {
      explora: 'Explore', participa: 'Get involved', tarjetas: 'Cards to share', colabora: 'Would you like to help?', avisoLegal: 'Use of data and legal notice', hojaDeRuta: 'Roadmap',
      codigo: 'Code on GitHub', sugerencia: 'Make a suggestion', error: 'Report an error',
      fuentes: 'Only official data from the {congreso} and the {boe} (Official State Gazette), with no interpretation. Every figure links to its original document.',
      congreso: 'Congress of Deputies', independiente: 'Independent project · Open source (MIT)', idiomas: 'Languages',
    },
    voto: { 'Sí': 'Yes', 'No': 'No', 'Abstención': 'Abstain', 'No vota': 'Did not vote' },
    resultado: { Aprobada: 'Passed', Rechazada: 'Rejected', Aprobado: 'Passed', Rechazado: 'Rejected', Convalidado: 'Ratified', Derogado: 'Repealed' },
    elecciones: {
      texto: 'General election on 29 November 2026', corto: '29 November election', etiqueta: 'General election: 29 November',
      mini: 'Election: 29 November', tarjeta: 'General election · 29 November', llamada: 'Before you vote on 29 November, know who represents you. ',
    },
    temas: { vivienda: 'Housing', economia: 'Economy and taxes', trabajo: 'Work and pensions', sanidad: 'Health and care', educacion: 'Education and culture', igualdad: 'Equality and social rights', justicia: 'Justice and security', migracion: 'Migration and nationality', exterior: 'Foreign policy', defensa: 'Defence', transporte: 'Transport and infrastructure', territorio: 'Autonomous communities', 'campo-medioambiente': 'Farming, energy and environment', instituciones: 'Institutions and transparency', otros: 'Other' },
    candidatura: '{grupo} (elected on the {partido} ticket)',
    palabras: {
      diputados: ['{n} deputy', '{n} deputies'], propiedades: ['{n} property', '{n} properties'], viviendas: ['{n} home', '{n} homes'],
      vehiculos: ['{n} vehicle', '{n} vehicles'], cerrar: 'Close', sinDatos: 'no data', alMes: 'a month', lecturaNoConfirmada: 'Unconfirmed reading',
    },
    noEncontrada: { titulo: 'Page not found', descripcion: 'The page you are looking for does not exist.', texto: 'The address does not exist or has changed.', volver: 'Go to the chamber' },
  },
});
