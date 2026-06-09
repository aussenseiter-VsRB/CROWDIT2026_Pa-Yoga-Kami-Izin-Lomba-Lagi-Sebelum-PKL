import { injectStyle } from '../../../js/utils/styleLoader.js';
injectStyle('/components/ui/confirm-modal/confirm-modal.css');

export function showConfirmModal({ title, message, confirmText, cancelText, onConfirm, onCancel, input } = {}) {
  const overlay = document.createElement('div');
  overlay.className = 'confirm-overlay';

  const inputHtml = input ? `
    <div class="confirm-modal__input-group">
      <label class="confirm-modal__label">${input.label || 'Alasan'}</label>
      <textarea class="confirm-modal__input" placeholder="${input.placeholder || ''}" ${input.required ? 'required' : ''} rows="3"></textarea>
    </div>
  ` : '';

  overlay.innerHTML = `
    <div class="confirm-modal">
      <button class="confirm-modal__close" type="button" aria-label="Tutup"><i class="bi bi-x"></i></button>
      <div class="confirm-modal__icon"><i class="bi bi-question-circle"></i></div>
      <h3 class="confirm-modal__title">${title || 'Konfirmasi'}</h3>
      <p class="confirm-modal__message">${message || 'Apakah Anda yakin?'}</p>
      ${inputHtml}
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
    if (input && input.required) {
      const textarea = overlay.querySelector('.confirm-modal__input');
      const val = textarea ? textarea.value.trim() : '';
      if (!val) {
        textarea.classList.add('confirm-modal__input--error');
        textarea.focus();
        return;
      }
    }
    close();
    const textarea = overlay.querySelector('.confirm-modal__input');
    if (onConfirm) onConfirm(textarea ? textarea.value.trim() : '');
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      close();
      if (onCancel) onCancel();
    }
  });

  document.body.appendChild(overlay);

  if (input) {
    requestAnimationFrame(() => {
      overlay.querySelector('.confirm-modal__input')?.focus();
    });
  }
}
