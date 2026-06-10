import { injectStyle } from '../../../js/utils/styleLoader.js';

injectStyle('/features/home/css/_home-forum.css');
injectStyle('/features/home/css/_home-forum-status.css');
injectStyle('/features/home/css/_home-forum-actions.css');
injectStyle('/features/home/css/_home-mobile.css');

function ParticipantBar(participants, label) {
  const joined = participants?.joined || 0;
  const capacity = participants?.capacity;
  const text = capacity ? `${joined}/${capacity} ${label}` : `${joined} ${label}`;
  return `
    <div class="home-participants">
      <div class="home-participants__header">
        <span class="home-participants__label">
          <i class="bi bi-people"></i>
          ${text}
        </span>
      </div>
    </div>
  `;
}

export function SuggestionCard(item, index) {
  const isGroup = item._type === 'group';
  const isJoined = item.joined === 'joined';
  const href = isGroup
    ? (isJoined ? `/forum-interior?group=${item._realIndex ?? index}` : `/groups?group=${item._realIndex ?? index}`)
    : `/detail?index=${item._realIndex ?? index}`;

  return `
    <article class="home-forum-card home-forum-card--suggestion${isJoined ? ' home-forum-card--joined' : ''}" data-topic="${item.topic}" data-status="${item.status}">
      <div class="home-suggestion-badge">Disarankan untuk Kamu</div>
      <div class="home-forum-card__header">
        <div>
          <span class="home-forum-card__eyebrow">${isGroup ? (item.department || item.topic) : (item.topic || item.status)}</span>
          <h2>${item.title}</h2>
        </div>
        <div style="display:flex;align-items:center;gap:0.35rem;flex-shrink:0">
          ${isJoined
            ? `<span class="home-status--joined"><i class="bi bi-check-circle-fill"></i> Bergabung</span>`
            : isGroup
              ? `<span class="home-status home-status--group-${item.status}"><span></span>${item.status === 'popular' ? 'Populer' : item.status === 'active' ? 'Aktif' : 'Kurang Aktif'}</span>`
              : `<span class="home-status is-online"><span aria-hidden="true"></span>${item.status}</span>`
          }
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-bottom:0.75rem">
        <div class="home-type-badge home-type-badge--${isGroup ? 'group' : 'forum'}">
          <i class="bi ${isGroup ? 'bi-people' : 'bi-chat-square-text'}"></i>
          ${isGroup ? 'Grup' : 'Forum'}
        </div>
      </div>

      ${item.creator ? `<div class="home-forum-card__creator">Oleh ${item.creator.name}</div>` : ''}

      <p>${item.description}</p>

      <div class="home-forum-card__footer">
        ${ParticipantBar(item.participants, isGroup ? 'anggota' : 'peserta')}
        <a class="home-action ${isJoined ? 'is-secondary' : 'is-primary'}" href="${href}" data-link>${isJoined ? 'Buka' : 'Detail'}</a>
      </div>
    </article>
  `;
}

export function InterestCard(item, index) {
  const isGroup = item._type === 'group';
  const isJoined = item.joined === 'joined';
  const href = isGroup
    ? (isJoined ? `/forum-interior?group=${item._realIndex ?? index}` : `/groups?group=${item._realIndex ?? index}`)
    : `/detail?index=${item._realIndex ?? index}`;

  return `
    <article class="home-forum-card home-forum-card--interest${isJoined ? ' home-forum-card--joined' : ''}" data-topic="${item.topic}" data-status="${item.status}">
      <div class="home-forum-card__header">
        <div>
          <span class="home-forum-card__eyebrow">${isGroup ? (item.department || item.topic) : (item.topic || item.status)}</span>
          <h2>${item.title}</h2>
        </div>
        <div style="display:flex;align-items:center;gap:0.35rem;flex-shrink:0">
          ${isJoined
            ? `<span class="home-status--joined"><i class="bi bi-check-circle-fill"></i> Bergabung</span>`
            : isGroup
              ? `<span class="home-status home-status--group-${item.status}"><span></span>${item.status === 'popular' ? 'Populer' : item.status === 'active' ? 'Aktif' : 'Kurang Aktif'}</span>`
              : `<span class="home-status ${item.status === 'Online' ? 'is-online' : 'is-offline'}"><span aria-hidden="true"></span>${item.status}</span>`
          }
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-bottom:0.75rem">
        <div class="home-type-badge home-type-badge--${isGroup ? 'group' : 'forum'}">
          <i class="bi ${isGroup ? 'bi-people' : 'bi-chat-square-text'}"></i>
          ${isGroup ? 'Grup' : 'Forum'}
        </div>
      </div>

      ${item.creator ? `<div class="home-forum-card__creator">Oleh ${item.creator.name}</div>` : ''}

      <p>${item.description}</p>

      <div class="home-forum-card__footer">
        ${ParticipantBar(item.participants, isGroup ? 'anggota' : 'peserta')}
        <a class="home-action ${isJoined ? 'is-secondary' : 'is-primary'}" href="${href}" data-link>${isJoined ? 'Buka' : 'Detail'}</a>
      </div>
    </article>
  `;
}

export function mInterestCard(item, index) {
  const isGroup = item._type === 'group';
  const isJoined = item.joined === 'joined';
  const href = isGroup
    ? (isJoined ? `/forum-interior?group=${item._realIndex ?? index}` : `/groups?group=${item._realIndex ?? index}`)
    : `/detail?index=${item._realIndex ?? index}`;

  return `
    <article class="m-home-interest-card${isJoined ? ' m-home-interest-card--joined' : ''}" data-topic="${item.topic}" data-status="${item.status}">
      <h3 class="m-home-interest-card__title">${item.title}</h3>
      <div style="display:flex;align-items:center;gap:0.35rem;margin-bottom:0.35rem">
        <div class="m-home-type-badge m-home-type-badge--${isGroup ? 'group' : 'forum'}">
          <i class="bi ${isGroup ? 'bi-people' : 'bi-chat-square-text'}"></i>
          ${isGroup ? 'Grup' : 'Forum'}
        </div>
      </div>
      <a class="m-home-action m-home-interest-card__action ${isJoined ? 'is-secondary' : 'is-primary'}" href="${href}" data-link>${isJoined ? 'Buka' : 'Detail'}</a>
    </article>
  `;
}

export function ForumCard(forum, index) {
  const isGroup = forum._type === 'group';
  const isForumType = forum._type === 'forum' || !forum._type;
  const statusClass = forum.status === 'Online' || forum.status === 'popular' ? 'is-online' : 'is-offline';
  const isJoined = forum.joined === 'joined' || forum.joined === true;
  const isCustom = !!forum.id;
  const typeLabel = isGroup ? 'Grup' : 'Forum';
  const typeIcon = isGroup ? 'bi-people' : 'bi-chat-square-text';
  const href = isGroup
    ? (isJoined ? `/forum-interior?group=${forum._realIndex}` : `/groups?group=${forum._realIndex}`)
    : `/detail?index=${forum._realIndex ?? index}`;

  return `
    <article class="home-forum-card${isJoined ? ' home-forum-card--joined' : ''}${isCustom ? ' home-forum-card--custom' : ''}" data-topic="${forum.topic}" data-status="${forum.status}" data-type="${forum._type || 'forum'}">
      <div class="home-forum-card__header">
        <div>
          <span class="home-forum-card__eyebrow">${isCustom ? (isGroup ? 'Grup Kustom' : 'Forum Kustom') : (isGroup ? forum.department || forum.topic : forum.status)}</span>
          <h2>${forum.title}</h2>
        </div>
        <div style="display:flex;align-items:center;gap:0.35rem;flex-shrink:0">
          ${isCustom ? (isGroup ? `
            <button class="forums-icon-btn" data-edit-group="${forum.id}" title="Edit grup" aria-label="Edit grup"><i class="bi bi-pencil"></i></button>
            <button class="forums-icon-btn forums-icon-btn--danger" data-delete-group="${forum.id}" title="Hapus grup" aria-label="Hapus grup"><i class="bi bi-trash"></i></button>
          ` : `
            <button class="forums-icon-btn" data-edit-forum="${forum.id}" title="Edit forum" aria-label="Edit forum"><i class="bi bi-pencil"></i></button>
            <button class="forums-icon-btn forums-icon-btn--danger" data-delete-forum="${forum.id}" title="Hapus forum" aria-label="Hapus forum"><i class="bi bi-trash"></i></button>
          `) : ''}
          ${isJoined
            ? `<span class="home-status--joined"><i class="bi bi-check-circle-fill"></i> Bergabung</span>`
            : isGroup
              ? `<span class="home-status home-status--group-${forum.status}"><span></span>${forum.status === 'popular' ? 'Populer' : forum.status === 'active' ? 'Aktif' : 'Kurang Aktif'}</span>`
              : `<span class="home-status ${statusClass}"><span aria-hidden="true"></span>${forum.status}</span>`
          }
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-bottom:0.75rem">
        <div class="home-type-badge home-type-badge--${isGroup ? 'group' : 'forum'}">
          <i class="bi ${typeIcon}"></i>
          ${typeLabel}
        </div>
      </div>

      ${forum.creator ? `<div class="home-forum-card__creator">Oleh ${forum.creator.name}</div>` : ''}

      <p>${forum.description}</p>

      <div class="home-forum-card__footer">
        ${ParticipantBar(forum.participants, isGroup ? 'anggota' : 'peserta')}
        <a class="home-action ${isJoined ? 'is-secondary' : 'is-primary'}" href="${href}" data-link>${isJoined ? 'Buka' : 'Detail'}</a>
      </div>
    </article>
  `;
}

export function mSuggestionCard(item, index) {
  const isGroup = item._type === 'group';
  const isJoined = item.joined === 'joined';
  const href = isGroup
    ? (isJoined ? `/forum-interior?group=${item._realIndex ?? index}` : `/groups?group=${item._realIndex ?? index}`)
    : `/detail?index=${item._realIndex ?? index}`;

  return `
    <article class="m-home-forum-card m-home-forum-card--suggestion${isJoined ? ' m-home-forum-card--joined' : ''}" data-topic="${item.topic}">
      <div class="m-home-forum-card__header">
        <div>
          <span class="m-home-suggestion-badge">&#10024; Disarankan untuk Kamu</span>
          <h2>${item.title}</h2>
        </div>
        <div style="display:flex;align-items:center;gap:0.35rem;flex-shrink:0">
          ${isJoined
            ? `<span class="m-home-status--joined"><i class="bi bi-check-circle-fill"></i></span>`
            : isGroup
              ? `<span class="m-home-status m-home-status--group-${item.status}"><span></span>${item.status === 'popular' ? 'Populer' : item.status === 'active' ? 'Aktif' : 'Kurang'}</span>`
              : `<span class="m-home-status is-online"><span aria-hidden="true"></span>${item.status}</span>`
          }
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-bottom:0.5rem">
        <div class="m-home-type-badge m-home-type-badge--${isGroup ? 'group' : 'forum'}">
          <i class="bi ${isGroup ? 'bi-people' : 'bi-chat-square-text'}"></i>
          ${isGroup ? 'Grup' : 'Forum'}
        </div>
      </div>

      <p>${item.description}</p>

      <div class="m-home-forum-card__footer">
        ${ParticipantBar(item.participants, isGroup ? 'anggota' : 'peserta')}
        <a class="m-home-action ${isJoined ? 'is-secondary' : 'is-primary'}" href="${href}" data-link>${isJoined ? 'Buka' : 'Detail'}</a>
      </div>
    </article>
  `;
}

export function mForumCard(forum, index) {
  const isGroup = forum._type === 'group';
  const isForumType = forum._type === 'forum' || !forum._type;
  const statusClass = forum.status === 'Online' || forum.status === 'popular' ? 'is-online' : 'is-offline';
  const isJoined = forum.joined === 'joined' || forum.joined === true;
  const isCustom = !!forum.id;
  const typeLabel = isGroup ? 'Grup' : 'Forum';
  const typeIcon = isGroup ? 'bi-people' : 'bi-chat-square-text';
  const href = isGroup
    ? (isJoined ? `/forum-interior?group=${forum._realIndex}` : `/groups?group=${forum._realIndex}`)
    : `/detail?index=${forum._realIndex ?? index}`;

  return `
    <article class="m-home-forum-card${isJoined ? ' m-home-forum-card--joined' : ''}" data-topic="${forum.topic}" data-status="${forum.status}" data-type="${forum._type || 'forum'}">
      <div class="m-home-forum-card__header">
        <div>
          <h2>${forum.title}</h2>
        </div>
        <div style="display:flex;align-items:center;gap:0.35rem;flex-shrink:0">
          ${isCustom ? (isGroup ? `
            <button class="forums-icon-btn" data-edit-group="${forum.id}" title="Edit grup" aria-label="Edit grup"><i class="bi bi-pencil"></i></button>
            <button class="forums-icon-btn forums-icon-btn--danger" data-delete-group="${forum.id}" title="Hapus grup" aria-label="Hapus grup"><i class="bi bi-trash"></i></button>
          ` : `
            <button class="forums-icon-btn" data-edit-forum="${forum.id}" title="Edit forum" aria-label="Edit forum"><i class="bi bi-pencil"></i></button>
            <button class="forums-icon-btn forums-icon-btn--danger" data-delete-forum="${forum.id}" title="Hapus forum" aria-label="Hapus forum"><i class="bi bi-trash"></i></button>
          `) : ''}
          ${isJoined
            ? `<span class="m-home-status--joined"><i class="bi bi-check-circle-fill"></i></span>`
            : isGroup
              ? `<span class="m-home-status m-home-status--group-${forum.status}"><span></span>${forum.status === 'popular' ? 'Populer' : forum.status === 'active' ? 'Aktif' : 'Kurang'}</span>`
              : `<span class="m-home-status ${statusClass}"><span aria-hidden="true"></span>${forum.status}</span>`
          }
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-bottom:0.5rem">
        <div class="m-home-type-badge m-home-type-badge--${isGroup ? 'group' : 'forum'}">
          <i class="bi ${typeIcon}"></i>
          ${typeLabel}
        </div>
      </div>

      ${forum.creator ? `<div class="home-forum-card__creator">Oleh ${forum.creator.name}</div>` : ''}

      <p>${forum.description}</p>

      <div class="m-home-forum-card__footer">
        ${ParticipantBar(forum.participants, isGroup ? 'anggota' : 'peserta')}
        <a class="m-home-action ${isJoined ? 'is-secondary' : 'is-primary'}" href="${href}" data-link>${isJoined ? 'Buka' : 'Detail'}</a>
      </div>
    </article>
  `;
}
