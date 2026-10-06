import { area } from '..';

/**
 * Portada (hemiciclo). El lema, el subtítulo y la etiqueta de las elecciones vienen de comun.ts
 * (marca.lema, marca.subtitulo, elecciones.texto/etiqueta/mini).
 */
const es = {
  /** Texto de presentación en pantallas anchas. */
  leadLargo:
    'Si trabajan para la ciudadanía, la ciudadanía tiene derecho a conocerlos bien. Aquí están los 350 diputados de la XV Legislatura: quiénes son, qué han estudiado, a qué se han dedicado, lo que cobran, lo que ellos mismos declaran tener y cómo votan. Solo datos oficiales, sin interpretaciones, cada uno con un enlace a su documento original. Para que juzgues con criterio.',
  /** Móvil: texto corto para que el hemiciclo se vea entero nada más entrar. */
  leadCorto: 'Quiénes son los 350 diputados, qué cobran, qué declaran tener y cómo votan. Solo datos oficiales.',
};

export default area(es, {
  ca: {
    leadLargo:
      'Si treballen per a la ciutadania, la ciutadania té dret a conèixer-los bé. Aquí tens els 350 diputats de la XV legislatura: qui són, què han estudiat, a què s’han dedicat, què cobren, què declaren tenir ells mateixos i com voten. Només dades oficials, sense interpretacions, cadascuna amb un enllaç al document original. Perquè jutgis amb criteri.',
    leadCorto: 'Qui són els 350 diputats, què cobren, què declaren tenir i com voten. Només dades oficials.',
  },
  eu: {
    leadLargo:
      'Herritarrentzat lan egiten badute, herritarrek eskubidea dute haiek ondo ezagutzeko. Hemen dituzu XV. legegintzaldiko 350 diputatuak: nor diren, zer ikasi duten, zertan aritu diren, zenbat kobratzen duten, zer dutela aitortzen duten eurek eta nola bozkatzen duten. Datu ofizialak soilik, interpretaziorik gabe, bakoitza bere jatorrizko dokumentuaren estekarekin. Irizpide onez epai dezazun.',
    leadCorto: 'Nor diren 350 diputatuak, zenbat kobratzen duten, zer dutela aitortzen duten eta nola bozkatzen duten. Datu ofizialak soilik.',
  },
  gl: {
    leadLargo:
      'Se traballan para a cidadanía, a cidadanía ten dereito a coñecelos ben. Aquí están os 350 deputados da XV Lexislatura: quen son, que estudaron, a que se dedicaron, canto cobran, que declaran ter eles mesmos e como votan. Só datos oficiais, sen interpretacións, cada un cunha ligazón ao seu documento orixinal. Para que xulgues con criterio.',
    leadCorto: 'Quen son os 350 deputados, canto cobran, que declaran ter e como votan. Só datos oficiais.',
  },
  en: {
    leadLargo:
      'If they work for the public, the public has the right to know them well. Here are the 350 deputies of the 15th term (XV Legislatura): who they are, what they studied, what they have worked as, what they are paid, what they themselves declare they own and how they vote. Only official data, with no interpretation, each with a link to its original document. So you can make up your own mind.',
    leadCorto: 'Who the 350 deputies are, what they are paid, what they declare they own and how they vote. Only official data.',
  },
});
