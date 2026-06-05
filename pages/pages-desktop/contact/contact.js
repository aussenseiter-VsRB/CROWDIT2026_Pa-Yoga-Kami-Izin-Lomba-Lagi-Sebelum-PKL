import { PageHeader } from '/components/desktop/page-header/page-header.js';
import { FormField } from '/components/desktop/form-field/form-field.js';
import { Card } from '/components/desktop/card/card.js';

export async function Contact() {
  const el = document.createElement('section');
  el.className = 'container section';

  el.innerHTML = `
    <div class="desktop-page desktop-page--split">
      <div class="desktop-page__content">
        <div class="desktop-page__header"></div>
        <div class="desktop-page__support"></div>
      </div>
      <div class="desktop-page__panel"></div>
    </div>
  `;

  el.querySelector('.desktop-page__header').appendChild(
    PageHeader({
      eyebrow: 'Contact',
      title: 'Kontak',
      description: 'Kirim pesan kalau kamu ingin bertanya, memberi masukan, atau mengusulkan fitur baru untuk forum.',
    }),
  );

  const support = el.querySelector('.desktop-page__support');
  support.appendChild(Card({
    tag: 'Response',
    title: 'Respon yang rapi',
    description: 'Form di desktop dibuat lega, fokus, dan mudah dipindai agar pesan masuk terasa profesional.',
  }));

  const panel = el.querySelector('.desktop-page__panel');
  panel.innerHTML = `
    <form class="contact-form"></form>
  `;

  const form = panel.querySelector('form');
  form.appendChild(FormField({ label: 'Nama', name: 'name' }));
  form.appendChild(FormField({ label: 'Email', name: 'email', type: 'email' }));
  form.appendChild(FormField({ label: 'Pesan', name: 'message', type: 'textarea' }));

  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = 'Kirim pesan';
  form.appendChild(button);

  return el;
}
