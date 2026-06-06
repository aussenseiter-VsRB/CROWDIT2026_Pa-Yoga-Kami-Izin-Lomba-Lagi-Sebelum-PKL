import { PageHeader } from '/components/desktop/page-header/page-header.js';
import { FormField } from '/components/desktop/form-field/form-field.js';
import { Card } from '/components/desktop/card/card.js';

export async function Contact() {
  const res = await fetch('/data/contact.json');
  const data = await res.json();

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
    PageHeader(data.header),
  );

  const support = el.querySelector('.desktop-page__support');
  support.appendChild(Card(data.supportCard));

  const panel = el.querySelector('.desktop-page__panel');
  panel.innerHTML = `
    <form class="contact-form"></form>
  `;

  const form = panel.querySelector('form');
  data.formFields.forEach((field) => {
    form.appendChild(FormField(field));
  });

  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = data.submitText;
  form.appendChild(button);

  return el;
}
