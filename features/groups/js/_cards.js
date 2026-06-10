import { getStatus, statusLabel, memberLabel, peopleIcon } from './_utils.js';
import { getForumStatus } from '../../../js/services/forum-access.js';

export function GroupCard(group, index) {
  const status = getStatus(group.members);
  const joinedText = memberLabel(group.members, group.maxMembers);
  const isJoined = getForumStatus('group', index) === 'joined';
  const isCustom = !!group.id;

  return `
    <a class="grp-card${isJoined ? ' grp-card--joined' : ''}${isCustom ? ' grp-card--custom' : ''}" href="${isJoined ? `/forum-interior?group=${index}` : `/groups?group=${index}`}" data-link>
      <div class="grp-card__header">
        <div>
          <span class="grp-card__eyebrow">${isCustom ? 'Grup Kustom' : group.department}</span>
          <h2>${group.title}</h2>
        </div>
        <div class="grp-card__badges">
          ${isCustom ? `
            <button class="grp-icon-btn" data-edit-group="${group.id}" title="Edit grup" aria-label="Edit grup"><i class="bi bi-pencil"></i></button>
            <button class="grp-icon-btn grp-icon-btn--danger" data-delete-group="${group.id}" title="Hapus grup" aria-label="Hapus grup"><i class="bi bi-trash"></i></button>
          ` : ''}
          ${isJoined
            ? `<span class="grp-status--joined"><i class="bi bi-check-circle-fill"></i> Sudah Bergabung</span>`
            : `<span class="grp-status grp-status--${status}"><span aria-hidden="true"></span>${statusLabel(status)}</span>`
          }
        </div>
      </div>

      <p>${group.description}</p>

      <div class="grp-card__footer">
        <div class="grp-members">
          <span class="grp-members__label">
            ${peopleIcon()}
            ${joinedText}
          </span>
        </div>
        <span class="grp-action ${isJoined ? 'is-secondary' : 'is-primary'}">${isJoined ? 'Buka Forum' : 'Detail'}</span>
      </div>
    </a>
  `;
}

export function mGroupCard(group, index) {
  const status = getStatus(group.members);
  const isJoined = getForumStatus('group', index) === 'joined';
  const isCustom = !!group.id;

  return `
    <a class="mobile-card mobile-card--block${isJoined ? ' mobile-card--joined' : ''}" href="${isJoined ? `/forum-interior?group=${index}` : `/groups?group=${index}`}" data-link>
      <div class="mobile-card__header">
        <div>
          <h2>${group.title}</h2>
        </div>
        <div style="display:flex;align-items:center;gap:0.35rem;flex-shrink:0">
          ${isCustom ? `
            <button class="grp-icon-btn" data-edit-group="${group.id}" title="Edit grup" aria-label="Edit grup"><i class="bi bi-pencil"></i></button>
            <button class="grp-icon-btn grp-icon-btn--danger" data-delete-group="${group.id}" title="Hapus grup" aria-label="Hapus grup"><i class="bi bi-trash"></i></button>
          ` : ''}
          ${isJoined
            ? `<span class="mobile-status--joined"><i class="bi bi-check-circle-fill"></i> Joined</span>`
            : `<span class="mobile-status-badge mobile-status-badge--${status}"><span class="mobile-status-badge__dot"></span>${statusLabel(status)}</span>`
          }
        </div>
      </div>
      <p>${group.description}</p>
      <div class="grp-card__footer">
        <div class="grp-members">
          <span class="grp-members__label">
            ${peopleIcon()}
            ${memberLabel(group.members, group.maxMembers)}
          </span>
        </div>
        <span class="grp-action ${isJoined ? 'is-secondary' : 'is-primary'}">${isJoined ? 'Buka Forum' : 'Detail'}</span>
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
          <a class="grp-hero__btn grp-hero__btn--secondary" href="#" data-create-group>${hero.actions[1].label}</a>
        </div>
      </div>
    </section>
  `;
}
