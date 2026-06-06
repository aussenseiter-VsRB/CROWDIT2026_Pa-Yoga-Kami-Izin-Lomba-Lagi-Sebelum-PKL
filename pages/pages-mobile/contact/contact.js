import { FormField } from '/components/desktop/form-field/form-field.js';

export async function Contact() {
  const res = await fetch('/data/contact.json');
  const data = await res.json();

  const el = document.createElement('section');
  el.className = 'container section';

  el.innerHTML = `
    <h1>${data.header.title}</h1>
    <p style="color: var(--muted); max-width: 60ch; margin-bottom: var(--space-md);">
      ${data.header.description}
    </p>
    <form class="contact-form"></form>
  `;

  const form = el.querySelector('form');
  data.formFields.forEach((field) => {
    form.appendChild(FormField(field));
  });

  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = data.submitText;
  form.appendChild(button);

  return el;
}
