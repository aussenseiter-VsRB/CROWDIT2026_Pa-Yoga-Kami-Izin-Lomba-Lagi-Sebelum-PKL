export { CreatorBlock, MeetingBlock } from '../../detail/js/_cards.js';

function renderParticipantAvatars(users) {
  const colors = ['#007aff', '#5856d6', '#34c759', '#ff9f0a', '#ff3b30', '#af52de'];
  return (users || []).map(u => {
    const name = u.firstName || 'User';
    const initial = name.charAt(0).toUpperCase();
    const color = colors[name.length % colors.length];
    const imgSrc = u.image || '';
    if (imgSrc) {
      const fallbackSvg = encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35"><rect width="35" height="35" rx="17.5" fill="${color}"/><text x="17.5" y="22" text-anchor="middle" fill="white" font-size="15" font-weight="700">${initial}</text></svg>`
      );
      return `<img class="dtl-participant-avatar" src="${imgSrc}" alt="${name}" loading="lazy" onerror="this.onerror=null;this.src='data:image/svg+xml,${fallbackSvg}'" />`;
    }
    return `<div class="dtl-participant-avatar" style="background:${color}">${initial}</div>`;
  }).join('');
}

export function ParticipantsSection(participants, users, index) {
  return `
    <div class="dtl-participants" id="open-participants-${index}">
      <div class="dtl-participants__header">
        <div class="dtl-participants__title">
          <i class="bi bi-people"></i>
          <span>Partisipan</span>
        </div>
        <span class="dtl-participants__count">${participants.joined} bergabung</span>
      </div>
      <div class="dtl-participants__avatars">
        ${renderParticipantAvatars(users)}
      </div>
    </div>
  `;
}
