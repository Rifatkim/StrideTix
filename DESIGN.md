# StrideTix Design System

## 1. Design Direction

StrideTix menggunakan pendekatan visual **energetic, warm, modern, dan trustworthy**. Identitasnya harus terasa aktif seperti suasana menjelang garis start, tetapi tetap nyaman digunakan untuk proses pencarian event, analisis rekomendasi, dan pembelian tiket.

Arah visual utama:

- Latar dominan putih menuju cream hangat.
- Warna merek utama berupa oranye kemerahan.
- Tipografi tegas, bersih, dan mudah dibaca.
- Sudut komponen membulat tetapi tidak berlebihan.
- Foto menampilkan gerak, lintasan, sepatu, nomor dada, serta suasana event lari.
- Informasi tiket tetap menjadi fokus utama, sedangkan AI tampil sebagai fitur cerdas yang membantu pengguna.

### Kata kunci visual

**Energetic · Warm · Fast · Human · Smart · Reliable**

---

## 2. Warna Utama Merek

### Pilihan utama: Race Orange

**Primary Brand Color:** `#C2410C`

Race Orange dipilih sebagai warna utama sekaligus warna logo StrideTix. Warna ini menggabungkan energi merah dan optimisme oranye sehingga sesuai dengan dunia lari, perlombaan, keberanian memulai, dan dorongan mencapai garis finis.

Warna ini juga membuat StrideTix berbeda dari banyak platform ticketing yang menggunakan biru. Ketika dipadukan dengan putih dan cream, Race Orange tampil hangat, modern, aktif, dan tetap premium.

### Alasan pemilihan

- Memberikan kesan bergerak, cepat, dan penuh energi.
- Relevan dengan suasana race day dan garis start.
- Menonjol pada latar putih maupun cream.
- Tidak terlihat seperti platform perjalanan atau ticketing generik.
- Dapat digunakan sebagai warna logo, tombol utama, status rekomendasi, dan penanda kategori terpilih.
- Cukup gelap untuk digunakan bersama teks putih pada tombol utama.

### Makna merek

> Race Orange merepresentasikan energi saat pelari memulai langkah, keberanian mengambil tantangan, dan semangat untuk mencapai garis finis.

---

## 3. Color Palette

### 3.1 Primary Palette

| Token | Warna | Hex | Penggunaan |
|---|---|---:|---|
| `primary-50` | Soft Orange | `#FFF7ED` | Background label dan area AI |
| `primary-100` | Light Orange | `#FFEDD5` | Hover ringan dan badge |
| `primary-200` | Pale Orange | `#FED7AA` | Border aktif lembut |
| `primary-300` | Warm Orange | `#FDBA74` | Ilustrasi dan dekorasi |
| `primary-400` | Active Orange | `#FB923C` | Grafik dan indikator sekunder |
| `primary-500` | Bright Orange | `#F97316` | Accent dan elemen nonteks |
| `primary-600` | Race Orange | `#EA580C` | Hover tombol utama |
| `primary-700` | Brand Orange | `#C2410C` | Logo dan tombol utama |
| `primary-800` | Burnt Orange | `#9A3412` | Active state dan teks berwarna |
| `primary-900` | Deep Orange | `#7C2D12` | Heading aksen gelap |

**Warna logo utama:** `#C2410C`  
**Warna hover:** `#9A3412`  
**Warna background lembut:** `#FFF7ED`

### 3.2 Neutral dan Background Palette

| Token | Warna | Hex | Penggunaan |
|---|---|---:|---|
| `background-main` | Warm White | `#FFFCF8` | Latar utama halaman |
| `background-soft` | Soft Cream | `#FFF8EE` | Section alternatif |
| `background-muted` | Warm Beige | `#F7EFE3` | Panel, filter, dan sidebar |
| `surface` | Pure White | `#FFFFFF` | Card, modal, navbar |
| `border` | Sand Border | `#E8DDD0` | Border default |
| `border-strong` | Warm Gray | `#CDBEAE` | Border input aktif |
| `text-primary` | Espresso | `#241C17` | Judul dan teks utama |
| `text-secondary` | Warm Gray | `#665C54` | Deskripsi dan metadata |
| `text-muted` | Muted Taupe | `#8C8178` | Placeholder dan caption |

### 3.3 Supporting Colors

Supporting color tidak digunakan sebagai identitas utama. Fungsinya hanya untuk status, grafik, dan informasi khusus.

| Fungsi | Hex | Penggunaan |
|---|---:|---|
| Success | `#18864B` | Pembayaran berhasil, tiket valid |
| Warning | `#B76A00` | Safety warning dan perhatian |
| Error | `#C83232` | Error, tiket tidak valid |
| Information | `#5B4DB7` | Informasi sistem dan bantuan |
| AI Accent | `#7C3AED` | Ikon AI, sparkle, dan chatbot |
| Strava Accent | `#FC4C02` | Tombol atau indikator koneksi Strava |

> AI Accent berwarna ungu digunakan secara terbatas agar fitur AI mudah dikenali tanpa mengambil alih identitas Race Orange milik StrideTix.

---

## 4. Background Treatment

Latar halaman tidak menggunakan cream pada seluruh area karena dapat membuat antarmuka terlihat kusam. Gunakan perpindahan halus antara putih hangat dan cream.

### Struktur yang disarankan

- Navbar dan card: `#FFFFFF`
- Hero section: gradient dari `#FFFCF8` menuju `#FFF4E6`
- Section event: `#FFFCF8`
- Section Smart Recommendation: `#FFF7ED`
- Section testimoni atau informasi: `#FFF8EE`
- Footer: `#241C17`

### Gradient utama

`linear-gradient(135deg, #FFFCF8 0%, #FFF8EE 55%, #FFE8CF 100%)`

Gradient hanya digunakan untuk hero, banner AI, atau area promosi. Card inti tetap menggunakan warna solid agar mudah dibaca.

---

## 5. Logo Direction

### 5.1 Konsep Logo

Logo StrideTix sebaiknya menggabungkan unsur:

- Gerakan langkah atau lintasan lari.
- Bentuk tiket atau potongan tiket.
- Huruf **S** sebagai identitas StrideTix.
- Arah gerak maju menuju garis finis.

### 5.2 Bentuk yang Direkomendasikan

Gunakan simbol tiket dengan potongan kecil pada sisi kiri dan kanan. Di dalamnya terdapat garis melengkung berbentuk huruf **S** yang menyerupai lintasan lari. Ujung lintasan dapat membentuk panah kecil ke arah kanan untuk menandakan progres.

Hindari logo yang terlalu literal seperti menggunakan gambar pelari secara penuh. Logo harus tetap terbaca saat digunakan sebagai favicon, ikon aplikasi, QR ticket header, dan profil media sosial.

### 5.3 Variasi Logo

1. **Primary logo:** simbol Race Orange dan wordmark Espresso pada latar putih.
2. **Monochrome dark:** seluruh logo berwarna `#241C17`.
3. **Reverse logo:** seluruh logo putih pada latar Race Orange.
4. **Icon only:** simbol tiket dengan lintasan berbentuk S.

### 5.4 Wordmark

- Tulis sebagai **StrideTix**, tanpa spasi.
- `Stride` dapat menggunakan warna Espresso.
- `Tix` dapat menggunakan Race Orange untuk menegaskan fungsi ticketing.
- Gunakan bobot font 700 atau 800.

---

## 6. Typography

### Font Utama

**Plus Jakarta Sans**

Digunakan untuk heading, navigation, button, dan body text. Font ini modern, ramah, memiliki bentuk yang cukup dinamis, dan tetap mudah dibaca untuk dashboard maupun halaman ticketing.

### Font Pendukung Opsional

**Bebas Neue** hanya dapat digunakan secara terbatas untuk angka kategori seperti **5K**, **10K**, **21K**, dan **42K**, atau heading kampanye. Jangan gunakan untuk paragraf.

### Type Scale

| Style | Ukuran | Berat | Line Height |
|---|---:|---:|---:|
| Display | 56 px | 800 | 64 px |
| H1 | 44 px | 800 | 52 px |
| H2 | 36 px | 700 | 44 px |
| H3 | 28 px | 700 | 36 px |
| H4 | 22 px | 700 | 30 px |
| Body Large | 18 px | 400 | 30 px |
| Body | 16 px | 400 | 26 px |
| Body Small | 14 px | 400 | 22 px |
| Label | 14 px | 600 | 20 px |
| Caption | 12 px | 500 | 18 px |

Pada mobile, ukuran Display dapat diturunkan menjadi 38–42 px dan H1 menjadi 34–36 px.

---

## 7. Spacing and Layout

Gunakan sistem spacing kelipatan 4 px.

| Token | Nilai |
|---|---:|
| `space-1` | 4 px |
| `space-2` | 8 px |
| `space-3` | 12 px |
| `space-4` | 16 px |
| `space-5` | 20 px |
| `space-6` | 24 px |
| `space-8` | 32 px |
| `space-10` | 40 px |
| `space-12` | 48 px |
| `space-16` | 64 px |
| `space-20` | 80 px |

### Container

- Maksimal lebar konten: 1200–1280 px.
- Padding desktop: 32 px.
- Padding tablet: 24 px.
- Padding mobile: 16 px.
- Grid desktop: 12 kolom.
- Jarak antarkolom: 24 px.

---

## 8. Border Radius and Shadow

### Radius

| Komponen | Radius |
|---|---:|
| Button | 12 px |
| Input | 12 px |
| Event card | 18 px |
| Ticket card | 20 px |
| Modal | 24 px |
| Badge | 999 px |

### Shadow

**Card default:** `0 6px 24px rgba(58, 39, 24, 0.08)`  
**Card hover:** `0 14px 36px rgba(58, 39, 24, 0.14)`  
**Modal:** `0 24px 64px rgba(36, 28, 23, 0.18)`

Shadow menggunakan nuansa cokelat gelap transparan, bukan hitam pekat, agar selaras dengan tema cream.

---

## 9. Component Guidelines

### 9.1 Primary Button

- Background: `#C2410C`
- Text: `#FFFFFF`
- Hover: `#9A3412`
- Active: `#7C2D12`
- Disabled: `#D8C9BC`
- Minimum height: 44 px
- Horizontal padding: 20–24 px
- Radius: 12 px

Contoh label:

- **Cari Event**
- **Beli Tiket**
- **Pilih Kategori**
- **Lihat Rekomendasi Saya**

### 9.2 Secondary Button

- Background: `#FFFFFF`
- Border: `#C2410C`
- Text: `#9A3412`
- Hover background: `#FFF7ED`

### 9.3 Event Card

Event card memuat:

- Gambar dengan rasio 16:9.
- Badge kategori di kiri atas.
- Tanggal event.
- Nama event maksimal dua baris.
- Lokasi.
- Harga mulai.
- Status kuota.
- Tombol melihat detail.

Card bergerak naik 2–4 px saat hover, dengan shadow yang sedikit lebih kuat.

### 9.4 Category Card

Setiap kategori 5K, 10K, Half Marathon, dan Full Marathon ditampilkan sebagai card yang dapat dipilih.

State:

- Default: putih dengan border sand.
- Hover: border orange.
- Selected: background `#FFF7ED` dan border `#C2410C`.
- Recommended: memiliki badge Race Orange bertuliskan **Recommended for You**.
- Above recommendation: menampilkan ikon warning tanpa langsung memblokir pengguna.

### 9.5 AI Recommendation Card

Gunakan kombinasi:

- Background: `#FFF7ED`
- Garis aksen: `#C2410C`
- Ikon AI kecil: `#7C3AED`
- Heading: Espresso
- Confidence indicator: progress bar Race Orange

Urutan informasi:

1. Recommended for You.
2. Kategori jarak.
3. Tingkat kesiapan.
4. Confidence level.
5. Alasan rekomendasi.
6. Ringkasan data Strava.
7. Safety note bila diperlukan.

### 9.6 Safety Warning

- Background: `#FFF4DD`
- Border: `#E3A008`
- Icon dan heading: `#8A4B00`
- Teks utama: `#59422A`

Bahasa warning harus informatif dan tidak menghakimi pengguna.

### 9.7 Status Badge

- Paid / Valid: hijau.
- Pending: amber.
- Cancelled / Invalid: merah.
- Checked-in: ungu gelap.
- Recommended: Race Orange.

Warna tidak boleh menjadi satu-satunya pembeda. Gunakan ikon dan label teks.

### 9.8 Chatbot

- Floating action button menggunakan Race Orange.
- Ikon sparkle kecil menggunakan AI Accent ungu.
- Panel chatbot menggunakan putih dengan header gradient cream-orange.
- Pesan pengguna menggunakan Race Orange dengan teks putih.
- Pesan AI menggunakan cream lembut dengan teks Espresso.
- Tampilkan label **AI Running Assistant** dan catatan bahwa saran bukan diagnosis medis.

---

## 10. Iconography

Gunakan ikon outline dengan ketebalan konsisten 1.75–2 px.

Ikon yang diperlukan:

- Ticket.
- Calendar.
- Map pin.
- Route.
- Timer.
- Activity.
- QR Code.
- Sparkles atau AI.
- Shield check.
- Warning triangle.
- Users.
- Medal.
- Running shoe.

Gunakan ikon filled hanya untuk state terpilih atau notifikasi penting.

---

## 11. Imagery Direction

Foto harus terasa nyata, aktif, dan inklusif tanpa terlalu banyak pose promosi.

Gunakan visual:

- Pelari sedang bergerak di jalan atau lintasan.
- Close-up sepatu, race bib, jam lari, dan garis start.
- Suasana kelompok sebelum atau setelah perlombaan.
- Komposisi dengan cahaya matahari pagi atau golden hour.
- Warna pakaian yang memiliki aksen orange, merah bata, cream, hitam, atau hijau zaitun.

Hindari:

- Foto gym yang tidak relevan dengan event lari.
- Foto dengan dominasi neon berlebihan.
- Gambar yang terlalu gelap.
- Visual stok dengan pose yang terasa tidak alami.
- Penggunaan warna biru sebagai tone dominan.

---

## 12. Motion and Interaction

Animasi harus menunjukkan momentum tanpa mengganggu pembelian tiket.

- Button hover: 150 ms.
- Card hover: 180–220 ms.
- Modal entrance: 220–280 ms.
- Page transition: maksimal 300 ms.
- Loading recommendation dapat berupa garis lintasan yang bergerak maju.
- Keberhasilan pembelian dapat menggunakan animasi garis finis singkat.
- Hindari animasi terus-menerus pada halaman checkout.

---

## 13. Accessibility Rules

- Gunakan `#C2410C` untuk tombol utama dengan teks putih.
- Jangan menggunakan `#F97316` sebagai background untuk teks putih berukuran kecil.
- Teks utama menggunakan `#241C17`, bukan abu-abu muda.
- Informasi error dan warning wajib menggunakan ikon serta teks.
- Focus state harus terlihat jelas menggunakan outline `#C2410C` setebal 2 px.
- Area klik minimum 44 × 44 px.
- Jangan menampilkan teks panjang di atas foto tanpa overlay yang cukup.
- Placeholder bukan pengganti label input.

---

## 14. Page-Level Direction

### 14.1 Homepage

1. Navbar putih.
2. Hero dengan warm gradient, headline kuat, pencarian event, dan visual pelari.
3. Event populer.
4. Penjelasan Smart Distance Recommendation.
5. Tahapan Connect Strava → Analyze → Get Recommendation.
6. Kategori jarak.
7. Event mendatang.
8. CTA untuk organizer.
9. Footer gelap.

### 14.2 Event Detail

- Hero image event.
- Informasi tanggal dan lokasi.
- Deskripsi event.
- Peta atau lokasi.
- Pilihan kategori tiket.
- Recommendation badge pada kategori yang sesuai.
- Ringkasan harga tetap terlihat saat pengguna scroll pada desktop.

### 14.3 Checkout

- Gunakan latar `#FFFCF8`.
- Form berada di card putih.
- Order summary berada di sisi kanan pada desktop.
- Hindari dekorasi besar.
- Tombol pembayaran menggunakan Race Orange.
- Tampilkan progress step: Data Peserta → Pembayaran → E-Ticket.

### 14.4 User Dashboard

- Sidebar putih atau cream lembut.
- Tiket aktif menjadi konten utama.
- Ringkasan Strava dan rekomendasi ditampilkan dalam card terpisah.
- Gunakan orange untuk CTA, bukan untuk seluruh sidebar.

### 14.5 Organizer dan Admin Dashboard

- Dominan putih dan neutral.
- Race Orange hanya untuk active state dan tindakan utama.
- Grafik dapat menggunakan orange, ungu, hijau, dan amber.
- Tabel menggunakan border lembut dan zebra row cream yang sangat tipis.

---

## 15. Design Tokens

~~~css
:root {
  --color-primary-50: #fff7ed;
  --color-primary-100: #ffedd5;
  --color-primary-200: #fed7aa;
  --color-primary-300: #fdba74;
  --color-primary-400: #fb923c;
  --color-primary-500: #f97316;
  --color-primary-600: #ea580c;
  --color-primary-700: #c2410c;
  --color-primary-800: #9a3412;
  --color-primary-900: #7c2d12;

  --color-background-main: #fffcf8;
  --color-background-soft: #fff8ee;
  --color-background-muted: #f7efe3;
  --color-surface: #ffffff;

  --color-text-primary: #241c17;
  --color-text-secondary: #665c54;
  --color-text-muted: #8c8178;

  --color-border: #e8ddd0;
  --color-border-strong: #cdbeae;

  --color-success: #18864b;
  --color-warning: #b76a00;
  --color-error: #c83232;
  --color-info: #5b4db7;
  --color-ai: #7c3aed;

  --radius-button: 12px;
  --radius-input: 12px;
  --radius-card: 18px;
  --radius-modal: 24px;

  --shadow-card: 0 6px 24px rgba(58, 39, 24, 0.08);
  --shadow-card-hover: 0 14px 36px rgba(58, 39, 24, 0.14);
}
~~~

---

## 16. Final Brand Recommendation

### Brand combination

- **Nama:** StrideTix
- **Primary color:** Race Orange `#C2410C`
- **Main background:** Warm White `#FFFCF8`
- **Secondary background:** Soft Cream `#FFF8EE`
- **Main text:** Espresso `#241C17`
- **AI accent:** Electric Purple `#7C3AED`
- **Primary font:** Plus Jakarta Sans
- **Visual style:** energetic, warm, modern, dan trustworthy

### Ringkasan keputusan

Race Orange menjadi pilihan paling sesuai karena memberikan kesan energi dan kecepatan, tetapi tetap terasa matang saat dipasangkan dengan warna cream. Logo tidak perlu menggunakan banyak warna. Gunakan Race Orange sebagai warna simbol utama, Espresso untuk wordmark, dan ungu hanya sebagai aksen kecil pada fitur AI.

Dengan kombinasi tersebut, StrideTix akan terlihat berbeda dari platform ticketing biru, tetap relevan dengan dunia lari, dan tidak kehilangan kesan aman saat digunakan untuk transaksi.
