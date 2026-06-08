function iconPeople() {
  return '<i class="bi bi-people"></i>';
}

function iconCalendar() {
  return '<i class="bi bi-calendar"></i>';
}

function iconClock() {
  return '<i class="bi bi-clock"></i>';
}

function iconLocation() {
  return '<i class="bi bi-geo-alt"></i>';
}

function iconVideo() {
  return '<i class="bi bi-camera-video"></i>';
}

function iconArrowLeft() {
  return '<i class="bi bi-arrow-left"></i>';
}

function iconExternal() {
  return '<i class="bi bi-box-arrow-up-right"></i>';
}

export function ScheduleBlock(schedule) {
  return `
    <div class="dtl-schedule">
      <div class="dtl-schedule__row">
        <span class="dtl-schedule__icon">${iconCalendar()}</span>
        <div>
          <span class="dtl-schedule__label">Hari</span>
          <span class="dtl-schedule__value">${schedule.day}</span>
        </div>
      </div>
      <div class="dtl-schedule__row">
        <span class="dtl-schedule__icon">${iconClock()}</span>
        <div>
          <span class="dtl-schedule__label">Waktu</span>
          <span class="dtl-schedule__value">${schedule.time}</span>
        </div>
      </div>
      <div class="dtl-schedule__row dtl-schedule__row--period">
        <span class="dtl-schedule__icon">${iconCalendar()}</span>
        <div>
          <span class="dtl-schedule__label">Periode</span>
          <span class="dtl-schedule__value">${schedule.startDate} — ${schedule.endDate}</span>
        </div>
      </div>
      <div class="dtl-schedule__badge">${schedule.meetingCount}</div>
    </div>
  `;
}

export function MeetingBlock(meeting, status) {
  if (meeting.type === 'Online' && meeting.link) {
    const platformIcon = meeting.platform === 'Zoom'
      ? '<i class="bi bi-camera-video"></i>'
      : iconVideo();

    return `
      <div class="dtl-meeting dtl-meeting--online">
        <div class="dtl-meeting__header">
          <span class="dtl-meeting__icon">${platformIcon}</span>
          <div>
            <span class="dtl-meeting__label">Pertemuan ${meeting.platform}</span>
            <span class="dtl-meeting__status">Online · Bergabung sekarang</span>
          </div>
        </div>
        <a class="dtl-meeting__link" href="${meeting.link}" target="_blank" rel="noopener noreferrer">
          ${iconExternal()}
          ${meeting.link}
        </a>
      </div>
    `;
  }

  return `
    <div class="dtl-meeting dtl-meeting--offline">
      <div class="dtl-meeting__header">
        <span class="dtl-meeting__icon">${iconLocation()}</span>
        <div>
          <span class="dtl-meeting__label">Pertemuan Offline</span>
          <span class="dtl-meeting__status">${status}</span>
        </div>
      </div>
      <div class="dtl-meeting__location">
        ${iconLocation()}
        ${meeting.location}
      </div>
    </div>
  `;
}

export function CreatorBlock(creator) {
  const colors = ['#007aff', '#5856d6', '#34c759', '#ff9f0a', '#ff3b30', '#af52de'];
  const initial = creator.name.charAt(0).toUpperCase();
  const color = colors[creator.name.length % colors.length];
  return `
    <div class="dtl-creator">
      <div class="dtl-creator__avatar" style="background:${color}">${initial}</div>
      <div class="dtl-creator__info">
        <div class="dtl-creator__name">${creator.name}</div>
        <div class="dtl-creator__username">${creator.username}</div>
        <div class="dtl-creator__bio">${creator.bio}</div>
      </div>
    </div>
  `;
}

export function ParticipantsBlock(participants, users) {
  const colors = ['#007aff', '#5856d6', '#34c759', '#ff9f0a', '#ff3b30', '#af52de'];
  const avatarList = (users || []).slice(0, participants.joined).map(u => {
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
  });
  return `
    <div class="dtl-participants">
      <div class="dtl-participants__header">
        <div class="dtl-participants__title">
          ${iconPeople()}
          <span>Partisipan</span>
        </div>
        <span class="dtl-participants__count">${participants.joined} bergabung</span>
      </div>
      <div class="dtl-participants__avatars">
        ${avatarList.join('')}
      </div>
    </div>
  `;
}
