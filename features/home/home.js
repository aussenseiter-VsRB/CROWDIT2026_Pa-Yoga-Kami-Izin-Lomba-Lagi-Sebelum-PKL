import { injectStyle } from '../../js/utils/styleLoader.js';
import { fetchData } from '../../js/utils/api.js';
import { asset } from '../../js/utils/url.js';
import { DATA_PATHS, LIMITS, MOBILE_BREAKPOINT } from '../../js/core/config.js';
import { getLiveMemberCount } from '../../js/services/forum-access.js';

injectStyle('/features/home/home.css');

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

function ForumCard(forum, index) {
  const statusClass = forum.status === 'Online' ? 'is-online' : 'is-offline';
  const actionHref = forum.action === 'Detail' ? `/detail?index=${index}` : `/open?index=${index}`;

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
        <a class="home-action is-primary" href="${actionHref}" data-link>
          ${forum.action}
        </a>
      </div>
    </article>
  `;
}

function mForumCard(forum, index) {
  const statusClass = forum.status === 'Online' ? 'is-online' : 'is-offline';
  const actionHref = forum.action === 'Detail' ? `/detail?index=${index}` : `/open?index=${index}`;

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
        <a class="m-home-action is-primary" href="${actionHref}" data-link>
          ${forum.action}
        </a>
      </div>
    </article>
  `;
}

function renderDesktop(data) {
  const el = document.createElement('section');
  el.className = 'home-page container section';

  el.innerHTML = `
    <div class="home-page__inner">
      <section class="home-hero" aria-label="Hero section">
        <div class="home-hero__copy">
          <p class="home-hero__eyebrow">${data.hero.eyebrow}</p>
          <h1 class="home-hero__title">${data.hero.title}</h1>
          <p class="home-hero__text">${data.hero.text}</p>

          <div class="home-hero__actions">
            <a class="home-button home-button--primary" href="${data.hero.actions[0].href}" data-link>${data.hero.actions[0].label}</a>
            <a class="home-button home-button--secondary" href="${data.hero.actions[1].href}" data-link>${data.hero.actions[1].label}</a>
          </div>
        </div>

        <div class="home-hero__aside">
          <p class="home-hero__aside-title">${data.aside.title}</p>
          <ul class="home-hero__aside-list">
            ${data.aside.stats.map(s => `<li><strong>${s.value}</strong><span>${s.label}</span></li>`).join('')}
          </ul>
        </div>
      </section>

      <nav class="home-topics" aria-label="Forum topics">
        ${data.topics.map((topic, index) => `
          <button class="home-topic ${index === 0 ? 'is-active' : ''}" type="button">
            ${topic}
          </button>
        `).join('')}
      </nav>

      <section class="home-stats" aria-label="Community stats">
        ${data.stats.map(s => `
          <div class="home-stat">
            <span class="home-stat__value">${s.value}</span>
            <span class="home-stat__label">${s.label}</span>
          </div>
        `).join('')}
      </section>

      <div class="home-forum-list">
        ${data.forums.map((forum, index) => ForumCard(forum, index)).join('')}
      </div>
    </div>
  `;

  return el;
}

function renderMobile(data) {
  const el = document.createElement('section');
  el.className = 'm-home-page';

  el.innerHTML = `
    <div class="m-home-page__inner">
      <header class="m-home-hero">
        <h1>${data.mobile.title}</h1>
        <p>${data.mobile.description}</p>
      </header>

      <nav class="m-home-topics" aria-label="Forum topics">
        ${data.topics.map((topic, index) => `
          <button class="m-home-topic ${index === 0 ? 'is-active' : ''}" type="button">
            ${topic}
          </button>
        `).join('')}
      </nav>

      ${data.stats ? `
        <div class="mobile-stats-grid">
          ${data.stats.map(s => `
            <div class="mobile-stat-card">
              <span class="mobile-stat-card__value">${s.value}</span>
              <span class="mobile-stat-card__label">${s.label}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div class="m-home-forum-list">
        ${data.mobile.forums.map((forum, index) => mForumCard(forum, index)).join('')}
      </div>
    </div>
  `;

  const topicBtns = el.querySelectorAll('.m-home-topic');
  topicBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      topicBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
    });
  });

  return el;
}

function mergeCourseData(forum, course, participants, index) {
  const liveJoined = getLiveMemberCount(index, participants?.joined || 0);
  return {
    ...forum,
    title: course?.title || forum.title || 'Forum',
    description: course?.description || forum.description || '',
    status: course?.status || forum.status || 'Online',
    participants: {
      joined: liveJoined,
      capacity: participants?.capacity || LIMITS.DEFAULT_MEMBER_LIMIT,
    },
  };
}

export async function Home() {
  try {
    const [homeData, detailData] = await Promise.all([
      fetchData(DATA_PATHS.HOME),
      fetch(asset(DATA_PATHS.DETAIL)).then(r => r.json()),
    ]);

    const data = {
      ...homeData,
      forums: homeData.forums.map((f, i) =>
        mergeCourseData(f, detailData[i]?.course, detailData[i]?.participants, i)
      ),
      mobile: {
        ...homeData.mobile,
        forums: homeData.mobile.forums.map((f, i) =>
          mergeCourseData(f, detailData[i]?.course, detailData[i]?.participants, i)
        ),
      },
    };

    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    const el = isMobile ? renderMobile(data) : renderDesktop(data);
    return el;
  } catch (err) {
    const el = document.createElement('section');
    el.className = 'home-page container section';
    el.innerHTML = `<p style="color:var(--muted);padding:2rem;text-align:center">Gagal memuat halaman: ${err.message}</p>`;
    return el;
  }
}
