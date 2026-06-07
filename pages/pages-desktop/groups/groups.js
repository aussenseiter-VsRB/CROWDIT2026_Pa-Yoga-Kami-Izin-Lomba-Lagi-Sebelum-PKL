if (!document.querySelector('link[href="/pages/pages-desktop/groups/groups.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-desktop/groups/groups.css';
  document.head.appendChild(link);
}

function peopleIcon() {
  return '<i class="bi bi-people"></i>';
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

function GroupCard(group, index) {
  const status = getStatus(group.members);
  const pct = Math.round((group.members / group.maxMembers) * 100);
  const joinedText = group.members === 0
    ? 'Belum ada anggota'
    : `${group.members}/${group.maxMembers} anggota`;

  return `
    <a class="grp-card" href="/forum?group=${index}" data-link style="text-decoration:none;color:inherit;display:block">
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
    </a>
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
  grid.innerHTML = data.groups.map((g, i) => GroupCard(g, i)).join('');

  return el;
}
