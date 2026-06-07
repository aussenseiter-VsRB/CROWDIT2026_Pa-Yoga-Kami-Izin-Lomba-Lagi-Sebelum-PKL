if (!document.querySelector('link[href="/pages/pages-mobile/mobile-page.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-mobile/mobile-page.css';
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

const avatarColors = ['#007aff', '#5856d6', '#34c759', '#ff9f0a', '#ff3b30', '#af52de', '#5ac8fa', '#ff9500'];

function forumStyles() {
  return `
    .forum-channels { margin-bottom: 1rem; }
    .forum-channel-item {
      display: flex; align-items: center; gap: 0.6rem;
      padding: 0.7rem 0.85rem; margin-bottom: 0.25rem;
      border-radius: 0.6rem; cursor: pointer;
      background: var(--surface, #fff);
      border: 1px solid var(--surface-hover, #e5e5ea);
      transition: background 0.15s;
      text-decoration: none; color: inherit;
    }
    .forum-channel-item:active { background: var(--surface-alt, #f5f5f7); }
    .forum-channel-item i { font-size: 1rem; color: var(--muted-alt, #8e8e93); width: 1.2rem; text-align: center; }
    .forum-channel-item__name { font-size: 0.9rem; font-weight: 700; }
    .forum-channel-item__count { font-size: 0.72rem; color: var(--muted-alt, #8e8e93); margin-left: auto; }

    .forum-mobile-msgs { padding: 0; }
    .forum-m-msg {
      display: flex; gap: 0.6rem; padding: 0.5rem 0.85rem;
    }
    .forum-m-msg__avatar {
      width: 1.8rem; height: 1.8rem; border-radius: 50%;
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-size: 0.65rem; font-weight: 700; flex-shrink: 0; margin-top: 0.1rem;
    }
    .forum-m-msg__body { flex: 1; min-width: 0; }
    .forum-m-msg__user { font-size: 0.82rem; font-weight: 700; }
    .forum-m-msg__time { font-size: 0.6rem; color: var(--muted-alt, #8e8e93); margin-left: 0.4rem; }
    .forum-m-msg__text { font-size: 0.82rem; line-height: 1.5; word-break: break-word; margin-top: 0.05rem; }

    .forum-m-input-wrap {
      display: flex; gap: 0.5rem; padding: 0.6rem 0.85rem;
      border-top: 1px solid var(--surface-hover, #e5e5ea);
      background: var(--surface, #fff);
      position: sticky; bottom: 0;
    }
    .forum-m-input {
      flex: 1; padding: 0.55rem 0.85rem;
      border: 1.5px solid var(--surface-hover, #e5e5ea);
      border-radius: 0.6rem; font: inherit; font-size: 0.85rem;
      outline: none; background: var(--surface-alt, #fafafe);
    }
    .forum-m-input:focus { border-color: var(--accent, #007aff); }
    .forum-m-send {
      width: 2.4rem; height: 2.4rem; border-radius: 50%;
      border: none; background: var(--accent, #007aff); color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: 1rem; cursor: pointer; flex-shrink: 0;
    }
    .forum-m-empty {
      padding: 2rem 0.85rem; text-align: center;
      color: var(--muted-alt, #8e8e93); font-size: 0.82rem; font-style: italic;
    }
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

  if (!document.querySelector('style[data-forum-mobile]')) {
    const s = document.createElement('style');
    s.setAttribute('data-forum-mobile', '');
    s.textContent = forumStyles();
    document.head.appendChild(s);
  }

  const channels = forumData.channels.filter(c => c.type !== 'voice');
  let activeChannel = channels[0] || forumData.channels[0];

  const el = document.createElement('section');
  el.className = 'mobile-page';

  function renderChannelList() {
    el.innerHTML = `
      <div class="mobile-page__inner">
        <header class="mobile-page__hero" style="padding-bottom:0.5rem">
          <a class="forum-back" href="${backLink}" data-link style="display:inline-flex;align-items:center;gap:0.35rem;font-size:0.82rem;font-weight:600;color:var(--muted,#6b7280);text-decoration:none;margin-bottom:0.5rem">
            <i class="bi bi-arrow-left"></i> Kembali
          </a>
          <p class="mobile-page__eyebrow" style="margin-bottom:0.15rem">${serverName}</p>
          <h1 style="margin:0;font-size:1.4rem">Saluran</h1>
        </header>
        <div class="forum-channels">
          ${channels.map(ch => `
            <button class="forum-channel-item" data-channel="${ch.id}">
              <i class="bi bi-hash"></i>
              <span class="forum-channel-item__name">${ch.name}</span>
              <span class="forum-channel-item__count">${ch.messages.length}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    el.querySelectorAll('.forum-channel-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.channel;
        const found = channels.find(c => c.id === id) || forumData.channels.find(c => c.id === id);
        if (found) {
          activeChannel = found;
          renderMessages();
        }
      });
    });
  }

  function renderMessages() {
    el.innerHTML = `
      <div class="mobile-page__inner" style="display:flex;flex-direction:column;height:calc(100vh - 7rem)">
        <header style="padding:0.5rem 0.85rem;border-bottom:1px solid var(--surface-hover,#e5e5ea);display:flex;align-items:center;gap:0.5rem;flex-shrink:0">
          <button class="forum-back" id="js-m-back" style="background:none;border:none;font-size:1.1rem;color:var(--accent,#007aff);cursor:pointer;padding:0.25rem">
            <i class="bi bi-chevron-left"></i>
          </button>
          <div>
            <div style="font-size:0.85rem;font-weight:700"># ${activeChannel.name}</div>
            <div style="font-size:0.68rem;color:var(--muted-alt,#8e8e93)">${activeChannel.topic || ''}</div>
          </div>
        </header>
        <div class="forum-mobile-msgs" id="js-m-msgs" style="flex:1;overflow-y:auto">
          ${activeChannel.messages.length === 0
            ? '<div class="forum-m-empty">Belum ada pesan di sini.</div>'
            : activeChannel.messages.map(m => {
                const initial = m.user.charAt(0).toUpperCase();
                const colorIdx = m.user.length % avatarColors.length;
                return `
                  <div class="forum-m-msg">
                    <div class="forum-m-msg__avatar" style="background:${avatarColors[colorIdx]}">${initial}</div>
                    <div class="forum-m-msg__body">
                      <div>
                        <span class="forum-m-msg__user">${m.user}</span>
                        <span class="forum-m-msg__time">${timeAgo(m.time)}</span>
                      </div>
                      <div class="forum-m-msg__text">${m.text}</div>
                    </div>
                  </div>
                `;
              }).join('')
          }
        </div>
        <div class="forum-m-input-wrap">
          <input class="forum-m-input" id="js-m-input" type="text" placeholder="Ketik pesan..." autocomplete="off" />
          <button class="forum-m-send" id="js-m-send"><i class="bi bi-arrow-up"></i></button>
        </div>
      </div>
    `;

    el.querySelector('#js-m-back').addEventListener('click', renderChannelList);

    const input = el.querySelector('#js-m-input');
    const sendBtn = el.querySelector('#js-m-send');
    function sendMsg() {
      if (input.value.trim()) {
        activeChannel.messages.push({
          user: 'Saya',
          text: input.value.trim(),
          time: new Date().toISOString(),
        });
        input.value = '';
        renderMessages();
      }
    }
    input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMsg(); });
    sendBtn.addEventListener('click', sendMsg);

    const msgs = el.querySelector('#js-m-msgs');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }

  renderChannelList();
  return el;
}
