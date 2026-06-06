if (!document.querySelector('link[href="/pages/pages-desktop/home/home.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-desktop/home/home.css';
  document.head.appendChild(link);
}

export async function Open() {
  const el = document.createElement('section');
  el.className = 'home-page container section';

  el.innerHTML = `
    <div class="home-page__inner">
      <section class="home-hero" aria-label="Open forum">
        <div class="home-hero__copy">
          <p class="home-hero__eyebrow">Forum Open</p>
          <h1 class="home-hero__title">Buka Forum</h1>
          <p class="home-hero__text">Masuk ke diskusi dan lihat konten forum secara langsung.</p>

          <div class="home-hero__actions">
            <a class="home-button home-button--secondary" href="/" data-link>Kembali ke Home</a>
          </div>
        </div>
      </section>
    </div>
  `;

  return el;
}
