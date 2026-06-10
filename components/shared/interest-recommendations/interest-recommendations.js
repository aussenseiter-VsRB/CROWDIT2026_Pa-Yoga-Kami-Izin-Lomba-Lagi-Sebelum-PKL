import { injectStyle } from '../../../js/utils/styleLoader.js';
import { asset, navigateTo } from '../../../js/utils/url.js';
import { DATA_PATHS } from '../../../js/core/config.js';

injectStyle('/components/shared/interest-recommendations/interest-recommendations.css');

function deduplicate(items) {
  const seen = new Set();
  return items.filter(item => {
    const key = item.title + item.type;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function computeRelevance(item, interests) {
  const lower = interests.map(i => i.toLowerCase());
  const text = (item.category || '').toLowerCase();
  const title = (item.title || '').toLowerCase();
  let score = 0;
  lower.forEach(interest => {
    if (text === interest) score += 3;
    if (text.includes(interest)) score += 2;
    if (title.includes(interest)) score += 1;
  });
  return score;
}

function renderItem(item) {
  return `
    <a class="ir-item" href="${item.href}" data-link>
      <span class="ir-item__badge ir-item__badge--${item.type}">${item.type === 'course' ? 'Kursus' : item.type === 'group' ? 'Grup' : 'Forum'}</span>
      <span class="ir-item__title">${item.title}</span>
      <span class="ir-item__desc">${item.description}</span>
    </a>
  `;
}

export function InterestRecommendations(interests, { variant = 'card' } = {}) {
  if (!interests || !interests.length) return null;

  const el = document.createElement('div');
  el.className = `ir ir--${variant}`;

  let items = [];
  let fetched = false;

  function render() {
    if (!items.length) return;
    el.innerHTML = `
      <button class="ir__dismiss" type="button" aria-label="Tutup">&times;</button>
      <h2 class="ir__title">Rekomendasi untuk Anda</h2>
      <p class="ir__desc">Berdasarkan minat belajar Anda</p>
      <div class="ir__list">
        ${items.map(renderItem).join('')}
      </div>
    `;

    el.querySelector('.ir__dismiss').addEventListener('click', () => {
      el.remove();
    });
  }

  async function fetchAndFilter() {
    try {
      const [detail, groups, forum] = await Promise.all([
        fetch(asset(DATA_PATHS.DETAIL)).then(r => r.json()),
        fetch(asset(DATA_PATHS.GROUPS)).then(r => r.json()),
        fetch(asset(DATA_PATHS.FORUM)).then(r => r.json()),
      ]);

      const lowerInterests = interests.map(i => i.toLowerCase());

      const courses = detail.map((d, i) => {
        const cat = d.course?.category || '';
        const match = lowerInterests.some(li => cat.toLowerCase().includes(li) || d.course?.title?.toLowerCase().includes(li));
        if (!match) return null;
        return {
          title: d.course.title,
          description: d.course.description,
          category: d.course.category,
          type: 'course',
          href: `/detail?index=${i}`,
        };
      }).filter(Boolean);

      const groupItems = (groups.groups || []).map((g, i) => {
        const dept = g.department || '';
        const match = lowerInterests.some(li => dept.toLowerCase().includes(li) || g.title?.toLowerCase().includes(li));
        if (!match) return null;
        return {
          title: g.title,
          description: g.description,
          category: g.department,
          type: 'group',
          href: '/groups',
        };
      }).filter(Boolean);

      const forumCourses = (forum.courses || []).map((f, i) => {
        if (!detail[i]?.course) return null;
        const cat = detail[i].course.category || '';
        const match = lowerInterests.some(li => cat.toLowerCase().includes(li) || detail[i].course.title?.toLowerCase().includes(li));
        if (!match) return null;
        return {
          title: 'Forum ' + detail[i].course.title,
          description: `${f.memberCount}/${f.memberLimit} anggota`,
          category: detail[i].course.category,
          type: 'forum',
          href: '/#/forum',
        };
      }).filter(Boolean);

      items = deduplicate([...courses, ...groupItems, ...forumCourses]);
      items.sort((a, b) => computeRelevance(b, interests) - computeRelevance(a, interests));
      items = items.slice(0, 8);

      fetched = true;
      render();
    } catch {
      el.remove();
    }
    if (!items.length) el.remove();
  }

  fetchAndFilter();

  return el;
}
