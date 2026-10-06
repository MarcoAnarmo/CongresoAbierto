import { area } from '..';

/** Página Estadísticas (src/lib/estadisticas.ts). Siempre totales, nunca medias. */
const es = {
  "titulo": "Estadísticas",
  "tituloSeo": "Estadísticas de los diputados: cómo vota cada grupo, qué estudiaron y qué declaran",
  "descripcion": "Cómo vota cada grupo por tema, con quién coincide, qué estudiaron los diputados, sus rentas declaradas y quién cobra alquileres. Cifras totales con datos oficiales.",
  "lead": "Cifras de los 350 diputados de la XV Legislatura con datos oficiales del Congreso. Siempre totales, nunca medias.",
  "indice": "En esta página",
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
    "titulo": "Estadístiques",
    "tituloSeo": "Estadístiques dels diputats: com vota cada grup, què van estudiar i què declaren",
    "descripcion": "Com vota cada grup per tema, amb qui coincideix, què van estudiar els diputats, les seves rendes declarades i qui cobra lloguers. Xifres totals amb dades oficials.",
    "lead": "Xifres dels 350 diputats de la XV Legislatura amb dades oficials del Congrés. Sempre totals, mai mitjanes.",
    "indice": "En aquesta pàgina",
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
    "perfil": {
      "titulo": "Dones i homes a cada grup",
      "mujeres": "Dones",
      "hombres": "Homes",
      "nacTitulo": "Any de naixement",
      "nacIntro": "Diputats per dècada de naixement, segons la seva fitxa oficial."
    }
  },
  eu: {
    "titulo": "Estatistikak",
    "tituloSeo": "Diputatuen estatistikak: talde bakoitzak nola bozkatzen duen, zer ikasi zuten eta zer aitortzen duten",
    "descripcion": "Talde bakoitzak gaika nola bozkatzen duen, norekin bat egiten duen, diputatuek zer ikasi zuten, aitortutako errentak eta nork kobratzen dituen alokairuak. Guztizko zifrak, datu ofizialekin.",
    "lead": "XV. Legegintzaldiko 350 diputatuen zifrak, Kongresuaren datu ofizialekin. Beti guztizkoak, inoiz ez batez bestekoak.",
    "indice": "Orrialde honetan",
    "fuente": "Nola kalkulatzen den",
    "descargar": "Deskargatu datu hauek",
    "votoTema": {
      "titulo": "Talde bakoitzak nola bozkatzen duen, gaika",
      "intro": "Gai bakoitzeko zenbat bozketatan bozkatu zuen talde bakoitzak, gehienbat, bai, ez edo abstentzioa.",
      "elige": "Gaia",
      "votaciones": [
        "{n} bozketa",
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
      "titulo": "Nork bozkatzen duen gehien bere taldetik bestela",
      "intro": "Egun hartan bere taldeko gehiengoaz bestela bai, ez edo abstentzioa gehien bozkatu zuten diputatuak.",
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
        "sin-centro": "Espainiako unibertsitaterik ez fitxan",
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
      "titulo": "Aitortutako errentak, tarteka",
      "intro": "Ondasun-aitorpenaren aurreko urteko errentak, Kongresuko soldata kanpo (ez da aitortzen). Diputatuak tarte bakoitzean.",
      "ninguna": "Bat ere ez",
      "menos": "{a} baino gutxiago",
      "entre": "{a} - {b}",
      "mas": "{a} edo gehiago",
      "alMenos": [
        "{n} aitorpenek zenbateko irakurtezinen bat du: bere gutxienekoaren tartean zenbatzen da.",
        "{n} aitorpenek zenbateko irakurtezinen bat dute: beren gutxienekoaren tartean zenbatzen dira."
      ],
      "sinDecl": [
        "{n} diputatu aitorpen argitaraturik gabe.",
        "{n} diputatu aitorpen argitaraturik gabe."
      ]
    },
    "alquiler": {
      "titulo": "Nork aitortzen dituen alokairuetako errentak",
      "intro": [
        "{n} diputatuk higiezinak alokatzeagatiko errentak aitortzen ditu.",
        "{n} diputatuk higiezinak alokatzeagatiko errentak aitortzen dituzte."
      ],
      "porGrupo": "Taldeka",
      "verLista": "Ikusi nortzuk diren",
      "nota": "Alokairua, errentamendua edo higiezinen kapitalaren etekinak aipatzen dituzten errenta-kontzeptuak, diputatu bakoitzak idazten dituen bezala (etxebizitzak, lokalak, garaje-plazak…). Ez dira dibidenduak ezta interesak zenbatzen."
    },
    "perfil": {
      "titulo": "Emakumeak eta gizonak talde bakoitzean",
      "mujeres": "Emakumeak",
      "hombres": "Gizonak",
      "nacTitulo": "Jaiotze urtea",
      "nacIntro": "Diputatuak jaiotze-hamarkadaren arabera, fitxa ofizialaren arabera."
    }
  },
  gl: {
    "titulo": "Estatísticas",
    "tituloSeo": "Estatísticas dos deputados: como vota cada grupo, que estudaron e que declaran",
    "descripcion": "Como vota cada grupo por tema, con quen coincide, que estudaron os deputados, as súas rendas declaradas e quen cobra alugueres. Cifras totais con datos oficiais.",
    "lead": "Cifras dos 350 deputados da XV Lexislatura con datos oficiais do Congreso. Sempre totais, nunca medias.",
    "indice": "Nesta páxina",
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
    "perfil": {
      "titulo": "Mulleres e homes en cada grupo",
      "mujeres": "Mulleres",
      "hombres": "Homes",
      "nacTitulo": "Ano de nacemento",
      "nacIntro": "Deputados por década de nacemento, segundo a súa ficha oficial."
    }
  },
  en: {
    "titulo": "Statistics",
    "tituloSeo": "Statistics on Spain’s deputies: how each group votes, what they studied and what they declare",
    "descripcion": "How each group votes by topic, who it votes with, what the deputies studied, their declared income and who earns rent. Totals from official data.",
    "lead": "Figures on the 350 deputies of the 15th Legislature from official Congress data. Always totals, never averages.",
    "indice": "On this page",
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
    "perfil": {
      "titulo": "Women and men in each group",
      "mujeres": "Women",
      "hombres": "Men",
      "nacTitulo": "Year of birth",
      "nacIntro": "Deputies by decade of birth, from their official profile."
    }
  },
});
