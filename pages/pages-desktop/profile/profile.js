import { PageHeader } from '/components/desktop/page-header/page-header.js';
import { Card } from '/components/desktop/card/card.js';

export async function Profile() {
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
      eyebrow: 'Account',
      title: 'Profil',
      description: 'Ringkasan akun, badge, dan kontribusi pengguna dalam tampilan yang bersih dan mudah dipindai.',
    }),
  );

  const grid = el.querySelector('.desktop-page__grid');
  grid.appendChild(Card({
    tag: 'Stats',
    title: 'Aktivitas mingguan',
    description: 'Pantau posting, jawaban, dan interaksi terbaru tanpa harus keluar dari konteks profil.',
  }));
  grid.appendChild(Card({
    tag: 'Badge',
    title: 'Kontribusi komunitas',
    description: 'Sorot pencapaian dan keahlian supaya profil terasa lebih personal dan kredibel.',
  }));
  grid.appendChild(Card({
    tag: 'Settings',
    title: 'Preferensi akun',
    description: 'Akses pengaturan utama dengan hierarchy yang tenang, konsisten, dan tidak terlalu ramai.',
  }));

  return el;
}
