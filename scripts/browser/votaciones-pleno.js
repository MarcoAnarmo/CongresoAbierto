// Descarga todas las votaciones del Pleno de un día desde los datos abiertos del Congreso.
//
// Uso:
//   1. Abre https://www.congreso.es/es/opendata/votaciones y elige un día en su calendario.
//   2. Abre la consola (F12), pega este fichero y pulsa Enter (solo la primera vez).
//   3. Ejecuta: await window._bajarVotaciones()
//      Se descarga votaciones-AAAAMMDD.jsonl con el JSON oficial de cada votación de ese día.
//   4. Repite 1 y 3 para cada día. Copia los ficheros a data/raw/votaciones/descargas/
//      y ejecuta: npm run data:votaciones && npm run data:build
(() => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const bajar = (nombre, texto) => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([texto], { type: 'text/plain' })); a.download = nombre; a.click(); };
  window._bajarVotaciones = async () => {
    const urls = [...new Set([...document.querySelectorAll('a[href*="/opendata/votaciones/"][href$=".json"]')].map((a) => new URL(a.getAttribute('href'), location.href).href))];
    if (!urls.length) { console.warn('No hay enlaces JSON de votaciones en esta página. Elige antes un día con votaciones.'); return; }
    // El PDF de cada votación está en la misma carpeta que su JSON, pero con otro nombre
    const pdfDe = (url) => { const dir = url.replace(/[^/]+$/, ''); const a = document.querySelector(`a[href*="${new URL(dir).pathname}"][href$=".pdf"]`); return a ? new URL(a.getAttribute('href'), location.href).href : undefined; };
    const lineas = [];
    for (const url of urls) {
      const datos = await fetch(url).then((r) => r.json());
      lineas.push(JSON.stringify({ url, pdf: pdfDe(url), datos }));
      await sleep(300);
    }
    const dia = (urls[0].match(/\/(\d{8})\//) || [])[1] || 'dia';
    bajar(`votaciones-${dia}.jsonl`, lineas.join('\n') + '\n');
    console.log(`${urls.length} votaciones del ${dia} descargadas.`);
  };
  console.log('Listo. Elige un día en el calendario y ejecuta: await window._bajarVotaciones()');
})();
