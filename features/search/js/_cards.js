import { escape, highlight } from './_utils.js';

export function TrendingCard(item) {
  return `
    <article class="mobile-card search-card" data-search="${escape(item.label)}" role="button" tabindex="0">
      <div class="search-card__row">
        <div class="search-card__icon"><i class="bi bi-${item.icon}"></i></div>
        <div class="search-card__body">
          <p class="search-card__title">${escape(item.label)}</p>
          <p class="search-card__meta">${item.count} konten</p>
        </div>
      </div>
    </article>
  `;
}

export function SuggestedCard(item) {
  return `
    <a class="mobile-card search-card search-card--link" href="${item.url}" data-link>
      <div class="search-suggest__header">
        <div class="search-suggest__icon"><i class="bi bi-${item.icon}"></i></div>
        <div class="search-suggest__info">
          <p class="search-suggest__title">${escape(item.title)}</p>
          <p class="search-suggest__sub">${escape(item.sub)}</p>
        </div>
      </div>
      <p class="search-suggest__desc">${escape(item.description)}</p>
      <div class="search-suggest__footer">
        <div class="search-suggest__tags">
          ${item.tags.map(t => `<span class="badge">${escape(t)}</span>`).join('')}
        </div>
        <span class="search-suggest__stat">${escape(item.stat)}</span>
      </div>
    </a>
  `;
}

export function ResultCard(item, query) {
  const isOnline = item.stat && item.stat.toLowerCase().includes('online');
  return `
    <a class="mobile-card search-card search-card--link" href="${item.url}" data-link>
      <span class="mobile-card__tag">${item.type}</span>
      ${item.meta ? `<p class="search-result__meta">${escape(item.meta)}</p>` : ''}
      <h2>${highlight(item.title, query)}</h2>
      <p>${highlight(item.description, query)}</p>
      <div class="result-card__footer">
        <div class="result-card__tags">
          ${(item.tags || []).map(t => {
            const isMatch = query && t.toLowerCase().includes(query.toLowerCase());
            return `<span class="badge${isMatch ? ' badge--match' : ''}">${escape(t)}</span>`;
          }).join('')}
        </div>
        ${item.stat ? `<span class="result-card__stat">${isOnline ? '<span class="status-dot"></span>' : ''}${escape(item.stat)}</span>` : ''}
      </div>
    </a>
  `;
}
