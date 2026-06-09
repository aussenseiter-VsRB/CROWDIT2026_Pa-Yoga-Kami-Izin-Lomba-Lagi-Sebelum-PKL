import { CourseChatBlock } from '../../../components/ui/course-chat/course-chat.js';
import { ScheduleBlock, MeetingBlock, CreatorBlock, ParticipantsBlock } from './_cards.js';

export function renderDetail(item, { participantsLive, forumLive, users, index, isJoined, status, statusClass, simple }) {
  const el = document.createElement('section');
  el.className = 'dtl-page container section';

  const joinedLink = status === 'pending'
    ? `<span class="dtl-join-btn dtl-join-btn--joined"><i class="bi bi-clock"></i> Menunggu Persetujuan</span>`
    : `<span class="dtl-join-btn dtl-join-btn--joined">
        <i class="bi bi-check-circle"></i> Sudah Bergabung
      </span>`;

  el.innerHTML = `
    <div class="dtl-page__inner">
      <a class="dtl-back" href="/" data-link>
        <i class="bi bi-arrow-left"></i>
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
            <h2 class="dtl-section__title">
              <i class="bi bi-person-badge"></i> Dibuat oleh
            </h2>
            ${CreatorBlock(item.creator)}
          </div>

          ${!simple ? `
          <div class="dtl-section">
            <h2 class="dtl-section__title">Jadwal Pertemuan</h2>
            ${ScheduleBlock(item.schedule)}
          </div>
          ` : ''}

          <div class="dtl-section">
            <h2 class="dtl-section__title">Informasi Pertemuan</h2>
            ${MeetingBlock(item.meeting, item.course.status)}
          </div>

          <div class="dtl-section dtl-reminder">
            <label class="dtl-reminder__label">
              <input type="checkbox" class="dtl-reminder__checkbox">
              <span>Ingatkan saya</span>
            </label>
          </div>
        </div>

        <div class="dtl-grid__right">
          <div class="dtl-section">
            <h2 class="dtl-section__title">Partisipan</h2>
            ${ParticipantsBlock(participantsLive, users)}
          </div>

          <div class="dtl-section">
            <h2 class="dtl-section__title">
              <i class="bi bi-chat-dots"></i> Live Chat
            </h2>
            ${CourseChatBlock(index, item.chats)}
          </div>

          ${!simple ? `
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
          ` : ''}

          ${isJoined ? joinedLink : `<button class="dtl-join-btn" type="button">
              Gabung ke Forum
              <i class="bi bi-arrow-right"></i>
            </button>`
          }
        </div>
      </div>
    </div>
  `;

  return el;
}
