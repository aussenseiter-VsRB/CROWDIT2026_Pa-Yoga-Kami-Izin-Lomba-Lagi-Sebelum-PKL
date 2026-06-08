import { showConfirmModal } from '../../../components/ui/confirm-modal/confirm-modal.js';
import { joinForum, incrementMemberCount, getLiveMemberCount } from '../../../js/services/forum-access.js';
import { ParticipantsBlock } from './_cards.js';

export function attachJoinHandler(el, item, index, users, participantsLive) {
  const joinBtn = el.querySelector('.dtl-join-btn');
  if (!joinBtn) return;

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
          participantsSection.outerHTML = ParticipantsBlock({ ...item.participants, joined: liveCount }, users);
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
