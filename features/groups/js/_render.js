import { ForumCard, mForumCard } from '../../../components/shared/forum-card/forum-card.js';
import { Hero } from './_cards.js';

export function renderDesktop(data) {
  const el = document.createElement('section');
  el.className = 'container section';

  el.innerHTML = `
    <div class="desktop-page">
      ${Hero(data.hero)}
      <div class="grp-grid" id="groups"></div>
    </div>
  `;

  const grid = el.querySelector('.grp-grid');
  grid.innerHTML = data.groups.map((g, i) => ForumCard(g, i)).join('');

  return el;
}

export function renderMobile(data) {
  const el = document.createElement('section');
  el.className = 'm-home-page';

  el.innerHTML = `
    <div class="m-home-page__inner">
      <header class="m-home-hero">
        <h1>Grup Belajar</h1>
        <p>${data.hero.description}</p>
      </header>

      <div class="m-forums-stats">
        <div class="m-forums-stat">
          <i class="bi bi-people"></i>
          <span><strong>${data.stats.totalGroups} grup</strong> — ${data.stats.totalMembers} anggota</span>
        </div>
        ${data.stats.topGroup ? `
          <div class="m-forums-stat">
            <i class="bi bi-trophy"></i>
            <span><strong>${data.stats.topGroup.title}</strong> — ${data.stats.topGroup.count} anggota</span>
          </div>
        ` : ''}
      </div>

      <button class="fab" data-create-group type="button" aria-label="Buat Grup"><i class="bi bi-plus-lg"></i></button>

      <div class="m-home-status-chips">
        <button class="m-home-status-chip is-active" type="button" data-status="">Semua</button>
        <button class="m-home-status-chip" type="button" data-status="popular">Populer</button>
        <button class="m-home-status-chip" type="button" data-status="active">Aktif</button>
        <button class="m-home-status-chip" type="button" data-status="inactive">Kurang Aktif</button>
      </div>

      <div class="m-home-forum-list" id="groups-mobile-list">
        ${data.groups.map((g, i) => mForumCard(g, i)).join('')}
      </div>
    </div>
  `;

  return el;
}
