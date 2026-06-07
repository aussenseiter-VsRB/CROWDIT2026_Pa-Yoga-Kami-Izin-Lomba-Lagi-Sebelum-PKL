if (!document.querySelector('link[href="/components/desktop/qr-modal/qr-modal.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/components/desktop/qr-modal/qr-modal.css';
  document.head.appendChild(link);
}

export function showQrModal({ name = '', email = '' } = {}) {
  const overlay = document.createElement('div');
  overlay.className = 'qm-overlay';

  overlay.innerHTML = `
    <div class="qm">
      <button class="qm__close" type="button" aria-label="Tutup"><i class="bi bi-x"></i></button>
      <div class="qm__qr"><i class="bi bi-qr-code"></i></div>
      <p class="qm__title">${name}</p>
      <p class="qm__sub">${email}</p>
      <p class="qm__hint">Scan QR code untuk melihat profil</p>
    </div>
  `;

  overlay.querySelector('.qm__close').addEventListener('click', () => overlay.remove());

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  document.body.appendChild(overlay);
}
