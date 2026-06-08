import { injectStyle } from '../../js/utils/styleLoader.js';
import { getHashParams, asset } from '../../js/utils/url.js';
import { DATA_PATHS } from '../../js/core/config.js';
import { showConfirmModal } from '../../components/ui/confirm-modal/confirm-modal.js';
import { joinForum, getForumStatus, incrementMemberCount, getLiveMemberCount } from '../../js/services/forum-access.js';
injectStyle('/features/detail/detail.css');

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
  const colors = ['#007aff', '#5856d6', '#34c759', '#ff9f0a', '#ff3b30', '#af52de'];
  const dummies = participants.dummies || [];
  const dummyList = dummies.map(name => {
    const initial = name.charAt(0).toUpperCase();
    const color = colors[name.length % colors.length];
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
        ${dummyList.join('')}
      </div>
    </div>
  `;
}

export async function Detail() {
  const params = getHashParams();
  const index = parseInt(params.get('index'), 10) || 0;

  const res = await fetch(asset(DATA_PATHS.DETAIL));
  const data = await res.json();
  const item = data[index] ?? data[0];

  const statusClass = item.course.status === 'Online' ? 'is-online' : 'is-offline';

  const status = getForumStatus('course', index);
  const liveParticipants = getLiveMemberCount(index, item.participants.joined);
  const liveMemberCount = getLiveMemberCount(index, item.forum.memberCount);
  const participantsLive = { ...item.participants, joined: liveParticipants };
  const forumLive = { ...item.forum, memberCount: liveMemberCount };

  const el = document.createElement('section');
  el.className = 'dtl-page container section';

  const isJoined = status === 'joined' || status === 'pending';

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
            ${ParticipantsBlock(participantsLive)}
          </div>

          <div class="dtl-section">
            <div class="dtl-forum-card">
              <div class="dtl-forum-card__stat">
                <span class="dtl-forum-card__stat-value">${forumLive.memberCount}</span>
                <span class="dtl-forum-card__stat-label">Anggota forum</span>
              </div>
              <div class="dtl-forum-card__stat">
                <span class="dtl-forum-card__stat-value">${item.forum.postCount}</span>
                <span class="dtl-forum-card__stat-label">Postingan</span>
              </div>
            </div>
          </div>

          ${isJoined
            ? `<a class="dtl-join-btn dtl-join-btn--joined" href="/forum?index=${index}" data-link>
                <i class="bi bi-check-circle"></i>
                ${status === 'pending' ? 'Menunggu Persetujuan' : 'Sudah Bergabung'}
              </a>`
            : `<button class="dtl-join-btn" type="button">
                Gabung ke Forum
                <i class="bi bi-arrow-right"></i>
              </button>`
          }
        </div>
      </div>
    </div>
  `;

  if (!isJoined) {
    const joinBtn = el.querySelector('.dtl-join-btn');
    joinBtn.addEventListener('click', () => {
      showConfirmModal({
        title: 'Bergabung ke Forum',
        message: `Apakah Anda yakin ingin bergabung ke forum "${item.course.title}"?`,
        confirmText: 'Ya, Bergabung',
        cancelText: 'Batal',
        onConfirm: () => {
          joinForum('course', index);
          incrementMemberCount(index, item.participants.joined);
          const liveCount = getLiveMemberCount(index, item.participants.joined);
          const participantsSection = el.querySelector('.dtl-participants');
          if (participantsSection) {
            participantsSection.outerHTML = ParticipantsBlock({ ...item.participants, joined: liveCount });
          }
          const memberStat = el.querySelector('.dtl-forum-card__stat:first-child .dtl-forum-card__stat-value');
          if (memberStat) {
            memberStat.textContent = liveCount;
          }
          joinBtn.outerHTML = `<a class="dtl-join-btn dtl-join-btn--joined" href="/forum?index=${index}" data-link>
            <i class="bi bi-check-circle"></i>
            Sudah Bergabung
          </a>`;
        },
      });
    });
  }

  return el;
}
