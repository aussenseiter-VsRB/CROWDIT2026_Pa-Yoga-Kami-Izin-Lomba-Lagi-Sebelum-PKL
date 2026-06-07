import { injectStyle } from '../../js/utils/styleLoader.js';
import { getHashParams, getHashPath, asset, navigateTo } from '../../js/utils/url.js';
import { getForumStatus, joinForum, requestJoin, leaveForum } from '../../js/forum-access.js';
import { isAuthenticated } from '../../js/auth.js';
import { AvatarStackHtml, populateStacks, initForumUsers } from '../forum-interior/forum-interior.js';

injectStyle('/css/_shared.css');
injectStyle('/features/forum/forum.css');

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'baru saja';
  if (mins < 60) return `${mins}m lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}j lalu`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'kemarin';
  return `${days}h lalu`;
}

const lastActivity = '2025-06-02T18:00:00Z';

function renderCTA(status, privacy) {
  if (status === 'joined') {
    return `<button class="forum-cta forum-cta--open" type="button" id="js-forum-cta"><i class="bi bi-box-arrow-in-right"></i> Buka Forum</button>`;
  }
  if (status === 'pending') {
    return `<button class="forum-cta forum-cta--pending" type="button" disabled><i class="bi bi-clock"></i> Permintaan Terkirim</button>`;
  }
  if (privacy === 'private') {
    return `<button class="forum-cta forum-cta--request" type="button" id="js-forum-cta"><i class="bi bi-lock"></i> Minta Bergabung</button>`;
  }
  return `<button class="forum-cta forum-cta--join" type="button" id="js-forum-cta"><i class="bi bi-plus-circle"></i> Gabung Forum</button>`;
}

function renderLandingDesktop(data) {
  const { serverName, forumType, description, memberCount, memberLimit, channels, members, privacy, forumIndex, backLink, status } = data;
  const isLocked = privacy === 'private' && status !== 'joined';

  const el = document.createElement('section');
  el.className = 'container section';
  el.style.display = 'flex';
  el.style.flexDirection = 'column';
  el.style.alignItems = 'center';

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

      <div class="forum-landing__section">
        <h3 class="forum-landing__section-title">Saluran</h3>
        <div class="forum-landing__channels ${isLocked ? 'forum-landing__channels--locked' : ''}">
          ${channels.map(ch => `
            <div class="forum-landing__channel">
              <i class="bi ${ch.type === 'voice' ? 'bi-mic' : 'bi-hash'}"></i>
              <span>${ch.name}</span>
              ${isLocked ? '<i class="bi bi-lock forum-landing__channel-lock"></i>' : `<span class="forum-landing__channel-count">${ch.messages.length}</span>`}
            </div>
          `).join('')}
          ${isLocked ? '<div class="forum-landing__blur"><i class="bi bi-lock"></i> Gabung untuk melihat pesan</div>' : ''}
        </div>
      </div>

      <div class="forum-landing__cta">
        ${renderCTA(status, privacy)}
      </div>
    </div>
  `;

  return el;
}

function renderLandingMobile(data) {
  const { serverName, forumType, description, memberCount, memberLimit, channels, members, privacy, forumIndex, backLink, status } = data;
  const isLocked = privacy === 'private' && status !== 'joined';

  const el = document.createElement('section');
  el.className = 'mobile-page';

  el.innerHTML = `
    <div class="mobile-page__inner">
      <header class="mobile-page__hero" style="padding-bottom:0.5rem">
        <a class="forum-back" href="${backLink}" data-link style="display:inline-flex;align-items:center;gap:0.35rem;font-size:0.82rem;font-weight:600;color:var(--muted,#6b7280);text-decoration:none;margin-bottom:0.75rem">
          <i class="bi bi-arrow-left"></i> Kembali
        </a>
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.5rem">
          <div style="width:2.8rem;height:2.8rem;border-radius:0.75rem;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:700;flex-shrink:0">${serverName.charAt(0)}</div>
          <div>
            <p class="mobile-page__eyebrow" style="margin-bottom:0.1rem">${forumType === 'course' ? 'Kursus' : 'Grup'}</p>
            <h1 style="margin:0;font-size:1.25rem">${serverName}</h1>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.78rem">
          <span class="forum-landing__privacy forum-landing__privacy--${privacy}" style="display:inline-flex;align-items:center;gap:0.25rem;padding:0.15rem 0.5rem;border-radius:999px;font-size:0.72rem;font-weight:700">
            <i class="bi ${privacy === 'private' ? 'bi-lock' : 'bi-unlock'}"></i>
            ${privacy === 'private' ? 'Private' : 'Public'}
          </span>
        </div>
      </header>

      <p style="font-size:0.88rem;color:var(--text-secondary);line-height:1.6;margin:0 0 1rem">${description || 'Diskusi dan kolaborasi untuk anggota forum.'}</p>

      <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem;flex-wrap:wrap">
        ${AvatarStackHtml(memberCount, memberLimit, forumIndex)}
        <span style="font-size:0.75rem;color:var(--muted-alt)"><i class="bi bi-chat-dots"></i> ${channels.reduce((s, c) => s + c.messages.length, 0)} pesan</span>
        <span style="font-size:0.75rem;color:var(--muted-alt)"><i class="bi bi-clock"></i> ${timeAgo(lastActivity)}</span>
      </div>

      <div class="forum-landing__section" style="margin-bottom:1.25rem">
        <h3 class="forum-landing__section-title" style="font-size:0.72rem;margin-bottom:0.5rem">Saluran</h3>
        <div class="forum-landing__channels ${isLocked ? 'forum-landing__channels--locked' : ''}">
          ${channels.map(ch => `
            <div class="forum-landing__channel" style="padding:0.55rem 0.75rem">
              <i class="bi ${ch.type === 'voice' ? 'bi-mic' : 'bi-hash'}"></i>
              <span>${ch.name}</span>
              ${isLocked ? '<i class="bi bi-lock forum-landing__channel-lock" style="margin-left:auto;font-size:0.7rem"></i>' : `<span class="forum-landing__channel-count">${ch.messages.length}</span>`}
            </div>
          `).join('')}
          ${isLocked ? '<div class="forum-landing__blur"><i class="bi bi-lock"></i> Gabung untuk melihat pesan</div>' : ''}
        </div>
      </div>

      <div class="forum-landing__cta">
        ${renderCTA(status, privacy)}
      </div>
    </div>
  `;

  return el;
}

function attachCTA(el, data) {
  const btn = el.querySelector('#js-forum-cta');
  if (!btn) return;

  const { forumType, index, privacy, serverName, status } = data;

  btn.addEventListener('click', () => {
    if (!isAuthenticated()) {
      navigateTo('/login');
      return;
    }
    if (status === 'joined') {
      navigateTo(`/forum-interior?${forumType === 'course' ? 'index' : 'group'}=${index}`);
      return;
    }
    if (privacy === 'public') {
      joinForum(forumType, index);
      updateCTA(el, 'joined');
      navigateTo(`/forum-interior?${forumType === 'course' ? 'index' : 'group'}=${index}`);
    } else {
      requestJoin(forumType, index, serverName);
      updateCTA(el, 'pending');
    }
  });
}

function updateCTA(el, newStatus) {
  const cta = el.querySelector('.forum-landing__cta');
  if (!cta) return;
  if (newStatus === 'joined') {
    cta.innerHTML = renderCTA('joined', 'public');
  } else if (newStatus === 'pending') {
    cta.innerHTML = renderCTA('pending', 'private');
  }
  attachCTA(el, { ...el.__forumData, status: newStatus });
}

export async function Forum() {
  const params = getHashParams();
  const courseIdx = parseInt(params.get('index'), 10);
  const groupIdx = parseInt(params.get('group'), 10);

  const [forumRes, detailRes, groupsRes] = await Promise.all([
    fetch(asset('/data/forum.json')).then(r => r.json()),
    fetch(asset('/data/detail.json')).then(r => r.json()),
    fetch(asset('/data/groups.json')).then(r => r.json()),
  ]);

  let forumData, serverName, forumType, index = 0, description = '';
  if (!isNaN(courseIdx) && forumRes.courses[courseIdx]) {
    forumData = forumRes.courses[courseIdx];
    serverName = detailRes[courseIdx]?.course?.title || 'Forum';
    description = detailRes[courseIdx]?.course?.description || '';
    forumType = 'course';
    index = courseIdx;
  } else if (!isNaN(groupIdx) && forumRes.groups[groupIdx]) {
    forumData = forumRes.groups[groupIdx];
    serverName = groupsRes.groups[groupIdx]?.title || 'Grup';
    description = groupsRes.groups[groupIdx]?.description || '';
    forumType = 'group';
    index = groupIdx;
  } else {
    forumData = forumRes.courses[0];
    serverName = 'Forum';
    description = '';
    forumType = 'course';
    index = 0;
  }

  const backLink = forumType === 'group' ? '/groups' : '/';
  const channels = forumData.channels;
  const members = forumData.members;
  const memberCount = forumType === 'group'
    ? (groupsRes.groups[groupIdx]?.members || members.length)
    : (forumData.memberCount || members.length);
  const memberLimit = forumType === 'group'
    ? (groupsRes.groups[groupIdx]?.maxMembers || 100)
    : (forumData.memberLimit || 100);
  const privacy = forumData.privacy || 'public';
  const forumIndex = forumType === 'course' ? index : (forumRes.courses.length + index);
  const status = getForumStatus(forumType, index);

  if (status === 'joined') {
    const el = document.createElement('section');
    el.className = 'container section';
    el.innerHTML = `<p style="text-align:center;padding:2rem;color:var(--muted)"><i class="bi bi-arrow-repeat"></i> Mengalihkan ke forum...</p>`;
    navigateTo(`/forum-interior?${forumType === 'course' ? 'index' : 'group'}=${index}`);
    return el;
  }

  initForumUsers();

  const isMobile = window.innerWidth <= 900;
  const data = { serverName, forumType, description, memberCount, memberLimit, channels, members, privacy, forumIndex, backLink, status, index };

  const el = isMobile ? renderLandingMobile(data) : renderLandingDesktop(data);
  el.__forumData = data;

  attachCTA(el, data);
  populateStacks(el);

  const onUpdate = () => {
    const current = getForumStatus(forumType, index);
    if (current === 'joined' && el.__forumData.status !== 'joined') {
      el.__forumData.status = 'joined';
      updateCTA(el, 'joined');
    }
  };
  window.addEventListener('forum-join-update', onUpdate, { once: false });
  el._cleanup = () => window.removeEventListener('forum-join-update', onUpdate);

  return el;
}
