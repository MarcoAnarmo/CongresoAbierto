// Descarga los datos en bruto del Congreso desde el navegador.
//
// Por qué en el navegador: congreso.es bloquea muchas peticiones automáticas
// (scripts, servidores en la nube). Desde una pestaña normal funciona.
//
// Uso: abre https://www.congreso.es/es/opendata/votaciones, abre la consola
// del navegador (F12), pega este fichero y pulsa Enter. Se descargarán:
//   diputados_base.tsv, fichas.tsv, previas.tsv  → copiar a data/raw/
//   votaciones-compactas.txt                     → copiar a data/raw/votaciones/
// Ve despacio: el script espera entre peticiones para no saturar la web.
(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const bajar = (nombre, texto) => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([texto], { type: 'text/plain' })); a.download = nombre; a.click(); };
  const pd = (t) => { const m = (t || '').match(/(\d\d)\/(\d\d)\/(\d{4})/); return m ? m[3] + m[2] + m[1] : '0'; };

  // 1) Lista de diputados en activo
  const body = new URLSearchParams({ _diputadomodule_idLegislatura: '15', _diputadomodule_genero: '0', _diputadomodule_grupo: 'all', _diputadomodule_tipo: '0', _diputadomodule_nombre: '', _diputadomodule_apellidos: '', _diputadomodule_formacion: 'all', _diputadomodule_filtroProvincias: '[]', _diputadomodule_nombreCircunscripcion: '' });
  const lista = (await fetch('/es/busqueda-de-diputados?p_p_id=diputadomodule&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_resource_id=searchDiputados&p_p_cacheability=cacheLevelPage', { method: 'POST', body, headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest' } }).then((r) => r.json())).data;
  bajar('diputados_base.tsv', lista.map((d) => [d.codParlamentario, d.apellidos, d.nombre, d.genero, d.formacion, d.grupo.replace('Grupo Parlamentario ', 'GP '), d.nombreCircunscripcion, d.fchAlta].join('|')).join('\n') + '\n');
  console.log(`Diputados: ${lista.length}`);

  // 2) Fichas: cargos retribuidos y declaraciones de bienes
  const cargoRe = /^(President|Vicepresident|Secretari|Portavoz)/;
  const peso = (c) => /Congreso de los Diputados/.test(c) ? 9 : /Mesa del Congreso/.test(c) ? (c.startsWith('Vice') ? 7 : 6) : /Portavoz Titular de la Junta/.test(c) ? 8 : /Portavoz adjunt. de la Junta/.test(c) ? 5 : /^President. de la Comisi/.test(c) ? 4 : /^(Vicepresident|Portavoz de la Comisi)/.test(c) ? 3 : 2;
  const fichas = [], previas = [];
  for (const d of lista) {
    const html = await fetch(`/es/busqueda-de-diputados?p_p_id=diputadomodule&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&_diputadomodule_mostrarFicha=true&codParlamentario=${d.codParlamentario}&idLegislatura=XV`).then((r) => r.text());
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const bienes = [...doc.querySelectorAll('a')].filter((a) => /Bienes y Rentas/.test(a.textContent)).map((a) => ({ t: a.textContent, h: a.getAttribute('href').replace('/docbienes/leg15/', '') })).sort((a, b) => pd(b.t).localeCompare(pd(a.t)));
    const txt = doc.body.textContent.replace(/\s+/g, ' ');
    const cargos = ((txt.match(/ Cargos (.*?) (Histórico de cargos|Iniciativas Parlamentarias)/) || [])[1] || '').split(/ desde el \d\d\/\d\d\/\d{4} ?/).map((s) => s.trim()).filter((s) => cargoRe.test(s) && !/Subcomisi|Ponencia/.test(s));
    const camara = cargos.filter((c) => /Junta de Portavoces|Mesa del Congreso|Congreso de los Diputados/.test(c)).sort((a, b) => peso(b) - peso(a))[0] || '';
    const comisiones = cargos.filter((c) => / de la Comisi[oó]n /.test(c));
    const comision = comisiones.sort((a, b) => peso(b) - peso(a))[0] || '';
    fichas.push([d.codParlamentario, bienes[0]?.h || '', bienes.length, camara, comision, comisiones.length].join('|'));
    if (bienes.length > 1) previas.push(`${d.codParlamentario}|${bienes.slice(1).map((b) => b.h).join(',')}`);
    await sleep(400);
  }
  bajar('fichas.tsv', fichas.join('\n') + '\n');
  bajar('previas.tsv', previas.join('\n') + '\n');
  console.log('Fichas descargadas. Las votaciones se generan con window._votacion(id, rutaJson) (ver README).');

  // 3) Votación en formato compacto (voto mayoritario por grupo + excepciones)
  window._votacion = async (id, ruta) => {
    const v = await fetch(`/webpublica/opendata/votaciones/Leg15/${ruta}.json`).then((r) => r.json());
    const map = new Map(lista.map((d) => [d.apellidosNombre.trim(), d]));
    const voto = {}; v.votaciones.forEach((x) => { const d = map.get(x.diputado.trim()); if (d) voto[d.codParlamentario] = { 'Sí': 'S', 'No': 'N', 'Abstención': 'A' }[x.voto] || 'X'; });
    const cuenta = {}; lista.forEach((d) => { const g = d.grupo.replace('Grupo Parlamentario ', ''); const x = voto[d.codParlamentario] ?? '-'; (cuenta[g] ??= {})[x] = (cuenta[g][x] || 0) + 1; });
    const mayoria = Object.fromEntries(Object.entries(cuenta).map(([g, c]) => [g, Object.entries(c).sort((a, b) => b[1] - a[1])[0][0]]));
    const exc = lista.filter((d) => (voto[d.codParlamentario] ?? '-') !== mayoria[d.grupo.replace('Grupo Parlamentario ', '')]).map((d) => `${d.codParlamentario}:${voto[d.codParlamentario] ?? '-'}`);
    const t = v.totales; const i = v.informacion;
    const linea = `${id}|${i.fecha}|${i.sesion}|${i.numeroVotacion}|${t.afavor},${t.enContra},${t.abstenciones},${t.noVotan}|${Object.entries(mayoria).map(([g, m]) => `${g}=${m}`).join(';')}|${exc.join(',')}`;
    console.log(linea); return linea;
  };
})();
