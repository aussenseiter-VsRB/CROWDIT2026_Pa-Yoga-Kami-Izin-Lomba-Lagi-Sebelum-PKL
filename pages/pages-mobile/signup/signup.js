if (!document.querySelector('link[href="/pages/pages-mobile/mobile-page.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-mobile/mobile-page.css';
  document.head.appendChild(link);
}

import { initUsers, register, navigateAfterAuth } from '/js/auth.js';

export async function Signup() {
  const res = await fetch('/data/signup.json');
  const data = await res.json();

  await initUsers();

  const el = document.createElement('section');
  el.className = 'mobile-page';
  el.innerHTML = `
    <div class="mobile-page__inner">
      <header class="mobile-page__hero">
        <p class="mobile-page__eyebrow">${data.copy.eyebrow}</p>
        <h1>${data.copy.title}</h1>
        <p>${data.copy.description}</p>
      </header>
      <form class="mobile-form">
        <p class="mobile-page__error" aria-live="polite" hidden></p>
        ${data.fields.map((field) => `
          <input class="mobile-input" type="${field.type}" name="${field.name}" placeholder="${field.placeholder}" autocomplete="${field.name}" />
        `).join('')}
        <button class="mobile-submit" type="submit">${data.submitText}</button>
      </form>
      <p class="mobile-card" style="font-size: 0.9rem; color: #3c4253;">
        ${data.footer.text} <a href="${data.footer.linkHref}" data-link style="color: #075ac5; font-weight: 800;">${data.footer.linkLabel}</a>
      </p>
    </div>
  `;

  const form = el.querySelector('.mobile-form');
  const errorEl = el.querySelector('.mobile-page__error');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const passwordInput = form.querySelector('input[name="password"]');
    const confirmInput = form.querySelector('input[name="confirm_password"]');
    const submitBtn = form.querySelector('.mobile-submit');

    if (!nameInput.value.trim() || !emailInput.value.trim() || !passwordInput.value) {
      errorEl.textContent = 'Semua field harus diisi';
      errorEl.hidden = false;
      return;
    }

    if (passwordInput.value !== confirmInput.value) {
      errorEl.textContent = 'Password tidak cocok';
      errorEl.hidden = false;
      return;
    }

    if (passwordInput.value.length < 8) {
      errorEl.textContent = 'Password minimal 8 karakter';
      errorEl.hidden = false;
      return;
    }

    const result = register(nameInput.value.trim(), emailInput.value.trim(), passwordInput.value);

    if (!result.success) {
      errorEl.textContent = result.error;
      errorEl.hidden = false;
      return;
    }

    errorEl.hidden = true;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';

    window.setTimeout(() => {
      navigateAfterAuth('/profile');
    }, 180);
  });

  return el;
}
