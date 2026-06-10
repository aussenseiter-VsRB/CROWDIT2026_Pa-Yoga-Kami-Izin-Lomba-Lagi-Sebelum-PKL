import { PageHeader } from '../../../../components/shared/page-header/page-header.js';
import { Card } from '../../../../components/ui/card/card.js';
import { getSession } from '../../../../js/services/auth.js';
import { getFriendNames } from '../../../../js/services/follow.js';
import { getJoinedForums } from '../../../../js/services/forum-access.js';
import { getConversations } from '../../../../js/services/dm.js';
import {
  ConversationCard, FriendCard, ForumCard,
  mConversationCard, mFriendCard, mForumCard, mDataCard,
} from './_cards.js';

function buildDesktopSections() {
  const session = getSession();
  let convHtml = '';
  let friendsHtml = '';

  if (session) {
    const convos = getConversations(session.email);
    if (convos.length > 0) {
      convHtml = `
        <div class="chat-section chat-section--with-top-gap">
          <h3 class="chat-section-title"><i class="bi bi-chat-dots"></i> Pesan Langsung</h3>
          <div class="chat-list">${convos.map(ConversationCard).join('')}</div>
        </div>

      `;
    }

    const friendNames = getFriendNames(session.email);
    if (friendNames.length > 0) {
      friendsHtml = `
        <div class="chat-section">
          <h3 class="chat-section-title"><i class="bi bi-person-plus"></i> Teman</h3>
          <div class="chat-friend-grid">${friendNames.map(FriendCard).join('')}</div>
        </div>
      `;
    }
  }

  const joinedForums = getJoinedForums().filter(f => f.type === 'group');
  let forumsHtml = '';
  if (joinedForums.length > 0) {
    forumsHtml = `
      <div class="chat-section chat-section--with-top-gap">
        <h3 class="chat-section-title"><i class="bi bi-collection"></i> Grup saya</h3>
        <div class="chat-friend-grid chat-friend-grid--forums">${joinedForums.map(ForumCard).join('')}</div>
      </div>

    `;
  }

  return { convHtml, friendsHtml, forumsHtml };
}

function buildMobileSections() {
  const session = getSession();
  let convHtml = '';
  let friendsHtml = '';

  if (session) {
    const convos = getConversations(session.email);
    if (convos.length > 0) {
      convHtml = `
        <div class="mobile-page__inner" style="padding-bottom:0.5rem">
          <div class="chat-mobile-gap"></div>
          <p class="chatm-section-title"><i class="bi bi-chat-dots"></i> Pesan Langsung</p>
          <div class="mobile-list">${convos.map(mConversationCard).join('')}</div>
        </div>

        <div class="chatm-separator"></div>
      `;
    }

    const friendNames = getFriendNames(session.email);
    if (friendNames.length > 0) {
      friendsHtml = `
        <div class="mobile-page__inner" style="padding-bottom:0.5rem">
          <p class="chatm-section-title"><i class="bi bi-person-plus"></i> Teman</p>
          <div class="mobile-list">${friendNames.map(mFriendCard).join('')}</div>
        </div>
        <div class="chatm-separator"></div>
      `;
    }
  }

  const joinedForums = getJoinedForums().filter(f => f.type === 'group');
  let forumsHtml = '';
  if (joinedForums.length > 0) {
    forumsHtml = `
      <div class="mobile-page__inner" style="padding-bottom:0.5rem">
        <div class="chat-mobile-gap"></div>
        <p class="chatm-section-title"><i class="bi bi-collection"></i> Forum Saya</p>
        <div class="mobile-list chat-mobile-forums">${joinedForums.map(mForumCard).join('')}</div>
      </div>
      <div class="chatm-separator"></div>

    `;
  }

  return { convHtml, friendsHtml, forumsHtml };
}

export function renderDesktop(data) {
  const el = document.createElement('section');
  el.className = 'container section';

  const { convHtml, friendsHtml, forumsHtml } = buildDesktopSections();

  el.innerHTML = `
    <div class="desktop-page">
      <div class="desktop-page__header"></div>
      <div class="chat-page__topbar">
        <div class="chat-page__topbar-inner">
          <span class="chat-page__topbar-icon">💬</span>
          <span class="chat-page__topbar-title">Pesan</span>
          <a class="chat-page__new-btn" href="/groups" data-link>
            <span class="chat-page__new-pencil">✏️</span>
            Baru
          </a>
        </div>
      </div>

      <div class="chat-page__sections">
        ${convHtml}
        ${friendsHtml}
        ${forumsHtml}
      </div>

      <div class="card-grid desktop-page__grid"></div>
    </div>
  `;


  // Ganti hero PageHeader dengan header sederhana (lihat requirements)
  const headerMount = el.querySelector('.desktop-page__header');
  if (headerMount) headerMount.remove();


  const grid = el.querySelector('.desktop-page__grid');
  if (data.cards) {
    data.cards.forEach(card => grid.appendChild(Card(card)));
  }

  return el;
}

export function renderMobile(data) {
  const { convHtml, friendsHtml, forumsHtml } = buildMobileSections();

  const el = document.createElement('section');
  el.className = 'mobile-page';

  el.innerHTML = `
    <div class="mobile-page__inner">
      <div class="chat-page__topbar chat-page__topbar--mobile">
        <div class="chat-page__topbar-inner">
          <span class="chat-page__topbar-icon">💬</span>
          <span class="chat-page__topbar-title">Pesan</span>
          <a class="chat-page__new-btn" href="/groups" data-link>
            <span class="chat-page__new-pencil">✏️</span>
            Baru
          </a>
        </div>
      </div>
    </div>

    <div class="chat-page__sections chat-page__sections--mobile">
      ${convHtml}
      ${forumsHtml}
      ${friendsHtml}

      <div class="mobile-page__inner">
        <div class="mobile-list">
          ${data.cards ? data.cards.map(mDataCard).join('') : ''}
        </div>
      </div>
    </div>
  `;


  return el;
}
