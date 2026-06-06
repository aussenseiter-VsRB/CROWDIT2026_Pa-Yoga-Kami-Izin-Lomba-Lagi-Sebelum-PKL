if (!document.querySelector('link[href="/pages/pages-desktop/groups/groups.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-desktop/groups/groups.css';
  document.head.appendChild(link);
}

function peopleIcon() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/><path d="M5 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1"/></svg>';
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

function GroupCard(group) {
  const status = getStatus(group.members);
  const pct = Math.round((group.members / group.maxMembers) * 100);
  const joinedText = group.members === 0
    ? 'Belum ada anggota'
    : `${group.members}/${group.maxMembers} anggota`;

  return `
    <article class="grp-card">
      <div class="grp-card__top">
        <span class="grp-card__dept">${group.department}</span>
        <span class="grp-status grp-status--${status}">
          <span aria-hidden="true"></span>
          ${statusLabel(status)}
        </span>
      </div>

      <h2 class="grp-card__title">${group.title}</h2>
      <p class="grp-card__desc">${group.description}</p>

      <div class="grp-card__members">
        <div class="grp-card__members-header">
          <span class="grp-card__members-label">
            ${peopleIcon()}
            ${joinedText}
          </span>
          <span class="grp-card__members-pct">${pct}%</span>
        </div>
        <div class="grp-card__bar">
          <div class="grp-card__bar-fill grp-card__bar-fill--${status}" style="width:${pct}%"></div>
        </div>
      </div>

      <button class="grp-join-btn" type="button">Gabung ke Grup</button>
    </article>
  `;
}

function Hero(hero) {
  return `
    <section class="grp-hero">
      <div class="grp-hero__bg">
        <div class="grp-hero__dot"></div>
        <div class="grp-hero__dot"></div>
        <div class="grp-hero__dot"></div>
        <div class="grp-hero__grid"></div>
       
        <div class="grp-hero__ring"></div>
        <div class="grp-hero__ring"></div>
        <div class="grp-hero__ring"></div>
        <div class="grp-hero__illustration"></div>
      </div>
      <div class="grp-hero__copy">
        <p class="grp-hero__eyebrow">${hero.eyebrow}</p>
        <h1 class="grp-hero__title">${hero.title}</h1>
        <p class="grp-hero__desc">${hero.description}</p>
        <div class="grp-hero__actions">
          <a class="grp-hero__btn grp-hero__btn--primary" href="${hero.actions[0].href}" data-link>${hero.actions[0].label}</a>
          <a class="grp-hero__btn grp-hero__btn--secondary" href="${hero.actions[1].href}" data-link>${hero.actions[1].label}</a>
        </div>
      </div>
    </section>
  `;
}

export async function Groups() {
  const res = await fetch('/data/groups.json');
  const data = await res.json();

  const el = document.createElement('section');
  el.className = 'container section';

  el.innerHTML = `
    <div class="desktop-page">
      ${Hero(data.hero)}
      <div class="grp-grid" id="groups"></div>
    </div>
  `;

  const grid = el.querySelector('.grp-grid');
  grid.innerHTML = data.groups.map(GroupCard).join('');

  return el;
}
