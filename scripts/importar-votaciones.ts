/**
 * Convierte los JSON oficiales de votaciones del Pleno (data/raw/votaciones/descargas/*.jsonl,
 * descargados con scripts/browser/votaciones-pleno.js) en un fichero compacto y estable:
 *   data/raw/votaciones/pleno.jsonl   (una votación por línea; voto de cada diputado por su código)
 * Comprueba que el recuento nominal coincide con los totales oficiales; si no, se detiene.
 * Guarda también el recuento por grupo parlamentario tal y como lo publica el Congreso en cada votación
 * (el grupo de cada diputado en esa fecha), así sirve aunque luego cambie la composición de los grupos.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'data/raw/votaciones';
const SALIDA = join(DIR, 'pleno.jsonl');
const LETRA: Record<string, string> = { 'Sí': 'S', 'No': 'N', 'Abstención': 'A', 'No vota': 'X' };

const codPorNombre = new Map(readFileSync('data/raw/diputados_base.tsv', 'utf8').split('\n').filter(Boolean)
  .map((l) => l.split('|')).map(([cod, apellidos, nombre]) => [`${apellidos}, ${nombre}`.trim(), cod]));

export interface VotacionPleno {
  id: string; fuente: string; fecha: string; sesion: number; numero: number;
  tipo: string; texto: string; subgrupo: string[]; asentimiento: boolean;
  totales: { si: number; no: number; abstencion: number; noVota: number };
  /** Códigos de los diputados actuales que votaron cada opción, separados por espacios (S, N, A, X). */
  votos: Record<string, string>;
  /** PDF oficial con el resultado (su nombre no coincide con el del JSON, así que se toma de la página del día). */
  pdf?: string;
  /** Recuento por grupo oficial (código del Congreso: GP, GS, GVOX…): [sí, no, abstención, no vota]. */
  grupos: Record<string, [number, number, number, number]>;
}

/** Acepta el formato antiguo ({ cod: letra }) y el nuevo ({ letra: 'cod cod …' }). */
function compactar(votos: Record<string, string>): Record<string, string> {
  if (Object.keys(votos).every((k) => /^[SNAX]$/.test(k))) return votos;
  const r: Record<string, string[]> = { S: [], N: [], A: [], X: [] };
  for (const [cod, l] of Object.entries(votos)) r[l]?.push(cod);
  return Object.fromEntries(Object.entries(r).filter(([, v]) => v.length).map(([k, v]) => [k, v.sort((a, b) => +a - +b).join(' ')]));
}

const existentes = new Map<string, VotacionPleno>(existsSync(SALIDA)
  ? readFileSync(SALIDA, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)).map((v: VotacionPleno) => [v.id, v])
  : []);
const antes = existentes.size;
const sinDiputado = new Set<string>();

for (const f of readdirSync(join(DIR, 'descargas')).filter((x) => x.endsWith('.jsonl')).sort()) {
  for (const linea of readFileSync(join(DIR, 'descargas', f), 'utf8').split('\n').filter(Boolean)) {
    const { url, datos, pdf } = JSON.parse(linea);
    const d = datos.data ?? datos;
    const i = d.informacion; const t = d.totales;
    const [dia, mes, anio] = String(i.fecha).split('/').map(Number);
    const fecha = `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    const cuenta: Record<string, number> = { S: 0, N: 0, A: 0, X: 0 };
    const votos: Record<string, string> = {};
    const porGrupo: Record<string, [number, number, number, number]> = {};
    for (const x of d.votaciones ?? []) {
      const letra = LETRA[x.voto] ?? 'X';
      cuenta[letra]++;
      const g = String(x.grupo ?? '').trim() || '?';
      (porGrupo[g] ??= [0, 0, 0, 0])['SNAX'.indexOf(letra)]++;
      const cod = codPorNombre.get(String(x.diputado).trim());
      if (cod) votos[cod] = letra; else sinDiputado.add(x.diputado);
    }
    const totales = { si: +t.afavor, no: +t.enContra, abstencion: +t.abstenciones, noVota: +t.noVotan };
    if ((d.votaciones ?? []).length && (cuenta.S !== totales.si || cuenta.N !== totales.no || cuenta.A !== totales.abstencion)) {
      throw new Error(`${url}: el recuento nominal (${cuenta.S}/${cuenta.N}/${cuenta.A}) no coincide con los totales oficiales (${totales.si}/${totales.no}/${totales.abstencion})`);
    }
    const id = `s${i.sesion}-v${String(i.numeroVotacion).padStart(3, '0')}`;
    existentes.set(id, {
      id, fuente: url, fecha, sesion: +i.sesion, numero: +i.numeroVotacion,
      tipo: String(i.titulo ?? '').trim(), texto: String(i.textoExpediente ?? '').trim(),
      subgrupo: [i.tituloSubGrupo, i.textoSubGrupo].map((s) => String(s ?? '').trim()).filter(Boolean),
      asentimiento: t.asentimiento === 'Sí', totales, votos: compactar(votos), grupos: porGrupo,
      ...(pdf ? { pdf } : existentes.get(id)?.pdf ? { pdf: existentes.get(id)!.pdf } : {}),
    });
  }
}

// Enlaces a los PDF oficiales recogidos aparte (descargas/pdfs.json: { urlJson: urlPdf })
const RUTA_PDFS = join(DIR, 'descargas', 'pdfs.json');
const pdfs: Record<string, string> = existsSync(RUTA_PDFS) ? JSON.parse(readFileSync(RUTA_PDFS, 'utf8')) : {};
for (const v of existentes.values()) if (pdfs[v.fuente]) v.pdf = pdfs[v.fuente];
const todas = [...existentes.values()].map((v) => ({ ...v, votos: compactar(v.votos) })).sort((a, b) => a.fecha.localeCompare(b.fecha) || a.sesion - b.sesion || a.numero - b.numero);
writeFileSync(SALIDA, todas.map((v) => JSON.stringify(v)).join('\n') + '\n');
console.log(`OK: ${todas.length} votaciones del Pleno (${todas.length - antes} nuevas) en ${SALIDA}`);
if (sinDiputado.size) console.log(`Votos de personas que ya no son diputadas (cuentan en los totales, no en el hemiciclo): ${[...sinDiputado].join('; ')}`);
