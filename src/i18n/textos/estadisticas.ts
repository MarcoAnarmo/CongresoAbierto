import { area } from '..';

/** Página Estadísticas (src/lib/estadisticas.ts). Siempre totales, nunca medias. */
const es = {
  "pestanas": {"aria": "Apartados de las estadísticas", "votos": "Votos", "perfil": "Perfil", "dinero": "Dinero", "empresas": "Empresas"},
  "cifras": {"votaciones": "votaciones del Pleno analizadas", "mujeres": "mujeres entre los 350 diputados", "distintos": "diputados votaron alguna vez distinto de su grupo", "alquiler": "diputados declaran rentas de alquileres"},
  "verCifras": "Pulsa una fila para ver todas sus cifras.",
  "matriz": "Porcentaje de votaciones en que coincidieron los dos grupos (fila y columna).",
  "titulo": "Estadísticas",
  "tituloSeo": "Estadísticas de los diputados: cómo vota cada grupo, qué estudiaron y qué declaran",
  "descripcion": "Cómo vota cada grupo por tema, con quién coincide, qué estudiaron los diputados, sus rentas declaradas y quién cobra alquileres. Cifras totales con datos oficiales.",
  "lead": "Cifras de los 350 diputados de la XV Legislatura con datos oficiales del Congreso. Siempre totales, nunca medias.",
  "fuente": "Cómo se calcula",
  "descargar": "Descargar estos datos",
  "votoTema": {
    "titulo": "Cómo vota cada grupo, por tema",
    "intro": "En cuántas votaciones de cada tema votó cada grupo, mayoritariamente, sí, no o abstención.",
    "elige": "Tema",
    "votaciones": [
      "{n} votación",
      "{n} votaciones"
    ],
    "empate": "Empate",
    "nota": "Cada votación cuenta igual: leyes, enmiendas, mociones y proposiciones de cualquier grupo, así que votar «no» puede ser rechazar la propuesta de otro. Los temas los asigna Congreso Abierto por palabras del título oficial. El Grupo Mixto reúne partidos distintos.",
    "ver": "Ver estas votaciones"
  },
  "coincidencia": {
    "titulo": "Con quién vota igual cada grupo",
    "intro": "En cuántas votaciones dos grupos tuvieron el mismo voto mayoritario.",
    "elige": "Grupo",
    "fila": "{iguales} de {ambos}",
    "nota": "Solo cuentan las votaciones en las que los dos grupos tuvieron un voto mayoritario claro (sin empate)."
  },
  "distintos": {
    "titulo": "Quién vota más veces distinto de su grupo",
    "intro": "Diputados que más veces votaron sí, no o abstención distinto de la mayoría de su grupo ese día.",
    "veces": [
      "{n} vez",
      "{n} veces"
    ],
    "nota": "Sin el Grupo Mixto, que reúne partidos distintos, ni los empates."
  },
  "formacion": {
    "titulo": "Qué y dónde estudiaron",
    "intro": "Según la formación que consta en la ficha oficial de cada diputado.",
    "tipoTitulo": "Tipo de universidad",
    "tipos": {
      "publica": "Solo pública",
      "privada": "Solo privada",
      "ambas": "Pública y privada",
      "sin-centro": "Sin universidad española en la ficha",
      "sin-datos": "No consta formación en su ficha oficial"
    },
    "univTitulo": "Universidades más frecuentes",
    "univNota": "Universidades del registro oficial (RUCT) nombradas en la ficha; cada persona cuenta una vez por universidad.",
    "areaTitulo": "Área de estudios",
    "areaNota": "Clasificación propia por palabras del texto oficial; una persona cuenta en cada área que aparece en su ficha.",
    "areas": {
      "derecho": "Derecho",
      "economia": "Economía y empresa",
      "politicas": "Ciencias políticas",
      "sociales": "Sociología y ciencias sociales",
      "comunicacion": "Periodismo y comunicación",
      "humanidades": "Humanidades",
      "educacion": "Educación",
      "ingenieria": "Ingeniería y arquitectura",
      "ciencias": "Ciencias",
      "salud": "Salud y psicología"
    }
  },
  "rentas": {
    "titulo": "Rentas declaradas, por tramos",
    "intro": "Rentas del año anterior a su declaración de bienes, sin el sueldo del Congreso (que no se declara). Diputados en cada tramo.",
    "ninguna": "Ninguna",
    "menos": "Menos de {a}",
    "entre": "De {a} a {b}",
    "mas": "{a} o más",
    "alMenos": [
      "{n} declaración tiene algún importe ilegible: cuenta en el tramo de su mínimo.",
      "{n} declaraciones tienen algún importe ilegible: cuentan en el tramo de su mínimo."
    ],
    "sinDecl": [
      "{n} diputado sin declaración publicada.",
      "{n} diputados sin declaración publicada."
    ]
  },
  "alquiler": {
    "titulo": "Quién declara rentas de alquileres",
    "intro": [
      "{n} diputado declara rentas por alquilar inmuebles.",
      "{n} diputados declaran rentas por alquilar inmuebles."
    ],
    "porGrupo": "Por grupo",
    "verLista": "Ver quiénes son",
    "nota": "Conceptos de renta que mencionan alquiler, arrendamiento o rendimientos del capital inmobiliario, tal como los escribe cada diputado (viviendas, locales, plazas de garaje…). No cuenta dividendos ni intereses."
  },
  "deGrupo": "{n} de {de}",
  "rentasGrupo": {
    "titulo": "Quién declara rentas, por grupo",
    "intro": "Diputados de cada grupo que declaran alguna renta del año anterior (sin el sueldo del Congreso), de los que tienen declaración publicada.",
    "con": "Declaran rentas",
    "sin": "No declaran ninguna",
    "nota": "Cuenta quien declara alguna renta mayor que cero o algún importe ilegible. Solo los diputados con declaración de bienes publicada."
  },
  "masRentas": {
    "titulo": "Las rentas más altas declaradas",
    "intro": "Total de rentas del año anterior a su declaración de bienes, sin el sueldo del Congreso.",
    "alMenos": "al menos {x}",
    "nota": "Suma de los importes de la tabla de rentas tal como los escribe cada diputado: trabajo, dividendos, intereses, alquileres y otras. Si algún importe es ilegible, la cifra es un mínimo («al menos»)."
  },
  "tiposRenta": {
    "titulo": "Qué tipo de rentas declaran",
    "intro": "Diputados que declaran alguna renta de cada tipo. Una persona cuenta en cada tipo que declara.",
    "tipos": {
      "salariales": "Trabajo (salarios)",
      "dividendos": "Dividendos",
      "intereses": "Intereses",
      "otras": "Otras rentas (alquileres, actividades…)"
    }
  },
  "inversiones": {
    "titulo": "Acciones y fondos de inversión",
    "intro": "Diputados que declaran acciones o participaciones y fondos de inversión, según cómo describe cada uno lo que tiene.",
    "acciones": [
      "{n} diputado declara acciones o participaciones",
      "{n} diputados declaran acciones o participaciones"
    ],
    "fondos": [
      "{n} diputado declara fondos de inversión",
      "{n} diputados declaran fondos de inversión"
    ],
    "euros": "{x} en total",
    "porGrupoAcciones": "Acciones o participaciones, por grupo",
    "porGrupoFondos": "Fondos de inversión, por grupo",
    "nota": "Tabla oficial «Deuda pública, obligaciones, acciones y participaciones» de la declaración de bienes. Se clasifica por las palabras de cada fila: si menciona acciones y fondos, cuenta en los dos; los planes de pensiones no cuentan como fondos; si no lo dice (por ejemplo, solo «TELEFONICA»), no se clasifica. Los euros son los importes legibles."
  },
  "masValores": {
    "titulo": "Quién declara más en acciones, fondos y otros valores",
    "intro": "Valor total de la tabla «Deuda pública, obligaciones, acciones y participaciones» de su declaración de bienes.",
    "nota": "Suma de los importes de esa tabla tal como los escribe cada diputado (incluye deuda pública y otros valores). Si algún importe es ilegible, la cifra es un mínimo («al menos»)."
  },
  "accionesDe": {
    "titulo": "De qué empresas declaran acciones más diputados",
    "intro": "Empresas cuyas acciones o participaciones nombran más diputados en su declaración de bienes.",
    "nota": "Solo cuentan las empresas que el diputado nombra; quien escribe solo «acciones» no se cuenta. Cada diputado cuenta una vez por empresa."
  },
  "empRelacion": {
    "titulo": "Qué relación tienen con empresas privadas",
    "intro": "Diputados que nombran empresas privadas en sus documentos oficiales, por tipo de relación. Una persona cuenta en cada tipo que tiene.",
    "cifra": [
      "{n} diputado nombra alguna empresa privada en sus documentos",
      "{n} diputados nombran alguna empresa privada en sus documentos"
    ],
    "nota": "Participar no es ser dueño ni cobrar: tener acciones, haber trabajado en una empresa o tener una actividad autorizada son relaciones distintas. El tipo sale de la sección del documento o del artículo de la ley que cita el acuerdo del Congreso."
  },
  "empGrupo": {
    "titulo": "Quién nombra empresas privadas, por grupo",
    "intro": "Diputados de cada grupo que nombran alguna empresa privada en sus documentos oficiales, con cualquier relación.",
    "con": "Nombran alguna",
    "sin": "Ninguna"
  },
  "remuneracion": {
    "titulo": "Qué dicen sus documentos sobre si cobran",
    "intro": "Diputados con alguna relación con empresas o entidades (cargos, actividades, trabajos) en cada caso. Una persona cuenta en cada caso que aparece en sus documentos.",
    "lista": "Quiénes tienen alguna relación con remuneración, según el documento",
    "nota": "Solo cuenta lo que dice el texto del documento: cuando no lo dice, no cuenta como que cobra ni como que no. Algunos acuerdos hablan de cobros que ya terminaron; el texto literal está en la ficha de cada diputado. El sueldo del Congreso no se cuenta aquí."
  },
  "masEmpresas": {
    "titulo": "Quién nombra más empresas",
    "intro": "Empresas privadas distintas que nombran los documentos oficiales de cada diputado, con cualquier relación (acciones, trabajos anteriores, actividades…).",
    "empresas": [
      "{n} empresa",
      "{n} empresas"
    ]
  },
  "borme": {
    "titulo": "Cargos en sociedades según el Registro Mercantil, por grupo",
    "intro": "Diputados con algún acto inscrito en el BORME desde 2009 (nombramientos, ceses…) confirmado por otro documento oficial.",
    "con": "Con cargos en el BORME",
    "sin": "Sin cargos confirmados",
    "nota": "El BORME no publica el DNI: solo cuentan las coincidencias de nombre confirmadas por otro documento oficial. El BORME tampoco dice si el cargo sigue vigente."
  },
  "ong": {
    "titulo": "Aportaciones a fundaciones, ONG y asociaciones",
    "intro": "Diputados que declaran cuotas o donativos a fundaciones, ONG y asociaciones en su declaración de intereses económicos.",
    "cifra": [
      "{n} diputado declara aportaciones a fundaciones, ONG o asociaciones",
      "{n} diputados declaran aportaciones a fundaciones, ONG o asociaciones"
    ],
    "porGrupo": "Por grupo",
    "mas": "A cuáles aportan más diputados",
    "cargos": [
      "Además, {n} diputado tiene un cargo o una actividad en alguna fundación o asociación.",
      "Además, {n} diputados tienen un cargo o una actividad en alguna fundación o asociación."
    ],
    "nota": "Una aportación no es un cargo ni una participación en la entidad. No se cuentan las cuotas al propio partido. Cada diputado cuenta una vez por entidad."
  },
  "perfil": {
    "titulo": "Mujeres y hombres en cada grupo",
    "mujeres": "Mujeres",
    "hombres": "Hombres",
    "nacTitulo": "Año de nacimiento",
    "nacIntro": "Diputados por década de nacimiento, según su ficha oficial."
  }
};

export default area(es, {
  ca: {
    "pestanas": {"aria": "Apartats de les estadístiques", "votos": "Vots", "perfil": "Perfil", "dinero": "Diners", "empresas": "Empreses"},
    "cifras": {"votaciones": "votacions del Ple analitzades", "mujeres": "dones entre els 350 diputats", "distintos": "diputats han votat alguna vegada diferent del seu grup", "alquiler": "diputats declaren rendes de lloguers"},
    "verCifras": "Prem una fila per veure’n totes les xifres.",
    "matriz": "Percentatge de votacions en què els dos grups (fila i columna) van coincidir.",
    "titulo": "Estadístiques",
    "tituloSeo": "Estadístiques dels diputats: com vota cada grup, què van estudiar i què declaren",
    "descripcion": "Com vota cada grup per tema, amb qui coincideix, què van estudiar els diputats, les seves rendes declarades i qui cobra lloguers. Xifres totals amb dades oficials.",
    "lead": "Xifres dels 350 diputats de la XV Legislatura amb dades oficials del Congrés. Sempre totals, mai mitjanes.",
    "fuente": "Com es calcula",
    "descargar": "Descarregar aquestes dades",
    "votoTema": {
      "titulo": "Com vota cada grup, per tema",
      "intro": "En quantes votacions de cada tema cada grup va votar, majoritàriament, sí, no o abstenció.",
      "elige": "Tema",
      "votaciones": [
        "{n} votació",
        "{n} votacions"
      ],
      "empate": "Empat",
      "nota": "Cada votació compta igual: lleis, esmenes, mocions i proposicions de qualsevol grup, així que votar «no» pot ser rebutjar la proposta d’un altre. Els temes els assigna Congreso Abierto per paraules del títol oficial. El Grup Mixt reuneix partits diferents.",
      "ver": "Veure aquestes votacions"
    },
    "coincidencia": {
      "titulo": "Amb qui vota igual cada grup",
      "intro": "En quantes votacions dos grups van tenir el mateix vot majoritari.",
      "elige": "Grup",
      "fila": "{iguales} de {ambos}",
      "nota": "Només compten les votacions en què els dos grups van tenir un vot majoritari clar (sense empat)."
    },
    "distintos": {
      "titulo": "Qui vota més vegades diferent del seu grup",
      "intro": "Diputats que més vegades van votar sí, no o abstenció diferent de la majoria del seu grup aquell dia.",
      "veces": [
        "{n} vegada",
        "{n} vegades"
      ],
      "nota": "Sense el Grup Mixt, que reuneix partits diferents, ni els empats."
    },
    "formacion": {
      "titulo": "Què i on van estudiar",
      "intro": "Segons la formació que consta a la fitxa oficial de cada diputat.",
      "tipoTitulo": "Tipus d’universitat",
      "tipos": {
        "publica": "Només pública",
        "privada": "Només privada",
        "ambas": "Pública i privada",
        "sin-centro": "Sense universitat espanyola a la fitxa",
        "sin-datos": "No consta formació a la seva fitxa oficial"
      },
      "univTitulo": "Universitats més freqüents",
      "univNota": "Universitats del registre oficial (RUCT) esmentades a la fitxa; cada persona compta un cop per universitat.",
      "areaTitulo": "Àrea d’estudis",
      "areaNota": "Classificació pròpia per paraules del text oficial; una persona compta a cada àrea que apareix a la seva fitxa.",
      "areas": {
        "derecho": "Dret",
        "economia": "Economia i empresa",
        "politicas": "Ciències polítiques",
        "sociales": "Sociologia i ciències socials",
        "comunicacion": "Periodisme i comunicació",
        "humanidades": "Humanitats",
        "educacion": "Educació",
        "ingenieria": "Enginyeria i arquitectura",
        "ciencias": "Ciències",
        "salud": "Salut i psicologia"
      }
    },
    "rentas": {
      "titulo": "Rendes declarades, per trams",
      "intro": "Rendes de l’any anterior a la seva declaració de béns, sense el sou del Congrés (que no es declara). Diputats a cada tram.",
      "ninguna": "Cap",
      "menos": "Menys de {a}",
      "entre": "De {a} a {b}",
      "mas": "{a} o més",
      "alMenos": [
        "{n} declaració té algun import il·legible: compta al tram del seu mínim.",
        "{n} declaracions tenen algun import il·legible: compten al tram del seu mínim."
      ],
      "sinDecl": [
        "{n} diputat sense declaració publicada.",
        "{n} diputats sense declaració publicada."
      ]
    },
    "alquiler": {
      "titulo": "Qui declara rendes de lloguers",
      "intro": [
        "{n} diputat declara rendes per llogar immobles.",
        "{n} diputats declaren rendes per llogar immobles."
      ],
      "porGrupo": "Per grup",
      "verLista": "Veure qui són",
      "nota": "Conceptes de renda que esmenten lloguer, arrendament o rendiments del capital immobiliari, tal com els escriu cada diputat (habitatges, locals, places de garatge…). No compta dividends ni interessos."
    },
    "deGrupo": "{n} de {de}",
    "rentasGrupo": {
      "titulo": "Qui declara rendes, per grup",
      "intro": "Diputats de cada grup que declaren alguna renda de l’any anterior (sense el sou del Congrés), dels que tenen la declaració publicada.",
      "con": "Declaren rendes",
      "sin": "No en declaren cap",
      "nota": "Compta qui declara alguna renda superior a zero o algun import il·legible. Només els diputats amb la declaració de béns publicada."
    },
    "masRentas": {
      "titulo": "Les rendes més altes declarades",
      "intro": "Total de rendes de l’any anterior a la declaració de béns, sense el sou del Congrés.",
      "alMenos": "almenys {x}",
      "nota": "Suma dels imports de la taula de rendes tal com els escriu cada diputat: treball, dividends, interessos, lloguers i altres. Si algun import és il·legible, la xifra és un mínim («almenys»)."
    },
    "tiposRenta": {
      "titulo": "Quin tipus de rendes declaren",
      "intro": "Diputats que declaren alguna renda de cada tipus. Una persona compta en cada tipus que declara.",
      "tipos": {
        "salariales": "Treball (salaris)",
        "dividendos": "Dividends",
        "intereses": "Interessos",
        "otras": "Altres rendes (lloguers, activitats…)"
      }
    },
    "inversiones": {
      "titulo": "Accions i fons d’inversió",
      "intro": "Diputats que declaren accions o participacions i fons d’inversió, segons com descriu cadascú el que té.",
      "acciones": [
        "{n} diputat declara accions o participacions",
        "{n} diputats declaren accions o participacions"
      ],
      "fondos": [
        "{n} diputat declara fons d’inversió",
        "{n} diputats declaren fons d’inversió"
      ],
      "euros": "{x} en total",
      "porGrupoAcciones": "Accions o participacions, per grup",
      "porGrupoFondos": "Fons d’inversió, per grup",
      "nota": "Taula oficial «Deute públic, obligacions, accions i participacions» de la declaració de béns. Es classifica per les paraules de cada fila: si esmenta accions i fons, compta en tots dos; els plans de pensions no compten com a fons; si no ho diu (per exemple, només «TELEFONICA»), no es classifica. Els euros són els imports llegibles."
    },
    "masValores": {
      "titulo": "Qui declara més en accions, fons i altres valors",
      "intro": "Valor total de la taula «Deute públic, obligacions, accions i participacions» de la declaració de béns.",
      "nota": "Suma dels imports d’aquesta taula tal com els escriu cada diputat (inclou deute públic i altres valors). Si algun import és il·legible, la xifra és un mínim («almenys»)."
    },
    "accionesDe": {
      "titulo": "De quines empreses declaren accions més diputats",
      "intro": "Empreses de les quals més diputats esmenten accions o participacions a la declaració de béns.",
      "nota": "Només compten les empreses que el diputat esmenta; qui escriu només «accions» no compta. Cada diputat compta una vegada per empresa."
    },
    "empRelacion": {
      "titulo": "Quina relació tenen amb empreses privades",
      "intro": "Diputats que esmenten empreses privades als seus documents oficials, per tipus de relació. Una persona compta en cada tipus que té.",
      "cifra": [
        "{n} diputat esmenta alguna empresa privada als seus documents",
        "{n} diputats esmenten alguna empresa privada als seus documents"
      ],
      "nota": "Participar no és ser-ne propietari ni cobrar: tenir accions, haver treballat en una empresa o tenir una activitat autoritzada són relacions diferents. El tipus surt de la secció del document o de l’article de la llei que cita l’acord del Congrés."
    },
    "empGrupo": {
      "titulo": "Qui esmenta empreses privades, per grup",
      "intro": "Diputats de cada grup que esmenten alguna empresa privada als seus documents oficials, amb qualsevol relació.",
      "con": "N’esmenten alguna",
      "sin": "Cap"
    },
    "remuneracion": {
      "titulo": "Què diuen els seus documents sobre si cobren",
      "intro": "Diputats amb alguna relació amb empreses o entitats (càrrecs, activitats, feines) en cada cas. Una persona compta en cada cas que apareix als seus documents.",
      "lista": "Qui té alguna relació amb remuneració, segons el document",
      "nota": "Només compta el que diu el text del document: quan no ho diu, no compta com que cobra ni com que no. Alguns acords parlen de cobraments que ja han acabat; el text literal és a la fitxa de cada diputat. El sou del Congrés no es compta aquí."
    },
    "masEmpresas": {
      "titulo": "Qui esmenta més empreses",
      "intro": "Empreses privades diferents que esmenten els documents oficials de cada diputat, amb qualsevol relació (accions, feines anteriors, activitats…).",
      "empresas": [
        "{n} empresa",
        "{n} empreses"
      ]
    },
    "borme": {
      "titulo": "Càrrecs en societats segons el Registre Mercantil, per grup",
      "intro": "Diputats amb algun acte inscrit al BORME des del 2009 (nomenaments, cessaments…) confirmat per un altre document oficial.",
      "con": "Amb càrrecs al BORME",
      "sin": "Sense càrrecs confirmats",
      "nota": "El BORME no publica el DNI: només compten les coincidències de nom confirmades per un altre document oficial. El BORME tampoc no diu si el càrrec continua vigent."
    },
    "ong": {
      "titulo": "Aportacions a fundacions, ONG i associacions",
      "intro": "Diputats que declaren quotes o donatius a fundacions, ONG i associacions a la declaració d’interessos econòmics.",
      "cifra": [
        "{n} diputat declara aportacions a fundacions, ONG o associacions",
        "{n} diputats declaren aportacions a fundacions, ONG o associacions"
      ],
      "porGrupo": "Per grup",
      "mas": "A quines aporten més diputats",
      "cargos": [
        "A més, {n} diputat té un càrrec o una activitat en alguna fundació o associació.",
        "A més, {n} diputats tenen un càrrec o una activitat en alguna fundació o associació."
      ],
      "nota": "Una aportació no és un càrrec ni una participació en l’entitat. No es compten les quotes al propi partit. Cada diputat compta una vegada per entitat."
    },
    "perfil": {
      "titulo": "Dones i homes a cada grup",
      "mujeres": "Dones",
      "hombres": "Homes",
      "nacTitulo": "Any de naixement",
      "nacIntro": "Diputats per dècada de naixement, segons la seva fitxa oficial."
    }
  },
  eu: {
    "pestanas": {"aria": "Estatistiken atalak", "votos": "Botoak", "perfil": "Profila", "dinero": "Dirua", "empresas": "Enpresak"},
    "cifras": {"votaciones": "Osoko Bilkurako bozketa aztertuta", "mujeres": "emakume 350 diputatuen artean", "distintos": "diputatuk bozkatu dute noizbait taldetik desberdin", "alquiler": "diputatuk alokairuetatik errentak aitortzen dituzte"},
    "verCifras": "Sakatu errenkada bat zifrak ikusteko.",
    "matriz": "Bi taldeek (errenkada eta zutabea) bat egin zuten bozketen ehunekoa.",
    "titulo": "Estatistikak",
    "tituloSeo": "Diputatuen estatistikak: talde bakoitzak nola bozkatzen duen, zer ikasi zuten eta zer aitortzen duten",
    "descripcion": "Talde bakoitzak gai bakoitzean nola bozkatzen duen, norekin bat egiten duen, diputatuek zer ikasi zuten, aitortutako errentak eta nork kobratzen dituen alokairuak. Guztizko zifrak, datu ofizialekin.",
    "lead": "XV. legegintzaldiko 350 diputatuen zifrak, Kongresuaren datu ofizialekin. Beti guztizkoak, inoiz ez batez bestekoak.",
    "fuente": "Nola kalkulatzen den",
    "descargar": "Deskargatu datu hauek",
    "votoTema": {
      "titulo": "Talde bakoitzak nola bozkatzen duen, gaiaren arabera",
      "intro": "Gai bakoitzeko zenbat bozketatan bozkatu zuen talde bakoitzak, gehienbat, bai, ez edo abstentzioa.",
      "elige": "Gaia",
      "votaciones": [
        "bozketa {n}",
        "{n} bozketa"
      ],
      "empate": "Berdinketa",
      "nota": "Bozketa guztiek berdin balio dute: edozein taldetako legeak, zuzenketak, mozioak eta proposamenak; beraz, «ez» bozkatzea beste baten proposamena baztertzea izan daiteke. Gaiak Congreso Abiertok esleitzen ditu izenburu ofizialeko hitzen arabera. Talde Mistoak alderdi desberdinak biltzen ditu.",
      "ver": "Ikusi bozketa hauek"
    },
    "coincidencia": {
      "titulo": "Talde bakoitzak norekin bozkatzen duen berdin",
      "intro": "Zenbat bozketatan izan zuten bi taldek gehiengoaren boto bera.",
      "elige": "Taldea",
      "fila": "{iguales} / {ambos}",
      "nota": "Bi taldeek gehiengoaren boto argia (berdinketarik gabe) izan zuten bozketak soilik zenbatzen dira."
    },
    "distintos": {
      "titulo": "Nork bozkatzen duen gehien taldetik desberdin",
      "intro": "Egun hartan bere taldeko gehiengotik desberdin bai, ez edo abstentzioa gehien bozkatu zuten diputatuak.",
      "veces": [
        "{n} aldiz",
        "{n} aldiz"
      ],
      "nota": "Talde Mistoa (alderdi desberdinak biltzen ditu) eta berdinketak kanpo."
    },
    "formacion": {
      "titulo": "Zer eta non ikasi zuten",
      "intro": "Diputatu bakoitzaren fitxa ofizialean agertzen den prestakuntzaren arabera.",
      "tipoTitulo": "Unibertsitate mota",
      "tipos": {
        "publica": "Publikoa soilik",
        "privada": "Pribatua soilik",
        "ambas": "Publikoa eta pribatua",
        "sin-centro": "Espainiako unibertsitaterik gabe fitxan",
        "sin-datos": "Ez dago prestakuntzarik bere fitxa ofizialean"
      },
      "univTitulo": "Unibertsitate ohikoenak",
      "univNota": "Erregistro ofizialeko (RUCT) unibertsitateak, fitxan aipatuak; pertsona bakoitza behin zenbatzen da unibertsitate bakoitzeko.",
      "areaTitulo": "Ikasketa-arloa",
      "areaNota": "Testu ofizialeko hitzen araberako sailkapen propioa; pertsona bat bere fitxan agertzen den arlo bakoitzean zenbatzen da.",
      "areas": {
        "derecho": "Zuzenbidea",
        "economia": "Ekonomia eta enpresa",
        "politicas": "Zientzia politikoak",
        "sociales": "Soziologia eta gizarte-zientziak",
        "comunicacion": "Kazetaritza eta komunikazioa",
        "humanidades": "Giza zientziak",
        "educacion": "Hezkuntza",
        "ingenieria": "Ingeniaritza eta arkitektura",
        "ciencias": "Zientziak",
        "salud": "Osasuna eta psikologia"
      }
    },
    "rentas": {
      "titulo": "Aitortutako errentak, tarteen arabera",
      "intro": "Ondasun-aitorpenaren aurreko urteko errentak, Kongresuko soldata kanpo (ez da aitortzen). Diputatuak tarte bakoitzean.",
      "ninguna": "Bat ere ez",
      "menos": "{a} baino gutxiago",
      "entre": "{a} - {b}",
      "mas": "{a} edo gehiago",
      "alMenos": [
        "Aitorpen batek zenbateko irakurtezinen bat du: bere gutxienekoaren tartean zenbatzen da.",
        "{n} aitorpenek zenbateko irakurtezinen bat dute: beren gutxienekoaren tartean zenbatzen dira."
      ],
      "sinDecl": [
        "diputatu {n} aitorpen argitaraturik gabe.",
        "{n} diputatu aitorpen argitaraturik gabe."
      ]
    },
    "alquiler": {
      "titulo": "Nork aitortzen dituen alokairuetako errentak",
      "intro": [
        "Diputatu batek higiezinak alokatzeagatiko errentak aitortzen ditu.",
        "{n} diputatuk higiezinak alokatzeagatiko errentak aitortzen dituzte."
      ],
      "porGrupo": "Talde bakoitzeko",
      "verLista": "Ikusi nortzuk diren",
      "nota": "Alokairua, errentamendua edo higiezinen kapitalaren etekinak aipatzen dituzten errenta-kontzeptuak, diputatu bakoitzak idazten dituen bezala (etxebizitzak, lokalak, garaje-plazak…). Ez dira dibidenduak ezta interesak zenbatzen."
    },
    "deGrupo": "{n} / {de}",
    "rentasGrupo": {
      "titulo": "Nork aitortzen ditu errentak, taldearen arabera",
      "intro": "Aurreko urteko errentaren bat aitortzen duten talde bakoitzeko diputatuak (Kongresuko soldata kanpo), aitorpena argitaratuta dutenen artean.",
      "con": "Errentak aitortzen dituzte",
      "sin": "Ez dute bat ere aitortzen",
      "nota": "Zero baino errenta handiagoa edo zenbateko irakurtezinen bat aitortzen duena zenbatzen da. Ondasun-aitorpena argitaratuta duten diputatuak bakarrik."
    },
    "masRentas": {
      "titulo": "Aitortutako errentarik handienak",
      "intro": "Ondasun-aitorpenaren aurreko urteko errenten guztizkoa, Kongresuko soldata kanpo.",
      "alMenos": "gutxienez {x}",
      "nota": "Errenten taulako zenbatekoen batura, diputatu bakoitzak idazten dituen bezala: lana, dibidenduak, interesak, alokairuak eta beste batzuk. Zenbatekoren bat irakurtezina bada, zifra gutxienekoa da («gutxienez»)."
    },
    "tiposRenta": {
      "titulo": "Zer errenta mota aitortzen dituzten",
      "intro": "Mota bakoitzeko errentaren bat aitortzen duten diputatuak. Pertsona bat aitortzen duen mota bakoitzean zenbatzen da.",
      "tipos": {
        "salariales": "Lana (soldatak)",
        "dividendos": "Dibidenduak",
        "intereses": "Interesak",
        "otras": "Beste errenta batzuk (alokairuak, jarduerak…)"
      }
    },
    "inversiones": {
      "titulo": "Akzioak eta inbertsio-funtsak",
      "intro": "Akzioak edo partaidetzak eta inbertsio-funtsak aitortzen dituzten diputatuak, bakoitzak duena deskribatzen duen moduaren arabera.",
      "acciones": [
        "Diputatu batek akzioak edo partaidetzak aitortzen ditu",
        "{n} diputatuk akzioak edo partaidetzak aitortzen dituzte"
      ],
      "fondos": [
        "Diputatu batek inbertsio-funtsak aitortzen ditu",
        "{n} diputatuk inbertsio-funtsak aitortzen dituzte"
      ],
      "euros": "{x} guztira",
      "porGrupoAcciones": "Akzioak edo partaidetzak, taldearen arabera",
      "porGrupoFondos": "Inbertsio-funtsak, taldearen arabera",
      "nota": "Ondasun-aitorpeneko «Zor publikoa, obligazioak, akzioak eta partaidetzak» taula ofiziala. Errenkada bakoitzeko hitzen arabera sailkatzen da: akzioak eta funtsak aipatzen baditu, bietan zenbatzen da; pentsio-planak ez dira funtsak; ez badu esaten (adibidez, «TELEFONICA» bakarrik), ez da sailkatzen. Euroak zenbateko irakurgarriak dira."
    },
    "masValores": {
      "titulo": "Nork aitortzen du gehien akzioetan, funtsetan eta beste baloreetan",
      "intro": "Ondasun-aitorpeneko «Zor publikoa, obligazioak, akzioak eta partaidetzak» taularen balio osoa.",
      "nota": "Taula horretako zenbatekoen batura, diputatu bakoitzak idazten dituen bezala (zor publikoa eta beste balore batzuk barne). Zenbatekoren bat irakurtezina bada, zifra gutxienekoa da («gutxienez»)."
    },
    "accionesDe": {
      "titulo": "Zein enpresatako akzioak aitortzen dituzten diputatu gehienek",
      "intro": "Diputatu gehienek ondasun-aitorpenean akzioak edo partaidetzak aipatzen dituzten enpresak.",
      "nota": "Diputatuak aipatzen dituen enpresak bakarrik zenbatzen dira; «akzioak» bakarrik idazten duena ez da zenbatzen. Diputatu bakoitza behin zenbatzen da enpresa bakoitzeko."
    },
    "empRelacion": {
      "titulo": "Zer harreman duten enpresa pribatuekin",
      "intro": "Beren dokumentu ofizialetan enpresa pribatuak aipatzen dituzten diputatuak, harreman motaren arabera. Pertsona bat duen mota bakoitzean zenbatzen da.",
      "cifra": [
        "Diputatu batek enpresa pribaturen bat aipatzen du bere dokumentuetan",
        "{n} diputatuk enpresa pribaturen bat aipatzen dute beren dokumentuetan"
      ],
      "nota": "Parte hartzea ez da jabea izatea, ezta kobratzea ere: akzioak izatea, enpresa batean lan egin izana edo baimendutako jarduera bat izatea harreman desberdinak dira. Mota dokumentuaren ataletik edo Kongresuaren erabakiak aipatzen duen legearen artikulutik dator."
    },
    "empGrupo": {
      "titulo": "Nork aipatzen ditu enpresa pribatuak, taldearen arabera",
      "intro": "Beren dokumentu ofizialetan enpresa pribaturen bat aipatzen duten talde bakoitzeko diputatuak, edozein harremanekin.",
      "con": "Bat edo gehiago aipatzen dute",
      "sin": "Bat ere ez"
    },
    "remuneracion": {
      "titulo": "Zer diote beren dokumentuek kobratzen duten ala ez",
      "intro": "Enpresa edo erakundeekin harremanen bat (karguak, jarduerak, lanak) duten diputatuak kasu bakoitzean. Pertsona bat bere dokumentuetan agertzen den kasu bakoitzean zenbatzen da.",
      "lista": "Ordainsariarekin harremanen bat duten pertsonek, dokumentuaren arabera",
      "nota": "Dokumentuaren testuak dioena bakarrik zenbatzen da: esaten ez duenean, ez da zenbatzen kobratzen duela ez kobratzen ez duela. Erabaki batzuek amaitutako kobrantzak aipatzen dituzte; testu literala diputatu bakoitzaren fitxan dago. Kongresuko soldata ez da hemen zenbatzen."
    },
    "masEmpresas": {
      "titulo": "Nork aipatzen ditu enpresa gehien",
      "intro": "Diputatu bakoitzaren dokumentu ofizialek aipatzen dituzten enpresa pribatu desberdinak, edozein harremanekin (akzioak, aurreko lanak, jarduerak…).",
      "empresas": [
        "enpresa {n}",
        "{n} enpresa"
      ]
    },
    "borme": {
      "titulo": "Sozietateetako karguak Merkataritza Erregistroaren arabera, talde bakoitzeko",
      "intro": "2009az geroztik BORMEn inskribatutako egintzaren bat (izendapenak, kargu-uzteak…) duten diputatuak, beste dokumentu ofizial batek baieztatuta.",
      "con": "BORMEn karguekin",
      "sin": "Baieztatutako kargurik gabe",
      "nota": "BORMEk ez du NANa argitaratzen: beste dokumentu ofizial batek baieztatutako izen-bat-etortzeak bakarrik zenbatzen dira. BORMEk ezta ere kargua oraindik indarrean dagoenik ez du esaten."
    },
    "ong": {
      "titulo": "Fundazio, GKE eta elkarteei egindako ekarpenak",
      "intro": "Interes ekonomikoen aitorpenean fundazio, GKE eta elkarteei kuotak edo dohaintzak aitortzen dizkieten diputatuak.",
      "cifra": [
        "Diputatu batek fundazio, GKE edo elkarteei egindako ekarpenak aitortzen ditu",
        "{n} diputatuk fundazio, GKE edo elkarteei egindako ekarpenak aitortzen dituzte"
      ],
      "porGrupo": "Talde bakoitzeko",
      "mas": "Zeini egiten dioten ekarpena diputatu gehienek",
      "cargos": [
        "Gainera, diputatu batek kargu edo jarduera bat du fundazio edo elkarteren batean.",
        "Gainera, {n} diputatuk kargu edo jarduera bat dute fundazio edo elkarteren batean."
      ],
      "nota": "Ekarpen bat ez da kargu bat ezta erakundean parte hartzea ere. Norberaren alderdiari ordaindutako kuotak ez dira zenbatzen. Diputatu bakoitza behin zenbatzen da erakunde bakoitzeko."
    },
    "perfil": {
      "titulo": "Emakumeak eta gizonak talde bakoitzean",
      "mujeres": "Emakumeak",
      "hombres": "Gizonak",
      "nacTitulo": "Jaiotze-urtea",
      "nacIntro": "Diputatuak jaiotze-hamarkadaren arabera, fitxa ofizialeko datuekin."
    }
  },
  gl: {
    "pestanas": {"aria": "Apartados das estatísticas", "votos": "Votos", "perfil": "Perfil", "dinero": "Diñeiro", "empresas": "Empresas"},
    "cifras": {"votaciones": "votacións do Pleno analizadas", "mujeres": "mulleres entre os 350 deputados", "distintos": "deputados votaron algunha vez distinto do seu grupo", "alquiler": "deputados declaran rendas de alugueiros"},
    "verCifras": "Preme unha fila para ver todas as súas cifras.",
    "matriz": "Porcentaxe de votacións en que coincidiron os dous grupos (fila e columna).",
    "titulo": "Estatísticas",
    "tituloSeo": "Estatísticas dos deputados: como vota cada grupo, que estudaron e que declaran",
    "descripcion": "Como vota cada grupo por tema, con quen coincide, que estudaron os deputados, as súas rendas declaradas e quen cobra alugueres. Cifras totais con datos oficiais.",
    "lead": "Cifras dos 350 deputados da XV Lexislatura con datos oficiais do Congreso. Sempre totais, nunca medias.",
    "fuente": "Como se calcula",
    "descargar": "Descargar estes datos",
    "votoTema": {
      "titulo": "Como vota cada grupo, por tema",
      "intro": "En cantas votacións de cada tema votou cada grupo, maioritariamente, si, non ou abstención.",
      "elige": "Tema",
      "votaciones": [
        "{n} votación",
        "{n} votacións"
      ],
      "empate": "Empate",
      "nota": "Cada votación conta igual: leis, emendas, mocións e proposicións de calquera grupo, así que votar «non» pode ser rexeitar a proposta doutro. Os temas asígnaos Congreso Abierto por palabras do título oficial. O Grupo Mixto reúne partidos distintos.",
      "ver": "Ver estas votacións"
    },
    "coincidencia": {
      "titulo": "Con quen vota igual cada grupo",
      "intro": "En cantas votacións dous grupos tiveron o mesmo voto maioritario.",
      "elige": "Grupo",
      "fila": "{iguales} de {ambos}",
      "nota": "Só contan as votacións nas que os dous grupos tiveron un voto maioritario claro (sen empate)."
    },
    "distintos": {
      "titulo": "Quen vota máis veces distinto do seu grupo",
      "intro": "Deputados que máis veces votaron si, non ou abstención distinto da maioría do seu grupo ese día.",
      "veces": [
        "{n} vez",
        "{n} veces"
      ],
      "nota": "Sen o Grupo Mixto, que reúne partidos distintos, nin os empates."
    },
    "formacion": {
      "titulo": "Que e onde estudaron",
      "intro": "Segundo a formación que consta na ficha oficial de cada deputado.",
      "tipoTitulo": "Tipo de universidade",
      "tipos": {
        "publica": "Só pública",
        "privada": "Só privada",
        "ambas": "Pública e privada",
        "sin-centro": "Sen universidade española na ficha",
        "sin-datos": "Non consta formación na súa ficha oficial"
      },
      "univTitulo": "Universidades máis frecuentes",
      "univNota": "Universidades do rexistro oficial (RUCT) nomeadas na ficha; cada persoa conta unha vez por universidade.",
      "areaTitulo": "Área de estudos",
      "areaNota": "Clasificación propia por palabras do texto oficial; unha persoa conta en cada área que aparece na súa ficha.",
      "areas": {
        "derecho": "Dereito",
        "economia": "Economía e empresa",
        "politicas": "Ciencias políticas",
        "sociales": "Socioloxía e ciencias sociais",
        "comunicacion": "Xornalismo e comunicación",
        "humanidades": "Humanidades",
        "educacion": "Educación",
        "ingenieria": "Enxeñaría e arquitectura",
        "ciencias": "Ciencias",
        "salud": "Saúde e psicoloxía"
      }
    },
    "rentas": {
      "titulo": "Rendas declaradas, por tramos",
      "intro": "Rendas do ano anterior á súa declaración de bens, sen o soldo do Congreso (que non se declara). Deputados en cada tramo.",
      "ninguna": "Ningunha",
      "menos": "Menos de {a}",
      "entre": "De {a} a {b}",
      "mas": "{a} ou máis",
      "alMenos": [
        "{n} declaración ten algún importe ilexible: conta no tramo do seu mínimo.",
        "{n} declaracións teñen algún importe ilexible: contan no tramo do seu mínimo."
      ],
      "sinDecl": [
        "{n} deputado sen declaración publicada.",
        "{n} deputados sen declaración publicada."
      ]
    },
    "alquiler": {
      "titulo": "Quen declara rendas de alugueres",
      "intro": [
        "{n} deputado declara rendas por alugar inmobles.",
        "{n} deputados declaran rendas por alugar inmobles."
      ],
      "porGrupo": "Por grupo",
      "verLista": "Ver quen son",
      "nota": "Conceptos de renda que mencionan aluguer, arrendamento ou rendementos do capital inmobiliario, tal como os escribe cada deputado (vivendas, locais, prazas de garaxe…). Non conta dividendos nin xuros."
    },
    "deGrupo": "{n} de {de}",
    "rentasGrupo": {
      "titulo": "Quen declara rendas, por grupo",
      "intro": "Deputados de cada grupo que declaran algunha renda do ano anterior (sen o soldo do Congreso), dos que teñen declaración publicada.",
      "con": "Declaran rendas",
      "sin": "Non declaran ningunha",
      "nota": "Conta quen declara algunha renda maior que cero ou algún importe ilexible. Só os deputados con declaración de bens publicada."
    },
    "masRentas": {
      "titulo": "As rendas máis altas declaradas",
      "intro": "Total de rendas do ano anterior á súa declaración de bens, sen o soldo do Congreso.",
      "alMenos": "polo menos {x}",
      "nota": "Suma dos importes da táboa de rendas tal e como os escribe cada deputado: traballo, dividendos, xuros, alugueiros e outras. Se algún importe é ilexible, a cifra é un mínimo («polo menos»)."
    },
    "tiposRenta": {
      "titulo": "Que tipo de rendas declaran",
      "intro": "Deputados que declaran algunha renda de cada tipo. Unha persoa conta en cada tipo que declara.",
      "tipos": {
        "salariales": "Traballo (salarios)",
        "dividendos": "Dividendos",
        "intereses": "Xuros",
        "otras": "Outras rendas (alugueiros, actividades…)"
      }
    },
    "inversiones": {
      "titulo": "Accións e fondos de investimento",
      "intro": "Deputados que declaran accións ou participacións e fondos de investimento, segundo como describe cada un o que ten.",
      "acciones": [
        "{n} deputado declara accións ou participacións",
        "{n} deputados declaran accións ou participacións"
      ],
      "fondos": [
        "{n} deputado declara fondos de investimento",
        "{n} deputados declaran fondos de investimento"
      ],
      "euros": "{x} en total",
      "porGrupoAcciones": "Accións ou participacións, por grupo",
      "porGrupoFondos": "Fondos de investimento, por grupo",
      "nota": "Táboa oficial «Débeda pública, obrigas, accións e participacións» da declaración de bens. Clasifícase polas palabras de cada fila: se menciona accións e fondos, conta nos dous; os plans de pensións non contan como fondos; se non o di (por exemplo, só «TELEFONICA»), non se clasifica. Os euros son os importes lexibles."
    },
    "masValores": {
      "titulo": "Quen declara máis en accións, fondos e outros valores",
      "intro": "Valor total da táboa «Débeda pública, obrigas, accións e participacións» da súa declaración de bens.",
      "nota": "Suma dos importes desa táboa tal e como os escribe cada deputado (inclúe débeda pública e outros valores). Se algún importe é ilexible, a cifra é un mínimo («polo menos»)."
    },
    "accionesDe": {
      "titulo": "De que empresas declaran accións máis deputados",
      "intro": "Empresas das que máis deputados nomean accións ou participacións na súa declaración de bens.",
      "nota": "Só contan as empresas que o deputado nomea; quen escribe só «accións» non conta. Cada deputado conta unha vez por empresa."
    },
    "empRelacion": {
      "titulo": "Que relación teñen con empresas privadas",
      "intro": "Deputados que nomean empresas privadas nos seus documentos oficiais, por tipo de relación. Unha persoa conta en cada tipo que ten.",
      "cifra": [
        "{n} deputado nomea algunha empresa privada nos seus documentos",
        "{n} deputados nomean algunha empresa privada nos seus documentos"
      ],
      "nota": "Participar non é ser dono nin cobrar: ter accións, ter traballado nunha empresa ou ter unha actividade autorizada son relacións distintas. O tipo sae da sección do documento ou do artigo da lei que cita o acordo do Congreso."
    },
    "empGrupo": {
      "titulo": "Quen nomea empresas privadas, por grupo",
      "intro": "Deputados de cada grupo que nomean algunha empresa privada nos seus documentos oficiais, con calquera relación.",
      "con": "Nomean algunha",
      "sin": "Ningunha"
    },
    "remuneracion": {
      "titulo": "Que din os seus documentos sobre se cobran",
      "intro": "Deputados con algunha relación con empresas ou entidades (cargos, actividades, traballos) en cada caso. Unha persoa conta en cada caso que aparece nos seus documentos.",
      "lista": "Quen ten algunha relación con remuneración, segundo o documento",
      "nota": "Só conta o que di o texto do documento: cando non o di, non conta como que cobra nin como que non. Algúns acordos falan de cobros que xa remataron; o texto literal está na ficha de cada deputado. O soldo do Congreso non se conta aquí."
    },
    "masEmpresas": {
      "titulo": "Quen nomea máis empresas",
      "intro": "Empresas privadas distintas que nomean os documentos oficiais de cada deputado, con calquera relación (accións, traballos anteriores, actividades…).",
      "empresas": [
        "{n} empresa",
        "{n} empresas"
      ]
    },
    "borme": {
      "titulo": "Cargos en sociedades segundo o Rexistro Mercantil, por grupo",
      "intro": "Deputados con algún acto inscrito no BORME desde 2009 (nomeamentos, cesamentos…) confirmado por outro documento oficial.",
      "con": "Con cargos no BORME",
      "sin": "Sen cargos confirmados",
      "nota": "O BORME non publica o DNI: só contan as coincidencias de nome confirmadas por outro documento oficial. O BORME tampouco di se o cargo segue vixente."
    },
    "ong": {
      "titulo": "Achegas a fundacións, ONG e asociacións",
      "intro": "Deputados que declaran cotas ou donativos a fundacións, ONG e asociacións na súa declaración de intereses económicos.",
      "cifra": [
        "{n} deputado declara achegas a fundacións, ONG ou asociacións",
        "{n} deputados declaran achegas a fundacións, ONG ou asociacións"
      ],
      "porGrupo": "Por grupo",
      "mas": "A cales achegan máis deputados",
      "cargos": [
        "Ademais, {n} deputado ten un cargo ou unha actividade nalgunha fundación ou asociación.",
        "Ademais, {n} deputados teñen un cargo ou unha actividade nalgunha fundación ou asociación."
      ],
      "nota": "Unha achega non é un cargo nin unha participación na entidade. Non se contan as cotas ao propio partido. Cada deputado conta unha vez por entidade."
    },
    "perfil": {
      "titulo": "Mulleres e homes en cada grupo",
      "mujeres": "Mulleres",
      "hombres": "Homes",
      "nacTitulo": "Ano de nacemento",
      "nacIntro": "Deputados por década de nacemento, segundo a súa ficha oficial."
    }
  },
  en: {
    "pestanas": {"aria": "Statistics sections", "votos": "Votes", "perfil": "Profile", "dinero": "Money", "empresas": "Companies"},
    "cifras": {"votaciones": "plenary votes analysed", "mujeres": "women among the 350 MPs", "distintos": "MPs have voted differently from their group at least once", "alquiler": "MPs declare rental income"},
    "verCifras": "Select a row to see all its figures.",
    "matriz": "Percentage of votes in which both groups (row and column) voted the same way.",
    "titulo": "Statistics",
    "tituloSeo": "Statistics on Spain’s deputies: how each group votes, what they studied and what they declare",
    "descripcion": "How each group votes by topic, who it votes with, what the deputies studied, their declared income and who earns rent. Totals from official data.",
    "lead": "Figures on the 350 deputies of the 15th Legislature from official Congress data. Always totals, never averages.",
    "fuente": "How it is calculated",
    "descargar": "Download this data",
    "votoTema": {
      "titulo": "How each group votes, by topic",
      "intro": "In how many votes on each topic each group mostly voted yes, no or abstained.",
      "elige": "Topic",
      "votaciones": [
        "{n} vote",
        "{n} votes"
      ],
      "empate": "Tie",
      "nota": "Every vote counts the same: bills, amendments, motions and proposals from any group, so voting “no” may mean rejecting another group’s proposal. Topics are assigned by Congreso Abierto from words in the official title. The Mixed Group brings together different parties.",
      "ver": "See these votes"
    },
    "coincidencia": {
      "titulo": "Who each group votes with",
      "intro": "In how many votes two groups had the same majority vote.",
      "elige": "Group",
      "fila": "{iguales} of {ambos}",
      "nota": "Only votes in which both groups had a clear majority vote (no tie) are counted."
    },
    "distintos": {
      "titulo": "Who votes against their group most often",
      "intro": "Deputies who most often voted yes, no or abstained differently from their group’s majority that day.",
      "veces": [
        "{n} time",
        "{n} times"
      ],
      "nota": "Excluding the Mixed Group, which brings together different parties, and ties."
    },
    "formacion": {
      "titulo": "What and where they studied",
      "intro": "Based on the education listed in each deputy’s official profile.",
      "tipoTitulo": "Type of university",
      "tipos": {
        "publica": "Public only",
        "privada": "Private only",
        "ambas": "Public and private",
        "sin-centro": "No Spanish university in the profile",
        "sin-datos": "No education listed in their official profile"
      },
      "univTitulo": "Most frequent universities",
      "univNota": "Universities in the official register (RUCT) named in the profile; each person counts once per university.",
      "areaTitulo": "Field of study",
      "areaNota": "Our own classification from words in the official text; a person counts in every field that appears in their profile.",
      "areas": {
        "derecho": "Law",
        "economia": "Economics and business",
        "politicas": "Political science",
        "sociales": "Sociology and social sciences",
        "comunicacion": "Journalism and communication",
        "humanidades": "Humanities",
        "educacion": "Education",
        "ingenieria": "Engineering and architecture",
        "ciencias": "Sciences",
        "salud": "Health and psychology"
      }
    },
    "rentas": {
      "titulo": "Declared income, by band",
      "intro": "Income in the year before their asset declaration, excluding Congress pay (which is not declared). Deputies in each band.",
      "ninguna": "None",
      "menos": "Under {a}",
      "entre": "{a} to {b}",
      "mas": "{a} or more",
      "alMenos": [
        "{n} declaration has an unreadable amount: it counts in the band of its minimum.",
        "{n} declarations have an unreadable amount: they count in the band of their minimum."
      ],
      "sinDecl": [
        "{n} deputy without a published declaration.",
        "{n} deputies without a published declaration."
      ]
    },
    "alquiler": {
      "titulo": "Who declares rental income",
      "intro": [
        "{n} deputy declares income from renting out property.",
        "{n} deputies declare income from renting out property."
      ],
      "porGrupo": "By group",
      "verLista": "See who they are",
      "nota": "Income items that mention rent, lease or income from real estate, as each deputy writes them (homes, premises, parking spaces…). Dividends and interest are not counted."
    },
    "deGrupo": "{n} of {de}",
    "rentasGrupo": {
      "titulo": "Who declares income, by group",
      "intro": "Members of each group who declare some income from the previous year (excluding their Congress salary), out of those with a published declaration.",
      "con": "Declare income",
      "sin": "Declare none",
      "nota": "Counts anyone who declares income above zero or an unreadable amount. Only members with a published asset declaration."
    },
    "masRentas": {
      "titulo": "Highest declared income",
      "intro": "Total income from the year before their asset declaration, excluding their Congress salary.",
      "alMenos": "at least {x}",
      "nota": "Sum of the amounts in the income table as each member writes them: employment, dividends, interest, rent and other. If an amount is unreadable, the figure is a minimum («at least»)."
    },
    "tiposRenta": {
      "titulo": "What kind of income they declare",
      "intro": "Members who declare some income of each kind. A person counts once in each kind they declare.",
      "tipos": {
        "salariales": "Employment (salaries)",
        "dividendos": "Dividends",
        "intereses": "Interest",
        "otras": "Other income (rent, activities…)"
      }
    },
    "inversiones": {
      "titulo": "Shares and investment funds",
      "intro": "Members who declare shares or holdings and investment funds, according to how each one describes what they own.",
      "acciones": [
        "{n} member declares shares or holdings",
        "{n} members declare shares or holdings"
      ],
      "fondos": [
        "{n} member declares investment funds",
        "{n} members declare investment funds"
      ],
      "euros": "{x} in total",
      "porGrupoAcciones": "Shares or holdings, by group",
      "porGrupoFondos": "Investment funds, by group",
      "nota": "Official table «Public debt, bonds, shares and holdings» of the asset declaration. Classified by the words in each row: if it mentions shares and funds, it counts in both; pension plans do not count as funds; if it does not say (e.g. just «TELEFONICA»), it is not classified. Euros are the readable amounts."
    },
    "masValores": {
      "titulo": "Who declares most in shares, funds and other securities",
      "intro": "Total value of the «Public debt, bonds, shares and holdings» table of their asset declaration.",
      "nota": "Sum of the amounts in that table as each member writes them (includes public debt and other securities). If an amount is unreadable, the figure is a minimum («at least»)."
    },
    "accionesDe": {
      "titulo": "Companies whose shares most members declare",
      "intro": "Companies whose shares or holdings are named by most members in their asset declaration.",
      "nota": "Only companies the member names count; someone who just writes «shares» is not counted. Each member counts once per company."
    },
    "empRelacion": {
      "titulo": "How they are involved with private companies",
      "intro": "Members who name private companies in their official documents, by type of involvement. A person counts once in each type they have.",
      "cifra": [
        "{n} member names a private company in their documents",
        "{n} members name a private company in their documents"
      ],
      "nota": "Involvement does not mean ownership or being paid: holding shares, having worked at a company or having an authorised activity are different things. The type comes from the section of the document or the article of the law cited by the Congress decision."
    },
    "empGrupo": {
      "titulo": "Who names private companies, by group",
      "intro": "Members of each group who name a private company in their official documents, with any type of involvement.",
      "con": "Name at least one",
      "sin": "None"
    },
    "remuneracion": {
      "titulo": "What their documents say about pay",
      "intro": "Members with some involvement with companies or organisations (positions, activities, jobs) in each case. A person counts once in each case that appears in their documents.",
      "lista": "Who has some paid involvement, according to the document",
      "nota": "Only what the text of the document says counts: when it does not say, it counts neither as paid nor as unpaid. Some decisions mention payments that have already ended; the literal text is on each member’s page. The Congress salary is not counted here."
    },
    "masEmpresas": {
      "titulo": "Who names the most companies",
      "intro": "Distinct private companies named in each member’s official documents, with any type of involvement (shares, previous jobs, activities…).",
      "empresas": [
        "{n} company",
        "{n} companies"
      ]
    },
    "borme": {
      "titulo": "Company positions in the Companies Register, by group",
      "intro": "Members with an entry in the BORME since 2009 (appointments, resignations…) confirmed by another official document.",
      "con": "With positions in the BORME",
      "sin": "No confirmed positions",
      "nota": "The BORME does not publish ID numbers: only name matches confirmed by another official document count. The BORME does not say whether the position is still held either."
    },
    "ong": {
      "titulo": "Contributions to foundations, NGOs and associations",
      "intro": "Members who declare membership fees or donations to foundations, NGOs and associations in their declaration of economic interests.",
      "cifra": [
        "{n} member declares contributions to foundations, NGOs or associations",
        "{n} members declare contributions to foundations, NGOs or associations"
      ],
      "porGrupo": "By group",
      "mas": "Which ones most members contribute to",
      "cargos": [
        "In addition, {n} member holds a position or activity in a foundation or association.",
        "In addition, {n} members hold a position or activity in a foundation or association."
      ],
      "nota": "A contribution is not a position in or a stake in the organisation. Fees to their own party are not counted. Each member counts once per organisation."
    },
    "perfil": {
      "titulo": "Women and men in each group",
      "mujeres": "Women",
      "hombres": "Men",
      "nacTitulo": "Year of birth",
      "nacIntro": "Deputies by decade of birth, from their official profile."
    }
  },
});
