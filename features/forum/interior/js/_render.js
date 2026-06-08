import { API, LIMITS } from '../../../../js/core/config.js';
import { isFollowing } from '../../../../js/services/notifications.js';
import { seededShuffle } from './_utils.js';
import { MsgEl, ChannelSidebar, ActiveMembersPanel, MessageArea, MobileActiveMembersHtml } from './_cards.js';
import { bindFollowBtn, bindLeaveBtn, bindChannelNav, bindSendInput, sendMessage } from './_handlers.js';

export function populateStacks(root, users) {
  if (!users || users.length === 0) return;
  const stacks = root.querySelectorAll('.forum-member-stack');
  stacks.forEach(stack => {
    const idx = parseInt(stack.dataset.forumIndex, 10);
    const memberCount = parseInt(stack.dataset.memberCount, 10);
    const n = Math.min(memberCount, LIMITS.MAX_AVATAR_STACK);
    const shuffled = seededShuffle(users, idx);
    const items = shuffled.slice(0, n);
    const imgs = stack.querySelectorAll('.forum-member-avatar');
    imgs.forEach((img, i) => {
      if (items[i]) {
        img.src = items[i].image;
        img.alt = items[i].firstName;
        img.onerror = function () { this.src = API.DUMMY_AVATAR_FALLBACK; };
      }
    });
  });
}

export function renderDesktop(el, opts) {
  let { serverName, channels, members, memberCount, memberLimit, forumIndex, backLink, forumId, forumType, activeChannel, activeUsers } = opts;

  function appendMessage(msg) {
    const msgs = el.querySelector('#js-forum-msgs');
    if (!msgs) return;
    const empty = msgs.querySelector('#js-forum-empty');
    if (empty) empty.remove();
    msgs.appendChild(MsgEl(msg, 'desktop'));
    msgs.scrollTop = msgs.scrollHeight;
  }

  function render() {
    const dateStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    el.innerHTML = `
      <a class="forum-back" href="${backLink}" data-link><i class="bi bi-arrow-left"></i> Kembali</a>
      <div class="forum-layout">
        ${ChannelSidebar(serverName, channels, activeChannel.id, forumId, forumType, forumIndex)}
        ${MessageArea(activeChannel, dateStr)}
        ${ActiveMembersPanel(activeUsers, serverName)}
      </div>
    `;

    bindChannelNav(el.querySelectorAll('.forum-sidebar__channel'), channels, (found) => {
      activeChannel = found;
      render();
    });

    const followBtn = el.querySelector('#js-forum-follow');
    if (followBtn) bindFollowBtn(followBtn, forumId, forumType, serverName, false);

    const leaveBtn = el.querySelector('#js-leave-forum');
    if (leaveBtn) bindLeaveBtn(leaveBtn, forumType, forumIndex);

    const input = el.querySelector('#js-forum-input');
    if (input) bindSendInput(input, activeChannel, forumId, forumType, serverName, appendMessage);

    const msgs = el.querySelector('.forum-messages');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }

  render();
}

export function renderMobile(el, opts) {
  const { serverName, channels, members, memberCount, memberLimit, forumIndex, backLink, forumId, forumType, activeUsers } = opts;
  let activeChannel = channels[0];

  function appendMessage(msg) {
    const msgs = el.querySelector('#js-m-msgs');
    if (!msgs) return;
    const empty = msgs.querySelector('.forum-m-empty');
    if (empty) empty.remove();
    msgs.appendChild(MsgEl(msg, 'mobile'));
    msgs.scrollTop = msgs.scrollHeight;
  }

  function renderChannelList() {
    el.innerHTML = `
      <div class="mobile-page__inner">
        <header class="mobile-page__hero" style="padding-bottom:0.5rem">
          <a class="forum-back" href="${backLink}" data-link>
            <i class="bi bi-arrow-left"></i> Kembali
          </a>
          <div class="forum-mobile-header">
            <div>
              <p class="mobile-page__eyebrow">${serverName}</p>
              <h1>Saluran</h1>
            </div>
            ${(() => { const f = isFollowing(forumId, forumType); return `<button class="forum-follow-btn ${f ? 'forum-follow-btn--active' : ''}" id="js-forum-follow" type="button"><i class="bi ${f ? 'bi-bell-fill' : 'bi-bell'}"></i> ${f ? 'Mengikuti' : 'Ikuti'}</button>`; })()}
          </div>
        </header>
        <div class="forum-channels">
          ${channels.filter(c => c.type !== 'voice').map(ch => `
            <button class="forum-channel-item" data-channel="${ch.id}">
              <i class="bi bi-hash"></i>
              <span class="forum-channel-item__name">${ch.name}</span>
              <span class="forum-channel-item__count">${ch.messages.length}</span>
            </button>
          `).join('')}
          ${channels.filter(c => c.type === 'voice').length ? `
            <p class="forum-voice-label">Suara</p>
            ${channels.filter(c => c.type === 'voice').map(ch => `
              <button class="forum-channel-item" data-channel="${ch.id}">
                <i class="bi bi-mic"></i>
                <span class="forum-channel-item__name">${ch.name}</span>
              </button>
            `).join('')}
          ` : ''}
        </div>
        <div class="forum-active-panel">
          ${MobileActiveMembersHtml(activeUsers)}
        </div>
        <button class="forum-leave-btn" id="js-leave-forum-mobile" type="button" data-forum-type="${forumType}" data-forum-idx="${forumIndex}">
          <i class="bi bi-box-arrow-left"></i> Tinggalkan Forum
        </button>
      </div>
    `;

    const followBtn = el.querySelector('#js-forum-follow');
    if (followBtn) bindFollowBtn(followBtn, forumId, forumType, serverName, true);

    const leaveBtnMobile = el.querySelector('#js-leave-forum-mobile');
    if (leaveBtnMobile) bindLeaveBtn(leaveBtnMobile, forumType, forumIndex);

    el.querySelectorAll('.forum-channel-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.channel;
        const found = channels.find(c => c.id === id);
        if (found) {
          activeChannel = found;
          renderMessages();
        }
      });
    });
  }

  function renderMessages() {
    el.innerHTML = `
      <div class="forum-mobile-view">
        <header class="forum-mobile-view__header">
          <button class="forum-mobile-view__back" id="js-m-back">
            <i class="bi bi-chevron-left"></i>
          </button>
          <div class="forum-mobile-view__info">
            <div class="forum-mobile-view__name"># ${activeChannel.name}</div>
            <div class="forum-mobile-view__topic">${activeChannel.topic || ''}</div>
          </div>
          ${activeUsers.length ? `
            <button class="forum-mobile-view__members" id="js-members-toggle" aria-label="Anggota">
              <i class="bi bi-people"></i>
            </button>
          ` : ''}
        </header>
        <div class="forum-mobile-msgs" id="js-m-msgs">
          ${activeChannel.messages.length === 0
            ? '<div class="forum-m-empty">Belum ada pesan di sini.</div>'
            : activeChannel.messages.map(m => MsgEl(m, 'mobile').outerHTML).join('')
          }
        </div>
        <div class="forum-m-input-wrap">
          <input class="forum-m-input" id="js-m-input" type="text" placeholder="Ketik pesan..." autocomplete="off" />
          <button class="forum-m-send" id="js-m-send"><i class="bi bi-arrow-up"></i></button>
        </div>
      </div>
    `;

    el.querySelector('#js-m-back').addEventListener('click', renderChannelList);

    if (activeUsers.length) {
      let showingMembers = false;
      const membersToggle = el.querySelector('#js-members-toggle');
      const msgsContainer = el.querySelector('#js-m-msgs');

      membersToggle.addEventListener('click', () => {
        showingMembers = !showingMembers;
        if (showingMembers) {
          msgsContainer.innerHTML = MobileActiveMembersHtml(activeUsers);
        } else {
          msgsContainer.innerHTML = activeChannel.messages.length === 0
            ? '<div class="forum-m-empty">Belum ada pesan di sini.</div>'
            : activeChannel.messages.map(m => MsgEl(m, 'mobile').outerHTML).join('');
          setTimeout(() => {
            const msgs = el.querySelector('#js-m-msgs');
            if (msgs) msgs.scrollTop = msgs.scrollHeight;
          }, 10);
        }
      });
    }

    const input = el.querySelector('#js-m-input');
    const sendBtn = el.querySelector('#js-m-send');
    input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(input, activeChannel, forumId, forumType, serverName, appendMessage); });
    sendBtn.addEventListener('click', () => sendMessage(input, activeChannel, forumId, forumType, serverName, appendMessage));

    const msgs = el.querySelector('#js-m-msgs');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
    input.focus();
  }

  renderChannelList();
}
