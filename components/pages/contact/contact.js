import { FormField } from '/components/form-field/form-field.js';

export async function Contact() {
  const section = document.createElement('section');
  section.classList.add('section', 'contact');

  const heading = document.createElement('h1');
  heading.textContent = 'Contact';
  section.appendChild(heading);

  const form = document.createElement('form');
  form.classList.add('contact-form');
  form.setAttribute('novalidate', '');

  const fields = [
    { label: 'Name',    name: 'name',    type: 'text' },
    { label: 'Email',   name: 'email',   type: 'email' },
    { label: 'Message', name: 'message', type: 'textarea' },
  ];

  fields.forEach(p => form.appendChild(FormField(p)));

  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.textContent = 'Send';
  form.appendChild(btn);

  form.addEventListener('submit', e => { e.preventDefault(); console.log('Form data:', Object.fromEntries(new FormData(form))); });
  section.appendChild(form);

  return section;
}
