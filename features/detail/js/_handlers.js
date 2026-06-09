import { showConfirmModal } from '../../../components/ui/confirm-modal/confirm-modal.js';
import { joinForum, leaveForum, incrementMemberCount, decrementMemberCount, getLiveMemberCount } from '../../../js/services/forum-access.js';

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

        const joinSection = el.querySelector('.dtl-join-section');
        if (joinSection) {
          joinSection.innerHTML = `<span class="dtl-join-btn dtl-join-btn--joined">
            <i class="bi bi-check-circle"></i> Sudah Bergabung
          </span>`;
        }

        const leaveSection = el.querySelector('.dtl-leave-section');
        if (!leaveSection) {
          const reminder = el.querySelector('.dtl-reminder');
          if (reminder) {
            const section = document.createElement('div');
            section.className = 'dtl-section dtl-leave-section';
            section.innerHTML = `<button class="dtl-leave-btn" type="button"><i class="bi bi-box-arrow-left"></i> Keluar dari Forum</button>`;
            reminder.insertAdjacentElement('afterend', section);
            attachLeaveHandler(el, item, index);
          }
        }

        const participantsCount = el.querySelector('.dtl-participants__count');
        if (participantsCount) {
          const newCount = getLiveMemberCount(index, item.participants.joined);
          participantsCount.textContent = `${newCount} bergabung`;
        }
      },
    });
  });
}

export function attachLeaveHandler(el, item, index) {
  const leaveBtn = el.querySelector('.dtl-leave-btn');
  if (!leaveBtn) return;

  leaveBtn.addEventListener('click', () => {
    showConfirmModal({
      title: 'Keluar dari Forum',
      message: `Apakah Anda yakin ingin keluar dari forum "${item.course.title}"?`,
      confirmText: 'Ya, Keluar',
      cancelText: 'Batal',
      input: { label: 'Alasan keluar', placeholder: 'Tuliskan alasan Anda keluar...', required: true },
      onConfirm: (reason) => {
        leaveForum('course', index);
        decrementMemberCount(index, item.participants.joined);

        const leaveSection = el.querySelector('.dtl-leave-section');
        if (leaveSection) leaveSection.remove();

        const joinSection = el.querySelector('.dtl-join-section');
        if (joinSection) {
          joinSection.innerHTML = `<button class="dtl-join-btn" type="button">
            Gabung ke Forum
            <i class="bi bi-arrow-right"></i>
          </button>`;
          attachJoinHandler(el, item, index);
        }

        const participantsCount = el.querySelector('.dtl-participants__count');
        if (participantsCount) {
          const newCount = getLiveMemberCount(index, item.participants.joined);
          participantsCount.textContent = `${newCount} bergabung`;
        }
      },
    });
  });
}
