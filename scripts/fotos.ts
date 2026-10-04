/**
 * Guarda en data/fotos las fotos oficiales descargadas con scripts/browser/fotos.js.
 * Uso: npx tsx scripts/fotos.ts ~/Downloads/congreso-fotos.json
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const fichero = process.argv[2];
if (!fichero) throw new Error('Indica el fichero congreso-fotos.json');
const fotos = JSON.parse(readFileSync(fichero, 'utf8')) as Record<string, string>;
mkdirSync('data/fotos', { recursive: true });
for (const [cod, b64] of Object.entries(fotos)) writeFileSync(`data/fotos/${cod}_15.jpg`, Buffer.from(b64, 'base64'));
console.log(`${Object.keys(fotos).length} fotos guardadas en data/fotos`);
