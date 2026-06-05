import { PageHeader } from '/components/desktop/page-header/page-header.js';
import { Card } from '/components/desktop/card/card.js';

export async function About() {
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
      eyebrow: 'About',
      title: 'Tentang Forum',
      description: 'Ruang belajar yang dirancang supaya diskusi terasa rapi, hangat, dan mudah diikuti tanpa hiruk-pikuk visual.',
    }),
  );

  const grid = el.querySelector('.desktop-page__grid');
  grid.appendChild(Card({
    tag: 'Focus',
    title: 'Topik yang jelas',
    description: 'Setiap ruang diskusi dibuat untuk satu tujuan agar orang bisa masuk, paham konteks, lalu langsung berkontribusi.',
  }));
  grid.appendChild(Card({
    tag: 'Support',
    title: 'Komunitas saling bantu',
    description: 'Desain dan alur halaman mengutamakan kolaborasi, bukan sekadar menampilkan informasi sebanyak mungkin.',
  }));
  grid.appendChild(Card({
    tag: 'Flow',
    title: 'Sederhana untuk dipindai',
    description: 'Hierarchy yang bersih membantu pengguna melihat status, aksi, dan isi penting dalam satu kali lihat.',
  }));

  return el;
}
