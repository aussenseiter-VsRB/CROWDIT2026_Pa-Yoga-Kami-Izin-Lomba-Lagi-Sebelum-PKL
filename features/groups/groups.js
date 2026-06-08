import { injectStyle } from '../../js/utils/styleLoader.js';
import { fetchData } from '../../js/utils/api.js';
import { DATA_PATHS, LIMITS, MOBILE_BREAKPOINT } from '../../js/core/config.js';

injectStyle('/css/_shared.css');
injectStyle('/features/groups/groups.css');

function peopleIcon() {
  return '<i class="bi bi-people"></i>';
}

function getStatus(members) {
  if (members >= LIMITS.POPULAR_THRESHOLD) return 'popular';
  if (members >= LIMITS.ACTIVE_THRESHOLD) return 'active';
  return 'inactive';
}

function statusLabel(status) {
  if (status === 'popular') return 'Populer';
  if (status === 'active') return 'Aktif';
  return 'Kurang Aktif';
}

function statusPct(members, maxMembers) {
  return Math.round((members / maxMembers) * 100);
}

function memberLabel(members, maxMembers) {
  return members === 0
    ? 'Belum ada anggota'
    : `${members}/${maxMembers} anggota`;
}

function GroupCard(group, index) {
  const status = getStatus(group.members);
  const pct = statusPct(group.members, group.maxMembers);
  const joinedText = memberLabel(group.members, group.maxMembers);

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

function renderDesktop(data) {
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

function renderMobile(data) {
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

export async function Groups() {
  const data = await fetchData(DATA_PATHS.GROUPS);

  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  return isMobile ? renderMobile(data) : renderDesktop(data);
}
