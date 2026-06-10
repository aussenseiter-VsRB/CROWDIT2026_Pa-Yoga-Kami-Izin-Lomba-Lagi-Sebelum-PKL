import { injectStyle } from '../../../js/utils/styleLoader.js';
import { FormField } from '../../../components/ui/form-field/form-field.js';
import { LIMITS } from '../../../js/core/config.js';
import { addCustomForum, updateCustomForum } from '../../../js/services/custom-forums.js';
import { getSession } from '../../../js/services/auth.js';

injectStyle('/components/ui/form-field/form-field.css');
injectStyle('/features/groups/create-group/create-group.css');
injectStyle('/features/forum/create-forum/create-forum.css');

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

function StatusField() {
  const el = document.createElement('div');
  el.className = 'cf-status';
  el.innerHTML = `
    <p class="cf-status__label">Status Forum</p>
    <div class="cf-status__options" role="radiogroup" aria-label="Status forum">
      <label class="cf-status__option is-selected">
        <input type="radio" name="forumStatus" value="Online" checked />
        <span class="cf-status__icon"><i class="bi bi-wifi"></i></span>
        <span class="cf-status__title">Online</span>
      </label>
      <label class="cf-status__option">
        <input type="radio" name="forumStatus" value="Offline" />
        <span class="cf-status__icon"><i class="bi bi-wifi-off"></i></span>
        <span class="cf-status__title">Offline</span>
      </label>
    </div>
  `;

  el.querySelectorAll('input[name="forumStatus"]').forEach((input) => {
    input.addEventListener('change', () => {
      el.querySelectorAll('.cf-status__option').forEach((item) => {
        item.classList.toggle('is-selected', item.querySelector('input') === input);
      });
    });
  });

  return el;
}

function MeetingTypeField() {
  const el = document.createElement('div');
  el.className = 'cf-meeting-type';

  el.innerHTML = `
    <p class="cf-meeting-type__label">Tipe Pertemuan</p>
    <div class="cf-meeting-type__options" role="radiogroup" aria-label="Tipe pertemuan">
      <label class="cf-meeting-type__option is-selected">
        <input type="radio" name="meetingType" value="Online" checked />
        <span class="cf-meeting-type__icon"><i class="bi bi-camera-video"></i></span>
        <span class="cf-meeting-type__title">Online</span>
      </label>
      <label class="cf-meeting-type__option">
        <input type="radio" name="meetingType" value="Offline" />
        <span class="cf-meeting-type__icon"><i class="bi bi-geo-alt"></i></span>
        <span class="cf-meeting-type__title">Offline</span>
      </label>
    </div>
  `;

  const onlineFields = document.createElement('div');
  onlineFields.className = 'cf-conditional is-visible';
  onlineFields.id = 'cf-online-fields';
  onlineFields.innerHTML = `
    <div class="form-field">
      <label for="cf-platform">Platform</label>
      <select id="cf-platform" name="platform">
        <option value="Zoom">Zoom</option>
        <option value="Google Meet" selected>Google Meet</option>
        <option value="Microsoft Teams">Microsoft Teams</option>
        <option value="Cisco Webex">Cisco Webex</option>
      </select>
    </div>
  `;
  const linkField = FormField({ label: 'Link Pertemuan', name: 'meetingLink', type: 'url' });
  linkField.querySelector('input').placeholder = 'https://meet.google.com/...';
  onlineFields.appendChild(linkField);

  const offlineFields = document.createElement('div');
  offlineFields.className = 'cf-conditional';
  offlineFields.id = 'cf-offline-fields';
  const locationField = FormField({ label: 'Lokasi', name: 'location' });
  locationField.querySelector('input').placeholder = 'Gedung A, Ruang 101';
  offlineFields.appendChild(locationField);

  el.appendChild(onlineFields);
  el.appendChild(offlineFields);

  el.querySelectorAll('input[name="meetingType"]').forEach((input) => {
    input.addEventListener('change', () => {
      el.querySelectorAll('.cf-meeting-type__option').forEach((item) => {
        item.classList.toggle('is-selected', item.querySelector('input') === input);
      });
      const isOnline = input.value === 'Online';
      el.querySelector('#cf-online-fields').classList.toggle('is-visible', isOnline);
      el.querySelector('#cf-offline-fields').classList.toggle('is-visible', !isOnline);
    });
  });

  return el;
}

function SectionTitle(icon, label) {
  const el = document.createElement('div');
  el.className = 'cf-section';
  el.innerHTML = `
    <p class="cf-section__title"><i class="bi ${icon}"></i> ${label}</p>
    <div class="cf-section__divider"></div>
  `;
  return el;
}

function readForm(overlay) {
  const form = overlay.querySelector('.cg-form');
  const meetingType = form.querySelector('[name="meetingType"]:checked')?.value || 'Online';
  return {
    topic: form.querySelector('[name="topic"]')?.value.trim() || '',
    title: form.querySelector('[name="title"]')?.value.trim() || '',
    description: form.querySelector('[name="description"]')?.value.trim() || '',
    forumStatus: form.querySelector('[name="forumStatus"]:checked')?.value || 'Online',
    scheduleDay: form.querySelector('[name="scheduleDay"]')?.value.trim() || '',
    scheduleTime: form.querySelector('[name="scheduleTime"]')?.value.trim() || '',
    startDate: form.querySelector('[name="startDate"]')?.value || '',
    endDate: form.querySelector('[name="endDate"]')?.value || '',
    meetingType,
    platform: meetingType === 'Online' ? (form.querySelector('[name="platform"]')?.value || '') : '',
    meetingLink: meetingType === 'Online' ? (form.querySelector('[name="meetingLink"]')?.value.trim() || '') : '',
    location: meetingType === 'Offline' ? (form.querySelector('[name="location"]')?.value.trim() || '') : '',
    maxMembers: Number(form.querySelector('[name="maxMembers"]')?.value) || 0,
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

  // Section: Informasi Dasar
  fields.appendChild(SectionTitle('bi-info-circle', 'Informasi Dasar'));
  fields.appendChild(TopicField(topics));
  fields.appendChild(FormField({ label: 'Nama Forum', name: 'title' }));
  fields.appendChild(FormField({ label: 'Deskripsi', name: 'description', type: 'textarea' }));
  fields.appendChild(StatusField());

  // Section: Jadwal Pertemuan
  fields.appendChild(SectionTitle('bi-calendar-event', 'Jadwal Pertemuan'));

  const scheduleRow = document.createElement('div');
  scheduleRow.className = 'cf-row';
  const dayField = FormField({ label: 'Hari', name: 'scheduleDay' });
  dayField.querySelector('input').placeholder = 'Senin, Rabu, Jumat';
  const timeField = FormField({ label: 'Waktu', name: 'scheduleTime' });
  timeField.querySelector('input').placeholder = '10:00 - 11:30 WIB';
  scheduleRow.appendChild(dayField);
  scheduleRow.appendChild(timeField);
  fields.appendChild(scheduleRow);

  const dateRow = document.createElement('div');
  dateRow.className = 'cf-row';
  dateRow.appendChild(FormField({ label: 'Tanggal Mulai', name: 'startDate', type: 'date' }));
  dateRow.appendChild(FormField({ label: 'Tanggal Selesai', name: 'endDate', type: 'date' }));
  fields.appendChild(dateRow);

  // Section: Informasi Pertemuan
  fields.appendChild(SectionTitle('bi-camera-video', 'Informasi Pertemuan'));
  fields.appendChild(MeetingTypeField());

  // Section: Pengaturan Forum
  fields.appendChild(SectionTitle('bi-gear', 'Pengaturan Forum'));
  fields.appendChild(FormField({
    label: 'Maks. Anggota',
    name: 'maxMembers',
    type: 'number',
  }));

  // Set default values
  const maxInput = fields.querySelector('[name="maxMembers"]');
  if (maxInput) {
    maxInput.value = String(isEdit ? editForum.maxMembers : LIMITS.DEFAULT_MEMBER_LIMIT);
    maxInput.min = '2';
    maxInput.max = '500';
  }

  // Populate edit values
  if (isEdit) {
    fields.querySelector('[name="topic"]').value = editForum.topic || '';
    fields.querySelector('[name="title"]').value = editForum.title || '';
    fields.querySelector('[name="description"]').value = editForum.description || '';

    const statusRadio = fields.querySelector(`input[name="forumStatus"][value="${editForum.forumStatus || 'Online'}"]`);
    if (statusRadio) {
      statusRadio.checked = true;
      fields.querySelectorAll('.cf-status__option').forEach(el => el.classList.toggle('is-selected', el.querySelector('input') === statusRadio));
    }

    if (editForum.scheduleDay) fields.querySelector('[name="scheduleDay"]').value = editForum.scheduleDay;
    if (editForum.scheduleTime) fields.querySelector('[name="scheduleTime"]').value = editForum.scheduleTime;
    if (editForum.startDate) fields.querySelector('[name="startDate"]').value = editForum.startDate;
    if (editForum.endDate) fields.querySelector('[name="endDate"]').value = editForum.endDate;

    const mt = editForum.meetingType || 'Online';
    const mtRadio = fields.querySelector(`input[name="meetingType"][value="${mt}"]`);
    if (mtRadio) {
      mtRadio.checked = true;
      fields.querySelectorAll('.cf-meeting-type__option').forEach(el => el.classList.toggle('is-selected', el.querySelector('input') === mtRadio));
      fields.querySelector('#cf-online-fields').classList.toggle('is-visible', mt === 'Online');
      fields.querySelector('#cf-offline-fields').classList.toggle('is-visible', mt === 'Offline');
    }

    if (editForum.platform) fields.querySelector('[name="platform"]').value = editForum.platform;
    if (editForum.meetingLink) fields.querySelector('[name="meetingLink"]').value = editForum.meetingLink;
    if (editForum.location) fields.querySelector('[name="location"]').value = editForum.location;
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
      result = updateCustomForum(editForum.id, values);
    } else {
      const session = getSession();
      if (session) {
        values.creatorName = session.name;
        values.creatorEmail = session.email;
      }
      result = addCustomForum(values);
    }

    close();
    if (onCreated) onCreated(result);
  });

  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    fields.querySelector('[name="topic"]')?.focus();
  });
}
