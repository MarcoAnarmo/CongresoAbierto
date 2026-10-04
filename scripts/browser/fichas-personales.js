// Descarga la «Ficha personal» oficial de cada diputado (congreso.es): fecha de nacimiento,
// legislaturas, formación y trayectoria (texto literal), cargos actuales y enlaces a sus declaraciones.
//
// Uso: abre https://www.congreso.es/es/busqueda-de-diputados, abre la consola (F12), pega este
// fichero y pulsa Enter. Se descarga fichas-personales.jsonl → cópialo a data/raw/.
// No se guardan datos familiares (estado civil, hijos): no son información pública relevante.
(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const bajar = (nombre, texto) => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([texto], { type: 'application/x-ndjson' })); a.download = nombre; a.click(); };
  const limpia = (s) => s.replace(/\s+/g, ' ').trim();
  const fecha = (t) => { const m = (t || '').match(/(\d\d)\/(\d\d)\/(\d{4})/); return m ? `${m[3]}-${m[2]}-${m[1]}` : null; };
  const familiar = /^(casad|solter|viud|divorciad|separad|pareja de hecho|padre|madre|tiene \d|con \d hij|\d+ hij|(un|dos|tres|cuatro|cinco|seis) hij)/i;

  const body = new URLSearchParams({ _diputadomodule_idLegislatura: '15', _diputadomodule_genero: '0', _diputadomodule_grupo: 'all', _diputadomodule_tipo: '0', _diputadomodule_nombre: '', _diputadomodule_apellidos: '', _diputadomodule_formacion: 'all', _diputadomodule_filtroProvincias: '[]', _diputadomodule_nombreCircunscripcion: '' });
  const lista = (await fetch('/es/busqueda-de-diputados?p_p_id=diputadomodule&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_resource_id=searchDiputados&p_p_cacheability=cacheLevelPage', { method: 'POST', body, headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest' } }).then((r) => r.json())).data;

  const salida = [];
  for (const d of lista) {
    const url = `/es/busqueda-de-diputados?p_p_id=diputadomodule&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&_diputadomodule_mostrarFicha=true&codParlamentario=${d.codParlamentario}&idLegislatura=XV`;
    const doc = new DOMParser().parseFromString(await fetch(url).then((r) => r.text()), 'text/html');
    const h3 = [...doc.querySelectorAll('h3')].find((e) => e.textContent.trim() === 'Ficha personal');
    const caja = h3?.parentElement;
    let nacimiento = null, legislaturas = '', lineas = [], condicionPlena = null;
    if (caja) {
      const ps = [...caja.children].filter((e) => e.tagName === 'P');
      nacimiento = fecha(ps[0]?.textContent);
      legislaturas = limpia(ps[1]?.textContent || '');
      // Texto libre: nodos tras los <p> hasta el primer div, separados por <br>
      let actual = '';
      for (const n of caja.childNodes) {
        if (n.nodeType === 1 && (n.tagName === 'P' || n.tagName === 'H3')) continue;
        if (n.nodeType === 1 && n.tagName === 'DIV') break;
        if (n.nodeType === 1 && n.tagName === 'BR') { lineas.push(actual); actual = ''; continue; }
        actual += ' ' + n.textContent;
      }
      lineas.push(actual);
      lineas = lineas.map(limpia).filter((l) => l && !familiar.test(l));
      condicionPlena = fecha([...caja.querySelectorAll('.f-alta')].map((e) => e.textContent).join(' '));
    }
    // La página usa la misma lista para cargos, iniciativas e intervenciones: solo se guardan los cargos
    const noCargo = /Fecha: |Presentad[oa] el|\(\d{3}\/\d{3,6}\)|Pregunta |Comparecencia|Proposici[oó]n|Interpelaci|Moci[oó]n /i;
    const cargos = [...doc.querySelectorAll('ul.cargos li')].map((li) => limpia(li.textContent)).filter((t) => !noCargo.test(t))
      .map((t) => ({ cargo: t.replace(/ desde el \d\d\/\d\d\/\d{4}.*$/, ''), desde: fecha(t) }));
    const enlaces = [...doc.querySelectorAll('a')].map((a) => ({ t: limpia(a.textContent), h: a.getAttribute('href') || '' }));
    const decl = (re) => enlaces.filter((a) => re.test(a.t)).map((a) => ({ fecha: fecha(a.t), url: new URL(a.h, location.origin).href }));
    salida.push({
      cod: d.codParlamentario, nacimiento, legislaturas, lineas, condicionPlena, cargos,
      bienes: decl(/Bienes y Rentas/), interesesEconomicos: decl(/Intereses Econ/), actividades: decl(/Declaraci[oó]n de Actividades/),
    });
    if (salida.length % 25 === 0) console.log(`${salida.length}/${lista.length}`);
    await sleep(300);
  }
  window._fichas = salida;
  salida.sort((a, b) => a.cod - b.cod);
  bajar('fichas-personales.jsonl', salida.map((x) => JSON.stringify(x)).join('\n') + '\n');
  console.log(`Fichas personales: ${salida.length}`);
})();
