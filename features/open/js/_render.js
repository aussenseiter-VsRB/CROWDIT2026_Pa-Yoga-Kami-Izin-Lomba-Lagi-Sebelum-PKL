import { CourseChatBlock } from '../../../components/ui/course-chat/course-chat.js';
import { CreatorBlock, MeetingBlock, ParticipantsSection } from './_cards.js';

export function renderOpen(item, { participantsLive, users, index, isJoined, status, statusClass }) {
  const el = document.createElement('section');
  el.className = 'dtl-page container section';

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

          <div class="dtl-section">
            <h2 class="dtl-section__title">Informasi Pertemuan</h2>
            ${MeetingBlock(item.meeting, item.course.status)}
          </div>
        </div>

        <div class="dtl-grid__right">
          <div class="dtl-section">
            <h2 class="dtl-section__title">Partisipan</h2>
            ${ParticipantsSection(participantsLive, users, index)}
          </div>

          <div class="dtl-section">
            <h2 class="dtl-section__title">
              <i class="bi bi-chat-dots"></i> Live Chat
            </h2>
            ${CourseChatBlock(index, item.chats)}
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

  return el;
}
