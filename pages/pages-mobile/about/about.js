if (!document.querySelector('link[href="/pages/pages-mobile/mobile-page.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-mobile/mobile-page.css';
  document.head.appendChild(link);
}

export async function About() {
  const res = await fetch('/data/about.json');
  const data = await res.json();

  const el = document.createElement('section');
  el.className = 'mobile-page';
  el.innerHTML = `
    <div class="mobile-page__inner">
      <header class="mobile-page__hero">
        <p class="mobile-page__eyebrow">${data.header.eyebrow}</p>
        <h1>${data.header.title}</h1>
        <p>${data.header.description}</p>
        <div class="mobile-page__actions">
          ${(data.header.actions || []).map(action => `
            <a class="mobile-page__action is-${action.variant}" href="${action.href}" data-link>${action.label}</a>
          `).join('')}
        </div>
      </header>
      <div class="mobile-list">
        ${data.cards.map((card, i) => {
          const icons = ['bi bi-star', 'bi bi-people', 'bi bi-shield-check', 'bi bi-gem'];
          const colors = ['blue', 'green', 'purple', 'orange'];
          return `
            <article class="mobile-card" style="display:flex;align-items:flex-start;gap:0.75rem">
              <span style="flex:0 0 auto;width:2.2rem;height:2.2rem;border-radius:0.55rem;background:var(--surface-alt);color:var(--accent);display:flex;align-items:center;justify-content:center;font-size:1.05rem">
                <i class="${icons[i % icons.length]}"></i>
              </span>
              <div style="flex:1;min-width:0">
                <span class="mobile-card__tag" style="margin-bottom:0.4rem">${card.tag}</span>
                <h2 style="font-size:1rem">${card.title}</h2>
                <p>${card.description}</p>
              </div>
            </article>
          `;
        }).join('')}
      </div>
    </div>
  `;
  return el;
}
