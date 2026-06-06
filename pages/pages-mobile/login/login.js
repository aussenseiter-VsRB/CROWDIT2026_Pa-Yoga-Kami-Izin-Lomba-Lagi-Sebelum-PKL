if (!document.querySelector('link[href="/pages/pages-mobile/mobile-page.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-mobile/mobile-page.css';
  document.head.appendChild(link);
}

import { initUsers, login, navigateAfterAuth } from '/js/auth.js';

export async function Login() {
  const res = await fetch('/data/login.json');
  const data = await res.json();

  await initUsers();

  const el = document.createElement('section');
  el.className = 'mobile-page';
  el.innerHTML = `
    <div class="mobile-page__inner">
      <header class="mobile-page__hero">
        <p class="mobile-page__eyebrow">${data.copy.mark}</p>
        <h1>${data.copy.title}</h1>
        <p>${data.copy.description}</p>
      </header>
      <form class="mobile-form">
        <p class="mobile-page__error" aria-live="polite" hidden></p>
        <input class="mobile-input" type="email" name="email" placeholder="Email" autocomplete="email" inputmode="email" required />
        <input class="mobile-input" type="password" name="password" placeholder="Password" autocomplete="current-password" required />
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

    const emailInput = form.querySelector('input[name="email"]');
    const passwordInput = form.querySelector('input[name="password"]');
    const submitBtn = form.querySelector('.mobile-submit');

    if (!emailInput.value.trim() || !passwordInput.value) {
      errorEl.textContent = 'Email dan password harus diisi';
      errorEl.hidden = false;
      return;
    }

    const result = login(emailInput.value.trim(), passwordInput.value);

    if (!result.success) {
      errorEl.textContent = result.error;
      errorEl.hidden = false;
      return;
    }

    errorEl.hidden = true;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';

    window.setTimeout(() => {
      navigateAfterAuth('/profile');
    }, 180);
  });

  return el;
}
