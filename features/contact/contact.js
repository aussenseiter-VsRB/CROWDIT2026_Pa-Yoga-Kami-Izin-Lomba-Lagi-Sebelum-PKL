import { injectStyle } from '/js/utils/styleLoader.js';
import { fetchData } from '/js/utils/api.js';

injectStyle('/css/_shared.css');
injectStyle('/features/contact/contact.css');
import { PageHeader } from '/components/page-header/page-header.js';
import { FormField } from '/components/form-field/form-field.js';
import { Card } from '/components/card/card.js';

function renderDesktop(data) {
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
  panel.innerHTML = `<form class="contact-form"></form>`;

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

function renderMobile(data) {
  const el = document.createElement('section');
  el.className = 'mobile-page';

  el.innerHTML = `
    <div class="mobile-page__inner">
      <header class="mobile-page__hero">
        <p class="mobile-page__eyebrow">${data.header.eyebrow}</p>
        <h1>${data.header.title}</h1>
        <p>${data.header.description}</p>
      </header>
      <form class="mobile-form" id="js-contact-form">
        <div class="mobile-page__error" aria-live="polite" hidden id="js-contact-error"></div>
        ${data.formFields.map((field) => field.type === 'textarea'
          ? `<textarea class="mobile-input" name="${field.name}" placeholder="${field.label}" rows="4"></textarea>`
          : `<input class="mobile-input" type="${field.type}" name="${field.name}" placeholder="${field.label}" />`
        ).join('')}
        <button class="mobile-submit" type="submit" id="js-contact-submit">${data.submitText}</button>
      </form>
      <article class="mobile-card" style="margin-top:1rem">
        <div style="display:flex;align-items:flex-start;gap:0.75rem">
          <span style="flex:0 0 auto;width:2.2rem;height:2.2rem;border-radius:0.55rem;background:var(--tag-bg);color:var(--accent);display:flex;align-items:center;justify-content:center;font-size:1.05rem">
            <i class="bi bi-envelope"></i>
          </span>
          <div>
            <span class="mobile-card__tag">${data.supportCard.tag}</span>
            <h2 style="font-size:1rem">${data.supportCard.title}</h2>
            <p>${data.supportCard.description}</p>
          </div>
        </div>
      </article>
    </div>
  `;

  const form = el.querySelector('#js-contact-form');
  const errorEl = el.querySelector('#js-contact-error');
  const submitBtn = el.querySelector('#js-contact-submit');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputs = form.querySelectorAll('.mobile-input');
    let valid = true;
    inputs.forEach(inp => { if (!inp.value.trim()) valid = false; });
    if (!valid) {
      errorEl.textContent = 'Semua field harus diisi';
      errorEl.hidden = false;
      return;
    }
    errorEl.hidden = true;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Mengirim...';
    setTimeout(() => {
      submitBtn.textContent = 'Terkirim!';
      form.reset();
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Kirim Pesan';
      }, 2000);
    }, 500);
  });

  return el;
}

export async function Contact() {
  const el = document.createElement('section');
  el.style.padding = '3rem 0';
  el.style.textAlign = 'center';
  el.innerHTML = `<p style="color:var(--muted)"><i class="bi bi-arrow-repeat"></i> Memuat...</p>`;

  try {
    const data = await fetchData('/features/contact/contact.json');

    const isMobile = window.innerWidth <= 900;
    const pageEl = isMobile ? renderMobile(data) : renderDesktop(data);
    el.replaceWith(pageEl);
    return pageEl;
  } catch {
    el.innerHTML = `<p style="color:var(--muted);text-align:center;padding:3rem 1rem">Failed to load contact page. Please try again.</p>`;
    return el;
  }
}
