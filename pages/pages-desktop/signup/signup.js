import { PageHeader } from '/components/desktop/page-header/page-header.js';
import { Card } from '/components/desktop/card/card.js';

export async function Signup() {
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
      title: 'Buat Akun',
      description: 'Halaman pendaftaran yang siap dipakai ketika proses sign up mulai dibangun di tahap berikutnya.',
      actions: [
        { label: 'Go to contact', href: '/contact', variant: 'secondary' },
        { label: 'Back to explore', href: '/', variant: 'primary' },
      ],
    }),
  );

  const grid = el.querySelector('.desktop-page__grid');
  grid.appendChild(Card({
    tag: 'Step 1',
    title: 'Identitas jelas',
    description: 'Form pendaftaran nantinya bisa dirancang dengan urutan field yang sederhana dan familiar.',
  }));
  grid.appendChild(Card({
    tag: 'Step 2',
    title: 'Akses aman',
    description: 'Gunakan pengalaman visual yang tenang supaya proses daftar terasa dipercaya dan mudah diikuti.',
  }));
  grid.appendChild(Card({
    tag: 'Step 3',
    title: 'Siap untuk onboard',
    description: 'Kartu ini menjadi placeholder yang konsisten sambil menunggu alur autentikasi selesai.',
  }));

  return el;
}
