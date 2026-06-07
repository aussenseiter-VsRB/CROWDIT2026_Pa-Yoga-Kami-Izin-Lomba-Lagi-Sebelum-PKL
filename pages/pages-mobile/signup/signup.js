if (!document.querySelector('link[href="/pages/pages-mobile/mobile-page.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-mobile/mobile-page.css';
  document.head.appendChild(link);
}

import { initUsers, register, navigateAfterAuth } from '/js/auth.js';

function iconEye() { return '<i class="bi bi-eye"></i>'; }
function iconEyeSlash() { return '<i class="bi bi-eye-slash"></i>'; }

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
        ${data.fields.map((field) => {
          if (field.name === 'password' || field.name === 'confirm_password') {
            return `
              <div style="position:relative">
                <input class="mobile-input" type="password" name="${field.name}" placeholder="${field.placeholder}" autocomplete="${field.name}" style="padding-right:2.8rem" />
                <button type="button" class="m-auth__toggle-pw" data-target="${field.name}" aria-label="Toggle password visibility" style="position:absolute;right:0.5rem;top:50%;transform:translateY(-50%);border:none;background:none;color:var(--muted-alt);cursor:pointer;font-size:1.1rem;padding:0.3rem">
                  ${iconEye()}
                </button>
              </div>
            `;
          }
          return `<input class="mobile-input" type="${field.type}" name="${field.name}" placeholder="${field.placeholder}" autocomplete="${field.name}" />`;
        }).join('')}
        <button class="mobile-submit" type="submit">${data.submitText}</button>
      </form>
      <p class="mobile-card" style="font-size:0.9rem;text-align:center;color:var(--text)">
        ${data.footer.text} <a href="${data.footer.linkHref}" data-link style="color:var(--accent);font-weight:800;">${data.footer.linkLabel}</a>
      </p>
    </div>
  `;

  const form = el.querySelector('.mobile-form');
  const errorEl = el.querySelector('.mobile-page__error');

  el.querySelectorAll('.m-auth__toggle-pw').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = form.querySelector(`input[name="${btn.dataset.target}"]`);
      if (!target) return;
      const isPassword = target.type === 'password';
      target.type = isPassword ? 'text' : 'password';
      btn.innerHTML = isPassword ? iconEyeSlash() : iconEye();
    });
  });

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
