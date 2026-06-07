if (!document.querySelector('link[href="/pages/pages-mobile/mobile-page.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-mobile/mobile-page.css';
  document.head.appendChild(link);
}

export async function Contact() {
  const res = await fetch('/data/contact.json');
  const data = await res.json();

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
