import { toggleFollow } from '../../../../js/services/notifications.js';
import { leaveForum } from '../../../../js/services/forum-access.js';
import { getHashPath, getHashParams, navigateTo } from '../../../../js/utils/url.js';
import { notifyNewMessage } from '../../../../js/services/notifications.js';

export function bindFollowBtn(btn, forumId, forumType, serverName, isMobile) {
  btn.addEventListener('click', () => {
    const nowFollowing = toggleFollow(forumId, forumType, serverName);
    btn.classList.toggle('forum-follow-btn--active', nowFollowing);
    if (isMobile) {
      btn.innerHTML = `<i class="bi ${nowFollowing ? 'bi-bell-fill' : 'bi-bell'}"></i> ${nowFollowing ? 'Mengikuti' : 'Ikuti'}`;
    } else {
      btn.querySelector('i').className = `bi ${nowFollowing ? 'bi-bell-fill' : 'bi-bell'}`;
      btn.title = nowFollowing ? 'Berhenti mengikuti' : 'Ikuti forum ini';
    }
  });
}

export function bindLeaveBtn(btn, forumType, forumIndex) {
  btn.addEventListener('click', () => {
    btn.disabled = true;
    btn.innerHTML = '<i class="bi bi-hourglass"></i> Meninggalkan...';
    leaveForum(forumType, forumIndex);
    navigateTo(`/groups?${forumType === 'course' ? 'index' : 'group'}=${forumIndex}`);
  });
}

export function bindChannelNav(buttons, channels, onChannelChange) {
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.channel;
      const found = channels.find(c => c.id === id);
      if (found && found.type !== 'voice') {
        onChannelChange(found);
      }
    });
  });
}

export function bindSendInput(input, activeChannel, forumId, forumType, serverName, appendMsg) {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      sendMessage(input, activeChannel, forumId, forumType, serverName, appendMsg);
    }
  });
}

export function sendMessage(input, activeChannel, forumId, forumType, serverName, appendMsg) {
  if (!input.value.trim()) return;
  const msg = {
    user: 'Saya',
    text: input.value.trim(),
    time: new Date().toISOString(),
  };
  activeChannel.messages.push(msg);
  const link = getHashPath() + (getHashParams().toString() ? '?' + getHashParams().toString() : '');
  notifyNewMessage(forumId, forumType, serverName, activeChannel.name, 'Saya', msg.text, link);
  input.value = '';
  appendMsg(msg);
}
