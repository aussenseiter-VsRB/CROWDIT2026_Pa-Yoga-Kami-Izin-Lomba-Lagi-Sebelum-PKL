import { PageHeader } from '/components/desktop/page-header/page-header.js';

if (!document.querySelector('link[href="/pages/pages-desktop/home/home.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-desktop/home/home.css';
  document.head.appendChild(link);
}

const topics = ['All Topics', 'Computer Science', 'Mathematics', 'Philosophy'];

const forums = [
  {
    title: 'Advanced Calculus III Midterm Prep',
    description:
      'Working through chapter 4 practice problems, focusing on double integrals and vector fields. Join if you need help with the homework!',
    joined: '3/6 joined',
    status: 'Online',
    action: 'Open',
  },
  {
    title: 'Data Structures Algorithms',
    description:
      'Reviewing binary trees, graph traversals, and dynamic programming approaches for the upcoming coding interview mock sessions.',
    joined: '12/15 joined',
    status: 'Online',
    action: 'Open',
  },
  {
    title: 'Intro to Modern Philosophy',
    description:
      "Discussion group for Kant's Critique of Pure Reason. Meeting resumes tomorrow at 10:00 AM EST. Read chapter 2 before joining.",
    joined: '4/8 joined',
    status: 'Offline',
    action: 'Details',
  },
  {
    title: 'Organic Chemistry Lab Prep',
    description:
      'Sharing pre-lab notes and discussing the safety protocols for the synthesis of aspirin experiment.',
    joined: '2/4 joined',
    status: 'Offline',
    action: 'Details',
  },
];

function peopleIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path>
      <path d="M5 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1"></path>
    </svg>
  `;
}

function ForumCard(forum) {
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
        <span class="home-joined">
          ${peopleIcon()}
          ${forum.joined}
        </span>
        <a class="home-action ${forum.action === 'Open' ? 'is-primary' : 'is-secondary'}" href="/groups" data-link>
          ${forum.action}
        </a>
      </div>
    </article>
  `;
}

export async function Home() {
  const el = document.createElement('section');
  el.className = 'home-page container section';

  el.innerHTML = `
    <div class="home-page__inner">
      <div class="home-hero"></div>

      <nav class="home-topics" aria-label="Forum topics">
        ${topics.map((topic, index) => `
          <button class="home-topic ${index === 0 ? 'is-active' : ''}" type="button">
            ${topic}
          </button>
        `).join('')}
      </nav>

      <section class="home-stats" aria-label="Community stats">
        <div class="home-stat">
          <span class="home-stat__value">24</span>
          <span class="home-stat__label">Active groups</span>
        </div>
        <div class="home-stat">
          <span class="home-stat__value">48</span>
          <span class="home-stat__label">New posts today</span>
        </div>
        <div class="home-stat">
          <span class="home-stat__value">16</span>
          <span class="home-stat__label">Mentors online</span>
        </div>
      </section>

      <div class="home-forum-list">
        ${forums.map(ForumCard).join('')}
      </div>
    </div>
  `;

  el.querySelector('.home-hero').appendChild(
    PageHeader({
      eyebrow: 'Explore',
      title: 'Explore Forums',
      description: 'Find a study group, join the discussion, and move faster together with a clean, calm desktop layout.',
      actions: [
        { label: 'Browse groups', href: '/groups', variant: 'secondary' },
        { label: 'Create account', href: '/signup', variant: 'primary' },
      ],
    }),
  );

  return el;
}
