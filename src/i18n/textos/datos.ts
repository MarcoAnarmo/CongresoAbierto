import { area } from '..';

/**
 * Página Datos (descargas). Nombres de tablas, filtros y columnas (src/lib/datos/tablas.ts) en cada idioma.
 * Las cabeceras de la descarga «Excel» usan columnas.<id>.nombre; el «CSV estándar», el id fijo de la columna.
 * Los valores oficiales (grupos, votos, resultados, textos) no se traducen.
 */
const es = {
  "licenciaTitulo": "Licencia y cómo citar",
  "avisoLegal": "Uso de los datos y aviso legal",
  "secciones": {"perfil": "Perfil", "dinero": "Sueldo, bienes y deudas", "votos": "Votos", "fuentes": "Avisos y enlaces"},
  "descripciones": {"votaciones": {"id": "Identificador de la votación (sesión y número)", "no_vota": "Diputados que no votaron"}, "votos-grupo": {"si": "Diputados del grupo que votaron sí", "no": "Diputados del grupo que votaron no", "abstencion": "Diputados del grupo que se abstuvieron", "no_vota": "Diputados del grupo que no votaron"}},
  "columnasDe": "{n} columnas",
  "verColumnas": "Ver qué significa cada columna",
  "formato": "Formato",
  "siguiente": "Siguiente",
  "atras": "Atrás",
  "progreso": "Pasos de la descarga",
  "pasoDe": "Paso {n} de {total}",
  "tuDescarga": "Tu descarga",
  "sinFiltros": "Sin filtros",
  "quitarFiltro": "Quitar el filtro: {nombre}",
  "verPrevia": "Ver las primeras filas",
  "mas": "Más formas de usar los datos",
  "listo": "Listo para descargar",
  "filas": [
    "{n} fila",
    "{n} filas"
  ],
  "titulo": "Descargar datos",
  "tituloSeo": "Descargar datos del Congreso en Excel y CSV: diputados, bienes y votaciones",
  "descripcion": "Descarga en Excel o CSV los datos oficiales de los 350 diputados: perfil, patrimonio, rentas, inmuebles y todas las votaciones del Pleno, con filtros.",
  "lead": "Elige una tabla, filtra lo que necesites y descárgala para abrirla en Excel, Google Sheets o tu programa de datos.",
  "paso1": "Tabla",
  "paso2": "Filtros",
  "paso3": "Columnas",
  "paso4": "Descargar",
  "cargando": "Cargando datos…",
  "error": "No se han podido cargar los datos. Comprueba la conexión y vuelve a intentarlo.",
  "descargar": "Descargar",
  "sinFilas": "Ningún resultado con estos filtros.",
  "vistaPrevia": "Vista previa: primeras {n} filas",
  "excel": "Excel",
  "excelAyuda": "Punto y coma y coma decimal: se abre con doble clic en Excel.",
  "csv": "CSV estándar",
  "csvAyuda": "Comas y punto decimal: para R, Python o Google Sheets.",
  "columnasN": "{n} de {total} columnas",
  "todas": "Todas",
  "porDefecto": "Las básicas",
  "desde": "Desde",
  "hasta": "Hasta",
  "todos": "Todos",
  "buscar": "Nombre o palabra",
  "quitarFiltros": "Quitar filtros",
  "grande": "Son muchas filas: la descarga puede tardar unos segundos y el archivo pesará varios MB.",
  "diccionario": "Qué significa cada columna",
  "completos": "Tablas completas",
  "completosTexto": "Las tablas enteras en CSV estándar, con nombres de columna fijos, para usarlas en programas o enlazarlas.",
  "licencia": "Los datos de Congreso Abierto se publican con licencia {licencia}: puedes reutilizarlos, también con fines comerciales, citando la fuente así:",
  "fuentes": "Todo sale de documentos oficiales del Congreso y cada fila enlaza a su fuente cuando la tiene. Los textos oficiales van en castellano, como los publica el Congreso.",
  "verdadero": "Sí",
  "falso": "No",
  "mujer": "Mujer",
  "hombre": "Hombre",
  "propio": "A su nombre",
  "sociedad": "De una sociedad",
  "abrirFiltros": "Filtrar",
  "aplicar": "Ver {n}",
  "nota_votos": "Solo diputados de la composición actual. El grupo es el actual.",
  "nota_inmuebles": "Una fila por línea de la declaración (una línea puede declarar varias unidades).",
  "nota_entidades": "Que una entidad aparezca no implica ninguna irregularidad: es lo que consta en los documentos oficiales.",
  "nota_borme": "Solo actos confirmados por otro documento oficial. El BORME no publica el DNI: las coincidencias de nombre sin confirmar no se incluyen.",
  "conf_declarada": "En sus documentos",
  "conf_cargo-publico": "Empresa pública de su cargo",
  "conf_apellido": "Lleva su nombre",
  "tipo_empresa": "Empresa",
  "tipo_publica": "Sector público",
  "tipo_fundacion": "Fundación",
  "tipo_asociacion": "Asociación u ONG",
  "tipo_partido": "Partido político",
  "tipo_sindicato": "Sindicato",
  "tipo_educacion": "Educación e investigación",
  "tipo_colegio": "Colegio profesional",
  "tipo_otra": "Otra",
  "fuente_compatibilidad": "Acuerdo del Congreso (BOCG)",
  "fuente_registro": "Registro de Intereses",
  "fuente_intereses": "Declaración de intereses económicos",
  "fuente_bienes": "Declaración de bienes",
  "fuente_ficha": "Ficha oficial",
  "tablas": {
    "diputados": {
      "nombre": "Diputados",
      "descripcion": "Una fila por diputado: perfil, bienes, rentas, deudas y resumen de sus votos"
    },
    "inmuebles": {
      "nombre": "Inmuebles",
      "descripcion": "Una fila por inmueble declarado"
    },
    "entidades": {
      "nombre": "Empresas y entidades",
      "descripcion": "Una fila por cada documento oficial que nombra una empresa o entidad junto a un diputado"
    },
    "borme": {
      "nombre": "Cargos en el BORME",
      "descripcion": "Una fila por cada acto del Registro Mercantil (nombramiento, cese…) a nombre de un diputado, confirmado por otro documento oficial"
    },
    "votaciones": {
      "nombre": "Votaciones",
      "descripcion": "Una fila por votación del Pleno, con el resultado"
    },
    "votos-grupo": {
      "nombre": "Voto de cada grupo",
      "descripcion": "Una fila por votación y grupo, con su voto mayoritario"
    },
    "votos": {
      "nombre": "Votos de cada diputado",
      "descripcion": "Una fila por diputado y votación (más de 700.000)"
    }
  },
  "filtros": {
    "buscar": "Buscar",
    "grupo": "Grupo",
    "circunscripcion": "Circunscripción",
    "genero": "Sexo",
    "es_vivienda": "Vivienda",
    "titular": "Titular",
    "tipo_entidad": "Tipo de entidad",
    "fuente": "Documento",
    "confirmacion": "Cómo se confirma",
    "fechas": "Fechas",
    "temas": "Tema",
    "resultado": "Resultado",
    "voto": "Voto"
  },
  "columnas": {
    "id": {
      "nombre": "Código",
      "descripcion": "Código parlamentario oficial del diputado"
    },
    "nombre": {
      "nombre": "Nombre",
      "descripcion": "Nombre de pila, como en la ficha oficial"
    },
    "apellidos": {
      "nombre": "Apellidos",
      "descripcion": "Apellidos, como en la ficha oficial"
    },
    "genero": {
      "nombre": "Sexo",
      "descripcion": "F o M, según la ficha oficial"
    },
    "grupo": {
      "nombre": "Grupo",
      "descripcion": "Grupo parlamentario (nombre corto)"
    },
    "grupo_nombre": {
      "nombre": "Grupo (nombre oficial)",
      "descripcion": "Nombre oficial del grupo parlamentario"
    },
    "partido": {
      "nombre": "Candidatura",
      "descripcion": "Candidatura por la que fue elegido"
    },
    "circunscripcion": {
      "nombre": "Circunscripción",
      "descripcion": "Provincia o ciudad por la que fue elegido"
    },
    "fecha_alta": {
      "nombre": "Fecha de alta",
      "descripcion": "Fecha en que adquirió el escaño"
    },
    "anio_nacimiento": {
      "nombre": "Año de nacimiento",
      "descripcion": "Según la ficha oficial"
    },
    "legislaturas": {
      "nombre": "Legislaturas",
      "descripcion": "Número de legislaturas como diputado"
    },
    "cargos": {
      "nombre": "Cargos",
      "descripcion": "Cargos actuales en el Congreso"
    },
    "formacion": {
      "nombre": "Formación",
      "descripcion": "Texto literal de la ficha oficial"
    },
    "tipo_formacion": {
      "nombre": "Tipo de universidad",
      "descripcion": "publica, privada, ambas, sin-centro o sin-datos (según el RUCT)"
    },
    "retribucion_mensual": {
      "nombre": "Retribución mensual (€)",
      "descripcion": "Importes oficiales del Congreso al mes"
    },
    "propiedades": {
      "nombre": "Propiedades",
      "descripcion": "Inmuebles declarados a su nombre"
    },
    "viviendas": {
      "nombre": "Viviendas",
      "descripcion": "Inmuebles residenciales declarados"
    },
    "vehiculos": {
      "nombre": "Vehículos",
      "descripcion": "Vehículos declarados"
    },
    "rentas_declaradas": {
      "nombre": "Rentas declaradas (€)",
      "descripcion": "Suma de rentas del año anterior a la declaración, sin el sueldo del Congreso"
    },
    "rentas_al_menos": {
      "nombre": "Rentas: al menos",
      "descripcion": "Algún importe no se pudo leer: el total es un mínimo"
    },
    "depositos": {
      "nombre": "Cuentas y depósitos (€)",
      "descripcion": "Saldo declarado en cuentas y depósitos"
    },
    "depositos_al_menos": {
      "nombre": "Depósitos: al menos",
      "descripcion": "Algún importe no se pudo leer: el total es un mínimo"
    },
    "deuda_pendiente": {
      "nombre": "Deuda pendiente (€)",
      "descripcion": "Saldo pendiente de los préstamos declarados"
    },
    "deuda_al_menos": {
      "nombre": "Deuda: al menos",
      "descripcion": "Algún importe no se pudo leer: el total es un mínimo"
    },
    "votaciones_en_escano": {
      "nombre": "Votaciones con escaño",
      "descripcion": "Votaciones del Pleno en las que tenía escaño"
    },
    "votos_si": {
      "nombre": "Votos sí",
      "descripcion": "Veces que votó sí"
    },
    "votos_no": {
      "nombre": "Votos no",
      "descripcion": "Veces que votó no"
    },
    "votos_abstencion": {
      "nombre": "Abstenciones",
      "descripcion": "Veces que se abstuvo"
    },
    "no_vota": {
      "nombre": "No vota",
      "descripcion": "Votaciones en las que no votó"
    },
    "votos_distintos_del_grupo": {
      "nombre": "Votos distintos del grupo",
      "descripcion": "Veces que votó distinto de la mayoría de su grupo"
    },
    "lectura_no_confirmada": {
      "nombre": "Lectura no confirmada",
      "descripcion": "Algún dato no se ha podido confirmar al 100 %: conviene revisarlo en el PDF oficial"
    },
    "url_ficha_oficial": {
      "nombre": "Ficha oficial",
      "descripcion": "Ficha en congreso.es"
    },
    "url_declaracion_bienes": {
      "nombre": "Declaración de bienes",
      "descripcion": "PDF oficial de la declaración de bienes"
    },
    "url_congreso_abierto": {
      "nombre": "Ficha en Congreso Abierto",
      "descripcion": "Su ficha en esta web"
    },
    "diputado_id": {
      "nombre": "Código del diputado",
      "descripcion": "Código parlamentario oficial"
    },
    "diputado": {
      "nombre": "Diputado",
      "descripcion": "Nombre completo"
    },
    "titular": {
      "nombre": "Titular",
      "descripcion": "propio (a su nombre) o sociedad (de una sociedad participada)"
    },
    "descripcion": {
      "nombre": "Descripción",
      "descripcion": "Texto literal de la declaración"
    },
    "naturaleza": {
      "nombre": "Naturaleza",
      "descripcion": "urbana, rustica o sociedad"
    },
    "es_vivienda": {
      "nombre": "Es vivienda",
      "descripcion": "Uso residencial (piso, casa, chalet…)"
    },
    "provincia": {
      "nombre": "Provincia",
      "descripcion": "Provincia del inmueble, si consta"
    },
    "anio_adquisicion": {
      "nombre": "Año de adquisición",
      "descripcion": "Si consta"
    },
    "derecho": {
      "nombre": "Derecho",
      "descripcion": "Texto literal: pleno dominio, nuda propiedad…"
    },
    "porcentaje": {
      "nombre": "Porcentaje",
      "descripcion": "Porcentaje de titularidad, si consta"
    },
    "titulo": {
      "nombre": "Título",
      "descripcion": "Texto oficial del asunto votado"
    },
    "url_declaracion": {
      "nombre": "Declaración",
      "descripcion": "PDF oficial"
    },
    "entidad": {
      "nombre": "Entidad",
      "descripcion": "Nombre de la empresa o entidad, como aparece en el documento (variantes agrupadas)"
    },
    "tipo_entidad": {
      "nombre": "Tipo de entidad",
      "descripcion": "empresa, publica, fundacion, asociacion, partido, sindicato, educacion, colegio u otra"
    },
    "relacion": {
      "nombre": "Relación",
      "descripcion": "Cargo o actividad que dice el documento, resumido de su texto"
    },
    "fuente": {
      "nombre": "Documento",
      "descripcion": "compatibilidad (BOCG), registro (Registro de Intereses), intereses (declaración de intereses económicos), bienes (declaración de bienes) o ficha (ficha oficial)"
    },
    "texto": {
      "nombre": "Texto literal",
      "descripcion": "Texto del documento oficial donde aparece"
    },
    "url_documento": {
      "nombre": "Documento (enlace)",
      "descripcion": "PDF o página oficial"
    },
    "empresa": {
      "nombre": "Sociedad",
      "descripcion": "Nombre de la sociedad tal como lo publica el BORME"
    },
    "confirmacion": {
      "nombre": "Cómo se confirma",
      "descripcion": "declarada (la empresa está en sus documentos), cargo-publico (empresa pública de una administración en la que declara un cargo) o apellido (la sociedad lleva su nombre)"
    },
    "motivo": {
      "nombre": "Documento que lo confirma",
      "descripcion": "Entidad de sus documentos oficiales que confirma que es la misma persona"
    },
    "acto": {
      "nombre": "Acto",
      "descripcion": "Nombramientos, Ceses/Dimisiones, Revocaciones… tal como lo escribe el BORME"
    },
    "cargo": {
      "nombre": "Cargo",
      "descripcion": "Cargo con las abreviaturas del BORME"
    },
    "registro": {
      "nombre": "Registro Mercantil",
      "descripcion": "Provincia del registro donde se inscribe"
    },
    "url_borme": {
      "nombre": "BORME (enlace)",
      "descripcion": "Anuncio oficial en boe.es"
    },
    "fecha": {
      "nombre": "Fecha",
      "descripcion": "AAAA-MM-DD"
    },
    "sesion": {
      "nombre": "Sesión",
      "descripcion": "Número de sesión del Pleno"
    },
    "numero": {
      "nombre": "Número",
      "descripcion": "Número de votación en la sesión"
    },
    "tipo": {
      "nombre": "Tipo",
      "descripcion": "Tipo de iniciativa (texto oficial)"
    },
    "temas": {
      "nombre": "Temas",
      "descripcion": "Temas de Congreso Abierto, asignados por palabras clave del título"
    },
    "resultado": {
      "nombre": "Resultado",
      "descripcion": "Resultado oficial"
    },
    "si": {
      "nombre": "Sí",
      "descripcion": "Votos a favor"
    },
    "no": {
      "nombre": "No",
      "descripcion": "Votos en contra"
    },
    "abstencion": {
      "nombre": "Abstención",
      "descripcion": "Votos de abstención"
    },
    "url_votacion": {
      "nombre": "Votación (oficial)",
      "descripcion": "JSON oficial de la votación"
    },
    "url_expediente": {
      "nombre": "Expediente",
      "descripcion": "Página oficial del expediente"
    },
    "votacion_id": {
      "nombre": "Votación",
      "descripcion": "Identificador de la votación (sesión y número)"
    },
    "voto_mayoritario": {
      "nombre": "Voto mayoritario",
      "descripcion": "Lo que más votó el grupo (Sí, No, Abstención o Empate)"
    },
    "voto": {
      "nombre": "Voto",
      "descripcion": "Sí, No, Abstención o No vota (valor oficial)"
    }
  }
};

export default area(es, {
  ca: {
    "licenciaTitulo": "Llicència i com citar",
    "avisoLegal": "Ús de les dades i avís legal",
    "secciones": {"perfil": "Perfil", "dinero": "Sou, béns i deutes", "votos": "Vots", "fuentes": "Avisos i enllaços"},
    "descripciones": {"votaciones": {"id": "Identificador de la votació (sessió i número)", "no_vota": "Diputats que no van votar"}, "votos-grupo": {"si": "Diputats del grup que van votar sí", "no": "Diputats del grup que van votar no", "abstencion": "Diputats del grup que es van abstenir", "no_vota": "Diputats del grup que no van votar"}},
    "columnasDe": "{n} columnes",
    "verColumnas": "Veure què vol dir cada columna",
    "formato": "Format",
    "siguiente": "Següent",
    "atras": "Enrere",
    "progreso": "Passos de la descàrrega",
    "pasoDe": "Pas {n} de {total}",
    "tuDescarga": "La teva descàrrega",
    "sinFiltros": "Sense filtres",
    "quitarFiltro": "Treu el filtre: {nombre}",
    "verPrevia": "Veure les primeres files",
    "mas": "Més maneres d’usar les dades",
    "listo": "A punt per descarregar",
    "filas": [
      "{n} fila",
      "{n} files"
    ],
    "titulo": "Descarregar dades",
    "tituloSeo": "Descarregar dades del Congrés en Excel i CSV: diputats, béns i votacions",
    "descripcion": "Descarrega en Excel o CSV les dades oficials dels 350 diputats: perfil, patrimoni, rendes, immobles i totes les votacions del Ple, amb filtres.",
    "lead": "Tria una taula, filtra el que necessitis i descarrega-la per obrir-la a Excel, Google Sheets o el teu programa de dades.",
    "paso1": "Taula",
    "paso2": "Filtres",
    "paso3": "Columnes",
    "paso4": "Descarregar",
    "cargando": "Carregant dades…",
    "error": "No s’han pogut carregar les dades. Comprova la connexió i torna-ho a provar.",
    "descargar": "Descarregar",
    "sinFilas": "Cap resultat amb aquests filtres.",
    "vistaPrevia": "Vista prèvia: primeres {n} files",
    "excel": "Excel",
    "excelAyuda": "Punt i coma i coma decimal: s’obre amb doble clic a Excel.",
    "csv": "CSV estàndard",
    "csvAyuda": "Comes i punt decimal: per a R, Python o Google Sheets.",
    "columnasN": "{n} de {total} columnes",
    "todas": "Totes",
    "porDefecto": "Les bàsiques",
    "desde": "Des de",
    "hasta": "Fins a",
    "todos": "Tots",
    "buscar": "Nom o paraula",
    "quitarFiltros": "Treure filtres",
    "grande": "Són moltes files: la descàrrega pot trigar uns segons i el fitxer pesarà diversos MB.",
    "diccionario": "Què vol dir cada columna",
    "completos": "Taules completes",
    "completosTexto": "Les taules senceres en CSV estàndard, amb noms de columna fixos, per fer-les servir en programes o enllaçar-les.",
    "licencia": "Les dades de Congreso Abierto es publiquen amb llicència {licencia}: les pots reutilitzar, també amb finalitats comercials, citant la font així:",
    "fuentes": "Tot surt de documents oficials del Congrés i cada fila enllaça a la seva font quan la té. Els textos oficials van en castellà, tal com els publica el Congrés.",
    "verdadero": "Sí",
    "falso": "No",
    "mujer": "Dona",
    "hombre": "Home",
    "propio": "Al seu nom",
    "sociedad": "D’una societat",
    "abrirFiltros": "Filtrar",
    "aplicar": "Veure {n}",
    "nota_votos": "Només diputats de la composició actual. El grup és l’actual.",
    "nota_inmuebles": "Una fila per línia de la declaració (una línia pot declarar diverses unitats).",
    "nota_entidades": "Que hi aparegui una entitat no implica cap irregularitat: és el que consta als documents oficials.",
    "nota_borme": "Només actes confirmats per un altre document oficial. El BORME no publica el DNI: les coincidències de nom sense confirmar no s’hi inclouen.",
    "conf_declarada": "Als seus documents",
    "conf_cargo-publico": "Empresa pública del seu càrrec",
    "conf_apellido": "Porta el seu nom",
    "tipo_empresa": "Empresa",
    "tipo_publica": "Sector públic",
    "tipo_fundacion": "Fundació",
    "tipo_asociacion": "Associació o ONG",
    "tipo_partido": "Partit polític",
    "tipo_sindicato": "Sindicat",
    "tipo_educacion": "Educació i recerca",
    "tipo_colegio": "Col·legi professional",
    "tipo_otra": "Altra",
    "fuente_compatibilidad": "Acord del Congrés (BOCG)",
    "fuente_registro": "Registre d’Interessos",
    "fuente_intereses": "Declaració d’interessos econòmics",
    "fuente_bienes": "Declaració de béns",
    "fuente_ficha": "Fitxa oficial",
    "tablas": {
      "diputados": {
        "nombre": "Diputats",
        "descripcion": "Una fila per diputat: perfil, béns, rendes, deutes i resum dels seus vots"
      },
      "inmuebles": {
        "nombre": "Immobles",
        "descripcion": "Una fila per immoble declarat"
      },
      "entidades": {
        "nombre": "Empreses i entitats",
        "descripcion": "Una fila per cada document oficial que esmenta una empresa o entitat al costat d’un diputat"
      },
      "borme": {
        "nombre": "Càrrecs al BORME",
        "descripcion": "Una fila per cada acte del Registre Mercantil (nomenament, cessament…) a nom d’un diputat, confirmat per un altre document oficial"
      },
      "votaciones": {
        "nombre": "Votacions",
        "descripcion": "Una fila per votació del Ple, amb el resultat"
      },
      "votos-grupo": {
        "nombre": "Vot de cada grup",
        "descripcion": "Una fila per votació i grup, amb el seu vot majoritari"
      },
      "votos": {
        "nombre": "Vots de cada diputat",
        "descripcion": "Una fila per diputat i votació (més de 700.000)"
      }
    },
    "filtros": {
      "buscar": "Cercar",
      "grupo": "Grup",
      "circunscripcion": "Circumscripció",
      "genero": "Sexe",
      "es_vivienda": "Habitatge",
      "titular": "Titular",
      "tipo_entidad": "Tipus d’entitat",
      "fuente": "Document",
      "confirmacion": "Com es confirma",
      "fechas": "Dates",
      "temas": "Tema",
      "resultado": "Resultat",
      "voto": "Vot"
    },
    "columnas": {
      "id": {
        "nombre": "Codi",
        "descripcion": "Codi parlamentari oficial del diputat"
      },
      "nombre": {
        "nombre": "Nom",
        "descripcion": "Nom de pila, com a la fitxa oficial"
      },
      "apellidos": {
        "nombre": "Cognoms",
        "descripcion": "Cognoms, com a la fitxa oficial"
      },
      "genero": {
        "nombre": "Sexe",
        "descripcion": "F o M, segons la fitxa oficial"
      },
      "grupo": {
        "nombre": "Grup",
        "descripcion": "Grup parlamentari (nom curt)"
      },
      "grupo_nombre": {
        "nombre": "Grup (nom oficial)",
        "descripcion": "Nom oficial del grup parlamentari"
      },
      "partido": {
        "nombre": "Candidatura",
        "descripcion": "Candidatura per la qual va ser elegit"
      },
      "circunscripcion": {
        "nombre": "Circumscripció",
        "descripcion": "Província o ciutat per la qual va ser elegit"
      },
      "fecha_alta": {
        "nombre": "Data d’alta",
        "descripcion": "Data en què va obtenir l’escó"
      },
      "anio_nacimiento": {
        "nombre": "Any de naixement",
        "descripcion": "Segons la fitxa oficial"
      },
      "legislaturas": {
        "nombre": "Legislatures",
        "descripcion": "Nombre de legislatures com a diputat"
      },
      "cargos": {
        "nombre": "Càrrecs",
        "descripcion": "Càrrecs actuals al Congrés"
      },
      "formacion": {
        "nombre": "Formació",
        "descripcion": "Text literal de la fitxa oficial"
      },
      "tipo_formacion": {
        "nombre": "Tipus d’universitat",
        "descripcion": "publica, privada, ambas, sin-centro o sin-datos (segons el RUCT)"
      },
      "retribucion_mensual": {
        "nombre": "Retribució mensual (€)",
        "descripcion": "Imports oficials del Congrés al mes"
      },
      "propiedades": {
        "nombre": "Propietats",
        "descripcion": "Immobles declarats al seu nom"
      },
      "viviendas": {
        "nombre": "Habitatges",
        "descripcion": "Immobles residencials declarats"
      },
      "vehiculos": {
        "nombre": "Vehicles",
        "descripcion": "Vehicles declarats"
      },
      "rentas_declaradas": {
        "nombre": "Rendes declarades (€)",
        "descripcion": "Suma de rendes de l’any anterior a la declaració, sense el sou del Congrés"
      },
      "rentas_al_menos": {
        "nombre": "Rendes: com a mínim",
        "descripcion": "Algun import no s’ha pogut llegir: el total és un mínim"
      },
      "depositos": {
        "nombre": "Comptes i dipòsits (€)",
        "descripcion": "Saldo declarat en comptes i dipòsits"
      },
      "depositos_al_menos": {
        "nombre": "Dipòsits: com a mínim",
        "descripcion": "Algun import no s’ha pogut llegir: el total és un mínim"
      },
      "deuda_pendiente": {
        "nombre": "Deute pendent (€)",
        "descripcion": "Saldo pendent dels préstecs declarats"
      },
      "deuda_al_menos": {
        "nombre": "Deute: com a mínim",
        "descripcion": "Algun import no s’ha pogut llegir: el total és un mínim"
      },
      "votaciones_en_escano": {
        "nombre": "Votacions amb escó",
        "descripcion": "Votacions del Ple en què tenia escó"
      },
      "votos_si": {
        "nombre": "Vots sí",
        "descripcion": "Vegades que va votar sí"
      },
      "votos_no": {
        "nombre": "Vots no",
        "descripcion": "Vegades que va votar no"
      },
      "votos_abstencion": {
        "nombre": "Abstencions",
        "descripcion": "Vegades que es va abstenir"
      },
      "no_vota": {
        "nombre": "No vota",
        "descripcion": "Votacions en què no va votar"
      },
      "votos_distintos_del_grupo": {
        "nombre": "Vots diferents del grup",
        "descripcion": "Vegades que va votar diferent de la majoria del seu grup"
      },
      "lectura_no_confirmada": {
        "nombre": "Lectura no confirmada",
        "descripcion": "Alguna dada no s’ha pogut confirmar al 100 %: convé revisar-la al PDF oficial"
      },
      "url_ficha_oficial": {
        "nombre": "Fitxa oficial",
        "descripcion": "Fitxa a congreso.es"
      },
      "url_declaracion_bienes": {
        "nombre": "Declaració de béns",
        "descripcion": "PDF oficial de la declaració de béns"
      },
      "url_congreso_abierto": {
        "nombre": "Fitxa a Congreso Abierto",
        "descripcion": "La seva fitxa en aquest web"
      },
      "diputado_id": {
        "nombre": "Codi del diputat",
        "descripcion": "Codi parlamentari oficial"
      },
      "diputado": {
        "nombre": "Diputat",
        "descripcion": "Nom complet"
      },
      "titular": {
        "nombre": "Titular",
        "descripcion": "propio (al seu nom) o sociedad (d’una societat participada)"
      },
      "descripcion": {
        "nombre": "Descripció",
        "descripcion": "Text literal de la declaració"
      },
      "naturaleza": {
        "nombre": "Naturalesa",
        "descripcion": "urbana, rustica o sociedad"
      },
      "es_vivienda": {
        "nombre": "És habitatge",
        "descripcion": "Ús residencial (pis, casa, xalet…)"
      },
      "provincia": {
        "nombre": "Província",
        "descripcion": "Província de l’immoble, si hi consta"
      },
      "anio_adquisicion": {
        "nombre": "Any d’adquisició",
        "descripcion": "Si hi consta"
      },
      "derecho": {
        "nombre": "Dret",
        "descripcion": "Text literal: ple domini, nua propietat…"
      },
      "porcentaje": {
        "nombre": "Percentatge",
        "descripcion": "Percentatge de titularitat, si hi consta"
      },
      "titulo": {
        "nombre": "Títol",
        "descripcion": "Text oficial de l’assumpte votat"
      },
      "url_declaracion": {
        "nombre": "Declaració",
        "descripcion": "PDF oficial"
      },
      "entidad": {
        "nombre": "Entitat",
        "descripcion": "Nom de l’empresa o entitat, tal com apareix al document (variants agrupades)"
      },
      "tipo_entidad": {
        "nombre": "Tipus d’entitat",
        "descripcion": "empresa, publica, fundacion, asociacion, partido, sindicato, educacion, colegio o otra"
      },
      "relacion": {
        "nombre": "Relació",
        "descripcion": "Càrrec o activitat que diu el document, resumit del seu text"
      },
      "fuente": {
        "nombre": "Document",
        "descripcion": "compatibilidad (BOCG), registro (Registre d’Interessos), intereses (declaració d’interessos econòmics), bienes (declaració de béns) o ficha (fitxa oficial)"
      },
      "texto": {
        "nombre": "Text literal",
        "descripcion": "Text del document oficial on apareix (en castellà)"
      },
      "url_documento": {
        "nombre": "Document (enllaç)",
        "descripcion": "PDF o pàgina oficial"
      },
      "empresa": {
        "nombre": "Societat",
        "descripcion": "Nom de la societat tal com el publica el BORME"
      },
      "confirmacion": {
        "nombre": "Com es confirma",
        "descripcion": "declarada (l’empresa és als seus documents), cargo-publico (empresa pública d’una administració en què declara un càrrec) o apellido (la societat porta el seu nom)"
      },
      "motivo": {
        "nombre": "Document que ho confirma",
        "descripcion": "Entitat dels seus documents oficials que confirma que és la mateixa persona"
      },
      "acto": {
        "nombre": "Acte",
        "descripcion": "Nomenaments, cessaments, revocacions… tal com ho escriu el BORME (en castellà)"
      },
      "cargo": {
        "nombre": "Càrrec",
        "descripcion": "Càrrec amb les abreviatures del BORME"
      },
      "registro": {
        "nombre": "Registre Mercantil",
        "descripcion": "Província del registre on s’inscriu"
      },
      "url_borme": {
        "nombre": "BORME (enllaç)",
        "descripcion": "Anunci oficial a boe.es"
      },
      "fecha": {
        "nombre": "Data",
        "descripcion": "AAAA-MM-DD"
      },
      "sesion": {
        "nombre": "Sessió",
        "descripcion": "Número de sessió del Ple"
      },
      "numero": {
        "nombre": "Número",
        "descripcion": "Número de votació a la sessió"
      },
      "tipo": {
        "nombre": "Tipus",
        "descripcion": "Tipus d’iniciativa (text oficial)"
      },
      "temas": {
        "nombre": "Temes",
        "descripcion": "Temes de Congreso Abierto, assignats per paraules clau del títol"
      },
      "resultado": {
        "nombre": "Resultat",
        "descripcion": "Resultat oficial"
      },
      "si": {
        "nombre": "Sí",
        "descripcion": "Vots a favor"
      },
      "no": {
        "nombre": "No",
        "descripcion": "Vots en contra"
      },
      "abstencion": {
        "nombre": "Abstenció",
        "descripcion": "Vots d’abstenció"
      },
      "url_votacion": {
        "nombre": "Votació (oficial)",
        "descripcion": "JSON oficial de la votació"
      },
      "url_expediente": {
        "nombre": "Expedient",
        "descripcion": "Pàgina oficial de l’expedient"
      },
      "votacion_id": {
        "nombre": "Votació",
        "descripcion": "Identificador de la votació (sessió i número)"
      },
      "voto_mayoritario": {
        "nombre": "Vot majoritari",
        "descripcion": "El que més va votar el grup (Sí, No, Abstención o Empate)"
      },
      "voto": {
        "nombre": "Vot",
        "descripcion": "Sí, No, Abstención o No vota (valor oficial)"
      }
    }
  },
  eu: {
    "licenciaTitulo": "Lizentzia eta nola aipatu",
    "avisoLegal": "Datuen erabilera eta lege-oharra",
    "secciones": {"perfil": "Profila", "dinero": "Soldata, ondasunak eta zorrak", "votos": "Botoak", "fuentes": "Oharrak eta estekak"},
    "descripciones": {"votaciones": {"id": "Bozketaren identifikatzailea (saioa eta zenbakia)", "no_vota": "Bozkatu ez zuten diputatuak"}, "votos-grupo": {"si": "Baiezkoa bozkatu zuten taldeko diputatuak", "no": "Ezezkoa bozkatu zuten taldeko diputatuak", "abstencion": "Abstenitu ziren taldeko diputatuak", "no_vota": "Bozkatu ez zuten taldeko diputatuak"}},
    "columnasDe": "{n} zutabe",
    "verColumnas": "Ikusi zutabe bakoitzaren esanahia",
    "formato": "Formatua",
    "siguiente": "Hurrengoa",
    "atras": "Atzera",
    "progreso": "Deskargaren urratsak",
    "pasoDe": "{n}. urratsa ({total}tik)",
    "tuDescarga": "Zure deskarga",
    "sinFiltros": "Iragazkirik gabe",
    "quitarFiltro": "Kendu iragazkia: {nombre}",
    "verPrevia": "Ikusi lehen errenkadak",
    "mas": "Datuak erabiltzeko beste modu batzuk",
    "listo": "Deskargatzeko prest",
    "filas": [
      "{n} errenkada",
      "{n} errenkada"
    ],
    "titulo": "Datuak deskargatu",
    "tituloSeo": "Kongresuko datuak Excel eta CSV formatuan: diputatuak, ondasunak eta bozketak",
    "descripcion": "Deskargatu Excel edo CSV formatuan 350 diputatuen datu ofizialak: profila, ondarea, errentak, higiezinak eta Osoko Bilkurako bozketa guztiak, iragazkiekin.",
    "lead": "Aukeratu taula bat, iragazi behar duzuna eta deskargatu Excel, Google Sheets edo zure datu-programan irekitzeko.",
    "paso1": "Taula",
    "paso2": "Iragazkiak",
    "paso3": "Zutabeak",
    "paso4": "Deskargatu",
    "cargando": "Datuak kargatzen…",
    "error": "Ezin izan dira datuak kargatu. Egiaztatu konexioa eta saiatu berriro.",
    "descargar": "Deskargatu",
    "sinFilas": "Ez dago emaitzarik iragazki hauekin.",
    "vistaPrevia": "Aurrebista: lehen {n} errenkadak",
    "excel": "Excel",
    "excelAyuda": "Puntu eta koma eta koma hamartarra: Excelen klik bikoitzarekin irekitzen da.",
    "csv": "CSV estandarra",
    "csvAyuda": "Komak eta puntu hamartarra: R, Python edo Google Sheetserako.",
    "columnasN": "{n}/{total} zutabe",
    "todas": "Guztiak",
    "porDefecto": "Oinarrizkoak",
    "desde": "Noiztik",
    "hasta": "Noiz arte",
    "todos": "Guztiak",
    "buscar": "Izena edo hitza",
    "quitarFiltros": "Kendu iragazkiak",
    "grande": "Errenkada asko dira: deskargak segundo batzuk iraun ditzake eta fitxategiak hainbat MB izango ditu.",
    "diccionario": "Zer esan nahi du zutabe bakoitzak",
    "completos": "Taula osoak",
    "completosTexto": "Taula osoak CSV estandarrean, zutabe-izen finkoekin, programetan erabiltzeko edo estekatzeko.",
    "licencia": "Congreso Abiertoren datuak {licencia} lizentziarekin argitaratzen dira: berrerabil ditzakezu, baita helburu komertzialekin ere, iturria honela aipatuz:",
    "fuentes": "Dena Kongresuaren dokumentu ofizialetatik dator, eta errenkada bakoitzak bere iturrira estekatzen du baldin badu. Testu ofizialak gaztelaniaz daude, Kongresuak argitaratzen dituen bezala.",
    "verdadero": "Bai",
    "falso": "Ez",
    "mujer": "Emakumea",
    "hombre": "Gizona",
    "propio": "Bere izenean",
    "sociedad": "Sozietate batena",
    "abrirFiltros": "Iragazi",
    "aplicar": "Ikusi {n}",
    "nota_votos": "Egungo osaerako diputatuak soilik. Taldea egungoa da.",
    "nota_inmuebles": "Errenkada bat aitorpeneko lerro bakoitzeko (lerro batek hainbat unitate izan ditzake).",
    "nota_entidades": "Erakunde bat agertzeak ez du esan nahi irregulartasunik dagoenik: dokumentu ofizialetan jasotakoa da.",
    "nota_borme": "Beste dokumentu ofizial batek baieztatutako egintzak bakarrik. BORMEk ez du NANa argitaratzen: baieztatu gabeko izen-kointzidentziak ez dira sartzen.",
    "conf_declarada": "Bere dokumentuetan",
    "conf_cargo-publico": "Bere karguaren enpresa publikoa",
    "conf_apellido": "Bere izena darama",
    "tipo_empresa": "Enpresa",
    "tipo_publica": "Sektore publikoa",
    "tipo_fundacion": "Fundazioa",
    "tipo_asociacion": "Elkartea edo GKE",
    "tipo_partido": "Alderdi politikoa",
    "tipo_sindicato": "Sindikatua",
    "tipo_educacion": "Hezkuntza eta ikerketa",
    "tipo_colegio": "Elkargo profesionala",
    "tipo_otra": "Bestelakoa",
    "fuente_compatibilidad": "Kongresuaren erabakia (BOCG)",
    "fuente_registro": "Interesen Erregistroa",
    "fuente_intereses": "Interes ekonomikoen adierazpena",
    "fuente_bienes": "Ondasunen adierazpena",
    "fuente_ficha": "Fitxa ofiziala",
    "tablas": {
      "diputados": {
        "nombre": "Diputatuak",
        "descripcion": "Errenkada bat diputatu bakoitzeko: profila, ondasunak, errentak, zorrak eta botoen laburpena"
      },
      "inmuebles": {
        "nombre": "Higiezinak",
        "descripcion": "Errenkada bat aitortutako higiezin bakoitzeko"
      },
      "entidades": {
        "nombre": "Enpresak eta erakundeak",
        "descripcion": "Errenkada bat diputatu batekin batera enpresa edo erakunde bat aipatzen duen dokumentu ofizial bakoitzeko"
      },
      "borme": {
        "nombre": "Karguak BORMEn",
        "descripcion": "Errenkada bat diputatu baten izenean dagoen Merkataritza Erregistroko egintza bakoitzeko (izendapena, kargu-uztea…), beste dokumentu ofizial batek baieztatua"
      },
      "votaciones": {
        "nombre": "Bozketak",
        "descripcion": "Errenkada bat Osoko Bilkurako bozketa bakoitzeko, emaitzarekin"
      },
      "votos-grupo": {
        "nombre": "Talde bakoitzaren botoa",
        "descripcion": "Errenkada bat bozketa eta talde bakoitzeko, gehiengoaren botoarekin"
      },
      "votos": {
        "nombre": "Diputatu bakoitzaren botoak",
        "descripcion": "Errenkada bat diputatu eta bozketa bakoitzeko (700.000 baino gehiago)"
      }
    },
    "filtros": {
      "buscar": "Bilatu",
      "grupo": "Taldea",
      "circunscripcion": "Barrutia",
      "genero": "Sexua",
      "es_vivienda": "Etxebizitza",
      "titular": "Titularra",
      "tipo_entidad": "Erakunde mota",
      "fuente": "Dokumentua",
      "confirmacion": "Nola baieztatzen den",
      "fechas": "Datak",
      "temas": "Gaia",
      "resultado": "Emaitza",
      "voto": "Botoa"
    },
    "columnas": {
      "id": {
        "nombre": "Kodea",
        "descripcion": "Diputatuaren kode parlamentario ofiziala"
      },
      "nombre": {
        "nombre": "Izena",
        "descripcion": "Izena, fitxa ofizialean bezala"
      },
      "apellidos": {
        "nombre": "Abizenak",
        "descripcion": "Abizenak, fitxa ofizialean bezala"
      },
      "genero": {
        "nombre": "Sexua",
        "descripcion": "F edo M, fitxa ofizialaren arabera"
      },
      "grupo": {
        "nombre": "Taldea",
        "descripcion": "Talde parlamentarioa (izen laburra)"
      },
      "grupo_nombre": {
        "nombre": "Taldea (izen ofiziala)",
        "descripcion": "Talde parlamentarioaren izen ofiziala"
      },
      "partido": {
        "nombre": "Hautagaitza",
        "descripcion": "Zein hautagaitzarekin hautatu zuten"
      },
      "circunscripcion": {
        "nombre": "Barrutia",
        "descripcion": "Zein probintzia edo hiritan hautatu zuten"
      },
      "fecha_alta": {
        "nombre": "Alta data",
        "descripcion": "Eserlekua lortu zuen data"
      },
      "anio_nacimiento": {
        "nombre": "Jaiotze urtea",
        "descripcion": "Fitxa ofizialaren arabera"
      },
      "legislaturas": {
        "nombre": "Legegintzaldiak",
        "descripcion": "Diputatu gisa izandako legegintzaldi kopurua"
      },
      "cargos": {
        "nombre": "Karguak",
        "descripcion": "Kongresuko egungo karguak"
      },
      "formacion": {
        "nombre": "Prestakuntza",
        "descripcion": "Fitxa ofizialeko testu literala"
      },
      "tipo_formacion": {
        "nombre": "Unibertsitate mota",
        "descripcion": "publica, privada, ambas, sin-centro edo sin-datos (RUCTen arabera)"
      },
      "retribucion_mensual": {
        "nombre": "Hileko ordainsaria (€)",
        "descripcion": "Kongresuaren hileko zenbateko ofizialak"
      },
      "propiedades": {
        "nombre": "Jabetzak",
        "descripcion": "Bere izenean aitortutako higiezinak"
      },
      "viviendas": {
        "nombre": "Etxebizitzak",
        "descripcion": "Aitortutako bizitegi-higiezinak"
      },
      "vehiculos": {
        "nombre": "Ibilgailuak",
        "descripcion": "Aitortutako ibilgailuak"
      },
      "rentas_declaradas": {
        "nombre": "Aitortutako errentak (€)",
        "descripcion": "Aitorpenaren aurreko urteko errenten batura, Kongresuko soldata kanpo"
      },
      "rentas_al_menos": {
        "nombre": "Errentak: gutxienez",
        "descripcion": "Zenbatekoren bat ezin izan da irakurri: gutxieneko bat da"
      },
      "depositos": {
        "nombre": "Kontuak eta gordailuak (€)",
        "descripcion": "Kontu eta gordailuetan aitortutako saldoa"
      },
      "depositos_al_menos": {
        "nombre": "Gordailuak: gutxienez",
        "descripcion": "Zenbatekoren bat ezin izan da irakurri: gutxieneko bat da"
      },
      "deuda_pendiente": {
        "nombre": "Zor ordaintzeko (€)",
        "descripcion": "Aitortutako maileguen saldo ordaintzeko"
      },
      "deuda_al_menos": {
        "nombre": "Zorra: gutxienez",
        "descripcion": "Zenbatekoren bat ezin izan da irakurri: gutxieneko bat da"
      },
      "votaciones_en_escano": {
        "nombre": "Eserlekuarekin bozketak",
        "descripcion": "Eserlekua zuenean Osoko Bilkuran egindako bozketak"
      },
      "votos_si": {
        "nombre": "Bai botoak",
        "descripcion": "Bai bozkatu zuen aldiz"
      },
      "votos_no": {
        "nombre": "Ez botoak",
        "descripcion": "Ez bozkatu zuen aldiz"
      },
      "votos_abstencion": {
        "nombre": "Abstentzioak",
        "descripcion": "Abstenitu zen aldiz"
      },
      "no_vota": {
        "nombre": "Ez du bozkatzen",
        "descripcion": "Bozkatu ez zuen bozketak"
      },
      "votos_distintos_del_grupo": {
        "nombre": "Taldetik bestelako botoak",
        "descripcion": "Bere taldeko gehiengoaz bestela bozkatu zuen aldiz"
      },
      "lectura_no_confirmada": {
        "nombre": "Irakurketa berretsi gabea",
        "descripcion": "Daturen bat ezin izan da % 100ean berretsi: PDF ofizialean egiaztatu"
      },
      "url_ficha_oficial": {
        "nombre": "Fitxa ofiziala",
        "descripcion": "Fitxa congreso.es-en"
      },
      "url_declaracion_bienes": {
        "nombre": "Ondasunen aitorpena",
        "descripcion": "Ondasunen aitorpenaren PDF ofiziala"
      },
      "url_congreso_abierto": {
        "nombre": "Fitxa Congreso Abierton",
        "descripcion": "Bere fitxa webgune honetan"
      },
      "diputado_id": {
        "nombre": "Diputatuaren kodea",
        "descripcion": "Kode parlamentario ofiziala"
      },
      "diputado": {
        "nombre": "Diputatua",
        "descripcion": "Izen osoa"
      },
      "titular": {
        "nombre": "Titularra",
        "descripcion": "propio (bere izenean) edo sociedad (partaide den sozietatearena)"
      },
      "descripcion": {
        "nombre": "Deskribapena",
        "descripcion": "Aitorpeneko testu literala"
      },
      "naturaleza": {
        "nombre": "Izaera",
        "descripcion": "urbana, rustica edo sociedad"
      },
      "es_vivienda": {
        "nombre": "Etxebizitza da",
        "descripcion": "Bizitegi-erabilera (pisua, etxea…)"
      },
      "provincia": {
        "nombre": "Probintzia",
        "descripcion": "Higiezinaren probintzia, agertzen bada"
      },
      "anio_adquisicion": {
        "nombre": "Eskuratze urtea",
        "descripcion": "Agertzen bada"
      },
      "derecho": {
        "nombre": "Eskubidea",
        "descripcion": "Testu literala: jabari osoa…"
      },
      "porcentaje": {
        "nombre": "Ehunekoa",
        "descripcion": "Titulartasun-ehunekoa, agertzen bada"
      },
      "titulo": {
        "nombre": "Izenburua",
        "descripcion": "Bozkatutako gaiaren testu ofiziala"
      },
      "url_declaracion": {
        "nombre": "Aitorpena",
        "descripcion": "PDF ofiziala"
      },
      "entidad": {
        "nombre": "Erakundea",
        "descripcion": "Enpresaren edo erakundearen izena, dokumentuan agertzen den bezala (aldaerak elkartuta)"
      },
      "tipo_entidad": {
        "nombre": "Erakunde mota",
        "descripcion": "empresa, publica, fundacion, asociacion, partido, sindicato, educacion, colegio edo otra"
      },
      "relacion": {
        "nombre": "Harremana",
        "descripcion": "Dokumentuak dioen kargua edo jarduera, bere testutik laburtua"
      },
      "fuente": {
        "nombre": "Dokumentua",
        "descripcion": "compatibilidad (BOCG), registro (Interesen Erregistroa), intereses (interes ekonomikoen adierazpena), bienes (ondasunen adierazpena) edo ficha (fitxa ofiziala)"
      },
      "texto": {
        "nombre": "Testu literala",
        "descripcion": "Agertzen den dokumentu ofizialaren testua (gaztelaniaz)"
      },
      "url_documento": {
        "nombre": "Dokumentua (esteka)",
        "descripcion": "PDF edo orri ofiziala"
      },
      "empresa": {
        "nombre": "Sozietatea",
        "descripcion": "Sozietatearen izena, BORMEk argitaratzen duen bezala"
      },
      "confirmacion": {
        "nombre": "Nola baieztatzen den",
        "descripcion": "declarada (enpresa bere dokumentuetan dago), cargo-publico (kargu bat adierazten duen administrazio baten enpresa publikoa) edo apellido (sozietateak bere izena darama)"
      },
      "motivo": {
        "nombre": "Baieztatzen duen dokumentua",
        "descripcion": "Pertsona bera dela baieztatzen duen bere dokumentu ofizialetako erakundea"
      },
      "acto": {
        "nombre": "Egintza",
        "descripcion": "Izendapenak, kargu-uzteak, ezeztapenak… BORMEk idazten duen bezala (gaztelaniaz)"
      },
      "cargo": {
        "nombre": "Kargua",
        "descripcion": "Kargua, BORMEren laburdurekin"
      },
      "registro": {
        "nombre": "Merkataritza Erregistroa",
        "descripcion": "Inskribatzen den erregistroaren probintzia"
      },
      "url_borme": {
        "nombre": "BORME (esteka)",
        "descripcion": "Iragarki ofiziala boe.es-en"
      },
      "fecha": {
        "nombre": "Data",
        "descripcion": "UUUU-HH-EE"
      },
      "sesion": {
        "nombre": "Saioa",
        "descripcion": "Osoko Bilkuraren saio-zenbakia"
      },
      "numero": {
        "nombre": "Zenbakia",
        "descripcion": "Saioko bozketa-zenbakia"
      },
      "tipo": {
        "nombre": "Mota",
        "descripcion": "Ekimen mota (testu ofiziala)"
      },
      "temas": {
        "nombre": "Gaiak",
        "descripcion": "Congreso Abiertoren gaiak, izenburuko gako-hitzen arabera"
      },
      "resultado": {
        "nombre": "Emaitza",
        "descripcion": "Emaitza ofiziala"
      },
      "si": {
        "nombre": "Bai",
        "descripcion": "Aldeko botoak"
      },
      "no": {
        "nombre": "Ez",
        "descripcion": "Aurkako botoak"
      },
      "abstencion": {
        "nombre": "Abstentzioa",
        "descripcion": "Abstentzio botoak"
      },
      "url_votacion": {
        "nombre": "Bozketa (ofiziala)",
        "descripcion": "Bozketaren JSON ofiziala"
      },
      "url_expediente": {
        "nombre": "Espedientea",
        "descripcion": "Espedientearen orri ofiziala"
      },
      "votacion_id": {
        "nombre": "Bozketa",
        "descripcion": "Bozketaren identifikatzailea (saioa eta zenbakia)"
      },
      "voto_mayoritario": {
        "nombre": "Gehiengoaren botoa",
        "descripcion": "Taldeak gehien bozkatu zuena (Sí, No, Abstención edo Empate)"
      },
      "voto": {
        "nombre": "Botoa",
        "descripcion": "Sí, No, Abstención edo No vota (balio ofiziala)"
      }
    }
  },
  gl: {
    "licenciaTitulo": "Licenza e como citar",
    "avisoLegal": "Uso dos datos e aviso legal",
    "secciones": {"perfil": "Perfil", "dinero": "Soldo, bens e débedas", "votos": "Votos", "fuentes": "Avisos e ligazóns"},
    "descripciones": {"votaciones": {"id": "Identificador da votación (sesión e número)", "no_vota": "Deputados que non votaron"}, "votos-grupo": {"si": "Deputados do grupo que votaron si", "no": "Deputados do grupo que votaron non", "abstencion": "Deputados do grupo que se abstiveron", "no_vota": "Deputados do grupo que non votaron"}},
    "columnasDe": "{n} columnas",
    "verColumnas": "Ver que significa cada columna",
    "formato": "Formato",
    "siguiente": "Seguinte",
    "atras": "Atrás",
    "progreso": "Pasos da descarga",
    "pasoDe": "Paso {n} de {total}",
    "tuDescarga": "A túa descarga",
    "sinFiltros": "Sen filtros",
    "quitarFiltro": "Quitar o filtro: {nombre}",
    "verPrevia": "Ver as primeiras filas",
    "mas": "Máis formas de usar os datos",
    "listo": "Listo para descargar",
    "filas": [
      "{n} fila",
      "{n} filas"
    ],
    "titulo": "Descargar datos",
    "tituloSeo": "Descargar datos do Congreso en Excel e CSV: deputados, bens e votacións",
    "descripcion": "Descarga en Excel ou CSV os datos oficiais dos 350 deputados: perfil, patrimonio, rendas, inmobles e todas as votacións do Pleno, con filtros.",
    "lead": "Escolle unha táboa, filtra o que necesites e descárgaa para abrila en Excel, Google Sheets ou o teu programa de datos.",
    "paso1": "Táboa",
    "paso2": "Filtros",
    "paso3": "Columnas",
    "paso4": "Descargar",
    "cargando": "Cargando datos…",
    "error": "Non se puideron cargar os datos. Comproba a conexión e téntao de novo.",
    "descargar": "Descargar",
    "sinFilas": "Ningún resultado con estes filtros.",
    "vistaPrevia": "Vista previa: primeiras {n} filas",
    "excel": "Excel",
    "excelAyuda": "Punto e coma e coma decimal: ábrese con dobre clic en Excel.",
    "csv": "CSV estándar",
    "csvAyuda": "Comas e punto decimal: para R, Python ou Google Sheets.",
    "columnasN": "{n} de {total} columnas",
    "todas": "Todas",
    "porDefecto": "As básicas",
    "desde": "Desde",
    "hasta": "Ata",
    "todos": "Todos",
    "buscar": "Nome ou palabra",
    "quitarFiltros": "Quitar filtros",
    "grande": "Son moitas filas: a descarga pode tardar uns segundos e o ficheiro pesará varios MB.",
    "diccionario": "Que significa cada columna",
    "completos": "Táboas completas",
    "completosTexto": "As táboas enteiras en CSV estándar, con nomes de columna fixos, para usalas en programas ou ligalas.",
    "licencia": "Os datos de Congreso Abierto publícanse con licenza {licencia}: podes reutilizalos, tamén con fins comerciais, citando a fonte así:",
    "fuentes": "Todo sae de documentos oficiais do Congreso e cada fila liga á súa fonte cando a ten. Os textos oficiais van en castelán, como os publica o Congreso.",
    "verdadero": "Si",
    "falso": "Non",
    "mujer": "Muller",
    "hombre": "Home",
    "propio": "Ao seu nome",
    "sociedad": "Dunha sociedade",
    "abrirFiltros": "Filtrar",
    "aplicar": "Ver {n}",
    "nota_votos": "Só deputados da composición actual. O grupo é o actual.",
    "nota_inmuebles": "Unha fila por liña da declaración (unha liña pode declarar varias unidades).",
    "nota_entidades": "Que apareza unha entidade non implica ningunha irregularidade: é o que consta nos documentos oficiais.",
    "nota_borme": "Só actos confirmados por outro documento oficial. O BORME non publica o DNI: as coincidencias de nome sen confirmar non se inclúen.",
    "conf_declarada": "Nos seus documentos",
    "conf_cargo-publico": "Empresa pública do seu cargo",
    "conf_apellido": "Leva o seu nome",
    "tipo_empresa": "Empresa",
    "tipo_publica": "Sector público",
    "tipo_fundacion": "Fundación",
    "tipo_asociacion": "Asociación ou ONG",
    "tipo_partido": "Partido político",
    "tipo_sindicato": "Sindicato",
    "tipo_educacion": "Educación e investigación",
    "tipo_colegio": "Colexio profesional",
    "tipo_otra": "Outra",
    "fuente_compatibilidad": "Acordo do Congreso (BOCG)",
    "fuente_registro": "Rexistro de Intereses",
    "fuente_intereses": "Declaración de intereses económicos",
    "fuente_bienes": "Declaración de bens",
    "fuente_ficha": "Ficha oficial",
    "tablas": {
      "diputados": {
        "nombre": "Deputados",
        "descripcion": "Unha fila por deputado: perfil, bens, rendas, débedas e resumo dos seus votos"
      },
      "inmuebles": {
        "nombre": "Inmobles",
        "descripcion": "Unha fila por inmoble declarado"
      },
      "entidades": {
        "nombre": "Empresas e entidades",
        "descripcion": "Unha fila por cada documento oficial que nomea unha empresa ou entidade xunto a un deputado"
      },
      "borme": {
        "nombre": "Cargos no BORME",
        "descripcion": "Unha fila por cada acto do Rexistro Mercantil (nomeamento, cesamento…) en nome dun deputado, confirmado por outro documento oficial"
      },
      "votaciones": {
        "nombre": "Votacións",
        "descripcion": "Unha fila por votación do Pleno, co resultado"
      },
      "votos-grupo": {
        "nombre": "Voto de cada grupo",
        "descripcion": "Unha fila por votación e grupo, co seu voto maioritario"
      },
      "votos": {
        "nombre": "Votos de cada deputado",
        "descripcion": "Unha fila por deputado e votación (máis de 700.000)"
      }
    },
    "filtros": {
      "buscar": "Buscar",
      "grupo": "Grupo",
      "circunscripcion": "Circunscrición",
      "genero": "Sexo",
      "es_vivienda": "Vivenda",
      "titular": "Titular",
      "tipo_entidad": "Tipo de entidade",
      "fuente": "Documento",
      "confirmacion": "Como se confirma",
      "fechas": "Datas",
      "temas": "Tema",
      "resultado": "Resultado",
      "voto": "Voto"
    },
    "columnas": {
      "id": {
        "nombre": "Código",
        "descripcion": "Código parlamentario oficial do deputado"
      },
      "nombre": {
        "nombre": "Nome",
        "descripcion": "Nome de pía, como na ficha oficial"
      },
      "apellidos": {
        "nombre": "Apelidos",
        "descripcion": "Apelidos, como na ficha oficial"
      },
      "genero": {
        "nombre": "Sexo",
        "descripcion": "F ou M, segundo a ficha oficial"
      },
      "grupo": {
        "nombre": "Grupo",
        "descripcion": "Grupo parlamentario (nome curto)"
      },
      "grupo_nombre": {
        "nombre": "Grupo (nome oficial)",
        "descripcion": "Nome oficial do grupo parlamentario"
      },
      "partido": {
        "nombre": "Candidatura",
        "descripcion": "Candidatura pola que foi elixido"
      },
      "circunscripcion": {
        "nombre": "Circunscrición",
        "descripcion": "Provincia ou cidade pola que foi elixido"
      },
      "fecha_alta": {
        "nombre": "Data de alta",
        "descripcion": "Data en que obtivo o escano"
      },
      "anio_nacimiento": {
        "nombre": "Ano de nacemento",
        "descripcion": "Segundo a ficha oficial"
      },
      "legislaturas": {
        "nombre": "Lexislaturas",
        "descripcion": "Número de lexislaturas como deputado"
      },
      "cargos": {
        "nombre": "Cargos",
        "descripcion": "Cargos actuais no Congreso"
      },
      "formacion": {
        "nombre": "Formación",
        "descripcion": "Texto literal da ficha oficial"
      },
      "tipo_formacion": {
        "nombre": "Tipo de universidade",
        "descripcion": "publica, privada, ambas, sin-centro ou sin-datos (segundo o RUCT)"
      },
      "retribucion_mensual": {
        "nombre": "Retribución mensual (€)",
        "descripcion": "Importes oficiais do Congreso ao mes"
      },
      "propiedades": {
        "nombre": "Propiedades",
        "descripcion": "Inmobles declarados ao seu nome"
      },
      "viviendas": {
        "nombre": "Vivendas",
        "descripcion": "Inmobles residenciais declarados"
      },
      "vehiculos": {
        "nombre": "Vehículos",
        "descripcion": "Vehículos declarados"
      },
      "rentas_declaradas": {
        "nombre": "Rendas declaradas (€)",
        "descripcion": "Suma de rendas do ano anterior á declaración, sen o soldo do Congreso"
      },
      "rentas_al_menos": {
        "nombre": "Rendas: polo menos",
        "descripcion": "Algún importe non se puido ler: o total é un mínimo"
      },
      "depositos": {
        "nombre": "Contas e depósitos (€)",
        "descripcion": "Saldo declarado en contas e depósitos"
      },
      "depositos_al_menos": {
        "nombre": "Depósitos: polo menos",
        "descripcion": "Algún importe non se puido ler: o total é un mínimo"
      },
      "deuda_pendiente": {
        "nombre": "Débeda pendente (€)",
        "descripcion": "Saldo pendente dos préstamos declarados"
      },
      "deuda_al_menos": {
        "nombre": "Débeda: polo menos",
        "descripcion": "Algún importe non se puido ler: o total é un mínimo"
      },
      "votaciones_en_escano": {
        "nombre": "Votacións con escano",
        "descripcion": "Votacións do Pleno nas que tiña escano"
      },
      "votos_si": {
        "nombre": "Votos si",
        "descripcion": "Veces que votou si"
      },
      "votos_no": {
        "nombre": "Votos non",
        "descripcion": "Veces que votou non"
      },
      "votos_abstencion": {
        "nombre": "Abstencións",
        "descripcion": "Veces que se abstivo"
      },
      "no_vota": {
        "nombre": "Non vota",
        "descripcion": "Votacións nas que non votou"
      },
      "votos_distintos_del_grupo": {
        "nombre": "Votos distintos do grupo",
        "descripcion": "Veces que votou distinto da maioría do seu grupo"
      },
      "lectura_no_confirmada": {
        "nombre": "Lectura non confirmada",
        "descripcion": "Algún dato non se puido confirmar ao 100 %: convén revisalo no PDF oficial"
      },
      "url_ficha_oficial": {
        "nombre": "Ficha oficial",
        "descripcion": "Ficha en congreso.es"
      },
      "url_declaracion_bienes": {
        "nombre": "Declaración de bens",
        "descripcion": "PDF oficial da declaración de bens"
      },
      "url_congreso_abierto": {
        "nombre": "Ficha en Congreso Abierto",
        "descripcion": "A súa ficha nesta web"
      },
      "diputado_id": {
        "nombre": "Código do deputado",
        "descripcion": "Código parlamentario oficial"
      },
      "diputado": {
        "nombre": "Deputado",
        "descripcion": "Nome completo"
      },
      "titular": {
        "nombre": "Titular",
        "descripcion": "propio (ao seu nome) ou sociedad (dunha sociedade participada)"
      },
      "descripcion": {
        "nombre": "Descrición",
        "descripcion": "Texto literal da declaración"
      },
      "naturaleza": {
        "nombre": "Natureza",
        "descripcion": "urbana, rustica ou sociedad"
      },
      "es_vivienda": {
        "nombre": "É vivenda",
        "descripcion": "Uso residencial (piso, casa, chalé…)"
      },
      "provincia": {
        "nombre": "Provincia",
        "descripcion": "Provincia do inmoble, se consta"
      },
      "anio_adquisicion": {
        "nombre": "Ano de adquisición",
        "descripcion": "Se consta"
      },
      "derecho": {
        "nombre": "Dereito",
        "descripcion": "Texto literal: pleno dominio, nuda propiedade…"
      },
      "porcentaje": {
        "nombre": "Porcentaxe",
        "descripcion": "Porcentaxe de titularidade, se consta"
      },
      "titulo": {
        "nombre": "Título",
        "descripcion": "Texto oficial del asunto votado"
      },
      "url_declaracion": {
        "nombre": "Declaración",
        "descripcion": "PDF oficial"
      },
      "entidad": {
        "nombre": "Entidade",
        "descripcion": "Nome da empresa ou entidade, tal como aparece no documento (variantes agrupadas)"
      },
      "tipo_entidad": {
        "nombre": "Tipo de entidade",
        "descripcion": "empresa, publica, fundacion, asociacion, partido, sindicato, educacion, colegio ou otra"
      },
      "relacion": {
        "nombre": "Relación",
        "descripcion": "Cargo ou actividade que di o documento, resumido do seu texto"
      },
      "fuente": {
        "nombre": "Documento",
        "descripcion": "compatibilidad (BOCG), registro (Rexistro de Intereses), intereses (declaración de intereses económicos), bienes (declaración de bens) ou ficha (ficha oficial)"
      },
      "texto": {
        "nombre": "Texto literal",
        "descripcion": "Texto do documento oficial onde aparece (en castelán)"
      },
      "url_documento": {
        "nombre": "Documento (ligazón)",
        "descripcion": "PDF ou páxina oficial"
      },
      "empresa": {
        "nombre": "Sociedade",
        "descripcion": "Nome da sociedade tal como o publica o BORME"
      },
      "confirmacion": {
        "nombre": "Como se confirma",
        "descripcion": "declarada (a empresa está nos seus documentos), cargo-publico (empresa pública dunha administración na que declara un cargo) ou apellido (a sociedade leva o seu nome)"
      },
      "motivo": {
        "nombre": "Documento que o confirma",
        "descripcion": "Entidade dos seus documentos oficiais que confirma que é a mesma persoa"
      },
      "acto": {
        "nombre": "Acto",
        "descripcion": "Nomeamentos, cesamentos, revogacións… tal como o escribe o BORME (en castelán)"
      },
      "cargo": {
        "nombre": "Cargo",
        "descripcion": "Cargo coas abreviaturas do BORME"
      },
      "registro": {
        "nombre": "Rexistro Mercantil",
        "descripcion": "Provincia do rexistro onde se inscribe"
      },
      "url_borme": {
        "nombre": "BORME (ligazón)",
        "descripcion": "Anuncio oficial en boe.es"
      },
      "fecha": {
        "nombre": "Data",
        "descripcion": "AAAA-MM-DD"
      },
      "sesion": {
        "nombre": "Sesión",
        "descripcion": "Número de sesión do Pleno"
      },
      "numero": {
        "nombre": "Número",
        "descripcion": "Número de votación na sesión"
      },
      "tipo": {
        "nombre": "Tipo",
        "descripcion": "Tipo de iniciativa (texto oficial)"
      },
      "temas": {
        "nombre": "Temas",
        "descripcion": "Temas de Congreso Abierto, asignados por palabras clave do título"
      },
      "resultado": {
        "nombre": "Resultado",
        "descripcion": "Resultado oficial"
      },
      "si": {
        "nombre": "Si",
        "descripcion": "Votos a favor"
      },
      "no": {
        "nombre": "Non",
        "descripcion": "Votos en contra"
      },
      "abstencion": {
        "nombre": "Abstención",
        "descripcion": "Votos de abstención"
      },
      "url_votacion": {
        "nombre": "Votación (oficial)",
        "descripcion": "JSON oficial da votación"
      },
      "url_expediente": {
        "nombre": "Expediente",
        "descripcion": "Páxina oficial do expediente"
      },
      "votacion_id": {
        "nombre": "Votación",
        "descripcion": "Identificador da votación (sesión e número)"
      },
      "voto_mayoritario": {
        "nombre": "Voto maioritario",
        "descripcion": "O que máis votou o grupo (Sí, No, Abstención ou Empate)"
      },
      "voto": {
        "nombre": "Voto",
        "descripcion": "Sí, No, Abstención ou No vota (valor oficial)"
      }
    }
  },
  en: {
    "licenciaTitulo": "Licence and how to cite",
    "avisoLegal": "Use of the data and legal notice",
    "secciones": {"perfil": "Profile", "dinero": "Pay, assets and debts", "votos": "Votes", "fuentes": "Warnings and links"},
    "descripciones": {"votaciones": {"id": "Vote identifier (sitting and number)", "no_vota": "MPs who did not vote"}, "votos-grupo": {"si": "MPs in the group who voted yes", "no": "MPs in the group who voted no", "abstencion": "MPs in the group who abstained", "no_vota": "MPs in the group who did not vote"}},
    "columnasDe": "{n} columns",
    "verColumnas": "See what each column means",
    "formato": "Format",
    "siguiente": "Next",
    "atras": "Back",
    "progreso": "Download steps",
    "pasoDe": "Step {n} of {total}",
    "tuDescarga": "Your download",
    "sinFiltros": "No filters",
    "quitarFiltro": "Remove filter: {nombre}",
    "verPrevia": "See the first rows",
    "mas": "More ways to use the data",
    "listo": "Ready to download",
    "filas": [
      "{n} row",
      "{n} rows"
    ],
    "titulo": "Download data",
    "tituloSeo": "Download Spanish Congress data in Excel and CSV: deputies, assets and votes",
    "descripcion": "Download the official data on the 350 deputies in Excel or CSV: profile, assets, income, properties and every plenary vote, with filters.",
    "lead": "Choose a table, filter what you need and download it to open in Excel, Google Sheets or your data tool.",
    "paso1": "Table",
    "paso2": "Filters",
    "paso3": "Columns",
    "paso4": "Download",
    "cargando": "Loading data…",
    "error": "The data could not be loaded. Check your connection and try again.",
    "descargar": "Download",
    "sinFilas": "No results with these filters.",
    "vistaPrevia": "Preview: first {n} rows",
    "excel": "Excel",
    "excelAyuda": "Semicolons and decimal comma: opens with a double click in Excel set to Spanish or European formats.",
    "csv": "Standard CSV",
    "csvAyuda": "Commas and decimal point: for R, Python, Google Sheets or English Excel.",
    "columnasN": "{n} of {total} columns",
    "todas": "All",
    "porDefecto": "The basics",
    "desde": "From",
    "hasta": "To",
    "todos": "All",
    "buscar": "Name or word",
    "quitarFiltros": "Clear filters",
    "grande": "That is a lot of rows: the download may take a few seconds and the file will be several MB.",
    "diccionario": "What each column means",
    "completos": "Full tables",
    "completosTexto": "The full tables in standard CSV, with fixed column names, for use in code or to link to.",
    "licencia": "Congreso Abierto data is published under the {licencia} licence: you may reuse it, including commercially, crediting the source like this:",
    "fuentes": "Everything comes from official Congress documents and each row links to its source when it has one. Official texts are in Spanish, as Congress publishes them.",
    "verdadero": "Yes",
    "falso": "No",
    "mujer": "Woman",
    "hombre": "Man",
    "propio": "In their name",
    "sociedad": "Via a company",
    "abrirFiltros": "Filter",
    "aplicar": "Show {n}",
    "nota_votos": "Current members only. The group is their current one.",
    "nota_inmuebles": "One row per line of the declaration (a line may declare several units).",
    "nota_entidades": "An organisation appearing here does not imply any wrongdoing: it is what the official documents state.",
    "nota_borme": "Only acts confirmed by another official document. The BORME does not publish ID numbers: unconfirmed name matches are not included.",
    "conf_declarada": "In their documents",
    "conf_cargo-publico": "Public company of their position",
    "conf_apellido": "Bears their name",
    "tipo_empresa": "Company",
    "tipo_publica": "Public sector",
    "tipo_fundacion": "Foundation",
    "tipo_asociacion": "Association or NGO",
    "tipo_partido": "Political party",
    "tipo_sindicato": "Trade union",
    "tipo_educacion": "Education and research",
    "tipo_colegio": "Professional association",
    "tipo_otra": "Other",
    "fuente_compatibilidad": "Congress decision (BOCG)",
    "fuente_registro": "Register of Interests",
    "fuente_intereses": "Economic interests declaration",
    "fuente_bienes": "Assets declaration",
    "fuente_ficha": "Official profile",
    "tablas": {
      "diputados": {
        "nombre": "Deputies",
        "descripcion": "One row per deputy: profile, assets, income, debts and a summary of their votes"
      },
      "inmuebles": {
        "nombre": "Properties",
        "descripcion": "One row per declared property"
      },
      "entidades": {
        "nombre": "Companies and organisations",
        "descripcion": "One row per official document that names a company or organisation together with a member"
      },
      "borme": {
        "nombre": "BORME positions",
        "descripcion": "One row per Companies Register act (appointment, resignation…) under a member’s name, confirmed by another official document"
      },
      "votaciones": {
        "nombre": "Votes",
        "descripcion": "One row per plenary vote, with its result"
      },
      "votos-grupo": {
        "nombre": "Each group’s vote",
        "descripcion": "One row per vote and group, with the group’s majority vote"
      },
      "votos": {
        "nombre": "Each deputy’s vote",
        "descripcion": "One row per deputy and vote (over 700,000)"
      }
    },
    "filtros": {
      "buscar": "Search",
      "grupo": "Group",
      "circunscripcion": "Constituency",
      "genero": "Sex",
      "es_vivienda": "Home",
      "titular": "Holder",
      "tipo_entidad": "Type of organisation",
      "fuente": "Document",
      "confirmacion": "How it is confirmed",
      "fechas": "Dates",
      "temas": "Topic",
      "resultado": "Result",
      "voto": "Vote"
    },
    "columnas": {
      "id": {
        "nombre": "Code",
        "descripcion": "Official parliamentary code of the deputy"
      },
      "nombre": {
        "nombre": "First name",
        "descripcion": "Given name, as in the official profile"
      },
      "apellidos": {
        "nombre": "Surnames",
        "descripcion": "Surnames, as in the official profile"
      },
      "genero": {
        "nombre": "Sex",
        "descripcion": "F or M, as in the official profile"
      },
      "grupo": {
        "nombre": "Group",
        "descripcion": "Parliamentary group (short name)"
      },
      "grupo_nombre": {
        "nombre": "Group (official name)",
        "descripcion": "Official name of the parliamentary group"
      },
      "partido": {
        "nombre": "Electoral list",
        "descripcion": "List on which they were elected"
      },
      "circunscripcion": {
        "nombre": "Constituency",
        "descripcion": "Province or city they were elected for"
      },
      "fecha_alta": {
        "nombre": "Start date",
        "descripcion": "Date they took their seat"
      },
      "anio_nacimiento": {
        "nombre": "Year of birth",
        "descripcion": "As in the official profile"
      },
      "legislaturas": {
        "nombre": "Terms",
        "descripcion": "Number of terms as a deputy"
      },
      "cargos": {
        "nombre": "Positions",
        "descripcion": "Current positions in Congress"
      },
      "formacion": {
        "nombre": "Education",
        "descripcion": "Literal text from the official profile"
      },
      "tipo_formacion": {
        "nombre": "University type",
        "descripcion": "publica, privada, ambas, sin-centro or sin-datos (per RUCT)"
      },
      "retribucion_mensual": {
        "nombre": "Monthly pay (€)",
        "descripcion": "Official monthly amounts from Congress"
      },
      "propiedades": {
        "nombre": "Properties",
        "descripcion": "Real estate declared in their name"
      },
      "viviendas": {
        "nombre": "Homes",
        "descripcion": "Residential properties declared"
      },
      "vehiculos": {
        "nombre": "Vehicles",
        "descripcion": "Vehicles declared"
      },
      "rentas_declaradas": {
        "nombre": "Declared income (€)",
        "descripcion": "Income in the year before the declaration, excluding Congress pay"
      },
      "rentas_al_menos": {
        "nombre": "Income: at least",
        "descripcion": "Some amount could not be read: the total is a minimum"
      },
      "depositos": {
        "nombre": "Accounts and deposits (€)",
        "descripcion": "Declared balance in accounts and deposits"
      },
      "depositos_al_menos": {
        "nombre": "Deposits: at least",
        "descripcion": "Some amount could not be read: the total is a minimum"
      },
      "deuda_pendiente": {
        "nombre": "Outstanding debt (€)",
        "descripcion": "Outstanding balance of declared loans"
      },
      "deuda_al_menos": {
        "nombre": "Debt: at least",
        "descripcion": "Some amount could not be read: the total is a minimum"
      },
      "votaciones_en_escano": {
        "nombre": "Votes while seated",
        "descripcion": "Plenary votes held while they had a seat"
      },
      "votos_si": {
        "nombre": "Yes votes",
        "descripcion": "Times they voted yes"
      },
      "votos_no": {
        "nombre": "No votes",
        "descripcion": "Times they voted no"
      },
      "votos_abstencion": {
        "nombre": "Abstentions",
        "descripcion": "Times they abstained"
      },
      "no_vota": {
        "nombre": "Did not vote",
        "descripcion": "Votes in which they did not vote"
      },
      "votos_distintos_del_grupo": {
        "nombre": "Votes against group",
        "descripcion": "Times they voted differently from their group majority"
      },
      "lectura_no_confirmada": {
        "nombre": "Unconfirmed reading",
        "descripcion": "Some value could not be fully confirmed: check the official PDF"
      },
      "url_ficha_oficial": {
        "nombre": "Official profile",
        "descripcion": "Profile on congreso.es"
      },
      "url_declaracion_bienes": {
        "nombre": "Asset declaration",
        "descripcion": "Official PDF of the asset declaration"
      },
      "url_congreso_abierto": {
        "nombre": "Congreso Abierto profile",
        "descripcion": "Their profile on this site"
      },
      "diputado_id": {
        "nombre": "Deputy code",
        "descripcion": "Official parliamentary code"
      },
      "diputado": {
        "nombre": "Deputy",
        "descripcion": "Full name"
      },
      "titular": {
        "nombre": "Holder",
        "descripcion": "propio (in their name) or sociedad (via a company)"
      },
      "descripcion": {
        "nombre": "Description",
        "descripcion": "Literal text of the declaration"
      },
      "naturaleza": {
        "nombre": "Type",
        "descripcion": "urbana, rustica or sociedad"
      },
      "es_vivienda": {
        "nombre": "Is a home",
        "descripcion": "Residential use (flat, house…)"
      },
      "provincia": {
        "nombre": "Province",
        "descripcion": "Province of the property, if stated"
      },
      "anio_adquisicion": {
        "nombre": "Year acquired",
        "descripcion": "If stated"
      },
      "derecho": {
        "nombre": "Right",
        "descripcion": "Literal text: full ownership, bare ownership…"
      },
      "porcentaje": {
        "nombre": "Share (%)",
        "descripcion": "Ownership share, if stated"
      },
      "titulo": {
        "nombre": "Title",
        "descripcion": "Official text of the matter voted on"
      },
      "url_declaracion": {
        "nombre": "Declaration",
        "descripcion": "Official PDF"
      },
      "entidad": {
        "nombre": "Organisation",
        "descripcion": "Name of the company or organisation as it appears in the document (variants grouped)"
      },
      "tipo_entidad": {
        "nombre": "Type of organisation",
        "descripcion": "empresa (company), publica (public sector), fundacion, asociacion, partido, sindicato, educacion, colegio or otra"
      },
      "relacion": {
        "nombre": "Relationship",
        "descripcion": "Position or activity stated in the document, summarised from its text"
      },
      "fuente": {
        "nombre": "Document",
        "descripcion": "compatibilidad (BOCG), registro (Register of Interests), intereses (economic interests), bienes (assets) or ficha (official profile)"
      },
      "texto": {
        "nombre": "Original text",
        "descripcion": "Text of the official document where it appears (in Spanish)"
      },
      "url_documento": {
        "nombre": "Document (link)",
        "descripcion": "Official PDF or page"
      },
      "empresa": {
        "nombre": "Company",
        "descripcion": "Company name as published in the BORME"
      },
      "confirmacion": {
        "nombre": "How it is confirmed",
        "descripcion": "declarada (the company is in their documents), cargo-publico (public company of an administration where they declare a position) or apellido (the company bears their name)"
      },
      "motivo": {
        "nombre": "Confirming document",
        "descripcion": "Organisation in their official documents that confirms it is the same person"
      },
      "acto": {
        "nombre": "Act",
        "descripcion": "Appointments, resignations, revocations… as written in the BORME (in Spanish)"
      },
      "cargo": {
        "nombre": "Position",
        "descripcion": "Position with the BORME’s abbreviations"
      },
      "registro": {
        "nombre": "Companies Register",
        "descripcion": "Province of the register where it is recorded"
      },
      "url_borme": {
        "nombre": "BORME (link)",
        "descripcion": "Official notice on boe.es"
      },
      "fecha": {
        "nombre": "Date",
        "descripcion": "YYYY-MM-DD"
      },
      "sesion": {
        "nombre": "Session",
        "descripcion": "Plenary session number"
      },
      "numero": {
        "nombre": "Number",
        "descripcion": "Vote number within the session"
      },
      "tipo": {
        "nombre": "Type",
        "descripcion": "Type of initiative (official text)"
      },
      "temas": {
        "nombre": "Topics",
        "descripcion": "Congreso Abierto topics, assigned by title keywords"
      },
      "resultado": {
        "nombre": "Result",
        "descripcion": "Official result"
      },
      "si": {
        "nombre": "Yes",
        "descripcion": "Votes in favour"
      },
      "no": {
        "nombre": "No",
        "descripcion": "Votes against"
      },
      "abstencion": {
        "nombre": "Abstention",
        "descripcion": "Abstention votes"
      },
      "url_votacion": {
        "nombre": "Vote (official)",
        "descripcion": "Official JSON of the vote"
      },
      "url_expediente": {
        "nombre": "File",
        "descripcion": "Official page of the file"
      },
      "votacion_id": {
        "nombre": "Vote",
        "descripcion": "Vote identifier (session and number)"
      },
      "voto_mayoritario": {
        "nombre": "Majority vote",
        "descripcion": "What most of the group voted (Sí, No, Abstención or Empate)"
      },
      "voto": {
        "nombre": "Vote",
        "descripcion": "Sí, No, Abstención or No vota (official value)"
      }
    }
  },
});
