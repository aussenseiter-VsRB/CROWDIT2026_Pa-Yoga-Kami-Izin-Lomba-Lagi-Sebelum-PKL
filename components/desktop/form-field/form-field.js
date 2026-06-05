if (!document.querySelector('link[href="/components/desktop/form-field/form-field.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/components/desktop/form-field/form-field.css';
  document.head.appendChild(link);
}

export function FormField({ label, name, type = 'text' }) {
  const uid = `field-${name}-${Math.random().toString(36).slice(2, 7)}`;

  const el = document.createElement('div');
  el.classList.add('form-field');

  const isTextarea = type === 'textarea';

  el.innerHTML = `
    <label for="${uid}">${label}</label>
    ${isTextarea
      ? `<textarea id="${uid}" name="${name}" placeholder="${label}"></textarea>`
      : `<input id="${uid}" name="${name}" type="${type}" placeholder="${label}" />`
    }
  `;

  return el;
}
