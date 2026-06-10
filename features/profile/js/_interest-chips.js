import { asset } from '../../../js/utils/url.js';
import { showInterestOverlay } from './_interest-overlay.js';

const VISIBLE_LIMIT = 6;

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

    const limit = VISIBLE_LIMIT;
    const hasMore = available.length > limit;
    const visible = hasMore ? available.slice(0, limit) : available;

    list.innerHTML = visible.map(interest => `
      <button type="button" class="interest-chip${selected.includes(interest) ? ' is-selected' : ''}" data-value="${interest}">
        ${interest}
      </button>
    `).join('');

    if (hasMore) {
      list.insertAdjacentHTML('beforeend', `<button type="button" class="interest-chip interest-chip--more" data-action="show-all">+${available.length - limit} Lihat Selengkapnya</button>`);
    }
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

    if (btn.dataset.action === 'show-all') {
      showInterestOverlay({
        available,
        selected,
        onSave: (vals) => {
          selected.length = 0;
          selected.push(...vals);
          render();
          if (onChange) onChange([...selected]);
        },
      });
      return;
    }

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
