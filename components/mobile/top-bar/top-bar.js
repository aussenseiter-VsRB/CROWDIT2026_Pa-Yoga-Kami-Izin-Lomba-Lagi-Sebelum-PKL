export function TopBar() {
  const el = document.createElement('header');
  el.className =
    'fixed inset-x-0 top-0 z-[130] hidden px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3 max-[900px]:block';

  el.innerHTML = `
    <div class="mx-auto flex max-w-none items-center justify-between gap-3 border border-[rgba(218,217,223,0.9)] bg-[rgba(250,250,254,0.72)] px-[0.9rem] py-[0.8rem] shadow-[0_10px_30px_rgba(0,0,0,0.04)] backdrop-blur-[18px] max-[420px]:px-3 max-[420px]:py-[0.7rem]">
      <div class="flex min-w-0 items-center gap-3">
        <a class="inline-flex shrink-0 items-center gap-1 rounded-full border border-[rgba(0,122,255,0.14)] bg-[rgba(0,122,255,0.08)] px-[0.8rem] py-[0.55rem] text-[0.78rem] font-semibold whitespace-nowrap text-[#007aff] transition duration-200 ease-in-out hover:-translate-y-px hover:border-[rgba(0,122,255,0.22)] hover:bg-[rgba(0,122,255,0.12)] active:scale-[0.98] max-[420px]:px-[0.72rem] max-[420px]:py-[0.5rem] max-[420px]:text-[0.72rem]" href="#/signup" data-link aria-label="Buat akun baru">
          <svg class="h-[0.95rem] w-[0.95rem] stroke-current fill-none [stroke-width:2] [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5v14"></path>
            <path d="M5 12h14"></path>
          </svg>
          <span>Create Akun</span>
        </a>
        <div class="flex min-w-0 flex-col" aria-label="StudNow">
          <strong class="text-[1.05rem] leading-[1.1] tracking-[-0.02em] text-[#1a1a1a] max-[420px]:text-[0.98rem]">StudNow</strong>
        </div>
      </div>
      <div class="inline-flex items-center gap-[0.45rem] max-[420px]:gap-[0.35rem]" aria-label="Aksi cepat">
        <a class="inline-flex h-[2.35rem] w-[2.35rem] items-center justify-center rounded-full border-0 bg-[rgba(255,255,255,0.8)] text-[#1a1a1a] shadow-[inset_0_0_0_1px_rgba(218,217,223,0.65)] transition duration-200 ease-in-out hover:-translate-y-px hover:shadow-[inset_0_0_0_1px_rgba(0,122,255,0.18)] active:scale-[0.96] max-[420px]:h-[2.1rem] max-[420px]:w-[2.1rem]" href="#/search" data-link aria-label="Cari">
          <svg class="h-4 w-4 stroke-current fill-none [stroke-width:2] [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7"></circle>
            <path d="M20 20l-3.5-3.5"></path>
          </svg>
        </a>
        <a class="inline-flex h-[2.35rem] w-[2.35rem] items-center justify-center rounded-full border-0 bg-[rgba(255,255,255,0.8)] text-[#1a1a1a] shadow-[inset_0_0_0_1px_rgba(218,217,223,0.65)] transition duration-200 ease-in-out hover:-translate-y-px hover:shadow-[inset_0_0_0_1px_rgba(0,122,255,0.18)] active:scale-[0.96] max-[420px]:h-[2.1rem] max-[420px]:w-[2.1rem]" href="#/notifications" data-link aria-label="Notifikasi">
          <svg class="h-4 w-4 stroke-current fill-none [stroke-width:2] [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 17H5l1.5-1.5V11a5.5 5.5 0 0 1 11 0v4.5L19 17h-4"></path>
            <path d="M10 17a2 2 0 0 0 4 0"></path>
          </svg>
        </a>
      </div>
    </div>
  `;

  return el;
}
