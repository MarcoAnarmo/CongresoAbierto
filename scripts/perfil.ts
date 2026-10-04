/**
 * Perfil de cada diputado a partir de su «Ficha personal» oficial (data/raw/fichas-personales.jsonl,
 * descargada con scripts/browser/fichas-personales.js) y de sus declaraciones de bienes transcritas.
 * El texto de formación y trayectoria se copia literalmente; solo se ordena y se separa por líneas.
 * Reglas documentadas en docs/metodologia.md.
 */
import { readFileSync, existsSync } from 'node:fs';
import { construirPatrimonio, type DeclRaw } from './patrimonio.ts';
import { resumenDeudas } from './deudas.ts';
import type { Perfil, LineaFormacion, Evento, Universidad } from '../src/lib/types.ts';

interface FichaRaw {
  cod: number; nacimiento: string | null; legislaturas: string; lineas: string[]; condicionPlena: string | null;
  cargos: { cargo: string; desde: string | null }[];
  bienes: { fecha: string | null; url: string }[];
  interesesEconomicos: { fecha: string | null; url: string }[];
  actividades: { fecha: string | null; url: string }[];
}

const RUTA = 'data/raw/fichas-personales.jsonl';
export const fichasPersonales = new Map<number, FichaRaw>(
  existsSync(RUTA) ? readFileSync(RUTA, 'utf8').split('\n').filter(Boolean).map((l) => { const f = JSON.parse(l) as FichaRaw; return [f.cod, f]; }) : [],
);

const ruct = JSON.parse(readFileSync('data/manual/universidades.json', 'utf8')) as { fuente: { url: string }; universidades: { codigo: string; nombre: string; tipo: 'pública' | 'privada'; alias: string[] }[] };
export const FUENTE_RUCT = ruct.fuente;
const norm = (s: string) => ` ${s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9/]+/g, ' ').trim()} `;
// Nombres y alias, del más largo al más corto (así «Politécnica de Valencia» gana a «Universidad de Valencia»)
const nombresRuct = ruct.universidades.flatMap((u) => [u.nombre, ...u.alias].map((n) => ({ n: norm(n), u })))
  .sort((a, b) => b.n.length - a.n.length);

/** Líneas que describen estudios o títulos (lo demás es trayectoria). */
const RE_FORMACION = /\b(licenciad|graduad|grado (en|de|superior)|diplomad|doctor(a)? (en|por|cum)|doctorad|m[aá]ster|mba\b|ingenier|arquitect|t[eé]cnic[oa] (superior|en|de)|t[ií]tulo|titulad|bachiller|formaci[oó]n profesional|ciclo (formativo|superior)|estudi(os|ó|a) |posgrado|postgrado|experto (universitario|en)|especialista universitari|programa (de|en) (direcci|alta direcci|desarrollo directivo|liderazgo)|programa (ejecutivo|executive)|\bcursos? (de|en|experto|superior)|\bcurso escuela|diploma |estudiante|\bdea\b|\bmba\b)/i;
/** Frases de empleo: una universidad citada en ellas es donde trabaja, no donde estudió. */
const RE_TRABAJO = /\b(profesor|profesora|catedr[aá]tic[oa]|docente|investigador|investigadora|ayudante|trabaj(a|ó|aba|ando|ador|adora)|director|directora|coordinador|coordinadora|responsable|gerente|jef[ea]|rector|decan[oa]|vicerrector)\b|\(grupo \d/i;
/** Menciones a centros que no se pueden clasificar con el RUCT (extranjeros, escuelas no universitarias…). */
const RE_CENTRO = /\b(Universidad|Universitat|Universidade|University|Universit[éàä]|Escuela|School|College|Instituto|Facultad|Conservatorio|Academia|Business School)\b/;

/** Frases de una línea («Licenciado en Derecho. Universidad de Valladolid.»). */
const frases = (l: string) => l.split(/(?<!\b[A-Z]{1,3})\.\s+|;\s+/).map((x) => x.trim()).filter(Boolean);
/** «Técnico en…» es un título solo en frases cortas; en las largas suele describir un puesto. */
const RE_TECNICO = /t[eé]cnic[oa] (superior|en|de)/gi;
const esEstudio = (f: string) => !RE_TRABAJO.test(f)
  && (RE_FORMACION.test(f.replace(RE_TECNICO, '')) || (f.length < 120 && new RegExp(RE_TECNICO.source, 'i').test(f)));

/**
 * Universidades donde estudió según una línea: solo las citadas en frases de estudios
 * (o en una frase que solo nombra el centro, justo después de una frase de estudios).
 */
function centrosDeEstudio(linea: string): Universidad[] {
  const out: Universidad[] = []; let previaEstudio = false;
  for (const f of frases(linea)) {
    const estudio = esEstudio(f);
    const soloCentro = !RE_FORMACION.test(f) && !RE_TRABAJO.test(f);
    if (estudio || (soloCentro && previaEstudio)) for (const u of centros(f)) if (!out.some((x) => x.codigo === u.codigo)) out.push(u);
    previaEstudio = estudio || (soloCentro && previaEstudio);
  }
  return out;
}

function centros(texto: string): Universidad[] {
  const t = norm(texto); const encontrados: Universidad[] = []; let resto = t;
  for (const { n, u } of nombresRuct) {
    if (resto.includes(n)) {
      if (!encontrados.some((x) => x.codigo === u.codigo)) encontrados.push({ codigo: u.codigo, nombre: u.nombre, tipo: u.tipo });
      resto = resto.replace(n, ' ');
    }
  }
  return encontrados;
}

/** Une los años sueltos («1995.», «2018 2021.») a la línea anterior, como se leen en la ficha. */
function unirLineas(lineas: string[]): string[] {
  const out: string[] = [];
  for (const l of lineas) {
    if (/^[\d\s\-–/.,y]+$/.test(l) && /\d{4}/.test(l) && out.length) out[out.length - 1] = `${out[out.length - 1].replace(/\.$/, '')} ${l}`;
    else out.push(l);
  }
  return out;
}

const ROMANOS: Record<string, [number, number | null]> = {
  'Constituyentes': [1977, 1979], I: [1979, 1982], II: [1982, 1986], III: [1986, 1989], IV: [1989, 1993], V: [1993, 1996], VI: [1996, 2000],
  VII: [2000, 2004], VIII: [2004, 2008], IX: [2008, 2011], X: [2011, 2015], XI: [2016, 2016], XII: [2016, 2019], XIII: [2019, 2019], XIV: [2019, 2023], XV: [2023, null],
};
const legislaturasDe = (t: string) => (t.match(/\b(XV|XIV|XIII|XII|XI|X|IX|VIII|VII|VI|V|IV|III|II|I|Constituyentes)\b/g) ?? []).filter((x, i, a) => a.indexOf(x) === i);

/** Cargos actuales: la ficha mezcla en la misma lista iniciativas e intervenciones; se quitan. */
const esCargo = (c: string) => !/Fecha: |Presentad[oa] el|\(\d{3}\/\d{3,6}\)|Pregunta |Comparecencia|Proposici[oó]n|Interpelaci|Moci[oó]n /i.test(c);

const fechaPdf = (url: string) => { const m = url.match(/_(\d{4})(\d{2})(\d{2})\.pdf$/); return m ? `${m[1]}-${m[2]}-${m[3]}` : null; };

export function construirPerfil(cod: number, genero: 'F' | 'M', decls: DeclRaw[], urlBienes: string): Perfil | null {
  const f = fichasPersonales.get(cod);
  if (!f) return null;
  const lineas = unirLineas(f.lineas);
  const formacion: LineaFormacion[] = []; const trayectoria: string[] = [];
  for (const l of lineas) {
    if (frases(l).some(esEstudio)) {
      const cs = centrosDeEstudio(l);
      formacion.push({ texto: l, centros: cs, otroCentro: cs.length === 0 && RE_CENTRO.test(l) });
    } else trayectoria.push(l);
  }
  const tipos = new Set(formacion.flatMap((x) => x.centros.map((c) => c.tipo)));
  const tipoFormacion: Perfil['tipoFormacion'] = !formacion.length ? 'sin-datos'
    : tipos.size === 2 ? 'ambas' : tipos.has('pública') ? 'publica' : tipos.has('privada') ? 'privada' : 'sin-centro';

  const legs = legislaturasDe(f.legislaturas);
  const eventos: Evento[] = [];
  const dip = genero === 'F' ? 'Diputada' : 'Diputado';
  for (const l of legs) {
    const [ini, fin] = ROMANOS[l];
    if (l === 'XV') continue; // la XV se fecha con la condición plena
    eventos.push({ fecha: String(ini), tipo: 'legislatura', texto: `${dip} en la ${l} Legislatura (${ini}${fin && fin !== ini ? `–${fin}` : ''})` });
  }
  if (f.condicionPlena) eventos.push({ fecha: f.condicionPlena, tipo: 'legislatura', texto: `Adquiere la condición plena de ${dip.toLowerCase()} en la XV Legislatura` });
  // En la línea de tiempo, los cargos titulares (no adscripciones, suplencias ni ponencias, que están en la ficha oficial)
  for (const c of f.cargos.filter((c) => esCargo(c.cargo) && c.desde && !/^(Adscrit|Ponente)|Suplente/.test(c.cargo))) eventos.push({ fecha: c.desde!, tipo: 'cargo', texto: c.cargo });
  for (const t of trayectoria) {
    const anios = t.match(/\b(19[4-9]\d|20[0-2]\d)\b/g);
    if (anios) eventos.push({ fecha: anios[0], tipo: 'trayectoria', texto: t });
  }
  // Declaraciones de bienes: resumen de cada una (las completas) o los cambios que comunica (las parciales)
  const porPdf = new Map(decls.map((d) => [d.pdf, d]));
  for (const b of f.bienes) {
    const pdf = b.url.split('/').pop()!; const d = porPdf.get(pdf); const fecha = b.fecha ?? fechaPdf(b.url);
    if (!fecha) continue;
    let resumen: string | undefined;
    if (d && !d.esModificacionParcial) {
      const p = construirPatrimonio([d], urlBienes, {});
      resumen = `${p.propiedades} ${p.propiedades === 1 ? 'propiedad' : 'propiedades'} (${p.viviendas} ${p.viviendas === 1 ? 'vivienda' : 'viviendas'}) y ${p.vehiculos} ${p.vehiculos === 1 ? 'vehículo' : 'vehículos'}`;
    } else if (d) resumen = d.cambios?.trim() || d.obs?.trim() || 'Comunica cambios en su patrimonio';
    const deudas = resumenDeudas(pdf);
    if (deudas && !(d?.esModificacionParcial && deudas === 'sin préstamos declarados')) resumen = [resumen, `deudas: ${deudas}`].filter(Boolean).join(' · ');
    eventos.push({ fecha, tipo: 'bienes', texto: d?.esModificacionParcial ? 'Modificación de su declaración de bienes' : 'Declaración de bienes y rentas', detalle: resumen, url: b.url });
  }
  for (const i of f.interesesEconomicos) {
    const fecha = i.fecha ?? fechaPdf(i.url);
    if (fecha) eventos.push({ fecha, tipo: 'intereses', texto: 'Declaración de intereses económicos', url: i.url });
  }
  eventos.sort((a, b) => b.fecha.localeCompare(a.fecha));

  return {
    anioNacimiento: f.nacimiento ? +f.nacimiento.slice(0, 4) : null,
    legislaturas: legs,
    legislaturasTexto: f.legislaturas,
    formacion, trayectoria, tipoFormacion,
    cargosActuales: f.cargos.filter((c) => esCargo(c.cargo)),
    eventos,
    declaracionActividades: f.actividades[0]?.url ?? null,
    declaracionesIntereses: f.interesesEconomicos.map((i) => ({ fecha: i.fecha ?? fechaPdf(i.url), url: i.url })),
  };
}
