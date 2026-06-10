import { searchEngine } from '../../../js/services/search.js';
import { ResultCard } from './_cards.js';

export function bindSearchHandlers(refs) {
  const { input, clearBtn, filtersEl, discovery, resultsPanel,
          resultsList, resultsLabel, emptyEl, trendingGrid,
          trendingTags } = refs;

  trendingGrid.innerHTML = trendingTags.join('');

  let currentFilter = 'Semua';
  let currentQuery = '';

  const renderResults = () => {
    const q = currentQuery.trim().toLowerCase();
    if (!q) {
      discovery.hidden = false;
      resultsPanel.hidden = true;
      clearBtn.style.display = '';
      return;
    }

    discovery.hidden = true;
    resultsPanel.hidden = false;
    clearBtn.style.display = 'flex';

    const allResults = searchEngine.search(q);
    const filtered = currentFilter === 'Semua'
      ? allResults
      : allResults.filter(r => r.type === currentFilter);

    emptyEl.hidden = filtered.length > 0;
    resultsLabel.textContent = filtered.length
      ? `${filtered.length} hasil untuk "${currentQuery}"`
      : '';
    resultsList.innerHTML = filtered.map(r => ResultCard(r, currentQuery)).join('');
  };

  input.addEventListener('input', () => {
    currentQuery = input.value;
    renderResults();
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    currentQuery = '';
    renderResults();
    input.focus();
  });

  filtersEl.addEventListener('click', e => {
    const btn = e.target.closest('.filter-pill');
    if (!btn) return;
    filtersEl.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('filter-pill--active'));
    btn.classList.add('filter-pill--active');
    currentFilter = btn.dataset.filter;
    if (currentQuery.trim()) renderResults();
  });

  trendingGrid.addEventListener('click', e => {
    const card = e.target.closest('[data-search]');
    if (!card) return;
    input.value = card.dataset.search;
    currentQuery = card.dataset.search;
    renderResults();
    input.focus();
  });
}
