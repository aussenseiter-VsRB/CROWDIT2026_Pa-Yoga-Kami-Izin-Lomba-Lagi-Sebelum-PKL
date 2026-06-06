if (!document.querySelector('link[href="/pages/pages-desktop/signup/signup.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-desktop/signup/signup.css';
  document.head.appendChild(link);
}

import { initUsers, register, navigateAfterAuth } from '/js/auth.js';

function field({ type, name, placeholder, icon }) {
  return `
    <label class="signup-field">
      <span class="signup-field__label">${placeholder}</span>
      <span class="signup-field__control">
        <input type="${type}" name="${name}" placeholder="${placeholder}" />
        <span class="signup-field__icon" aria-hidden="true">${icon}</span>
      </span>
    </label>
  `;
}

function socialIcon(type) {
  if (type === 'apple') {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M16.8 12.8c0-2 1.6-3 1.7-3.1-0.9-1.3-2.4-1.5-2.9-1.5-1.3-0.1-2.5 0.8-3.2 0.8-0.7 0-1.7-0.8-2.8-0.8-1.5 0-2.9 0.9-3.7 2.3-1.6 2.7-0.4 6.8 1.1 9 0.8 1.1 1.6 2.4 2.8 2.3 1.1 0 1.5-0.7 2.9-0.7 1.4 0 1.8 0.7 3 0.7 1.2 0 2-1.1 2.8-2.2 0.9-1.3 1.2-2.6 1.2-2.7-0.1 0-2.9-1.1-2.9-3.8z"></path>
        <path d="M15.2 4.7c0.6-0.7 1.1-1.7 1-2.7-0.9 0-1.9 0.6-2.6 1.4-0.6 0.7-1.2 1.7-1.1 2.7 1 0.1 1.9-0.5 2.7-1.4z"></path>
      </svg>
    `;
  }

  if (type === 'google') {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-.9 2.2-1.7 2.9v2.4h2.8c1.7-1.6 2.7-4 2.7-6.8 0-.7-.1-1.4-.2-2H12z"></path>
        <path fill="#34A853" d="M12 20c2.4 0 4.5-.8 6-2.1l-2.8-2.4c-.8.5-1.7.8-3.2.8-2.4 0-4.4-1.6-5.1-3.8H4.1v2.4C5.5 18 8.5 20 12 20z"></path>
        <path fill="#FBBC05" d="M6.9 12.5c-.2-.7-.4-1.4-.4-2.1s.1-1.4.4-2.1V5.9H4.1c-.7 1.4-1.1 2.9-1.1 4.5s.4 3.1 1.1 4.5l2.8-2.4z"></path>
        <path fill="#4285F4" d="M12 7.5c1.3 0 2.4.5 3.3 1.3l2.5-2.5C16.5 4.9 14.4 4 12 4 8.5 4 5.5 6 4.1 9.1l2.8 2.4c.7-2.2 2.7-4 5.1-4z"></path>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-10.4-8.9v6.4h2.5V3.1A9 9 0 0 1 21 12z"></path>
    </svg>
  `;
}

export async function Signup() {
  const res = await fetch('/data/signup.json');
  const data = await res.json();

  await initUsers();

  const el = document.createElement('section');
  el.className = 'signup-page';

  const transition = window.__routeTransition || {};
  const transitionClass = transition.isAuthTransition ? 'signup-shell--auth-transition' : '';
  const directionClass = transition.direction === 'to-signup' ? 'signup-shell--from-right' : 'signup-shell--from-left';

  el.innerHTML = `
    <div class="signup-shell ${transitionClass} ${directionClass}">
      <div class="signup-visual" aria-hidden="true">
        <div class="signup-visual__glow signup-visual__glow--one"></div>
        <div class="signup-visual__glow signup-visual__glow--two"></div>
        <div class="signup-visual__orb signup-visual__orb--top"></div>
        <div class="signup-visual__orb signup-visual__orb--bottom"></div>
      </div>

      <div class="signup-panel">
        <div class="signup-copy">
          <div class="signup-mark" aria-hidden="true">${data.copy.mark}</div>
          <h1>${data.copy.title}</h1>
          <p>${data.copy.description}</p>
        </div>

        <form class="signup-form">
          <div class="signup-error" aria-live="polite" hidden></div>
          ${data.fields.map(f => field(f)).join('')}

          <label class="signup-terms">
            <input type="checkbox" checked />
            <span>${data.termsLabel}</span>
          </label>

          <button class="signup-submit" type="submit">${data.submitText}</button>

          <div class="signup-divider"><span>or</span></div>

          <div class="signup-socials" aria-label="Alternative sign up methods">
            ${data.socialButtons.map(type => `
              <button type="button" class="signup-social" aria-label="Continue with ${type.charAt(0).toUpperCase() + type.slice(1)}">
                ${socialIcon(type)}
              </button>
            `).join('')}
          </div>

          <p class="signup-footer">
            ${data.footer.text}
            <a href="${data.footer.linkHref}" data-link>${data.footer.linkLabel}</a>
          </p>
        </form>
      </div>
    </div>
  `;

  const form = el.querySelector('.signup-form');
  const submit = el.querySelector('.signup-submit');
  const errorEl = el.querySelector('.signup-error');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const passwordInput = form.querySelector('input[name="password"]');
    const confirmInput = form.querySelector('input[name="confirm_password"]');

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
    submit.disabled = true;
    submit.textContent = 'Creating account...';

    window.setTimeout(() => {
      navigateAfterAuth('/profile');
    }, 180);
  });

  return el;
}
