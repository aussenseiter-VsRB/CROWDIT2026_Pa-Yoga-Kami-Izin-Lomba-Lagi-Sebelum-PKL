import { PageHeader } from '/components/desktop/page-header/page-header.js';
import { Card } from '/components/desktop/card/card.js';

export async function Search() {
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
      eyebrow: 'Search',
      title: 'Cari Konten',
      description: 'Cari thread, kategori, dan materi belajar dengan alur yang sederhana dan fokus ke hasil paling relevan.',
      actions: [
        { label: 'Browse groups', href: '/groups', variant: 'secondary' },
        { label: 'Open notifications', href: '/notifications', variant: 'primary' },
      ],
    }),
  );

  const grid = el.querySelector('.desktop-page__grid');
  grid.appendChild(Card({
    tag: 'Tip',
    title: 'Gunakan kata kunci spesifik',
    description: 'Pencarian yang lebih terarah membantu menemukan diskusi yang benar-benar relevan lebih cepat.',
  }));
  grid.appendChild(Card({
    tag: 'Filter',
    title: 'Saring menurut topik',
    description: 'Nanti halaman ini bisa dikembangkan dengan filter kategori, kelas, atau popularitas.',
  }));
  grid.appendChild(Card({
    tag: 'Result',
    title: 'Hasil yang mudah dipindai',
    description: 'Kartu hasil dibuat bersih supaya pengguna bisa membandingkan beberapa thread sekaligus dengan cepat.',
  }));

  return el;
}
