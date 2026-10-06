/**
 * Datos estructurados (JSON-LD, schema.org) para los buscadores.
 * Cada función devuelve un objeto que Base.astro inserta en <script type="application/ld+json">.
 * Solo describen datos que ya están en la página: nada que el usuario no vea.
 */
import type { Diputado } from './types';
import { REPO } from './data';

export type JsonLd = Record<string, unknown>;

const SITIO = 'https://congresoabierto.org';
const abs = (p: string) => new URL(p, SITIO).href;

/** Organización y sitio web (portada). */
export const sitio = (lang: string, nombre: string, descripcion: string): JsonLd[] => [
  { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITIO}/#web`, url: abs('/'), name: nombre, description: descripcion, inLanguage: lang, publisher: { '@id': `${SITIO}/#org` } },
  { '@context': 'https://schema.org', '@type': 'Organization', '@id': `${SITIO}/#org`, name: 'Congreso Abierto', url: abs('/'), logo: abs('/apple-touch-icon.png'), email: 'ayuda@congresoabierto.org', sameAs: [REPO] },
];

/** Migas de pan: [['Diputados', '/diputados'], ['Nombre', '/diputado/…']]. */
export const migas = (items: [string, string][]): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, ruta], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(ruta) })),
});

/** Persona: el diputado, con su cargo, grupo y circunscripción tal como los publica el Congreso. */
export const persona = (d: Diputado, ruta: string, cargo: string): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${abs(ruta)}#persona`,
  name: d.nombreCompleto,
  givenName: d.nombre,
  familyName: d.apellidos,
  url: abs(ruta),
  image: d.fotoUrl,
  jobTitle: cargo,
  ...(d.perfil?.anioNacimiento ? { birthDate: String(d.perfil.anioNacimiento) } : {}),
  memberOf: [
    { '@type': 'GovernmentOrganization', name: 'Congreso de los Diputados', url: 'https://www.congreso.es' },
    { '@type': 'Organization', name: d.grupo },
  ],
  workLocation: { '@type': 'AdministrativeArea', name: d.circunscripcion },
  sameAs: [d.fichaUrl],
});

/** Conjunto de datos descargable (Google Dataset Search). */
export const conjuntoDatos = (o: { nombre: string; descripcion: string; ruta: string; licencia: string; palabras: string[]; descargas: { nombre: string; ruta: string; formato: string }[]; modificado: string; lang: string }): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: o.nombre,
  description: o.descripcion,
  url: abs(o.ruta),
  inLanguage: o.lang,
  license: o.licencia,
  isAccessibleForFree: true,
  keywords: o.palabras,
  dateModified: o.modificado,
  creator: { '@id': `${SITIO}/#org`, '@type': 'Organization', name: 'Congreso Abierto', url: abs('/') },
  isBasedOn: 'https://www.congreso.es/es/datos-abiertos',
  spatialCoverage: { '@type': 'Place', name: 'España' },
  distribution: o.descargas.map((x) => ({ '@type': 'DataDownload', name: x.nombre, encodingFormat: x.formato, contentUrl: abs(x.ruta) })),
});

/** Serializa para <script type="application/ld+json"> sin que un «</script>» en los datos cierre la etiqueta. */
export const serializar = (x: JsonLd | JsonLd[]) => JSON.stringify(x).replace(/</g, '\\u003c');
