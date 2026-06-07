if (!document.querySelector('link[href="/pages/pages-mobile/mobile-page.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-mobile/mobile-page.css';
  document.head.appendChild(link);
}

function getStatus(members) {
  if (members >= 50) return 'popular';
  if (members >= 10) return 'active';
  return 'inactive';
}

function statusLabel(status) {
  if (status === 'popular') return 'Populer';
  if (status === 'active') return 'Aktif';
  return 'Kurang Aktif';
}

function memberLabel(members, maxMembers) {
  const pct = Math.round((members / maxMembers) * 100);
  return members === 0
    ? 'Belum ada anggota'
    : `${members}/${maxMembers} anggota`;
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
        ${data.groups.map((g, i) => {
          const status = getStatus(g.members);
          const pct = statusPct(g.members, g.maxMembers);
          return `
            <a class="mobile-card" href="/forum?group=${i}" data-link style="display:block;text-decoration:none;color:inherit">
              <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:0.5rem;margin-bottom:0.6rem">
                <span class="mobile-card__tag">${g.department}</span>
                <span class="mobile-status-badge mobile-status-badge--${status}">
                  <span class="mobile-status-badge__dot"></span>
                  ${statusLabel(status)}
                </span>
              </div>
              <h2>${g.title}</h2>
              <p>${g.description}</p>
              <div class="mobile-progress">
                <span class="mobile-progress__label">${memberLabel(g.members, g.maxMembers)}</span>
                <div class="mobile-progress__bar">
                  <div class="mobile-progress__fill mobile-progress__fill--${status}" style="width:${pct}%"></div>
                </div>
                <span class="mobile-progress__pct">${pct}%</span>
              </div>
            </a>
          `;
        }).join('')}
      </div>
    </div>
  `;
  return el;
}
