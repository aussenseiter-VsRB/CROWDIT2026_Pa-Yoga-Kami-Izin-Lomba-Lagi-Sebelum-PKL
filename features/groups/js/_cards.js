import { getStatus, statusLabel, statusPct, memberLabel, peopleIcon } from './_utils.js';

export function GroupCard(group, index) {
  const status = getStatus(group.members);
  const pct = statusPct(group.members, group.maxMembers);
  const joinedText = memberLabel(group.members, group.maxMembers);

  return `
    <a class="grp-card" href="/forum?group=${index}" data-link>
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

export function mGroupCard(group, index) {
  const status = getStatus(group.members);
  const pct = statusPct(group.members, group.maxMembers);

  return `
    <a class="mobile-card mobile-card--block" href="/forum?group=${index}" data-link>
      <div class="mobile-card__header">
        <span class="mobile-card__tag">${group.department}</span>
        <span class="mobile-status-badge mobile-status-badge--${status}">
          <span class="mobile-status-badge__dot"></span>
          ${statusLabel(status)}
        </span>
      </div>
      <h2>${group.title}</h2>
      <p>${group.description}</p>
      <div class="mobile-progress">
        <span class="mobile-progress__label">${memberLabel(group.members, group.maxMembers)}</span>
        <div class="mobile-progress__bar">
          <div class="mobile-progress__fill mobile-progress__fill--${status}" style="width:${pct}%"></div>
        </div>
        <span class="mobile-progress__pct">${pct}%</span>
      </div>
    </a>
  `;
}

export function Hero(hero) {
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
