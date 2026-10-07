/**
 * Reúne, para cada diputado, todos los textos oficiales en los que puede aparecer el nombre de una empresa,
 * administración, fundación, asociación u otra entidad. Cada texto lleva su fuente (PDF oficial y fecha).
 *   - Registro de Intereses - Actividades (secciones A-H)
 *   - Acuerdos de la Comisión del Estatuto sobre compatibilidad (BOCG, serie D)
 *   - Declaraciones de Intereses Económicos (todas, no solo la última)
 *   - Declaración de bienes: acciones, participaciones y sociedades
 *   - Trayectoria de la ficha oficial del Congreso
 * Salida: data/raw/vinculos/textos.jsonl. Necesita data/congreso/diputados.json (npm run data:build).
 * Uso: npx tsx scripts/vinculos-textos.ts
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import type { Diputado } from '../src/lib/types.ts';
import { idTexto, type TextoFuente } from '../src/lib/vinculos.ts';

const leer = <T>(ruta: string): T[] => (existsSync(ruta) ? readFileSync(ruta, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l) as T) : []);
const vacio = (t?: string) => !t?.trim() || /^([-—–_.\s/]+|ningun[oa]s?|no|nada|n\/a|no hay|no poseo|no procede|no tengo)\.?$/i.test(t.trim());

const diputados = (JSON.parse(readFileSync('data/congreso/diputados.json', 'utf8')) as { diputados: Diputado[] }).diputados;
const fichas = new Map(leer<{ cod: number; interesesEconomicos: { fecha: string | null; url: string }[] }>('data/raw/fichas-personales.jsonl').map((f) => [f.cod, f]));
const economicos = new Map(leer<{ pdf: string; actividades: Record<string, string>[]; donaciones: Record<string, string>[]; fundaciones: Record<string, string>[]; otros: string }>('data/raw/intereses/economicos.jsonl').map((e) => [e.pdf, e]));
const compatibilidad = leer<{ cod: number | null; bocg: string; fecha: string; url: string; puntos: string[] }>('data/raw/intereses/compatibilidad.jsonl');

const textos: TextoFuente[] = [];
const vistos = new Set<string>();
function add(t: Omit<TextoFuente, 'id'>) {
  t.texto = t.texto.replace(/\s+/g, ' ').trim();
  if (vacio(t.texto)) return;
  const id = idTexto(t);
  if (vistos.has(id)) return;
  vistos.add(id);
  textos.push({ id, ...t });
}

for (const d of diputados) {
  const cod = d.codParlamentario;
  // Registro de Intereses - Actividades
  for (const s of d.actividades?.secciones ?? []) {
    for (const it of s.items) add({ cod, fuente: 'registro', apartado: s.id, texto: it.texto, fecha: it.fechaAcuerdo, url: d.actividades!.url });
  }
  // Acuerdos de compatibilidad
  for (const b of compatibilidad.filter((c) => c.cod === cod)) {
    for (const p of b.puntos) add({ cod, fuente: 'compatibilidad', apartado: b.bocg, texto: p, fecha: b.fecha, url: b.url });
  }
  // Declaraciones de intereses económicos (todas)
  for (const decl of fichas.get(cod)?.interesesEconomicos ?? []) {
    const e = economicos.get(decl.url.split('/').pop()!);
    if (!e) continue;
    const base = { cod, fecha: decl.fecha, url: decl.url };
    for (const a of e.actividades) {
      if (vacio(a.empleador) && vacio(a.descripcion)) continue;
      add({ ...base, fuente: 'intereses', apartado: 'actividades', texto: [a.empleador, a.sector, a.descripcion].filter((x) => !vacio(x)).join(' · '), periodo: a.periodo || null });
    }
    for (const x of e.donaciones) if (!vacio(x.benefactor)) add({ ...base, fuente: 'intereses', apartado: 'donaciones', texto: [x.benefactor, x.descripcion].filter((y) => !vacio(y)).join(' · ') });
    for (const x of e.fundaciones) if (!vacio(x.destinatario)) add({ ...base, fuente: 'intereses', apartado: 'contribuciones', texto: [x.destinatario, x.descripcion].filter((y) => !vacio(y)).join(' · ') });
    if (!vacio(e.otros)) add({ ...base, fuente: 'intereses', apartado: 'otros', texto: e.otros });
  }
  // Declaración de bienes: valores y sociedades
  for (const k of ['valores', 'sociedades'] as const) {
    const t = d.finanzas?.[k];
    for (const f of t?.filas ?? []) add({ cod, fuente: 'bienes', apartado: k, texto: f.texto, fecha: t!.fecha, url: t!.url });
  }
  // Trayectoria de la ficha oficial
  for (const l of d.perfil?.trayectoria ?? []) add({ cod, fuente: 'ficha', apartado: 'trayectoria', texto: l, fecha: null, url: d.fichaUrl });
}

mkdirSync('data/raw/vinculos', { recursive: true });
writeFileSync('data/raw/vinculos/textos.jsonl', textos.map((t) => JSON.stringify(t)).join('\n') + '\n');
const porFuente = textos.reduce<Record<string, number>>((m, t) => ((m[t.fuente] = (m[t.fuente] ?? 0) + 1), m), {});
console.log(`textos: ${textos.length}`, porFuente);
