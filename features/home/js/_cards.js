import { LIMITS } from '../../../js/core/config.js';

function ParticipantBar(participants) {
  const joined = participants?.joined || 0;
  const capacity = participants?.capacity || LIMITS.DEFAULT_MEMBER_LIMIT;
  const pct = capacity > 0 ? Math.round((joined / capacity) * 100) : 0;
  return `
    <div class="home-participants">
      <div class="home-participants__header">
        <span class="home-participants__label">
          <i class="bi bi-people"></i>
          ${joined} peserta
        </span>
        <span class="home-participants__pct">${pct}%</span>
      </div>
      <div class="home-participants__bar">
        <div class="home-participants__bar-fill" style="width:${pct}%"></div>
      </div>
    </div>
  `;
}

export function ForumCard(forum, index) {
  const statusClass = forum.status === 'Online' ? 'is-online' : 'is-offline';

  return `
    <article class="home-forum-card">
      <div class="home-forum-card__header">
        <div>
          <span class="home-forum-card__eyebrow">${forum.status}</span>
          <h2>${forum.title}</h2>
        </div>
        <span class="home-status ${statusClass}">
          <span aria-hidden="true"></span>
          ${forum.status}
        </span>
      </div>

      <p>${forum.description}</p>

      <div class="home-forum-card__footer">
        ${ParticipantBar(forum.participants)}
        <a class="home-action is-primary" href="/detail?index=${index}" data-link>
          Detail
        </a>
      </div>
    </article>
  `;
}

export function mForumCard(forum, index) {
  const statusClass = forum.status === 'Online' ? 'is-online' : 'is-offline';

  return `
    <article class="m-home-forum-card">
      <div class="m-home-forum-card__header">
        <h2>${forum.title}</h2>
        <span class="m-home-status ${statusClass}">
          <span aria-hidden="true"></span>
          ${forum.status}
        </span>
      </div>

      <p>${forum.description}</p>

      <div class="m-home-forum-card__footer">
        ${ParticipantBar(forum.participants)}
        <a class="m-home-action is-primary" href="/detail?index=${index}" data-link>
          Detail
        </a>
      </div>
    </article>
  `;
}
