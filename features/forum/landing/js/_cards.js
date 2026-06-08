export function renderCTA(status, privacy) {
  if (status === 'joined') {
    return `<button class="forum-cta forum-cta--open" type="button" id="js-forum-cta"><i class="bi bi-box-arrow-in-right"></i> Buka Forum</button>`;
  }
  if (status === 'pending') {
    return `<button class="forum-cta forum-cta--pending" type="button" disabled><i class="bi bi-clock"></i> Permintaan Terkirim</button>`;
  }
  if (privacy === 'private') {
    return `<button class="forum-cta forum-cta--request" type="button" id="js-forum-cta"><i class="bi bi-lock"></i> Minta Bergabung</button>`;
  }
  return `<button class="forum-cta forum-cta--join" type="button" id="js-forum-cta"><i class="bi bi-plus-circle"></i> Gabung Forum</button>`;
}

export function ForumChannelListHtml(channels, isLocked) {
  return `
    <div class="forum-landing__channels ${isLocked ? 'forum-landing__channels--locked' : ''}">
      ${channels.map(ch => `
        <div class="forum-landing__channel">
          <i class="bi ${ch.type === 'voice' ? 'bi-mic' : 'bi-hash'}"></i>
          <span>${ch.name}</span>
          ${isLocked ? '<i class="bi bi-lock forum-landing__channel-lock"></i>' : `<span class="forum-landing__channel-count">${ch.messages.length}</span>`}
        </div>
      `).join('')}
      ${isLocked ? '<div class="forum-landing__blur"><i class="bi bi-lock"></i> Gabung untuk melihat pesan</div>' : ''}
    </div>
  `;
}
