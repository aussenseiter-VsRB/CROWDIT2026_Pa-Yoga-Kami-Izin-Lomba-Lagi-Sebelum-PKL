import { Card } from '/components/desktop/card/card.js';

export async function Home() {
  const el = document.createElement('section');
  el.className = 'container section';

  el.innerHTML = `
    <header style="margin-bottom: var(--space-md);">
      <p style="color: var(--accent); text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.75rem; margin-bottom: 0.5rem;">Forum Belajar</p>
      <h1>Belajar bareng, tanya cepat, dan temukan jawaban yang relevan.</h1>
      <p style="color: var(--muted); max-width: 60ch;">Halaman ini jadi pusat diskusi untuk materi, pertanyaan, dan update komunitas belajar.</p>
    </header>
    <div id="home-cards" class="card-grid"></div>
  `;

  const cards = [
    { tag: 'Populer', title: 'Diskusi Aktif', description: 'Lihat thread yang paling banyak dibahas hari ini.' },
    { tag: 'Baru', title: 'Materi Terbaru', description: 'Kumpulan materi dan catatan belajar terbaru.' },
    { tag: 'Tanya', title: 'Buat Pertanyaan', description: 'Tulis pertanyaanmu dan minta bantuan komunitas.' },
  ];

  const grid = el.querySelector('#home-cards');
  cards.forEach((card) => grid.appendChild(Card(card)));

  return el;
}
