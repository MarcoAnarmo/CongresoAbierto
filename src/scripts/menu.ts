/**
 * Menú «Más»: en el móvil abre una hoja desde abajo (se cierra arrastrándola, pulsando fuera o con Escape);
 * en el ordenador es un desplegable. Sin JavaScript, el botón del móvil lleva al menú del pie.
 */
import { deslizarParaCerrar } from './hoja';

export function iniciarMenu() {
  const dlg = document.getElementById('hoja-mas') as HTMLDialogElement | null;
  const boton = document.getElementById('boton-mas');
  if (dlg && boton && typeof dlg.showModal === 'function') {
    boton.setAttribute('aria-expanded', 'false');
    boton.addEventListener('click', (e) => {
      e.preventDefault();
      dlg.showModal();
      boton.setAttribute('aria-expanded', 'true');
    });
    dlg.addEventListener('close', () => boton.setAttribute('aria-expanded', 'false'));
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    dlg.querySelector('[data-cerrar]')?.addEventListener('click', () => dlg.close());
    deslizarParaCerrar(dlg, { cerrar: () => dlg.close() });
    // Al volver atrás (caché del navegador), la hoja no debe seguir abierta
    addEventListener('pageshow', (e) => { if (e.persisted && dlg.open) dlg.close(); });
  }

  const d = document.getElementById('mas-escritorio') as HTMLDetailsElement | null;
  if (d) {
    document.addEventListener('click', (e) => { if (d.open && !d.contains(e.target as Node)) d.open = false; });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && d.open) { d.open = false; d.querySelector('summary')?.focus(); }
    });
  }
}
