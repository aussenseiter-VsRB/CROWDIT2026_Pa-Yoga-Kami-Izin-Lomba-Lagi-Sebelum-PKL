import { injectStyle } from '../../../js/utils/styleLoader.js';
import { FormField } from '../../../components/ui/form-field/form-field.js';
import { updateCustomGroup } from '../../../js/services/custom-groups.js';

injectStyle('/components/ui/form-field/form-field.css');
injectStyle('/features/groups/create-group/create-group.css');

function CategoryField(categories = []) {
  const uid = `field-category-${Math.random().toString(36).slice(2, 7)}`;
  const el = document.createElement('div');
  el.className = 'form-field';

  const options = categories
    .map((cat) => `<option value="${cat}">${cat}</option>`)
    .join('');

  el.innerHTML = `
    <label for="${uid}">Kategori</label>
    <select id="${uid}" name="department" required>
      <option value="" disabled selected>Pilih kategori</option>
      ${options}
    </select>
  `;

  return el;
}

function showToast(message) {
  const existing = document.querySelector('.cg-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'cg-toast';
  toast.innerHTML = `
    <i class="bi bi-check-circle-fill"></i>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('cg-toast--visible'));

  setTimeout(() => {
    toast.classList.remove('cg-toast--visible');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function readForm(overlay) {
  const form = overlay.querySelector('.cg-form');
  return {
    department: form.querySelector('[name="department"]')?.value.trim() || '',
    title: form.querySelector('[name="title"]')?.value.trim() || '',
    description: form.querySelector('[name="description"]')?.value.trim() || '',
  };
}

function validateGroup(values) {
  if (!values.department) return 'Kategori wajib dipilih.';
  if (!values.title) return 'Nama grup wajib diisi.';
  if (!values.description) return 'Deskripsi wajib diisi.';
  return '';
}

export function showCreateGroupModal({ categories = [], onCreated, editGroup } = {}) {
  const isEdit = !!editGroup;
  const overlay = document.createElement('div');
  overlay.className = 'cg-overlay';

  overlay.innerHTML = `
    <div class="cg-modal" role="dialog" aria-modal="true" aria-labelledby="cg-modal-title">
      <button class="cg-modal__close" type="button" aria-label="Tutup"><i class="bi bi-x"></i></button>
      <div class="cg-modal__icon"><i class="bi bi-people-fill"></i></div>
      <h2 class="cg-modal__title" id="cg-modal-title">${isEdit ? 'Edit Grup' : 'Minta Izin Buat Grup'}</h2>
      <p class="cg-modal__desc">${isEdit ? 'Ubah informasi grup buatanmu.' : 'Isi detail grup yang ingin kamu buat. Permintaanmu akan ditinjau oleh admin sebelum grup dibuat.'}</p>
      <form class="cg-form" novalidate>
        <p class="cg-form__error" aria-live="polite" hidden></p>
        <div class="cg-form__fields"></div>
        <div class="cg-form__actions">
          <button class="cg-form__btn cg-form__btn--cancel" type="button">Batal</button>
          <button class="cg-form__btn cg-form__btn--submit" type="submit">${isEdit ? 'Simpan' : 'Kirim Permintaan'}</button>
        </div>
      </form>
    </div>
  `;

  const fields = overlay.querySelector('.cg-form__fields');
  fields.appendChild(CategoryField(categories));
  fields.appendChild(FormField({ label: 'Nama Grup', name: 'title' }));
  fields.appendChild(FormField({ label: 'Deskripsi', name: 'description', type: 'textarea' }));

  if (isEdit) {
    fields.appendChild(FormField({
      label: 'Maks. Anggota',
      name: 'maxMembers',
      type: 'number',
    }));

    const privacyField = document.createElement('div');
    privacyField.className = 'cg-privacy';
    privacyField.innerHTML = `
      <p class="cg-privacy__label">Tipe Grup</p>
      <div class="cg-privacy__options" role="radiogroup" aria-label="Tipe grup">
        <label class="cg-privacy__option is-selected">
          <input type="radio" name="privacy" value="public" checked />
          <span class="cg-privacy__icon"><i class="bi bi-globe2"></i></span>
          <span class="cg-privacy__title">Public Group</span>
          <span class="cg-privacy__desc">Siapa saja bisa bergabung</span>
        </label>
        <label class="cg-privacy__option">
          <input type="radio" name="privacy" value="private" />
          <span class="cg-privacy__icon"><i class="bi bi-lock"></i></span>
          <span class="cg-privacy__title">Private Group</span>
          <span class="cg-privacy__desc">Hanya dengan undangan</span>
        </label>
      </div>
    `;
    privacyField.querySelectorAll('input[name="privacy"]').forEach((input) => {
      input.addEventListener('change', () => {
        privacyField.querySelectorAll('.cg-privacy__option').forEach((item) => {
          item.classList.toggle('is-selected', item.querySelector('input') === input);
        });
      });
    });
    fields.appendChild(privacyField);

    const maxInput = fields.querySelector('[name="maxMembers"]');
    if (maxInput) {
      maxInput.value = String(editGroup.maxMembers || 100);
      maxInput.min = '2';
      maxInput.max = '500';
    }

    fields.querySelector('[name="department"]').value = editGroup.department || '';
    fields.querySelector('[name="title"]').value = editGroup.title || '';
    fields.querySelector('[name="description"]').value = editGroup.description || '';
    const privacyRadio = fields.querySelector(`input[name="privacy"][value="${editGroup.privacy || 'public'}"]`);
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
    const error = validateGroup(values);
    if (error) {
      errorEl.textContent = error;
      errorEl.hidden = false;
      return;
    }

    errorEl.hidden = true;

    if (isEdit) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Menyimpan...';
      const result = updateCustomGroup(editGroup.id, {
        department: values.department,
        title: values.title,
        description: values.description,
        maxMembers: editGroup.maxMembers,
        privacy: editGroup.privacy,
      });
      close();
      if (onCreated) onCreated(result);
    } else {
      close();
      showToast('Permintaan pembuatan grup telah dikirim ke admin untuk ditinjau.');
    }
  });

  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    fields.querySelector('[name="department"]')?.focus();
  });
}
