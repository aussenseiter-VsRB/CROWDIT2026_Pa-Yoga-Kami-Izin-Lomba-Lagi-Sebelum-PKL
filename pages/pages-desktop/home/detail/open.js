if (!document.querySelector('link[href="/pages/pages-desktop/home/home.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-desktop/home/home.css';
  document.head.appendChild(link);
}

export async function Open() {
  const params = new URLSearchParams(window.location.search);
  const index = parseInt(params.get('index'), 10) || 0;

  const res = await fetch('/data/detail.json');
  const data = await res.json();
  const item = data[index] ?? data[0];

  const statusClass = item.course.status === 'Online' ? 'is-online' : 'is-offline';

  const el = document.createElement('section');
  el.className = 'dtl-page container section';

  el.innerHTML = `
    <div class="dtl-page__inner">
      <a class="dtl-back" href="/" data-link>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
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
                    <span class="dtl-meeting__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg></span>
                    <div>
                      <span class="dtl-meeting__label">Pertemuan ${item.meeting.platform}</span>
                      <span class="dtl-meeting__status">Online · Bergabung sekarang</span>
                    </div>
                  </div>
                  <a class="dtl-meeting__link" href="${item.meeting.link}" target="_blank" rel="noopener noreferrer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    ${item.meeting.link}
                  </a>
                </div>`
              : `<div class="dtl-meeting dtl-meeting--offline">
                  <div class="dtl-meeting__header">
                    <span class="dtl-meeting__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></span>
                    <div>
                      <span class="dtl-meeting__label">Pertemuan Offline</span>
                      <span class="dtl-meeting__status">${item.course.status}</span>
                    </div>
                  </div>
                  <div class="dtl-meeting__location">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
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
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/><path d="M5 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1"/></svg>
                  <span>Partisipan</span>
                </div>
                <span class="dtl-participants__count">${item.participants.joined}/${item.participants.capacity} bergabung</span>
              </div>
              <div class="dtl-participants__bar">
                <div class="dtl-participants__bar-fill" style="width:${Math.round((item.participants.joined / item.participants.capacity) * 100)}%"></div>
              </div>
            </div>
          </div>

          <a class="dtl-join-btn" href="${item.forum.joinLink}" data-link>
            Gabung ke Forum
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </div>
      </div>
    </div>
  `;

  return el;
}
