import { injectStyle } from '../../js/utils/styleLoader.js';
import { getHashParams, asset } from '../../js/utils/url.js';
import { DATA_PATHS } from '../../js/core/config.js';
import { showConfirmModal } from '../../components/ui/confirm-modal/confirm-modal.js';
import { joinForum, getForumStatus, incrementMemberCount, getLiveMemberCount } from '../../js/services/forum-access.js';
import { CourseChatBlock, initCourseChat } from '../../components/ui/course-chat/course-chat.js';
injectStyle('/features/detail/detail.css');

function CreatorBlock(creator) {
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

export async function Open() {
  const params = getHashParams();
  const index = parseInt(params.get('index'), 10) || 0;

  const res = await fetch(asset(DATA_PATHS.DETAIL));
  const data = await res.json();
  const item = data[index] ?? data[0];

  const statusClass = item.course.status === 'Online' ? 'is-online' : 'is-offline';

  const status = getForumStatus('course', index);
  const liveParticipants = getLiveMemberCount(index, item.participants.joined);
  const participantsLive = { ...item.participants, joined: liveParticipants };
  const isJoined = status === 'joined' || status === 'pending';

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
            ${item.meeting.type === 'Online' && item.meeting.link
              ? `<div class="dtl-meeting dtl-meeting--online">
                  <div class="dtl-meeting__header">
                    <span class="dtl-meeting__icon"><i class="bi bi-camera-video"></i></span>
                    <div>
                      <span class="dtl-meeting__label">Pertemuan ${item.meeting.platform}</span>
                      <span class="dtl-meeting__status">Online · Bergabung sekarang</span>
                    </div>
                  </div>
                  <a class="dtl-meeting__link" href="${item.meeting.link}" target="_blank" rel="noopener noreferrer">
                    <i class="bi bi-box-arrow-up-right"></i>
                    ${item.meeting.link}
                  </a>
                </div>`
              : `<div class="dtl-meeting dtl-meeting--offline">
                  <div class="dtl-meeting__header">
                    <span class="dtl-meeting__icon"><i class="bi bi-geo-alt"></i></span>
                    <div>
                      <span class="dtl-meeting__label">Pertemuan Offline</span>
                      <span class="dtl-meeting__status">${item.course.status}</span>
                    </div>
                  </div>
                  <div class="dtl-meeting__location">
                    <i class="bi bi-geo-alt"></i>
                    ${item.meeting.location}
                  </div>
                </div>`
            }
          </div>
        </div>

        <div class="dtl-grid__right">
          <div class="dtl-section">
            <h2 class="dtl-section__title">Partisipan</h2>
            <div class="dtl-participants" id="open-participants-${index}">
              <div class="dtl-participants__header">
                <div class="dtl-participants__title">
                  <i class="bi bi-people"></i>
                  <span>Partisipan</span>
                </div>
                <span class="dtl-participants__count">${participantsLive.joined} bergabung</span>
              </div>
              <div class="dtl-participants__avatars">
                ${(participantsLive.dummies || []).map(n => {
                  const colors = ['#007aff','#5856d6','#34c759','#ff9f0a','#ff3b30','#af52de'];
                  const c = colors[n.length % colors.length];
                  return `<div class="dtl-participant-avatar" style="background:${c}">${n.charAt(0).toUpperCase()}</div>`;
                }).join('')}
              </div>
            </div>
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

  // Init course chat
  initCourseChat(el, index, item.chats);

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
            const dummies = item.participants.dummies || [];
            const colors = ['#007aff','#5856d6','#34c759','#ff9f0a','#ff3b30','#af52de'];
            participantsSection.innerHTML = `
              <div class="dtl-participants__header">
                <div class="dtl-participants__title">
                  <i class="bi bi-people"></i>
                  <span>Partisipan</span>
                </div>
                <span class="dtl-participants__count">${liveCount} bergabung</span>
              </div>
              <div class="dtl-participants__avatars">
                ${dummies.map(n => {
                  const c = colors[n.length % colors.length];
                  return `<div class="dtl-participant-avatar" style="background:${c}">${n.charAt(0).toUpperCase()}</div>`;
                }).join('')}
              </div>
            `;
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
