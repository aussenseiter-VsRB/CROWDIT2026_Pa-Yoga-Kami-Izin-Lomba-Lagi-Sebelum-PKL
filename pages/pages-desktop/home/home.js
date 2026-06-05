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
  {
    title: 'Linear Algebra Problem Solving',
    description:
      'Weekly problem session: eigenvalues, diagonalization, and applications to differential equations.',
    joined: '7/10 joined',
    status: 'Online',
    action: 'Open',
  },
  {
    title: 'Intro to Machine Learning',
    description:
      'Beginner-friendly walkthroughs of supervised learning algorithms and hands-on mini-projects.',
    joined: '20/30 joined',
    status: 'Online',
    action: 'Open',
  },
  {
    title: 'Shakespeare Reading Circle',
    description:
      'Casual group reading and discussion of selected plays. No prior experience required.',
    joined: '5/12 joined',
    status: 'Offline',
    action: 'Details',
  },
  {
    title: 'Physics: Classical Mechanics',
    description:
      'Problem solving for Newtonian mechanics and rotational dynamics. Great prep for exams.',
    joined: '9/14 joined',
    status: 'Online',
    action: 'Open',
  },
  {
    title: 'Statistics for Social Sciences',
    description:
      'Discussing hypothesis testing, regressions, and interpreting real survey datasets.',
    joined: '6/8 joined',
    status: 'Offline',
    action: 'Details',
  },
  {
    title: 'Creative Writing Workshop',
    description:
      'Peer feedback on short stories and poems. Share a piece and get constructive notes.',
    joined: '11/11 joined',
    status: 'Online',
    action: 'Open',
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
      <section class="home-hero" aria-label="Hero section">
        <div class="home-hero__copy">
          <p class="home-hero__eyebrow">Belajar lebih pintar bersama komunitas</p>
          <h1 class="home-hero__title">Forum studi modern untuk diskusi, tugas, dan kolaborasi.</h1>
          <p class="home-hero__text">Gabung dengan pelajar lain untuk memecahkan soal, bertukar ide, dan menyelesaikan proyek dalam ruang yang rapi, profesional, dan mudah dinavigasi.</p>

          <div class="home-hero__actions">
            <a class="home-button home-button--primary" href="/groups" data-link>Jelajahi grup</a>
            <a class="home-button home-button--secondary" href="/signup" data-link>Buat akun gratis</a>
          </div>
        </div>

        <div class="home-hero__aside">
          <p class="home-hero__aside-title">Ringkasan komunitas</p>
          <ul class="home-hero__aside-list">
            <li><strong>24</strong><span>Grup aktif</span></li>
            <li><strong>48</strong><span>Posting baru hari ini</span></li>
            <li><strong>16</strong><span>Mentor online</span></li>
          </ul>
        </div>
      </section>

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

  return el;
}
