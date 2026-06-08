import { AvatarStackHtml } from '../../interior/js/_cards.js';
import { timeAgo } from './_utils.js';
import { renderCTA, ForumChannelListHtml } from './_cards.js';
import { attachCTA } from './_handlers.js';

const lastActivity = '2025-06-02T18:00:00Z';

function statsHtml(channels, memberCount, memberLimit, forumIndex) {
  return `
    <div class="forum-landing__stats">
      <div class="forum-landing__members">
        ${AvatarStackHtml(memberCount, memberLimit, forumIndex)}
      </div>
      <span class="forum-landing__activity">
        <i class="bi bi-chat-dots"></i> ${channels.reduce((s, c) => s + c.messages.length, 0)} pesan
      </span>
      <span class="forum-landing__activity">
        <i class="bi bi-clock"></i> ${timeAgo(lastActivity)}
      </span>
    </div>
  `;
}

export function renderLandingDesktop(data) {
  const { serverName, forumType, description, privacy, backLink, status, channels, memberCount, memberLimit, forumIndex } = data;
  const isLocked = privacy === 'private' && status !== 'joined';

  const el = document.createElement('section');
  el.className = 'container section';
  el.style.cssText = 'display:flex;flex-direction:column;align-items:center';

  el.innerHTML = `
    <div class="forum-landing">
      <a class="forum-back" href="${backLink}" data-link><i class="bi bi-arrow-left"></i> Kembali</a>

      <div class="forum-landing__banner">
        <div class="forum-landing__avatar">${serverName.charAt(0)}</div>
        <div class="forum-landing__info">
          <h1 class="forum-landing__name">${serverName}</h1>
          <div class="forum-landing__meta">
            <span class="forum-landing__type">${forumType === 'course' ? 'Kursus' : 'Grup'}</span>
            <span class="forum-landing__dot"></span>
            <span class="forum-landing__privacy forum-landing__privacy--${privacy}">
              <i class="bi ${privacy === 'private' ? 'bi-lock' : 'bi-unlock'}"></i>
              ${privacy === 'private' ? 'Private' : 'Public'}
            </span>
          </div>
        </div>
      </div>

      <p class="forum-landing__desc">${description || 'Diskusi dan kolaborasi untuk anggota forum.'}</p>

      ${statsHtml(channels, memberCount, memberLimit, forumIndex)}

      <div class="forum-landing__section">
        <h3 class="forum-landing__section-title">Saluran</h3>
        ${ForumChannelListHtml(channels, isLocked)}
      </div>

      <div class="forum-landing__cta">
        ${renderCTA(status, privacy)}
      </div>
    </div>
  `;

  return el;
}

export function renderLandingMobile(data) {
  const { serverName, forumType, description, privacy, backLink, status, channels, memberCount, memberLimit, forumIndex } = data;
  const isLocked = privacy === 'private' && status !== 'joined';

  const el = document.createElement('section');
  el.className = 'mobile-page';

  el.innerHTML = `
    <div class="mobile-page__inner">
      <header class="mobile-page__hero" style="padding-bottom:0.5rem">
        <a class="forum-back" href="${backLink}" data-link>
          <i class="bi bi-arrow-left"></i> Kembali
        </a>
        <div class="forum-landing-mobile__header">
          <div class="forum-landing-mobile__avatar">${serverName.charAt(0)}</div>
          <div>
            <p class="mobile-page__eyebrow">${forumType === 'course' ? 'Kursus' : 'Grup'}</p>
            <h1>${serverName}</h1>
          </div>
        </div>
        <div class="forum-landing-mobile__privacy">
          <span class="forum-landing__privacy forum-landing__privacy--${privacy}">
            <i class="bi ${privacy === 'private' ? 'bi-lock' : 'bi-unlock'}"></i>
            ${privacy === 'private' ? 'Private' : 'Public'}
          </span>
        </div>
      </header>

      <p class="forum-landing-mobile__desc">${description || 'Diskusi dan kolaborasi untuk anggota forum.'}</p>

      <div class="forum-landing-mobile__stats">
        ${AvatarStackHtml(memberCount, memberLimit, forumIndex)}
        <span><i class="bi bi-chat-dots"></i> ${channels.reduce((s, c) => s + c.messages.length, 0)} pesan</span>
        <span><i class="bi bi-clock"></i> ${timeAgo(lastActivity)}</span>
      </div>

      <div class="forum-landing__section">
        <h3 class="forum-landing__section-title">Saluran</h3>
        ${ForumChannelListHtml(channels, isLocked)}
      </div>

      <div class="forum-landing__cta">
        ${renderCTA(status, privacy)}
      </div>
    </div>
  `;

  return el;
}
