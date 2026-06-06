if (!document.querySelector('link[href="/pages/pages-desktop/home/detail/detail.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-desktop/home/detail/detail.css';
  document.head.appendChild(link);
}

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

function ScheduleBlock(schedule) {
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

function MeetingBlock(meeting, status) {
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

function ParticipantsBlock(participants) {
  const pct = Math.round((participants.joined / participants.capacity) * 100);
  return `
    <div class="dtl-participants">
      <div class="dtl-participants__header">
        <div class="dtl-participants__title">
          ${iconPeople()}
          <span>Partisipan</span>
        </div>
        <span class="dtl-participants__count">${participants.joined}/${participants.capacity} bergabung</span>
      </div>
      <div class="dtl-participants__bar">
        <div class="dtl-participants__bar-fill" style="width:${pct}%"></div>
      </div>
      <div class="dtl-participants__avail ${participants.joined >= participants.capacity ? 'is-full' : ''}">
        ${participants.joined >= participants.capacity
          ? 'Kelas penuh'
          : `${participants.capacity - participants.joined} kursi tersedia`
        }
      </div>
    </div>
  `;
}

export async function Detail() {
  const params = new URLSearchParams(window.location.search);
  const index = parseInt(params.get('index'), 10) || 0;

  const res = await fetch('/data/detail.json');
  const data = await res.json();
  const item = data[index] ?? data[0];

  const statusClass = item.course.status === 'Online' ? 'is-online' : 'is-offline';

  const el = document.createElement('section');
  el.className = 'dtl-page container section';

  el.innerHTML = `
    <div class="dtl-page__inner">
      <a class="dtl-back" href="/" data-link>
        ${iconArrowLeft()}
        Kembali ke Home
      </a>

      <div class="dtl-hero">
        <div class="dtl-hero__main">
          <div class="dtl-hero__top">
            <span class="dtl-hero__category">${item.course.category}</span>
            <span class="dtl-status ${statusClass}">
              <span aria-hidden="true"></span>
              ${item.course.status}
            </span>
          </div>
          <h1 class="dtl-hero__title">${item.course.title}</h1>
          <p class="dtl-hero__desc">${item.course.description}</p>
        </div>
      </div>

      <div class="dtl-grid">
        <div class="dtl-grid__left">
          <div class="dtl-section">
            <h2 class="dtl-section__title">Jadwal Pertemuan</h2>
            ${ScheduleBlock(item.schedule)}
          </div>

          <div class="dtl-section">
            <h2 class="dtl-section__title">Informasi Pertemuan</h2>
            ${MeetingBlock(item.meeting, item.course.status)}
          </div>
        </div>

        <div class="dtl-grid__right">
          <div class="dtl-section">
            <h2 class="dtl-section__title">Partisipan</h2>
            ${ParticipantsBlock(item.participants)}
          </div>

          <div class="dtl-section">
            <div class="dtl-forum-card">
              <div class="dtl-forum-card__stat">
                <span class="dtl-forum-card__stat-value">${item.forum.memberCount}</span>
                <span class="dtl-forum-card__stat-label">Anggota forum</span>
              </div>
              <div class="dtl-forum-card__stat">
                <span class="dtl-forum-card__stat-value">${item.forum.postCount}</span>
                <span class="dtl-forum-card__stat-label">Postingan</span>
              </div>
            </div>
          </div>

          <a class="dtl-join-btn" href="${item.forum.joinLink}" data-link>
            Gabung ke Forum
            <i class="bi bi-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  `;

  return el;
}
