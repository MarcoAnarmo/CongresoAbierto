// Busca el nombre de cada diputado en todos los actos inscritos del BORME (Sección A) desde 2009.
//
// Fuente: API de datos abiertos del BOE. El sumario de cada día (/datosabiertos/api/borme/sumario/AAAAMMDD)
// enlaza un XML por provincia con los actos inscritos (nombramientos, ceses, constituciones…). Desde mayo de 2026
// el BOE publica ese XML para todo el BORME desde 2009.
//
// Por qué en el navegador: boe.es no responde a algunos servidores en la nube. Desde una pestaña normal funciona.
//
// Uso:
//   1. Genera la lista de diputados: python3 -c "import json;print(json.dumps([[int(r[0]),r[1],r[2]] for r in (l.split('|') for l in open('data/raw/diputados_base.tsv') if l.strip())],ensure_ascii=False))"
//   2. Abre https://www.boe.es/datosabiertos/api/borme/sumario/20261006 y la consola del navegador (F12).
//   3. Escribe `window.DIPS = <lista>` y pega este fichero. Tarda unas 3 horas (unos 4.600 días, 9,6 millones de actos).
//      Guarda cada día en IndexedDB: si se corta, vuelve a pegarlo y sigue donde iba.
//   4. Al terminar descarga borme-coincidencias.json → data/raw/borme/ (no se sube: incluye homónimos).
//   5. python3 scripts/borme-clasificar.py
//
// Solo busca el nombre completo tal como lo escribe el BORME («APELLIDO1 APELLIDO2 NOMBRE») y, aparte, apellidos y primer
// nombre. Una coincidencia de nombre NO es un vínculo: borme-clasificar.py decide cuáles se confirman con otro documento oficial.
(async () => {
  const norm = (s) => s.toUpperCase().replace(/Mª/g, 'MARIA ').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Z0-9;.,:()\s]/g, ' ').replace(/[;.,:()]/g, ' | ').replace(/\s+/g, ' ').trim();
  const CLAVES = new Map();
  const add = (k, v) => { k = norm(k); if (!CLAVES.has(k)) CLAVES.set(k, []); CLAVES.get(k).push(v); };
  for (const [cod, ap, nom] of window.DIPS) {
    const n1 = nom.split(' ')[0];
    for (const a of new Set([ap, ap.replace(/ i /g, ' ')])) {
      add(`${a} ${nom.replace(/ de$/, '')}`, [cod, 'completo']);
      if (n1 !== nom) add(`${a} ${n1}`, [cod, 'primer-nombre']);
    }
  }

  const idb = await new Promise((res, rej) => { const r = indexedDB.open('borme-ca', 1); r.onupgradeneeded = () => r.result.createObjectStore('dias'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  const op = (modo, f) => new Promise((res, rej) => { const t = idb.transaction('dias', modo); const q = f(t.objectStore('dias')); t.oncomplete = () => res(q?.result); t.onerror = () => rej(t.error); });
  const texto = async (url) => { for (let i = 0; i < 4; i++) { try { const r = await fetch(url); if (r.ok) return await r.text(); if (r.status === 404) return null; } catch {} await new Promise((s) => setTimeout(s, 1500 * (i + 1))); } throw new Error(url); };

  function procesar(xml, item, fecha) {
    const doc = new DOMParser().parseFromString(xml, 'text/xml');
    const out = []; let articulo = null, actos = 0;
    for (const p of doc.querySelectorAll('texto > p')) {
      if (p.getAttribute('class') === 'articulo') { articulo = p.textContent.trim(); continue; }
      if (p.getAttribute('class') !== 'parrafo') continue;
      actos++;
      const segs = norm(p.textContent).split(' | ').map((s) => s.trim());
      const vistos = new Set();
      for (let i = 0; i < segs.length; i++) {
        for (const k of [segs[i], i + 1 < segs.length ? `${segs[i]} ${segs[i + 1]}` : null]) {
          for (const [cod, tipo] of (k && CLAVES.get(k)) || []) {
            if (vistos.has(cod + tipo)) continue;
            vistos.add(cod + tipo);
            out.push({ fecha, id: item.identificador, prov: item.titulo, art: articulo, cod, tipo, clave: k, texto: p.textContent.slice(0, 4000) });
          }
        }
      }
    }
    return { out, actos };
  }

  async function dia(fecha) {
    const r = await fetch(`/datosabiertos/api/borme/sumario/${fecha}`, { headers: { Accept: 'application/json' } });
    if (r.status === 404) return { fecha, sin: true };
    const j = await r.json();
    if (!j.data) return { fecha, sin: true };
    const items = [];
    for (const d of [].concat(j.data.sumario.diario)) for (const s of [].concat(d.seccion || [])) if (s.codigo === 'A') for (const it of [].concat(s.item || [])) if (!/-99$/.test(it.identificador)) items.push(it);
    const matches = []; let actos = 0, i = 0;
    const trabajador = async () => { while (i < items.length) { const it = items[i++]; const x = await texto(it.url_xml); if (!x) continue; const res = procesar(x, it, fecha); actos += res.actos; matches.push(...res.out); } };
    await Promise.all(Array.from({ length: 6 }, trabajador));
    return { fecha, items: items.length, actos, matches };
  }

  const fechas = [];
  for (let d = new Date(); d >= new Date(Date.UTC(2009, 0, 1)); d.setUTCDate(d.getUTCDate() - 1)) {
    if (d.getUTCDay() % 6) fechas.push(d.toISOString().slice(0, 10).replace(/-/g, ''));
  }
  const hechas = new Set(await op('readonly', (s) => s.getAllKeys()));
  const pendientes = fechas.filter((f) => !hechas.has(f));
  let n = 0;
  const trabajador = async () => { while (pendientes.length) { const f = pendientes.shift(); const d = await dia(f); await op('readwrite', (s) => s.put(d, f)); if (++n % 50 === 0) console.log(`${n} días · ${f}`); } };
  await Promise.all([trabajador(), trabajador()]);

  const todo = (await op('readonly', (s) => s.getAll())).filter((d) => !d.sin);
  const a = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
  a.setAttribute('href', URL.createObjectURL(new Blob([JSON.stringify(todo)], { type: 'application/json' })));
  a.setAttribute('download', 'borme-coincidencias.json');
  document.documentElement.appendChild(a); a.click();
  console.log(`Hecho: ${todo.length} días, ${todo.reduce((x, d) => x + d.actos, 0)} actos`);
})();
