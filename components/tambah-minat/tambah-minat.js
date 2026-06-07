import { injectStyle } from '/js/utils/styleLoader.js';
injectStyle('/components/tambah-minat/tambah-minat.css');

export function TambahMinat({ interests = [], onChange } = {}) {
  const el = document.createElement('div');
  el.className = 'tm';

  el.innerHTML = `
    <p class="tm__section-title">Learning Interest</p>
    <div class="tm__tags-wrap"></div>
    <div class="tm__add">
      <input class="tm__input" type="text" placeholder="Tambah minat..." maxlength="30" />
      <button class="tm__add-btn" type="button" aria-label="Tambah minat"><i class="bi bi-plus"></i></button>
    </div>
  `;

  let currentInterests = [...interests];

  function renderTags() {
    const wrap = el.querySelector('.tm__tags-wrap');
    wrap.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'tm__tags';

    currentInterests.forEach((interest, index) => {
      const tag = document.createElement('span');
      tag.className = 'tm__tag';
      tag.innerHTML = `
        ${interest}
        <button class="tm__tag-remove" type="button" data-index="${index}" aria-label="Hapus ${interest}"><i class="bi bi-x"></i></button>
      `;
      const btn = tag.querySelector('.tm__tag-remove');
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentInterests.splice(index, 1);
        renderTags();
        if (onChange) onChange([...currentInterests]);
      });
      container.appendChild(tag);
    });

    wrap.appendChild(container);
  }

  renderTags();

  const input = el.querySelector('.tm__input');
  const addBtn = el.querySelector('.tm__add-btn');

  function addInterest() {
    const val = input.value.trim();
    if (!val) return;
    if (currentInterests.includes(val)) {
      input.value = '';
      return;
    }
    currentInterests.push(val);
    renderTags();
    if (onChange) onChange([...currentInterests]);
    input.value = '';
    input.focus();
  }

  addBtn.addEventListener('click', addInterest);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addInterest();
  });

  return el;
}
