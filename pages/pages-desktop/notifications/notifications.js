import { PageHeader } from '/components/desktop/page-header/page-header.js';
import { Card } from '/components/desktop/card/card.js';

export async function Notifications() {
  const el = document.createElement('section');
  el.className = 'container section';

  el.innerHTML = `
    <div class="desktop-page">
      <div class="desktop-page__header"></div>
      <div class="card-grid desktop-page__grid"></div>
    </div>
  `;

  el.querySelector('.desktop-page__header').appendChild(
    PageHeader({
      eyebrow: 'Updates',
      title: 'Notifikasi',
      description: 'Rangkuman update, balasan, mention, dan aktivitas terbaru yang tampil rapi dan tidak berisik.',
    }),
  );

  const grid = el.querySelector('.desktop-page__grid');
  grid.appendChild(Card({
    tag: 'New',
    title: 'Balasan baru',
    description: 'Setiap update dipresentasikan dengan hierarchy yang jelas supaya tidak terasa menumpuk.',
  }));
  grid.appendChild(Card({
    tag: 'Mentions',
    title: 'Mention penting',
    description: 'Sorot interaksi yang membutuhkan perhatian langsung tanpa mengganggu fokus utama halaman.',
  }));
  grid.appendChild(Card({
    tag: 'Digest',
    title: 'Ringkasan aktivitas',
    description: 'Nanti bisa diperluas menjadi notifikasi harian atau mingguan untuk memberi konteks yang lebih lengkap.',
  }));

  return el;
}
