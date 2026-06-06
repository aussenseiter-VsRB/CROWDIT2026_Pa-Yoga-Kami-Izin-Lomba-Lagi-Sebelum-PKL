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
      <form class="mobile-form">
        ${data.formFields.map((field) => field.type === 'textarea'
          ? `<textarea class="mobile-input" name="${field.name}" placeholder="${field.label}" rows="5"></textarea>`
          : `<input class="mobile-input" type="${field.type}" name="${field.name}" placeholder="${field.label}" />`
        ).join('')}
        <button class="mobile-submit" type="button">${data.submitText}</button>
      </form>
      <article class="mobile-card">
        <span class="mobile-card__tag">${data.supportCard.tag}</span>
        <h2>${data.supportCard.title}</h2>
        <p>${data.supportCard.description}</p>
      </article>
    </div>
  `;

  return el;
}
