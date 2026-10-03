// Visor de declaraciones de bienes del Congreso para transcripción asistida.
// Se pega en la consola de una pestaña abierta en https://www.congreso.es
// (mismo origen que los PDFs). Renderiza la página 2 (inmuebles) y la
// sección de vehículos de la página 3 en una sola imagen.
(async () => {
  const m = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.mjs');
  const wtxt = await fetch('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs').then(r => r.text());
  m.GlobalWorkerOptions.workerSrc = URL.createObjectURL(new Blob([wtxt], { type: 'text/javascript' }));
  window.pdfjsLib = m;
  if (!window.Tesseract) {
    await new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js'; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  }
  window._worker = window._worker || await Tesseract.createWorker('spa');
  async function load(url) { const buf = await fetch(url).then(r => r.arrayBuffer()); return m.getDocument({ data: buf }).promise; }
  async function render(pdf, p, scale) { const pg = await pdf.getPage(p); const vp = pg.getViewport({ scale }); const c = document.createElement('canvas'); c.width = vp.width; c.height = vp.height; await pg.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise; pg.cleanup(); return c; }
  function show(canvas) { document.body.innerHTML = ''; document.body.style.margin = '0'; document.body.style.background = '#fff'; canvas.style.display = 'block'; canvas.style.width = '100%'; canvas.style.height = 'auto'; document.body.appendChild(canvas); window.scrollTo(0, 0); }
  // Vista compuesta: cabecera + tabla de inmuebles (pág. 2) + vehículos (pág. 3)
  window._compose = async function (cod, url) {
    const pdf = await load(url); const n = pdf.numPages;
    const W = 800; const p2 = await render(pdf, 2, 2); const p3 = n >= 3 ? await render(pdf, 3, 2) : null;
    let vy = 0.55;
    if (p3) { const res = await window._worker.recognize(p3); const w = []; res.data.blocks.forEach(b => b.paragraphs.forEach(p => p.lines.forEach(li => li.words.forEach(x => w.push(x))))); const v = w.find(x => /VEH/i.test(x.text)); if (v) vy = Math.max(0, v.bbox.y0 / p3.height - 0.01); }
    await pdf.destroy();
    const c2 = [0.07, 0.72], c3 = [vy, Math.min(1, vy + 0.2)];
    const h2 = Math.round(W * (p2.height / p2.width) * (c2[1] - c2[0])); const h3 = p3 ? Math.round(W * (p3.height / p3.width) * (c3[1] - c3[0])) : 0;
    const out = document.createElement('canvas'); out.width = W; out.height = 24 + h2 + h3; const ctx = out.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, out.width, out.height); ctx.fillStyle = '#c00'; ctx.font = 'bold 16px sans-serif'; ctx.fillText(`cod ${cod} · ${n} págs`, 8, 18);
    ctx.drawImage(p2, 0, c2[0] * p2.height, p2.width, (c2[1] - c2[0]) * p2.height, 0, 24, W, h2);
    if (p3) { ctx.drawImage(p3, 0, c3[0] * p3.height, p3.width, (c3[1] - c3[0]) * p3.height, 0, 24 + h2, W, h3); ctx.strokeStyle = '#c00'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 24 + h2); ctx.lineTo(W, 24 + h2); ctx.stroke(); }
    show(out); return { cod, paginas: n };
  };
  // Página completa (por si hace falta revisar observaciones u otras páginas)
  window._page = async function (url, p) { const pdf = await load(url); const c = await render(pdf, p, 1.4); await pdf.destroy(); show(c); return { p }; };
  return 'visor listo';
})();
