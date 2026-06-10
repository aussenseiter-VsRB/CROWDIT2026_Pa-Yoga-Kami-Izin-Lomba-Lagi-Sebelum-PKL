function ParticipantBar(participants) {
  const joined = participants?.joined || 0;
  return `
    <div class="home-participants">
      <div class="home-participants__header">
        <span class="home-participants__label">
          <i class="bi bi-people"></i>
          ${joined} peserta
        </span>
      </div>
    </div>
  `;
}

export function SuggestionCard(forum, index) {
  const isJoined = forum.joined === 'joined';

  return `
    <article class="home-forum-card home-forum-card--suggestion${isJoined ? ' home-forum-card--joined' : ''}" data-topic="${forum.topic}">
      <div class="home-forum-card__header">
        <div>
          <span class="home-suggestion-badge">&#10024; Disarankan untuk Kamu</span>
          <span class="home-forum-card__eyebrow">${forum.topic || forum.status}</span>
          <h2>${forum.title}</h2>
        </div>
        ${isJoined
          ? `<span class="home-status--joined"><i class="bi bi-check-circle-fill"></i> Sudah Bergabung</span>`
          : `<span class="home-status is-online"><span aria-hidden="true"></span>${forum.status}</span>`
        }
      </div>

      <p>${forum.description}</p>

      <div class="home-forum-card__footer">
        ${ParticipantBar(forum.participants)}
        <a class="home-action ${isJoined ? 'is-secondary' : 'is-primary'}" href="/detail?index=${index}" data-link>${isJoined ? 'Buka Forum' : 'Detail'}</a>
      </div>
    </article>
  `;
}

export function mSuggestionCard(forum, index) {
  const isJoined = forum.joined === 'joined';

  return `
    <article class="m-home-forum-card m-home-forum-card--suggestion${isJoined ? ' m-home-forum-card--joined' : ''}" data-topic="${forum.topic}">
      <div class="m-home-forum-card__header">
        <div>
          <span class="m-home-suggestion-badge">&#10024; Disarankan untuk Kamu</span>
          <h2>${forum.title}</h2>
        </div>
        ${isJoined
          ? `<span class="m-home-status--joined"><i class="bi bi-check-circle-fill"></i> Joined</span>`
          : `<span class="m-home-status is-online"><span aria-hidden="true"></span>${forum.status}</span>`
        }
      </div>

      <p>${forum.description}</p>

      <div class="m-home-forum-card__footer">
        ${ParticipantBar(forum.participants)}
        <a class="m-home-action ${isJoined ? 'is-secondary' : 'is-primary'}" href="/detail?index=${index}" data-link>${isJoined ? 'Buka Forum' : 'Detail'}</a>
      </div>
    </article>
  `;
}

export function ForumCard(forum, index) {
  const statusClass = forum.status === 'Online' ? 'is-online' : 'is-offline';
  const isJoined = forum.joined === 'joined';

  return `
    <article class="home-forum-card home-forum-card--suggestion${isJoined ? ' home-forum-card--joined' : ''}" data-topic="${forum.topic}">
      <div class="home-forum-card__header">
        <div>
          <span class="home-suggestion-badge">&#10024; Disarankan untuk Kamu</span>
          <span class="home-forum-card__eyebrow">${forum.topic || forum.status}</span>
          <h2>${forum.title}</h2>
        </div>
        ${isJoined
          ? `<span class="home-status--joined"><i class="bi bi-check-circle-fill"></i> Sudah Bergabung</span>`
          : `<span class="home-status is-online"><span aria-hidden="true"></span>${forum.status}</span>`
        }
      </div>

      <p>${forum.description}</p>

      <div class="home-forum-card__footer">
        ${ParticipantBar(forum.participants)}
        <a class="home-action ${isJoined ? 'is-secondary' : 'is-primary'}" href="/detail?index=${index}" data-link>${isJoined ? 'Buka Forum' : 'Detail'}</a>
      </div>
    </article>
  `;
}

export function mSuggestionCard(forum, index) {
  const isJoined = forum.joined === 'joined';

  return `
    <article class="m-home-forum-card m-home-forum-card--suggestion${isJoined ? ' m-home-forum-card--joined' : ''}" data-topic="${forum.topic}">
      <div class="m-home-forum-card__header">
        <div>
          <span class="m-home-suggestion-badge">&#10024; Disarankan untuk Kamu</span>
          <h2>${forum.title}</h2>
        </div>
        ${isJoined
          ? `<span class="m-home-status--joined"><i class="bi bi-check-circle-fill"></i> Joined</span>`
          : `<span class="m-home-status is-online"><span aria-hidden="true"></span>${forum.status}</span>`
        }
      </div>

      <p>${forum.description}</p>

      <div class="m-home-forum-card__footer">
        ${ParticipantBar(forum.participants)}
        <a class="m-home-action ${isJoined ? 'is-secondary' : 'is-primary'}" href="/detail?index=${index}" data-link>${isJoined ? 'Buka Forum' : 'Detail'}</a>
      </div>
    </article>
  `;
}

export function ForumCard(forum, index) {
  const statusClass = forum.status === 'Online' ? 'is-online' : 'is-offline';
  const isJoined = forum.joined === 'joined';
  const isCustom = !!forum.id;

  return `
    <article class="home-forum-card${isJoined ? ' home-forum-card--joined' : ''}${isCustom ? ' home-forum-card--custom' : ''}" data-topic="${forum.topic}">
      <div class="home-forum-card__header">
        <div>
          <span class="home-forum-card__eyebrow">${isCustom ? 'Forum Kustom' : forum.status}</span>
          <h2>${forum.title}</h2>
        </div>
        <div style="display:flex;align-items:center;gap:0.35rem;flex-shrink:0">
          ${isCustom ? `
            <button class="forums-icon-btn" data-edit-forum="${forum.id}" title="Edit forum" aria-label="Edit forum"><i class="bi bi-pencil"></i></button>
            <button class="forums-icon-btn forums-icon-btn--danger" data-delete-forum="${forum.id}" title="Hapus forum" aria-label="Hapus forum"><i class="bi bi-trash"></i></button>
          ` : ''}
          ${isJoined
            ? `<span class="home-status--joined"><i class="bi bi-check-circle-fill"></i> Sudah Bergabung</span>`
            : `<span class="home-status ${statusClass}"><span aria-hidden="true"></span>${forum.status}</span>`
          }
        </div>
      </div>

      <p>${forum.description}</p>

      <div class="home-forum-card__footer">
        ${ParticipantBar(forum.participants)}
        <a class="home-action ${isJoined ? 'is-secondary' : 'is-primary'}" href="/detail?index=${index}" data-link>${isJoined ? 'Buka Forum' : 'Detail'}</a>
      </div>
    </article>
  `;
}

export function mForumCard(forum, index) {
  const statusClass = forum.status === 'Online' ? 'is-online' : 'is-offline';
  const isJoined = forum.joined === 'joined';
  const isCustom = !!forum.id;

  return `
    <article class="m-home-forum-card${isJoined ? ' m-home-forum-card--joined' : ''}" data-topic="${forum.topic}">
      <div class="m-home-forum-card__header">
        <div>
          <h2>${forum.title}</h2>
        </div>
        <div style="display:flex;align-items:center;gap:0.35rem;flex-shrink:0">
          ${isCustom ? `
            <button class="forums-icon-btn" data-edit-forum="${forum.id}" title="Edit forum" aria-label="Edit forum"><i class="bi bi-pencil"></i></button>
            <button class="forums-icon-btn forums-icon-btn--danger" data-delete-forum="${forum.id}" title="Hapus forum" aria-label="Hapus forum"><i class="bi bi-trash"></i></button>
          ` : ''}
          ${isJoined
            ? `<span class="m-home-status--joined"><i class="bi bi-check-circle-fill"></i> Joined</span>`
            : `<span class="m-home-status ${statusClass}"><span aria-hidden="true"></span>${forum.status}</span>`
          }
        </div>
      </div>

      <p>${forum.description}</p>

      <div class="m-home-forum-card__footer">
        ${ParticipantBar(forum.participants)}
        <a class="m-home-action ${isJoined ? 'is-secondary' : 'is-primary'}" href="/detail?index=${index}" data-link>${isJoined ? 'Buka Forum' : 'Detail'}</a>
      </div>
    </article>
  `;
}
