# StudNow Design System

Desain sistem yang terinspirasi dari pendekatan Apple — fokus pada kesederhanaan, hierarki visual yang bersih, dan fungsionalitas yang elegan. Menggunakan Bootstrap Icons untuk semua ikon aplikasi.

## Color Palette

### Brand Colors
- **Primary (Blue):** `#007AFF` (System Blue) — tombol utama, state navigasi aktif, indikator progress.
- **Surface:** `#FAFAFE` — latar belakang utama (off-white).
- **Surface Dim:** `#DAD9DF` — border subtle dan background sekunder.
- **Surface Container:** `#FFFFFF` — putih murni untuk kartu dan permukaan yang terangkat.

### Functional Colors
- **Success:** `#34C759` — indikator status aktif, langkah selesai.
- **Error/Destructive:** `#FF3B30` — aksi logout, alert kritis.
- **Text Primary:** `#1A1A1A` — heading dan body utama.
- **Text Secondary (Muted):** `#6B7280` — caption, label, pratinjau pesan.
- **Accent Alt:** `#5856D6` — aksen sekunder (filter aktif, tag).
- **Surface Hover:** `#E5E5EA` — divider, batas elemen.

## Typography

- **Primary Font:** Inter (sans-serif, di-load via Google Fonts).
- **Headings:** Bold/ExtraBold, `tracking-tight` (`-0.02em`) untuk judul halaman dan section headers.
- **Body:** Regular/Medium untuk keterbacaan.
- **Labels:** Semibold, skala kecil (0.7–0.85rem) untuk navigasi dan status tags.

## Layout & Spacing

- **Border Radius:**
  - 8px (`0.5rem`) — komponen kecil dan tags.
  - 20px (`1.25rem`) — tombol hero, chat bubbles.
  - 32px (`2rem`) — container utama, modal, section profile.
- **Margins:** `container` class (lebar maksimum 1200px, padding 2rem di desktop).
- **Elevation:** Shadow halus (`box-shadow: 0 2px 8px rgba(0,0,0,0.04)`) untuk mendefinisikan kedalaman tanpa garis keras.
- **Gap:** CSS `gap` utility; jarak antar kartu umumnya 1rem–1.5rem.

## Components & Patterns

### Glassmorphism
- Tidak digunakan di versi saat ini. Navigasi menggunakan background solid dengan border-bottom tipis.

### Navigasi Desktop (Navbar)
- Layout: logo kiri, link navigasi tengah, auth right.
- Border-bottom tipis (`1px solid var(--surface-hover)`).
- Auth state: tombol "Login" diganti dengan nama user (link ke `/profile`) saat terautentikasi.
- Sembunyi di halaman auth (`/login`, `/signup`).

### Navigasi Mobile
- **Top Bar:** Logo StudNow kiri, link "Create"/nama user kanan, border-bottom tipis.
- **Bottom Bar:** 4 tab (Explore, Groups, Chat, Profil) dengan ikon Bootstrap Icons dan indikator aktif berbentuk pill. Sembunyi di halaman auth.
- Router melepas `route-change` event; bottom-bar mendengarnya untuk update state aktif.

### Hero Card (Search Page)
- Satu kartu terpadu berisi eyebrow, judul, deskripsi, dan search bar.
- Search bar: input tinggi (`3.6rem`), border tebal, ikon accent, focus glow ring.
- Filter pills di bawah search bar (Semua/Forum/Grup/Kursus).

### Auth Pages (Login/Signup)
- Layout dua kolom desktop: visual (glow + orb) di kiri, form panel di kanan.
- Social buttons (Apple, Google, Facebook) menggunakan inline SVG (brand icons — dikecualikan dari aturan Bootstrap Icons).
- Transisi antar halaman login/signup dengan animasi slide.
- Validasi real-time dengan error display.

### Detail / Open Pages
- `Detail`: halaman penuh dengan jadwal, informasi pertemuan (online/offline), partisipan, dan forum card.
- `Open`: versi ringkas dengan informasi pertemuan, partisipan, dan tombol gabung.
- Progress bar partisipan, status online/offline.

### Profile Page (Desktop)
- Avatar (initial), nama, email.
- Learning Interests (CRUD dengan localStorage).
- Menu: Edit Profil, My QR Code, Pengaturan, Bantuan.
- Logout button.

### Profile Page (Mobile)
- Cover dengan grid dan ring dekoratif, avatar besar, stats (Postingan/Mengikuti/Badge).
- Learning Interests, menu pengaturan, logout.

### Cards
- **Forum Card (Home):** Header (status badge + title), deskripsi, footer (member count + action button).
- **Group Card (Groups):** Department tag, status (Populer/Aktif/Kurang Aktif), progress bar anggota.
- **Result Card (Search):** Type tag, title (dengan highlight), deskripsi, tags, metadata.

### Interaction States
- Buttons: `cursor: pointer`, `transition` halus, `active:scale` pada beberapa tombol.
- Focus: ring `box-shadow` pada input (search bar, form fields).
- Filter pills: background solid saat aktif, subtle saat non-aktif.

## Ikon

Semua ikon aplikasi menggunakan **Bootstrap Icons v1.11.3** (CDN) — berupa elemen `<i class="bi bi-{nama}">`. Pengecualian:
- Social brand icons (Apple, Google, Facebook) pada halaman login/signup — inline SVG.
- Logo StudNow di navbar dan top-bar — inline SVG.
- Emoji characters **tidak boleh** digunakan.

## Data-Driven Pages

- Semua konten halaman di-load dari file JSON di `/data/`.
- Format data konsisten: home (forums + mobile subset), detail (array kursus), groups, search (copy only), dsb.
- Desktop dan mobile berbagi data JSON yang sama; properti `mobile` digunakan untuk data yang berbeda (mis. daftar forum yang lebih pendek di mobile).
- Search engine mengindeks data dari home, groups, dan detail saat inisialisasi.

## Responsive Breakpoint

- **Desktop:** ≥901px — route table desktop, komponen navbar + footer.
- **Mobile:** ≤900px — route table mobile (override desktop), komponen top-bar + bottom-bar.
- Router otomatis merespon resize dan mengganti halaman jika melewati breakpoint.
