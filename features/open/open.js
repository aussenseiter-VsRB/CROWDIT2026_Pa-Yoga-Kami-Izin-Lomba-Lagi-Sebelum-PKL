import { injectStyle } from '../../js/utils/styleLoader.js';
import { getHashParams, asset } from '../../js/utils/url.js';
injectStyle('/features/detail/detail.css');

export async function Open() {
  const params = getHashParams();
  const index = parseInt(params.get('index'), 10) || 0;

  const res = await fetch(asset('/data/detail.json'));
  const data = await res.json();
  const item = data[index] ?? data[0];

  const statusClass = item.course.status === 'Online' ? 'is-online' : 'is-offline';

  const el = document.createElement('section');
  el.className = 'dtl-page container section';

  el.innerHTML = `
    <div class="dtl-page__inner">
      <a class="dtl-back" href="/" data-link>
        <i class="bi bi-arrow-left"></i>
        Kembali ke Home
      </a>

      <div class="dtl-hero">
        <div class="dtl-hero__main">
          <div class="dtl-hero__top">
            <span class="dtl-hero__category">${item.course.category}</span>
            <span class="dtl-status ${statusClass}">
              <span aria-hidden="true"></span>
              ${item.course.status}
            </span>
          </div>
          <h1 class="dtl-hero__title">${item.course.title}</h1>
          <p class="dtl-hero__desc">${item.course.description}</p>
        </div>
      </div>

      <div class="dtl-grid">
        <div class="dtl-grid__left">
          <div class="dtl-section">
            <h2 class="dtl-section__title">Informasi Pertemuan</h2>
            ${item.meeting.type === 'Online' && item.meeting.link
              ? `<div class="dtl-meeting dtl-meeting--online">
                  <div class="dtl-meeting__header">
                    <span class="dtl-meeting__icon"><i class="bi bi-camera-video"></i></span>
                    <div>
                      <span class="dtl-meeting__label">Pertemuan ${item.meeting.platform}</span>
                      <span class="dtl-meeting__status">Online · Bergabung sekarang</span>
                    </div>
                  </div>
                  <a class="dtl-meeting__link" href="${item.meeting.link}" target="_blank" rel="noopener noreferrer">
                    <i class="bi bi-box-arrow-up-right"></i>
                    ${item.meeting.link}
                  </a>
                </div>`
              : `<div class="dtl-meeting dtl-meeting--offline">
                  <div class="dtl-meeting__header">
                    <span class="dtl-meeting__icon"><i class="bi bi-geo-alt"></i></span>
                    <div>
                      <span class="dtl-meeting__label">Pertemuan Offline</span>
                      <span class="dtl-meeting__status">${item.course.status}</span>
                    </div>
                  </div>
                  <div class="dtl-meeting__location">
                    <i class="bi bi-geo-alt"></i>
                    ${item.meeting.location}
                  </div>
                </div>`
            }
          </div>
        </div>

        <div class="dtl-grid__right">
          <div class="dtl-section">
            <h2 class="dtl-section__title">Partisipan</h2>
            <div class="dtl-participants">
              <div class="dtl-participants__header">
                <div class="dtl-participants__title">
                  <i class="bi bi-people"></i>
                  <span>Partisipan</span>
                </div>
                <span class="dtl-participants__count">${item.participants.joined}/${item.participants.capacity} bergabung</span>
              </div>
              <div class="dtl-participants__bar">
                <div class="dtl-participants__bar-fill" style="width:${Math.round((item.participants.joined / item.participants.capacity) * 100)}%"></div>
              </div>
            </div>
          </div>

          <a class="dtl-join-btn" href="/forum?index=${index}" data-link>
            Gabung ke Forum
            <i class="bi bi-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  `;

  return el;
}
