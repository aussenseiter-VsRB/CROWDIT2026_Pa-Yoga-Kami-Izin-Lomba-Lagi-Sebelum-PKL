if (!document.querySelector('link[href="/pages/pages-mobile/mobile-page.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-mobile/mobile-page.css';
  document.head.appendChild(link);
}

function memberLabel(members, maxMembers) {
  const pct = Math.round((members / maxMembers) * 100);
  return members === 0
    ? 'Belum ada anggota'
    : `${members}/${maxMembers} (${pct}%)`;
}

function statusPct(members, maxMembers) {
  return Math.round((members / maxMembers) * 100);
}

export async function Groups() {
  const res = await fetch('/data/groups.json');
  const data = await res.json();

  const el = document.createElement('section');
  el.className = 'mobile-page';
  el.innerHTML = `
    <div class="mobile-page__inner">
      <header class="mobile-page__hero">
        <p class="mobile-page__eyebrow">${data.hero.eyebrow}</p>
        <h1>${data.hero.title}</h1>
        <p>${data.hero.description}</p>
        <div class="mobile-page__actions">
          ${data.hero.actions.map((action) => `
            <a class="mobile-page__action is-${action.variant}" href="${action.href}" data-link>${action.label}</a>
          `).join('')}
        </div>
      </header>
      <div class="mobile-list">
        ${data.groups.map((g) => `
          <article class="mobile-card">
            <span class="mobile-card__tag">${g.department}</span>
            <h2>${g.title}</h2>
            <p>${g.description}</p>
            <div style="margin-top:0.75rem;padding-top:0.75rem;border-top:1px solid #e2e7ef;display:flex;justify-content:space-between;align-items:center">
              <span style="font-size:0.78rem;color:#687386;font-weight:600">${memberLabel(g.members, g.maxMembers)}</span>
              <span style="font-size:0.78rem;color:#687386;font-weight:600">${statusPct(g.members, g.maxMembers)}%</span>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  `;
  return el;
}
