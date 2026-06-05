import { FormField } from '/components/desktop/form-field/form-field.js';

export async function Contact() {
  const el = document.createElement('section');
  el.className = 'container section';

  el.innerHTML = `
    <h1>Kontak</h1>
    <p style="color: var(--muted); max-width: 60ch; margin-bottom: var(--space-md);">
      Kirim pesan kalau kamu ingin bertanya atau memberi masukan untuk forum.
    </p>
    <form class="contact-form"></form>
  `;

  const form = el.querySelector('form');
  form.appendChild(FormField({ label: 'Nama', name: 'name' }));
  form.appendChild(FormField({ label: 'Email', name: 'email', type: 'email' }));
  form.appendChild(FormField({ label: 'Pesan', name: 'message', type: 'textarea' }));

  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = 'Kirim';
  form.appendChild(button);

  return el;
}
