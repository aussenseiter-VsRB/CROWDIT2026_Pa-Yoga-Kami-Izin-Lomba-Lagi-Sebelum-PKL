// reusable, generates unique id per instance
// inject styles once
if (!document.querySelector('link[href="/components/form-field/form-field.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/components/form-field/form-field.css';
  document.head.appendChild(link);
}

// FormField({ label, name, type })
// Generates a unique id per instance so label+input pairing
// works correctly even when mounted multiple times on the same page
export function FormField({ label, name, type = 'text' }) {
  const uid = `field-${name}-${Math.random().toString(36).slice(2, 7)}`;

  const el = document.createElement('div');
  el.classList.add('form-field');

  const isTextarea = type === 'textarea';

  el.innerHTML = `
    <label for="${uid}">${label}</label>
    ${isTextarea
      ? `<textarea id="${uid}" name="${name}" placeholder="${label}"></textarea>`
      : `<input    id="${uid}" name="${name}" type="${type}" placeholder="${label}" />`
    }
  `;

  return el;
}