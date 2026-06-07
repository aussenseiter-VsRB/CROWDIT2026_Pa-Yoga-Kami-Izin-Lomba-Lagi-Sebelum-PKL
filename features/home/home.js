import { injectStyle } from '../../js/utils/styleLoader.js';
import { fetchData } from '../../js/utils/api.js';
import { asset } from '../../js/utils/url.js';
import { initForumUsers, AvatarStackHtml, populateStacks } from '../forum-interior/forum-interior.js';

injectStyle('/features/home/home.css');
injectStyle('/features/forum/_members.css');

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
        ${AvatarStackHtml(forum.memberCount || 0, forum.memberLimit || 100, index)}
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
        ${AvatarStackHtml(forum.memberCount || 0, forum.memberLimit || 100, index)}
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

function mergeCourseData(forum, course, forumCourse) {
  return {
    ...forum,
    title: course?.title || forum.title || 'Forum',
    description: course?.description || forum.description || '',
    status: course?.status || forum.status || 'Online',
    memberCount: forumCourse?.memberCount || forum.memberCount || 0,
    memberLimit: forumCourse?.memberLimit || forum.memberLimit || 100,
  };
}

export async function Home() {
  const usersPromise = initForumUsers();
  try {
    const [homeData, detailData, forumData] = await Promise.all([
      fetchData('/features/home/home.json'),
      fetch(asset('/data/detail.json')).then(r => r.json()),
      fetch(asset('/data/forum.json')).then(r => r.json()),
    ]);

    const data = {
      ...homeData,
      forums: homeData.forums.map((f, i) =>
        mergeCourseData(f, detailData[i]?.course, forumData.courses[i])
      ),
      mobile: {
        ...homeData.mobile,
        forums: homeData.mobile.forums.map((f, i) =>
          mergeCourseData(f, detailData[i]?.course, forumData.courses[i])
        ),
      },
    };

    const isMobile = window.innerWidth <= 900;
    const el = isMobile ? renderMobile(data) : renderDesktop(data);
    usersPromise.then(() => populateStacks(el));
    return el;
  } catch (err) {
    const el = document.createElement('section');
    el.className = 'home-page container section';
    el.innerHTML = `<p style="color:var(--muted);padding:2rem;text-align:center">Gagal memuat halaman: ${err.message}</p>`;
    return el;
  }
}
