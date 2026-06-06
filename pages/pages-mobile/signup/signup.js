if (!document.querySelector('link[href="/pages/pages-mobile/mobile-page.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-mobile/mobile-page.css';
  document.head.appendChild(link);
}

export async function Signup() {
  const res = await fetch('/data/signup.json');
  const data = await res.json();

  const el = document.createElement('section');
  el.className = 'mobile-page';
  el.innerHTML = `
    <div class="mobile-page__inner">
      <header class="mobile-page__hero">
        <p class="mobile-page__eyebrow">${data.eyebrow}</p>
        <h1>${data.copy.title}</h1>
        <p>${data.copy.description}</p>
      </header>
      <form class="mobile-form">
        ${data.fields.map((field) => `
          <input class="mobile-input" type="${field.type}" name="${field.name}" placeholder="${field.placeholder}" autocomplete="${field.name}" />
        `).join('')}
        <button class="mobile-submit" type="button">${data.submitText}</button>
      </form>
      <p class="mobile-card" style="font-size: 0.9rem; color: #3c4253;">
        ${data.footer.text} <a href="${data.footer.linkHref}" data-link style="color: #075ac5; font-weight: 800;">${data.footer.linkLabel}</a>
      </p>
    </div>
  `;
  return el;
}
