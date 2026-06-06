if (!document.querySelector('link[href="/pages/pages-mobile/mobile-page.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-mobile/mobile-page.css';
  document.head.appendChild(link);
}

export async function Search() {
  const res = await fetch('/data/search.json');
  const data = await res.json();

  const el = document.createElement('section');
  el.className = 'mobile-page';
  el.innerHTML = `
    <div class="mobile-page__inner">
      <header class="mobile-page__hero">
        <p class="mobile-page__eyebrow">${data.header.eyebrow}</p>
        <h1>${data.header.title}</h1>
        <p>${data.header.description}</p>
      </header>
      <div class="mobile-search-box" role="search">
        <input class="mobile-input" type="search" placeholder="Search forums, topics, notes..." aria-label="Search forums" />
      </div>
      <div class="mobile-list">
        ${data.cards.map((card) => `
          <article class="mobile-card">
            <span class="mobile-card__tag">${card.tag}</span>
            <h2>${card.title}</h2>
            <p>${card.description}</p>
          </article>
        `).join('')}
      </div>
    </div>
  `;
  return el;
}
