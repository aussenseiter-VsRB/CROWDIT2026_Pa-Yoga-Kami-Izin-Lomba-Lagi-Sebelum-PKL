if (!document.querySelector('link[href="/pages/pages-desktop/forum/forum.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-desktop/forum/forum.css';
  document.head.appendChild(link);
}

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

function ChannelIcon(ch) {
  if (ch.type === 'voice') return '<i class="bi bi-mic"></i>';
  return '<i class="bi bi-hash"></i>';
}

function ChannelSidebar(serverName, channels, activeId) {
  const textCh = channels.filter(c => c.type !== 'voice');
  const voiceCh = channels.filter(c => c.type === 'voice');
  return `
    <div class="forum-sidebar">
      <div class="forum-sidebar__server">
        <i class="bi bi-collection"></i>
        ${serverName}
      </div>
      <div class="forum-sidebar__scroll">
        <div class="forum-sidebar__cat">Teks</div>
        ${textCh.map(ch => `
          <button class="forum-sidebar__channel ${ch.id === activeId ? 'forum-sidebar__channel--active' : ''}" data-channel="${ch.id}">
            <i class="bi bi-hash"></i>
            ${ch.name}
          </button>
        `).join('')}
        ${voiceCh.length ? `<div class="forum-sidebar__cat">Suara</div>` : ''}
        ${voiceCh.map(ch => `
          <button class="forum-sidebar__channel forum-sidebar__channel--voice" data-channel="${ch.id}">
            <i class="bi bi-mic"></i>
            ${ch.name}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function MemberList(members) {
  const groups = { online: [], idle: [], offline: [] };
  members.forEach(m => { (groups[m.status] || groups.offline).push(m); });
  const labels = { online: 'Online', idle: 'Idle', offline: 'Offline' };
  const dots = { online: 'online', idle: 'idle', offline: 'offline' };

  return `
    <div class="forum-members">
      ${['online', 'idle', 'offline'].filter(g => groups[g].length).map(g => `
        <div class="forum-members__cat">${labels[g]} — ${groups[g].length}</div>
        ${groups[g].map(m => `
          <div class="forum-members__user">
            <span class="forum-members__dot forum-members__dot--${dots[g]}"></span>
            ${m.name}
          </div>
        `).join('')}
      `).join('')}
    </div>
  `;
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function MessageEl(msg, showAvatar) {
  if (msg.system) {
    return `<div class="forum-msg forum-msg--system"><div class="forum-msg__text">${msg.text}</div></div>`;
  }
  const initial = msg.user.charAt(0).toUpperCase();
  const avatarColors = ['#007aff', '#5856d6', '#34c759', '#ff9f0a', '#ff3b30', '#af52de', '#5ac8fa', '#ff9500'];
  const colorIdx = msg.user.length % avatarColors.length;
  return `
    <div class="forum-msg">
      <div class="forum-msg__avatar" style="background:${avatarColors[colorIdx]}">${initial}</div>
      <div class="forum-msg__body">
        <div class="forum-msg__header">
          <span class="forum-msg__user">${msg.user}</span>
          <span class="forum-msg__time">${timeAgo(msg.time)}</span>
        </div>
        <div class="forum-msg__text">${msg.text.replace(/https?:\/\/[^\s]+/g, '<a href="$&" target="_blank" rel="noopener">$&</a>')}</div>
      </div>
    </div>
  `;
}

function MessageArea(channel, dateStr) {
  return `
    <div class="forum-main">
      <div class="forum-header">
        <span class="forum-header__name"><i class="bi bi-hash" style="font-size:0.9rem;margin-right:0.2rem"></i>${channel.name}</span>
        <span class="forum-header__divider"></span>
        <span class="forum-header__topic">${channel.topic || ''}</span>
      </div>
      <div class="forum-messages" id="js-forum-msgs">
        <div class="forum-msg forum-msg--system">
          <div class="forum-msg__text">${dateStr}</div>
        </div>
        ${channel.messages.length === 0
          ? '<div class="forum-empty">Belum ada pesan di sini. Mulai diskusi!</div>'
          : channel.messages.map(m => MessageEl(m)).join('')
        }
      </div>
      <div class="forum-input-wrap">
        <input class="forum-input" id="js-forum-input" type="text" placeholder="Ketik pesan... / Send a message..." autocomplete="off" />
      </div>
    </div>
  `;
}

export async function Forum() {
  const params = new URLSearchParams(window.location.search);
  const courseIdx = parseInt(params.get('index'), 10);
  const groupIdx = parseInt(params.get('group'), 10);

  const [forumRes, detailRes, groupsRes] = await Promise.all([
    fetch('/data/forum.json').then(r => r.json()),
    fetch('/data/detail.json').then(r => r.json()),
    fetch('/data/groups.json').then(r => r.json()),
  ]);

  let forumData, serverName, backLink;
  if (!isNaN(courseIdx) && forumRes.courses[courseIdx]) {
    forumData = forumRes.courses[courseIdx];
    serverName = detailRes[courseIdx]?.course?.title || 'Forum';
    backLink = '/';
  } else if (!isNaN(groupIdx) && forumRes.groups[groupIdx]) {
    forumData = forumRes.groups[groupIdx];
    serverName = groupsRes.groups[groupIdx]?.title || 'Grup';
    backLink = '/groups';
  } else {
    forumData = forumRes.courses[0];
    serverName = 'Forum';
    backLink = '/';
  }

  const channels = forumData.channels;
  const members = forumData.members;
  let activeChannel = channels[0];

  const el = document.createElement('section');
  el.className = 'container section';
  el.style.paddingTop = '0';
  el.style.paddingBottom = '0';

  function render() {
    const dateStr = formatDate(activeChannel.messages.length > 0 ? activeChannel.messages[0].time : new Date().toISOString());
    el.innerHTML = `
      <a class="forum-back" href="${backLink}" data-link><i class="bi bi-arrow-left"></i> Kembali</a>
      <div class="forum-layout">
        ${ChannelSidebar(serverName, channels, activeChannel.id)}
        ${MessageArea(activeChannel, dateStr)}
        ${MemberList(members)}
      </div>
    `;

    el.querySelectorAll('.forum-sidebar__channel').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.channel;
        const found = channels.find(c => c.id === id);
        if (found && found.type !== 'voice') {
          activeChannel = found;
          render();
        }
      });
    });

    const input = el.querySelector('#js-forum-input');
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && input.value.trim()) {
          const msg = {
            user: 'Saya',
            text: input.value.trim(),
            time: new Date().toISOString(),
          };
          activeChannel.messages.push(msg);
          input.value = '';
          render();
          setTimeout(() => {
            const msgs = el.querySelector('.forum-messages');
            if (msgs) msgs.scrollTop = msgs.scrollHeight;
          }, 10);
        }
      });
    }

    const msgs = el.querySelector('.forum-messages');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }

  render();
  return el;
}
