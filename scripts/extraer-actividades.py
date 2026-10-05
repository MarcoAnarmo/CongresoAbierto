"""Extrae el Registro de Intereses - Actividades (secciones A-H) de los PDF oficiales con capa de texto.
Entrada: data/raw/intereses/pdf/registro/registro_intereses_diputado_<cod>.pdf (no se suben al repositorio).
Salida: data/raw/intereses/actividades.jsonl, una línea por diputado. Copia literal del texto de cada actividad."""
import json, re, subprocess, sys
from pathlib import Path

RAIZ = Path(sys.argv[1] if len(sys.argv) > 1 else '.')
DIR = RAIZ / 'data/raw/intereses/pdf/registro'
SALIDA = Path('data/raw/intereses/actividades.jsonl')
SECCIONES = [
    ('A', r'A\) Cargos p[uú]blicos'), ('B', r'B\) Actividades p[uú]blicas a las que ha renunciado'),
    ('C1', r'\(1\) Prestaciones de derechos pasivos renunciadas'), ('C2', r'\(2\) Prestaciones consideradas compatibles'),
    ('D', r'D\) Actividades docentes'), ('E', r'E\) Cargos en partidos'), ('F', r'F\) Actividades de producci[oó]n'),
    ('G', r'G\) Actividades privadas autorizadas'), ('H', r'H\) Otras Actividades'),
]
RUIDO = re.compile(r'^(Registro de Intereses - Actividades|XV LEGISLATURA|Congreso de los Diputados|Comisi[oó]n de Estatuto de los Diputados|C\) Prestaciones de derechos pasivos\.?|-{5,}|Actividades)$')
FECHA = re.compile(r'\s*Fecha del acuerdo plenario( definitivo)?:\s*(\d{2})\.(\d{2})\.(\d{4})\s*$')
DECL = re.compile(r'^\d+\. Declaraci[oó]n de Actividades, de (.+)$')
MESES = 'enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre'.split()

def iso(txt):
    m = re.match(r'(\d{1,2}) de (\w+) de (\d{4})', txt.strip())
    return f'{m[3]}-{MESES.index(m[2].lower()) + 1:02d}-{int(m[1]):02d}' if m and m[2].lower() in MESES else None

def extraer(pdf):
    lineas = subprocess.run(['pdftotext', '-layout', str(pdf), '-'], capture_output=True, text=True).stdout.splitlines()
    sec, actual, out, decl, cab = None, None, {k: [] for k, _ in SECCIONES}, [], []
    for bruta in lineas:
        l = bruta.strip()
        if not l or RUIDO.match(l):
            continue
        if l.startswith(('¹', '²')) or l.startswith(('actividades prohibidas', 'condición de parlamentario')):
            actual = None; continue
        m = DECL.match(l)
        if m:
            decl.append(iso(m[1]) or m[1]); sec = None; actual = None; continue
        nueva = next((k for k, p in SECCIONES if re.match(p, l)), None)
        if nueva:
            sec, actual = nueva, None; continue
        if sec is None:
            cab.append(l); continue
        f = FECHA.search(l)
        texto = FECHA.sub('', l).strip()
        if f or actual is None:
            actual = {'texto': texto, 'fechaAcuerdo': f'{f[4]}-{f[3]}-{f[2]}' if f else None}
            out[sec].append(actual)
        else:
            actual['texto'] += ' ' + texto
    for k in out:
        for e in out[k]:
            e['texto'] = re.sub(r'(\w)- (\w)', r'\1-\2', re.sub(r'\s+', ' ', e['texto'])).strip()
    alta = next((iso(c.split(':', 1)[1]) for c in cab if c.startswith('Fecha de alta')), None)
    if any(c.startswith('Pendiente de acuerdo definitivo') for c in cab):
        return {'pendiente': True, 'secciones': {}, 'declaraciones': [], 'alta': None}
    return {'secciones': {k: v for k, v in out.items() if v}, 'declaraciones': decl, 'alta': alta}

with SALIDA.open('w') as fo:
    n = 0
    for pdf in sorted(DIR.glob('registro_intereses_diputado_*.pdf'), key=lambda p: int(re.search(r'(\d+)\.pdf', p.name)[1])):
        cod = int(re.search(r'(\d+)\.pdf', pdf.name)[1])
        r = extraer(pdf)
        fo.write(json.dumps({'cod': cod, 'pdf': f'https://www.congreso.es/docinte/{pdf.name}', **r}, ensure_ascii=False) + '\n'); n += 1
print(n, 'diputados')
