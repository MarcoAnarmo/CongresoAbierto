"""Extrae los acuerdos de la Comisión del Estatuto de los Diputados sobre declaraciones de actividades
(BOCG, Congreso, serie D) de los PDF oficiales con capa de texto.
Entrada: data/raw/intereses/pdf/compatibilidad/BOCG-15-D-*.PDF (no se suben al repositorio).
Salida: data/raw/intereses/compatibilidad.jsonl, una línea por diputado y dictamen. Copia literal de cada punto."""
import json, re, subprocess, sys, unicodedata
from pathlib import Path

RAIZ = Path(sys.argv[1] if len(sys.argv) > 1 else '.')
DIR = RAIZ / 'data/raw/intereses/pdf/compatibilidad'
SALIDA = RAIZ / 'data/raw/intereses/compatibilidad.jsonl'
BASE = 'https://www.congreso.es/public_oficiales/L15/CONG/BOCG/D/'
MESES = 'enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre'.split()
EXPTE = re.compile(r'^(D\.|Dña\.|D\.ª|Da\.|Don|Doña)\s+(.+?)\s*\((?:expte[.,]\s*núm\.?|núm\.?\s*expte\.?)\s*(\d{3}/\d{3,6}/\d+)?')
CAB = re.compile(r'^\d{3}/\d{6}$')
RUIDO = re.compile(r'^(cve: BOCG-.*|Serie D|BOLETÍN OFICIAL DE LAS CORTES GENERALES|CONGRESO DE LOS DIPUTADOS|Núm\. \d+|Pág\. \d+|\d{1,2} de \w+ de \d{4})$')
ORDINAL = re.compile(r'^(Primero|Segundo|Tercero|Cuarto|Quinto|Sexto|Séptimo|Octavo)\.\s*(.*)$')


def clave(s):
    s = unicodedata.normalize('NFD', s.lower().replace('m.ª', 'maría').replace('mª', 'maría'))
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z]+', ' ', s).replace(' i ', ' ').strip()


def diputados():
    out = {}
    for l in (RAIZ / 'data/raw/diputados_base.tsv').read_text(encoding='utf-8').splitlines():
        if not l.strip():
            continue
        cod, ap, nom = l.split('|')[:3]
        out[clave(f'{nom} {ap}')] = int(cod)
        # alternativa: apellidos + primer nombre (solo si no hay otro igual)
        alt = clave(f'{nom.split()[0]} {ap}')
        out.setdefault('~' + alt, []).append(int(cod))
    return out


def buscar(dips, nombre):
    k = clave(nombre)
    if k in dips:
        return dips[k]
    t = k.split()
    # sin nombres intermedios: «maria del socorro cuesta rodriguez» → «maria cuesta rodriguez»
    for n in range(2, min(5, len(t))):
        alt = dips.get('~' + ' '.join([t[0]] + t[-n:]), [])
        if len(alt) == 1:
            return alt[0]
    return None


def iso(txt):
    m = re.search(r'(\d{1,2}) de (\w+) de (\d{4})', txt)
    return f'{m[3]}-{MESES.index(m[2].lower()) + 1:02d}-{int(m[1]):02d}' if m and m[2].lower() in MESES else None


def limpiar(t):
    return re.sub(r'(\w)- (\w)', r'\1-\2', re.sub(r'\s+', ' ', t)).strip()


def extraer(pdf, dips):
    paginas = subprocess.run(['pdftotext', str(pdf), '-'], capture_output=True, text=True).stdout.split('\f')
    lineas = [(n + 1, l.strip()) for n, p in enumerate(paginas) for l in p.splitlines()]
    vistos, dentro, bloques, actual, ordinal, fecha_pleno, num = set(), False, [], None, None, None, None
    for pag, l in lineas:
        if not l or RUIDO.match(l):
            continue
        if CAB.match(l):
            if l.startswith('042/') and l in vistos:      # segunda aparición: cuerpo del dictamen
                dentro, num, ordinal, actual = True, l, None, None
            else:
                if dentro:
                    dentro, actual = False, None
                vistos.add(l)
            continue
        if not dentro:
            continue
        if fecha_pleno is None and 'en su sesión del día' in l:
            fecha_pleno = iso(l + ' ' + next((x for p, x in lineas if p == pag and x.startswith('20')), ''))
        m = ORDINAL.match(l)
        if m:
            ordinal, actual = m[1], None
            continue
        m = EXPTE.match(l)
        if m and ordinal and ordinal != 'Primero':
            nombre = limpiar(m[2])
            actual = {'nombre': nombre, 'cod': buscar(dips, nombre), 'expte': m[3], 'apartado': ordinal,
                      'pagina': pag, 'puntos': []}
            bloques.append(actual)
            continue
        if actual is None or ordinal == 'Primero':
            continue
        if l.startswith('—'):
            actual['puntos'].append(l.lstrip('— ').strip())
        elif actual['puntos']:
            actual['puntos'][-1] += ' ' + l
        else:
            actual.setdefault('intro', '')
            actual['intro'] += ' ' + l
    for b in bloques:
        b['puntos'] = [limpiar(p) for p in b['puntos']]
        if 'intro' in b:
            b['intro'] = limpiar(b['intro'])
    return bloques, fecha_pleno


def fecha_boletin(pdf):
    txt = subprocess.run(['pdftotext', '-l', '1', str(pdf), '-'], capture_output=True, text=True).stdout
    return iso(txt)


if __name__ == '__main__':
    dips = diputados()
    n = sin = 0
    with SALIDA.open('w', encoding='utf-8') as fo:
        for pdf in sorted(DIR.glob('BOCG-15-D-*.PDF'), key=lambda p: int(re.search(r'-D-(\d+)', p.name)[1])):
            bloques, pleno = extraer(pdf, dips)
            fecha = fecha_boletin(pdf)
            for b in bloques:
                b = {'bocg': pdf.stem, 'fecha': fecha, 'url': f'{BASE}{pdf.name}#page={b["pagina"]}', **b}
                fo.write(json.dumps(b, ensure_ascii=False) + '\n')
                n += 1
                sin += b['cod'] is None
            print(pdf.name, fecha, len(bloques))
    print('bloques', n, 'sin diputado actual', sin)
