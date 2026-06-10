import { injectStyle } from '../../../js/utils/styleLoader.js';
import { MOBILE_BREAKPOINT } from '../../../js/core/config.js';

injectStyle('/features/profile/css/_interest-overlay.css');

const MAX_SELECTION = 10;

export function showInterestOverlay({ available, selected, onSave, onClose }) {
  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  const current = [...selected];
  let searchQuery = '';

  const overlay = document.createElement('div');
  overlay.className = 'io-overlay' + (isMobile ? ' io-overlay--bottom' : '');

  const innerClass = isMobile ? 'io-sheet' : 'io-modal';
  const inner = document.createElement('div');
  inner.className = innerClass;

  function renderChips() {
    const container = inner.querySelector('[data-io-chips]');
    if (!container) return;

    const filtered = searchQuery
      ? available.filter(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
      : available;

    if (filtered.length === 0) {
      container.innerHTML = '<p style="text-align:center;color:var(--muted);font-size:0.85rem;padding:1rem 0">Tidak ada minat yang cocok</p>';
      return;
    }

    container.innerHTML = filtered.map(interest => {
      const isSel = current.includes(interest);
      const isDisabled = !isSel && current.length >= MAX_SELECTION;
      return `<button type="button" class="io-chip${isSel ? ' is-selected' : ''}${isDisabled ? ' is-disabled' : ''}" data-value="${interest}">${interest}</button>`;
    }).join('');
  }

  function updateCounter() {
    const el = inner.querySelector('[data-io-counter]');
    if (el) {
      el.textContent = `${current.length} / ${MAX_SELECTION}`;
      el.classList.toggle('io-counter--full', current.length >= MAX_SELECTION);
    }
  }

  function close(noCallback) {
    overlay.remove();
    if (!noCallback && onClose) onClose();
  }

  function save() {
    if (onSave) onSave([...current]);
    overlay.remove();
  }

  const headerHtml = isMobile
    ? `<div class="io-sheet__handle"></div>`
    : `<button class="io-modal__close" type="button" aria-label="Tutup"><i class="bi bi-x"></i></button>`;

  inner.innerHTML = `
    ${headerHtml}
    <h3 class="io-modal__title">Pilih Minat Belajar</h3>
    <p class="io-modal__desc">Maksimal ${MAX_SELECTION} pilihan minat</p>
    <input class="io-search" type="text" placeholder="Cari minat..." data-io-search />
    <div class="io-counter" data-io-counter>${current.length} / ${MAX_SELECTION}</div>
    <div class="io-chips" data-io-chips></div>
    <div class="io-actions">
      <button class="io-btn io-btn--cancel" type="button" data-io-cancel>Batal</button>
      <button class="io-btn io-btn--save" type="button" data-io-save>Simpan</button>
    </div>
  `;

  renderChips();
  updateCounter();

  const searchInput = inner.querySelector('[data-io-search]');
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderChips();
  });

  inner.querySelector('[data-io-cancel]').addEventListener('click', () => close());
  inner.querySelector('[data-io-save]').addEventListener('click', save);

  if (!isMobile) {
    inner.querySelector('.io-modal__close').addEventListener('click', () => close());
  }

  inner.addEventListener('click', (e) => {
    const chip = e.target.closest('.io-chip');
    if (!chip) return;
    if (chip.classList.contains('is-disabled')) return;

    const val = chip.dataset.value;
    const idx = current.indexOf(val);
    if (idx === -1) {
      if (current.length >= MAX_SELECTION) return;
      current.push(val);
    } else {
      current.splice(idx, 1);
    }
    renderChips();
    updateCounter();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  overlay.appendChild(inner);
  document.body.appendChild(overlay);

  requestAnimationFrame(() => searchInput.focus());
}
