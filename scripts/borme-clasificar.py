"""Clasifica las coincidencias del nombre de cada diputado en el BORME (Sección A, actos inscritos, 2009-hoy).

Entrada (no se suben al repositorio: contienen homónimos, es decir, datos de personas que no son diputados):
  data/raw/borme/borme-coincidencias.json  resultado de scripts/browser/borme.js (una entrada por día del BORME)
  data/raw/borme/rareza.json               cuántas personas se llaman igual en España (INE, apellidos y nombres)
  data/congreso/diputados.json             empresas y entidades de sus documentos oficiales (npm run data:build)
Salida:
  data/raw/borme/vinculos-borme.jsonl      SE PUBLICA: solo coincidencias confirmadas por un segundo documento oficial
  data/raw/borme/pendientes.json           NO se publica: coincidencias sin confirmar, para revisarlas a mano

Niveles que se publican:
  declarada     la empresa también aparece en sus documentos oficiales (declaraciones, acuerdos del Congreso, ficha)
  cargo-publico empresa pública (municipal, provincial, insular…) del mismo lugar en el que declara un cargo público
  apellido      empresa que lleva su nombre y apellido, inscrita en la provincia por la que es diputado
Uso: python3 scripts/borme-clasificar.py
"""
import collections, json, re, unicodedata
from pathlib import Path

RAW = Path('data/raw/borme')


def plano(s):
    s = ''.join(c for c in unicodedata.normalize('NFD', s.lower()) if unicodedata.category(c) != 'Mn')
    return re.sub(r'\s+', ' ', s).strip()


FORMA = re.compile(r'[\s,]+(s\.?\s?a\.?\s?u|s\.?\s?l\.?\s?u|s\.?\s?l\.?\s?p|s\.?\s?l\.?\s?l|s\.?\s?a|s\.?\s?l|s\.?\s?coop(?:\.?\s?and)?'
                   r'|sociedad (?:anonima|limitada)(?: unipersonal| profesional| laboral)?|societat (?:anonima|limitada)'
                   r'|s\.?\s?c|c\.?\s?b|sme|s\.?m\.?e\.?|m\.?p\.?|en liquidacion)\.?$')


def clave(nombre):
    k = re.sub(r'\(r\.m\..*$', '', plano(nombre))
    k = re.sub(r'[.,;:()\s]+$', '', k)
    antes = None
    while antes != k:
        antes = k
        k = re.sub(r'[.,;:()\s]+$', '', FORMA.sub('', k))
    return re.sub(r'[^a-z0-9ñ]+', ' ', k).strip()


# Empresas públicas: el nombre lo dice (municipal, provincial, mixta, insular, SME…)
PUBLICA = re.compile(r'\b(municipal|municipals|municipales|provincial|sme|s\.m\.e|estatal|mixta|insular|metropolita|metropolitana'
                     r'|ayuntamiento|ajuntament|consorcio|publica|publics|publicas|diputacion|comarca|comarcal)\b')
# Palabras de los nombres de administraciones que no son un lugar
NO_LUGAR = set('ayuntamiento ayto concello ajuntament udala diputacion diputacio provincial consell comarcal cabildo insular junta '
               'gobierno generalitat parlamento cortes mancomunidad consorcio consorci comarca consejo consejeria ministerio '
               'excmo excma ilustre ilmo de del la las los el i y en d l a o e'.split())
# Lugares demasiado amplios para confirmar un consejo de administración (comunidades autónomas y similares)
AMPLIOS = set('espana catalunya cataluna galicia andalucia canarias euskadi pais vasco aragon asturias cantabria rioja navarra '
              'murcia valenciana extremadura castilla leon mancha madrid balears baleares comunidad region estado'.split())
ACTOS = ['Nombramientos', 'Ceses/Dimisiones', 'Revocaciones', 'Reelecciones', 'Cancelaciones de oficio de nombramientos',
         'Cambio de identidad del socio único', 'Declaración de unipersonalidad', 'Socio único', 'Constitución']


def base(ch):
    return unicodedata.normalize('NFD', ch)[0].upper()


def acto_y_cargo(texto, nombre):
    """Acto (Nombramientos, Ceses…) y cargo (Consejero, Adm. Unico…) que acompañan al nombre en el texto del BORME."""
    norm = ''.join(base(c) for c in texto)
    m = re.search(r'(?<![A-Z])' + r'[\s,]+'.join(re.escape(w) for w in nombre.split()) + r'(?![A-Z])', norm)
    if not m:
        return '', ''
    previo = texto[:m.start()]
    dos_puntos = previo.rfind(':')
    if dos_puntos < 0:
        return '', ''
    pre = previo[:dos_puntos]
    acto, fin = '', -1
    for a in ACTOS:
        x = pre.rfind(a)
        if x > fin:
            fin, acto = x + len(a), a
    inicio = fin
    for mm in re.finditer(r'[A-ZÁÉÍÓÚÑ\-]{2,}(?:\s[A-ZÁÉÍÓÚÑ\-]{2,})+\.\s', pre):
        inicio = max(inicio, mm.end())
    return acto, pre[max(inicio, 0):].strip(' .;')[:40]


def lugares_de(nombre):
    """Lugar de una administración: «Ayuntamiento de Badalona» → «badalona»; «Cabildo de Tenerife» → «tenerife»."""
    p = re.sub(r"\bd'", 'de ', plano(nombre))
    m = re.search(r'\b(?:de|del|d)\s+(.+)$', p)
    lugar = m.group(1) if m else p
    palabras = [w for w in re.sub(r'[^a-zñ ]', ' ', lugar).split() if w not in NO_LUGAR]
    return ' '.join(palabras)


def provincia(p):
    return plano(p.split('/')[0])


def main():
    dips = {d['codParlamentario']: d for d in json.load(open('data/congreso/diputados.json'))['diputados']}
    rareza = json.load(open(RAW / 'rareza.json'))
    entidades = collections.defaultdict(dict)   # cod → clave → tipo
    nombres = {}                                # (cod, clave o lugar) → nombre de la entidad tal como aparece en la web
    lugares = collections.defaultdict(set)      # cod → lugares de sus cargos públicos declarados
    for d in dips.values():
        for e in (d.get('vinculos') or {}).get('entidades', []):
            entidades[d['codParlamentario']][clave(e['nombre'])] = e['tipo']
            nombres[(d['codParlamentario'], clave(e['nombre']))] = e['nombre']
            roles = ' '.join(plano(a['rol']) for a in e['apariciones'])
            admin = set(plano(e['nombre']).split()) & (NO_LUGAR - {'de', 'del', 'la', 'las', 'los', 'el', 'i', 'y', 'en', 'd', 'l', 'a', 'o', 'e'})
            if e['tipo'] == 'publica' and (admin or re.search(r'alcald|concejal|conceller|regidor|edil|teniente de alcalde|diputad[oa] provincial', roles)):
                lugar = lugares_de(e['nombre'])
                if lugar and len(lugar) > 3 and lugar not in AMPLIOS and not set(lugar.split()) <= AMPLIOS:
                    lugares[d['codParlamentario']].add(lugar)
                    nombres.setdefault((d['codParlamentario'], lugar), e['nombre'])

    dias = json.load(open(RAW / 'borme-coincidencias.json'))
    grupos = collections.defaultdict(list)
    for dia in dias:
        for m in dia.get('matches', []):
            if m['cod'] not in dips:
                continue
            empresa = re.sub(r'^\d+\s*-\s*', '', m['art'] or '').strip().rstrip('.')
            grupos[(m['cod'], clave(empresa))].append((m, empresa))

    publicar, pendientes = [], []
    for (cod, ce), ms in grupos.items():
        d = dips[cod]
        empresa = max((e for _, e in ms), key=len)
        cep = ' ' + plano(empresa) + ' '
        completo = any(m['tipo'] == 'completo' for m, _ in ms)
        nivel, motivo = None, ''
        if completo:
            for k, tipo in entidades[cod].items():
                distintiva = len(k.split()) >= 2 or len(k) >= 6
                if not distintiva or k in lugares[cod] or lugares_de(nombres[(cod, k)]) in lugares[cod] or not (k == ce or f' {k} ' in cep.replace(',', ' ') or (len(ce) >= 6 and ce in k)):
                    continue
                if tipo == 'publica' and set(k.split()) & NO_LUGAR - {'de', 'del', 'la', 'las', 'los', 'el', 'i', 'y', 'en', 'd', 'l', 'a', 'o', 'e'}:
                    # empresa pública de una administración en la que declara un cargo («Infraestructures de la Generalitat de Catalunya»)
                    nivel, motivo = nivel or 'cargo-publico', motivo or k
                    continue
                nivel, motivo = 'declarada', k
                break
            if not nivel and PUBLICA.search(cep):
                lug = [l for l in lugares[cod] if f' {l} ' in cep]
                if lug:
                    nivel, motivo = 'cargo-publico', lug[0]
            if not nivel:
                aps = [w for w in plano(d['apellidos']).replace('-', ' ').split() if len(w) > 3 and w not in NO_LUGAR]
                nombre1 = plano(d['nombre']).split()[0]
                misma = provincia(ms[0][0]['prov']).split()[0] in plano(d['circunscripcion'])
                if aps and misma and all(f' {a} ' in cep for a in aps[:2]) or (aps and misma and f' {aps[0]} ' in cep and f' {nombre1} ' in cep):
                    nivel, motivo = 'apellido', ' '.join(aps[:2])
        actos = []
        for m, _ in sorted(ms, key=lambda x: x[0]['fecha']):
            acto, cargo = acto_y_cargo(m['texto'], m['clave'])
            actos.append({'fecha': f"{m['fecha'][:4]}-{m['fecha'][4:6]}-{m['fecha'][6:]}", 'borme': m['id'], 'provincia': m['prov'],
                          'acto': acto, 'cargo': cargo, 'url': f"https://www.boe.es/diario_borme/txt.php?id={m['id']}"})
        # Un mismo acto puede salir dos veces (nombre completo y primer nombre): quitar repetidos
        vistos, unicos = set(), []
        for a in actos:
            if (a['borme'], a['acto'], a['cargo']) not in vistos:
                vistos.add((a['borme'], a['acto'], a['cargo']))
                unicos.append(a)
        if nivel in ('declarada', 'cargo-publico'):
            motivo = nombres.get((cod, motivo), motivo)
        fila = {'cod': cod, 'empresa': empresa, 'nivel': nivel, 'motivo': motivo, 'actos': unicos}
        if nivel:
            publicar.append(fila)
        else:
            r = rareza.get(str(cod), {})
            pendientes.append({**fila, 'diputado': d['nombreCompleto'], 'nombreCompleto': completo,
                               'personasConEseNombreINE': r.get('esperados'), 'textos': [m['texto'][:600] for m, _ in ms[:3]]})

    publicar.sort(key=lambda x: (x['cod'], x['empresa']))
    with open(RAW / 'vinculos-borme.jsonl', 'w', encoding='utf-8') as f:
        for x in publicar:
            f.write(json.dumps(x, ensure_ascii=False) + '\n')
    pendientes.sort(key=lambda x: (x['personasConEseNombreINE'] is None and -1 or x['personasConEseNombreINE'], x['cod']))
    json.dump(pendientes, open(RAW / 'pendientes.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    c = collections.Counter(x['nivel'] for x in publicar)
    print('publicar:', len(publicar), dict(c), 'diputados', len({x['cod'] for x in publicar}))
    print('pendientes:', len(pendientes), 'diputados', len({x['cod'] for x in pendientes}))


if __name__ == '__main__':
    main()
