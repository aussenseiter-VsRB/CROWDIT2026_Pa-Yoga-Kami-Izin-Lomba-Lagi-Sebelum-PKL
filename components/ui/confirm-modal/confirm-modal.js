import { injectStyle } from '../../../js/utils/styleLoader.js';
injectStyle('/components/ui/confirm-modal/confirm-modal.css');

export function showConfirmModal({ title, message, confirmText, cancelText, onConfirm, onCancel } = {}) {
  const overlay = document.createElement('div');
  overlay.className = 'confirm-overlay';

  overlay.innerHTML = `
    <div class="confirm-modal">
      <button class="confirm-modal__close" type="button" aria-label="Tutup"><i class="bi bi-x"></i></button>
      <div class="confirm-modal__icon"><i class="bi bi-question-circle"></i></div>
      <h3 class="confirm-modal__title">${title || 'Konfirmasi'}</h3>
      <p class="confirm-modal__message">${message || 'Apakah Anda yakin?'}</p>
      <div class="confirm-modal__actions">
        <button class="confirm-modal__btn confirm-modal__btn--cancel" type="button">${cancelText || 'Batal'}</button>
        <button class="confirm-modal__btn confirm-modal__btn--confirm" type="button">${confirmText || 'Ya, Bergabung'}</button>
      </div>
    </div>
  `;

  const close = () => overlay.remove();

  overlay.querySelector('.confirm-modal__close').addEventListener('click', () => {
    close();
    if (onCancel) onCancel();
  });

  overlay.querySelector('.confirm-modal__btn--cancel').addEventListener('click', () => {
    close();
    if (onCancel) onCancel();
  });

  overlay.querySelector('.confirm-modal__btn--confirm').addEventListener('click', () => {
    close();
    if (onConfirm) onConfirm();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      close();
      if (onCancel) onCancel();
    }
  });

  document.body.appendChild(overlay);
}
