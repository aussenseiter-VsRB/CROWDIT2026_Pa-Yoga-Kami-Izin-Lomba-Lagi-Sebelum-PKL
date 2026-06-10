import { injectStyle } from '../../../js/utils/styleLoader.js';
import { FormField } from '../../../components/ui/form-field/form-field.js';
import { LIMITS } from '../../../js/core/config.js';
import { addCustomForum, updateCustomForum } from '../../../js/services/custom-forums.js';

injectStyle('/components/ui/form-field/form-field.css');
injectStyle('/features/groups/create-group/create-group.css');

function TopicField(topics = []) {
  const uid = `field-topic-${Math.random().toString(36).slice(2, 7)}`;
  const el = document.createElement('div');
  el.className = 'form-field';

  const options = topics
    .map((t) => `<option value="${t}">${t}</option>`)
    .join('');

  el.innerHTML = `
    <label for="${uid}">Topik</label>
    <select id="${uid}" name="topic" required>
      <option value="" disabled selected>Pilih topik</option>
      ${options}
    </select>
  `;

  return el;
}

function PrivacyField() {
  const el = document.createElement('div');
  el.className = 'cg-privacy';
  el.innerHTML = `
    <p class="cg-privacy__label">Tipe Forum</p>
    <div class="cg-privacy__options" role="radiogroup" aria-label="Tipe forum">
      <label class="cg-privacy__option is-selected">
        <input type="radio" name="privacy" value="public" checked />
        <span class="cg-privacy__icon"><i class="bi bi-globe2"></i></span>
        <span class="cg-privacy__title">Public</span>
        <span class="cg-privacy__desc">Siapa saja bisa bergabung</span>
      </label>
      <label class="cg-privacy__option">
        <input type="radio" name="privacy" value="private" />
        <span class="cg-privacy__icon"><i class="bi bi-lock"></i></span>
        <span class="cg-privacy__title">Private</span>
        <span class="cg-privacy__desc">Hanya dengan undangan</span>
      </label>
    </div>
  `;

  el.querySelectorAll('input[name="privacy"]').forEach((input) => {
    input.addEventListener('change', () => {
      el.querySelectorAll('.cg-privacy__option').forEach((item) => {
        item.classList.toggle('is-selected', item.querySelector('input') === input);
      });
    });
  });

  return el;
}

function readForm(overlay) {
  const form = overlay.querySelector('.cg-form');
  return {
    topic: form.querySelector('[name="topic"]')?.value.trim() || '',
    title: form.querySelector('[name="title"]')?.value.trim() || '',
    description: form.querySelector('[name="description"]')?.value.trim() || '',
    maxMembers: Number(form.querySelector('[name="maxMembers"]')?.value) || 0,
    privacy: form.querySelector('[name="privacy"]:checked')?.value || 'public',
  };
}

function validateForum(values) {
  if (!values.topic) return 'Topik wajib dipilih.';
  if (!values.title) return 'Nama forum wajib diisi.';
  if (!values.description) return 'Deskripsi wajib diisi.';
  if (!Number.isFinite(values.maxMembers) || values.maxMembers < 2) {
    return 'Maksimal anggota minimal 2 orang.';
  }
  if (values.maxMembers > 500) return 'Maksimal anggota tidak boleh lebih dari 500.';
  return '';
}

export function showCreateForumModal({ topics = [], onCreated, editForum } = {}) {
  const isEdit = !!editForum;
  const overlay = document.createElement('div');
  overlay.className = 'cg-overlay';

  overlay.innerHTML = `
    <div class="cg-modal" role="dialog" aria-modal="true" aria-labelledby="cf-modal-title">
      <button class="cg-modal__close" type="button" aria-label="Tutup"><i class="bi bi-x"></i></button>
      <div class="cg-modal__icon"><i class="bi bi-chat-square-text"></i></div>
      <h2 class="cg-modal__title" id="cf-modal-title">${isEdit ? 'Edit Forum' : 'Buat Forum Baru'}</h2>
      <p class="cg-modal__desc">${isEdit ? 'Ubah informasi forum buatanmu.' : 'Buat forum diskusi sesuai topik dan minat belajarmu. Forum akan tersimpan di perangkatmu.'}</p>
      <form class="cg-form" novalidate>
        <p class="cg-form__error" aria-live="polite" hidden></p>
        <div class="cg-form__fields"></div>
        <div class="cg-form__actions">
          <button class="cg-form__btn cg-form__btn--cancel" type="button">Batal</button>
          <button class="cg-form__btn cg-form__btn--submit" type="submit">${isEdit ? 'Simpan' : 'Buat Forum'}</button>
        </div>
      </form>
    </div>
  `;

  const fields = overlay.querySelector('.cg-form__fields');
  fields.appendChild(TopicField(topics));
  fields.appendChild(FormField({ label: 'Nama Forum', name: 'title' }));
  fields.appendChild(FormField({ label: 'Deskripsi', name: 'description', type: 'textarea' }));
  fields.appendChild(FormField({
    label: 'Maks. Anggota',
    name: 'maxMembers',
    type: 'number',
  }));
  fields.appendChild(PrivacyField());

  const maxInput = fields.querySelector('[name="maxMembers"]');
  if (maxInput) {
    maxInput.value = String(isEdit ? editForum.maxMembers : LIMITS.DEFAULT_MEMBER_LIMIT);
    maxInput.min = '2';
    maxInput.max = '500';
  }

  if (isEdit) {
    fields.querySelector('[name="topic"]').value = editForum.topic || '';
    fields.querySelector('[name="title"]').value = editForum.title || '';
    fields.querySelector('[name="description"]').value = editForum.description || '';
    const privacyRadio = fields.querySelector(`input[name="privacy"][value="${editForum.privacy || 'public'}"]`);
    if (privacyRadio) {
      privacyRadio.checked = true;
      fields.querySelectorAll('.cg-privacy__option').forEach(el => el.classList.toggle('is-selected', el.querySelector('input') === privacyRadio));
    }
  }

  const errorEl = overlay.querySelector('.cg-form__error');
  const submitBtn = overlay.querySelector('.cg-form__btn--submit');
  const close = () => overlay.remove();

  overlay.querySelector('.cg-modal__close').addEventListener('click', close);
  overlay.querySelector('.cg-form__btn--cancel').addEventListener('click', close);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  overlay.querySelector('.cg-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const values = readForm(overlay);
    const error = validateForum(values);
    if (error) {
      errorEl.textContent = error;
      errorEl.hidden = false;
      return;
    }

    errorEl.hidden = true;
    submitBtn.disabled = true;
    submitBtn.textContent = isEdit ? 'Menyimpan...' : 'Membuat...';

    let result;
    if (isEdit) {
      result = updateCustomForum(editForum.id, {
        topic: values.topic,
        title: values.title,
        description: values.description,
        maxMembers: values.maxMembers,
        privacy: values.privacy,
      });
    } else {
      result = addCustomForum({
        topic: values.topic,
        title: values.title,
        description: values.description,
        maxMembers: values.maxMembers,
        privacy: values.privacy,
      });
    }

    close();
    if (onCreated) onCreated(result);
  });

  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    fields.querySelector('[name="topic"]')?.focus();
  });
}
