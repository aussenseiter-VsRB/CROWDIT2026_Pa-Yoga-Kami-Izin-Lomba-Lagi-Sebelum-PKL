import { injectStyle } from '../../../js/utils/styleLoader.js';

injectStyle('/components/ui/fab/fab.css');

export function renderFab() {
  return `<button class="fab" data-create-forum type="button" aria-label="Buat Forum"><i class="bi bi-plus-lg"></i></button>`;
}
