// Descarga las fotos oficiales de los diputados (congreso.es) para las tarjetas para compartir.
// congreso.es no deja descargarlas desde el build (Cloudflare) ni desde servidores, así que se guardan en el repositorio.
//
// Uso: abre https://www.congreso.es/es/busqueda-de-diputados, abre la consola (F12), pega este fichero y pulsa Enter.
// Se descarga congreso-fotos.json → ejecuta `npx tsx scripts/fotos.ts ~/Downloads/congreso-fotos.json`.
(async () => {
  const body = new URLSearchParams({ _diputadomodule_idLegislatura: '15', _diputadomodule_genero: '0', _diputadomodule_grupo: 'all', _diputadomodule_tipo: '0', _diputadomodule_nombre: '', _diputadomodule_apellidos: '', _diputadomodule_formacion: 'all', _diputadomodule_filtroProvincias: '[]', _diputadomodule_nombreCircunscripcion: '' });
  const lista = (await fetch('/es/busqueda-de-diputados?p_p_id=diputadomodule&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_resource_id=searchDiputados&p_p_cacheability=cacheLevelPage', { method: 'POST', body, headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest' } }).then((r) => r.json())).data;
  const salida = {};
  const fallos = [];
  // Se vuelven a codificar en JPEG (mismo tamaño, calidad 92) para que ocupen menos.
  const una = async (cod) => {
    const r = await fetch(`/docu/imgweb/diputados/${cod}_15.jpg`);
    if (!r.ok) throw new Error(String(r.status));
    const bm = await createImageBitmap(await r.blob());
    const cv = new OffscreenCanvas(bm.width, bm.height);
    cv.getContext('2d').drawImage(bm, 0, 0);
    const buf = new Uint8Array(await (await cv.convertToBlob({ type: 'image/jpeg', quality: 0.92 })).arrayBuffer());
    let s = '';
    for (let i = 0; i < buf.length; i += 8192) s += String.fromCharCode(...buf.subarray(i, i + 8192));
    salida[cod] = btoa(s);
  };
  const cods = lista.map((d) => d.codParlamentario);
  for (let i = 0; i < cods.length; i += 10) await Promise.all(cods.slice(i, i + 10).map((c) => una(c).catch((e) => fallos.push(`${c}: ${e.message}`))));
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(salida)], { type: 'application/json' }));
  a.download = 'congreso-fotos.json';
  a.click();
  console.log(`${Object.keys(salida).length} fotos descargadas`, fallos.length ? `· fallos: ${fallos.join(', ')}` : '');
})();
