/**
 * Convierte los JSON oficiales de votaciones del Pleno (data/raw/votaciones/descargas/*.jsonl,
 * descargados con scripts/browser/votaciones-pleno.js) en un fichero compacto y estable:
 *   data/raw/votaciones/pleno.jsonl   (una votación por línea; voto de cada diputado por su código)
 * Comprueba que el recuento nominal coincide con los totales oficiales; si no, se detiene.
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
  votos: Record<string, string>;
}

const existentes = new Map<string, VotacionPleno>(existsSync(SALIDA)
  ? readFileSync(SALIDA, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)).map((v: VotacionPleno) => [v.id, v])
  : []);
const antes = existentes.size;
const sinDiputado = new Set<string>();

for (const f of readdirSync(join(DIR, 'descargas')).filter((x) => x.endsWith('.jsonl')).sort()) {
  for (const linea of readFileSync(join(DIR, 'descargas', f), 'utf8').split('\n').filter(Boolean)) {
    const { url, datos } = JSON.parse(linea);
    const d = datos.data ?? datos;
    const i = d.informacion; const t = d.totales;
    const [dia, mes, anio] = String(i.fecha).split('/').map(Number);
    const fecha = `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    const cuenta: Record<string, number> = { S: 0, N: 0, A: 0, X: 0 };
    const votos: Record<string, string> = {};
    for (const x of d.votaciones ?? []) {
      const letra = LETRA[x.voto] ?? 'X';
      cuenta[letra]++;
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
      asentimiento: t.asentimiento === 'Sí', totales, votos,
    });
  }
}

const todas = [...existentes.values()].sort((a, b) => a.fecha.localeCompare(b.fecha) || a.sesion - b.sesion || a.numero - b.numero);
writeFileSync(SALIDA, todas.map((v) => JSON.stringify(v)).join('\n') + '\n');
console.log(`OK: ${todas.length} votaciones del Pleno (${todas.length - antes} nuevas) en ${SALIDA}`);
if (sinDiputado.size) console.log(`Votos de personas que ya no son diputadas (cuentan en los totales, no en el hemiciclo): ${[...sinDiputado].join('; ')}`);
