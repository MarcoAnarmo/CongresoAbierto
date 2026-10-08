import { area } from '..';

/**
 * Página de cada circunscripción (/provincia/<id>): pensada para quien busca «diputados de Sevilla».
 * Los nombres de las circunscripciones, grupos y diputados son datos oficiales y no se traducen.
 */
const es = {
  titulo: 'Diputados por {provincia}',
  tituloSeo: 'Diputados por {provincia}: quiénes son, qué declaran y cómo votan',
  descripcion: '{diputados} elegidos por {provincia}: de qué grupo son, cuántas propiedades y viviendas declaran y cómo votan en el Congreso. Datos oficiales.',
  lead: 'Quiénes representan a {provincia} en el Congreso, qué declaran y cómo votan. Toca un nombre para ver su ficha.',
  cifras: { diputados: 'Diputados', propiedades: 'Propiedades declaradas', viviendas: 'Viviendas declaradas' },
  sinDeclaracionN: ['{n} sin declaración de bienes publicada', '{n} sin declaración de bienes publicada'],
  porGrupo: 'Por grupo',
  lista: 'Sus diputados',
  sinDeclaracion: 'Sin declaración de bienes publicada',
  otras: 'Otras provincias',
  compartir: 'Compartir la tarjeta de {provincia}',
  tituloTarjeta: 'Diputados por {provincia}',
};

export default area(es, {
  ca: {
    titulo: 'Diputats per {provincia}',
    tituloSeo: 'Diputats per {provincia}: qui són, què declaren i com voten',
    descripcion: '{diputados} elegits per {provincia}: de quin grup són, quantes propietats i habitatges declaren i com voten al Congrés. Dades oficials.',
    lead: 'Qui representa {provincia} al Congrés, què declaren i com voten. Toca un nom per veure’n la fitxa.',
    cifras: { diputados: 'Diputats', propiedades: 'Propietats declarades', viviendas: 'Habitatges declarats' },
    sinDeclaracionN: ['{n} sense declaració de béns publicada', '{n} sense declaració de béns publicada'],
    porGrupo: 'Per grup',
    lista: 'Els seus diputats',
    sinDeclaracion: 'Sense declaració de béns publicada',
    otras: 'Altres províncies',
    compartir: 'Compartir la targeta de {provincia}',
    tituloTarjeta: 'Diputats per {provincia}',
  },
  eu: {
    titulo: 'Diputatuak: {provincia}',
    tituloSeo: 'Diputatuak: {provincia}. Nor diren, zer aitortzen duten eta nola bozkatzen duten',
    descripcion: '{provincia}: hautatutako {diputados}. Zein taldetakoak diren, zenbat jabetza eta etxebizitza aitortzen dituzten eta nola bozkatzen duten Kongresuan. Datu ofizialak.',
    lead: 'Nork ordezkatzen duen {provincia} Kongresuan, zer aitortzen duten eta nola bozkatzen duten. Sakatu izen bat haren fitxa ikusteko.',
    cifras: { diputados: 'Diputatuak', propiedades: 'Aitortutako jabetzak', viviendas: 'Aitortutako etxebizitzak' },
    sinDeclaracionN: ['{n} ondasunen aitorpenik argitaratu gabe', '{n} ondasunen aitorpenik argitaratu gabe'],
    porGrupo: 'Talde bakoitzeko',
    lista: 'Bere diputatuak',
    sinDeclaracion: 'Ondasunen aitorpenik argitaratu gabe',
    otras: 'Beste probintzia batzuk',
    compartir: 'Partekatu txartela: {provincia}',
    tituloTarjeta: 'Diputatuak: {provincia}',
  },
  gl: {
    titulo: 'Deputados por {provincia}',
    tituloSeo: 'Deputados por {provincia}: quen son, que declaran e como votan',
    descripcion: '{diputados} elixidos por {provincia}: de que grupo son, cantas propiedades e vivendas declaran e como votan no Congreso. Datos oficiais.',
    lead: 'Quen representa a {provincia} no Congreso, que declaran e como votan. Toca un nome para ver a súa ficha.',
    cifras: { diputados: 'Deputados', propiedades: 'Propiedades declaradas', viviendas: 'Vivendas declaradas' },
    sinDeclaracionN: ['{n} sen declaración de bens publicada', '{n} sen declaración de bens publicada'],
    porGrupo: 'Por grupo',
    lista: 'Os seus deputados',
    sinDeclaracion: 'Sen declaración de bens publicada',
    otras: 'Outras provincias',
    compartir: 'Compartir a tarxeta de {provincia}',
    tituloTarjeta: 'Deputados por {provincia}',
  },
  en: {
    titulo: 'Deputies for {provincia}',
    tituloSeo: 'Deputies for {provincia}: who they are, what they declare and how they vote',
    descripcion: '{diputados} elected for {provincia}: their parliamentary group, the properties and homes they declare and how they vote in Congress. Official data.',
    lead: 'Who represents {provincia} in Congress, what they declare and how they vote. Tap a name to see their profile.',
    cifras: { diputados: 'Deputies', propiedades: 'Declared properties', viviendas: 'Declared homes' },
    sinDeclaracionN: ['{n} without a published asset declaration', '{n} without a published asset declaration'],
    porGrupo: 'By group',
    lista: 'Their deputies',
    sinDeclaracion: 'No asset declaration published',
    otras: 'Other provinces',
    compartir: 'Share the card for {provincia}',
    tituloTarjeta: 'Deputies for {provincia}',
  },
});
