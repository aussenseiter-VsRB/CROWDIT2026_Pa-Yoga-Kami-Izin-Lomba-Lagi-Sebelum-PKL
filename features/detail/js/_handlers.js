import { showConfirmModal } from '../../../components/ui/confirm-modal/confirm-modal.js';
import { joinForum, incrementMemberCount, getLiveMemberCount } from '../../../js/services/forum-access.js';

export function attachJoinHandler(el, item, index) {
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

        joinBtn.outerHTML = `<span class="dtl-join-btn dtl-join-btn--joined">
          <i class="bi bi-check-circle"></i> Anda telah bergabung
        </span>`;

        const participantsCount = el.querySelector('.dtl-participants__count');
        if (participantsCount) {
          const newCount = getLiveMemberCount(index, item.participants.joined);
          participantsCount.textContent = `${newCount} bergabung`;
        }
      },
    });
  });
}
