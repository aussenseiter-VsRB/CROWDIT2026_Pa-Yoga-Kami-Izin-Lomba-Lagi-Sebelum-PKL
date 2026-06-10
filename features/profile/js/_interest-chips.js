import { asset } from '../../../js/utils/url.js';

export async function getAvailableInterests() {
  const [detail, groups] = await Promise.all([
    fetch(asset('/data/detail.json')).then(r => r.json()),
    fetch(asset('/data/groups.json')).then(r => r.json()),
  ]);
  const set = new Set();
  detail.forEach(item => {
    if (item.course?.category) set.add(item.course.category);
  });
  (groups.groups || []).forEach(item => {
    if (item.department) set.add(item.department);
  });
  return [...set].sort();
}

export function InterestChips(available, selected, onChange) {
  const el = document.createElement('div');
  el.className = 'interest-chips';

  function render() {
    const list = el.querySelector('[data-chips]');
    if (!list) return;
    list.innerHTML = available.map(interest => `
      <button type="button" class="interest-chip${selected.includes(interest) ? ' is-selected' : ''}" data-value="${interest}">
        ${interest}
      </button>
    `).join('');
  }

  el.innerHTML = `
    <p class="interest-chips__title">Minat Belajar</p>
    <p class="interest-chips__desc">Pilih minat yang sesuai dengan bidang Anda</p>
    <div class="interest-chips__list" data-chips></div>
  `;

  render();

  el.addEventListener('click', (e) => {
    const btn = e.target.closest('.interest-chip');
    if (!btn) return;
    const val = btn.dataset.value;
    const idx = selected.indexOf(val);
    if (idx === -1) {
      selected.push(val);
    } else {
      selected.splice(idx, 1);
    }
    render();
    if (onChange) onChange([...selected]);
  });

  return el;
}
