# Product Requirements Document (PRD)
## StrideTix: Platform E-Ticket Event Lari dengan Smart Distance Recommendation

**Versi Dokumen:** 1.0  
**Status:** Draft Awal untuk Analisis dan Perancangan  
**Metode Pengembangan:** Waterfall  
**Jenis Aplikasi:** Web-Based Application  
**Nama Produk:** StrideTix  
**Tagline:** *Every Stride Leads to a Race*

> **Catatan:** PRD ini mendokumentasikan kebutuhan produk StrideTix. Mengingat pendaftaran API pihak ketiga tertentu (seperti Strava API v3) kini menerapkan skema berbayar (Strava Subscriber), arsitektur integrasi data aktivitas lari pada MVP difokuskan pada **Universal Fitness Sync** (Upload GPX/CSV dari smartwatch/aplikasi lari, Formulir Penilaian Mandiri Cepat, dan Simulasi Persona Pelari) dengan opsi Strava sebagai penyedia eksternal opsional/legacy.

---

## 1. Executive Summary

**StrideTix** merupakan platform berbasis web untuk pencarian, pendaftaran, pembelian, dan pengelolaan e-ticket event lari. Platform ini menyediakan fungsi ticketing seperti pencarian event, pemilihan kategori lomba, pemesanan tiket, pembayaran, penerbitan tiket digital berbentuk QR Code, dan validasi tiket ketika peserta melakukan check-in.

Pembeda utama StrideTix dibandingkan platform ticketing umum adalah fitur **Smart Distance Recommendation**. Fitur ini membantu pengguna menentukan kategori jarak lari yang paling sesuai, seperti 5K, 10K, Half Marathon, atau Full Marathon, berdasarkan riwayat aktivitas lari pengguna melalui **Universal Fitness Sync** (Upload file GPX/CSV aktivitas lari dari Garmin/Coros/Apple Watch/Strava, Formulir Penilaian Mandiri Cepat, atau Preset Persona Simulator).

Sistem mengambil data latihan yang relevan, seperti jarak rata-rata, long run terpanjang, frekuensi latihan, pace, dan konsistensi latihan. Data tersebut diolah oleh sistem rekomendasi untuk menghasilkan:

- Kategori jarak yang direkomendasikan.
- Tingkat kesiapan pengguna.
- Ringkasan alasan rekomendasi.
- Indikator keyakinan rekomendasi.
- Peringatan jika pengguna memilih jarak di atas rekomendasi.

StrideTix juga menyediakan **AI Running Assistant** yang dapat memberikan saran umum tentang persiapan lomba, latihan, hidrasi, pemulihan, perlengkapan, dan checklist sebelum event.

Sistem memiliki tiga peran utama:

1. **Runner/User**
2. **Event Organizer**
3. **Administrator**

Dalam konteks tugas akhir, pengembangan difokuskan pada versi **Minimum Viable Product atau MVP** dengan alur ticketing lengkap, sinkronisasi data aktivitas lari serbaguna, rekomendasi jarak, chatbot, serta dashboard pengelolaan dasar.

---

## 2. Problem Statement

Platform ticketing event pada umumnya berfokus pada proses pencarian event dan penjualan tiket. Pengguna dapat memilih kategori lomba secara bebas, tetapi tidak memperoleh bantuan untuk mengetahui apakah kategori tersebut sesuai dengan kemampuan fisik dan riwayat latihannya.

Masalah yang ditemukan meliputi:

1. Pelari pemula belum memahami perbedaan tingkat kesiapan untuk kategori 5K, 10K, Half Marathon, dan Full Marathon.
2. Pengguna dapat memilih kategori yang terlalu jauh dibandingkan kemampuan dan pengalaman latihannya.
3. Pemilihan kategori yang terlalu berat dapat meningkatkan kemungkinan gagal menyelesaikan perlombaan dan risiko masalah selama latihan atau perlombaan.
4. Pengguna terkadang memilih kategori yang terlalu ringan meskipun memiliki kapasitas untuk mengikuti jarak yang lebih menantang.
5. Platform ticketing belum memanfaatkan data aktivitas olahraga pengguna untuk membantu proses pemilihan kategori.
6. Event organizer tidak memperoleh informasi tambahan mengenai kesesuaian kategori yang dipilih peserta.
7. Informasi dan saran persiapan lomba biasanya tersebar di berbagai sumber dan tidak terintegrasi dengan sistem ticketing.

Berdasarkan permasalahan tersebut, diperlukan sebuah platform e-ticket event lari yang tidak hanya menangani transaksi tiket, tetapi juga membantu pengguna membuat keputusan yang lebih terarah berdasarkan aktivitas latihannya.

---

## 3. Product Vision

> Menjadi platform e-ticket event lari yang membantu setiap pelari menemukan, memilih, dan mengikuti kategori perlombaan yang sesuai berdasarkan riwayat latihan dan tingkat kesiapannya.

StrideTix menggabungkan proses ticketing dengan analisis data aktivitas lari sehingga perjalanan pengguna tidak berhenti pada pembelian tiket. Sistem juga membantu pengguna memahami kesiapan dirinya sebelum memilih kategori event.

---

## 4. Business Goals

### 4.1 Tujuan Bisnis Utama

1. Menyediakan platform khusus untuk pemesanan tiket event lari.
2. Meningkatkan ketepatan pemilihan kategori perlombaan oleh peserta.
3. Memberikan nilai tambah kepada event organizer melalui fitur ticketing dan pengelolaan peserta terintegrasi.
4. Meningkatkan kepercayaan pengguna melalui rekomendasi yang memiliki penjelasan.
5. Memudahkan pengguna menghubungkan atau memasukkan data aktivitas lari melalui Universal Fitness Sync (GPX, CSV, atau formulir mandiri).
6. Mengurangi hambatan dalam proses registrasi dan validasi peserta event.
7. Membangun diferensiasi produk melalui fitur rekomendasi kategori jarak.

### 4.2 Nilai Bisnis

Sumber nilai bisnis yang dapat dikembangkan pada masa mendatang meliputi:

- Biaya layanan pada setiap transaksi tiket.
- Biaya publikasi event dari organizer.
- Paket premium untuk organizer.
- Promosi event berbayar.
- Fitur rekomendasi dan analisis latihan premium.
- Kerja sama dengan komunitas lari dan penyelenggara event.

Monetisasi tersebut tidak harus diterapkan pada MVP tugas akhir.

---

## 5. Product Goals

### 5.1 Tujuan Produk

StrideTix dirancang untuk:

1. Memudahkan pengguna menemukan event lari.
2. Menyediakan informasi event dan kategori tiket secara jelas.
3. Memungkinkan pengguna membeli tiket secara daring.
4. Menghasilkan e-ticket unik yang dilengkapi QR Code.
5. Memungkinkan organizer memvalidasi tiket peserta.
6. Mengintegrasikan data aktivitas lari melalui Universal Fitness Sync (GPX/CSV/Manual Assessment).
7. Menghasilkan rekomendasi kategori jarak berdasarkan indikator latihan.
8. Menyampaikan rekomendasi secara transparan dan mudah dipahami.
9. Memberikan peringatan apabila pengguna memilih kategori di atas rekomendasi.
10. Menyediakan chatbot untuk memberikan saran umum tentang latihan dan persiapan event.

### 5.2 Tujuan Akademik

Dalam konteks tugas akhir, proyek ini bertujuan menghasilkan:

- Analisis kebutuhan sistem.
- Pemodelan proses bisnis.
- Perancangan antarmuka pengguna.
- Perancangan basis data.
- UML, seperti use case diagram, activity diagram, sequence diagram, dan class diagram.
- Implementasi frontend dan backend.
- Integrasi API eksternal.
- Implementasi kecerdasan buatan.
- Pengujian fungsional dan nonfungsional.
- Dokumentasi menggunakan pendekatan Waterfall.

---

## 6. Success Metrics atau KPI

Karena sistem dikembangkan sebagai tugas akhir, KPI dapat dibagi menjadi KPI produk dan KPI pengujian.

### 6.1 KPI Produk

| KPI | Target MVP |
|---|---:|
| Tingkat keberhasilan registrasi akun | ≥ 95% |
| Tingkat keberhasilan login | ≥ 95% |
| Tingkat keberhasilan sinkronisasi kebugaran (GPX/CSV/Manual) | ≥ 95% pada skenario pengujian |
| Tingkat akurasi ekstraksi aktivitas lari | ≥ 90% pada dataset uji |
| Waktu menghasilkan rekomendasi | Maksimal 10 detik |
| Tingkat keberhasilan pemesanan tiket | ≥ 95% |
| Tingkat keberhasilan pembuatan QR Code | 100% pada transaksi berhasil |
| Tingkat keberhasilan validasi QR Code | ≥ 95% |
| Waktu muat halaman utama | Maksimal 3 detik pada kondisi pengujian normal |
| Tingkat penyelesaian alur pemesanan | ≥ 80% responden pengujian usability |
| Skor kepuasan pengguna | Minimal 4 dari 5 |

### 6.2 KPI Rekomendasi

| KPI | Target MVP |
|---|---:|
| Rekomendasi memiliki kategori jarak | 100% jika data mencukupi |
| Rekomendasi memiliki alasan | 100% |
| Rekomendasi memiliki tingkat kesiapan | 100% |
| Rekomendasi memiliki confidence level | 100% |
| Peringatan muncul untuk kategori di atas rekomendasi | 100% |
| Sistem mendeteksi data tidak mencukupi | 100% pada skenario uji |
| Pengguna dapat melihat data yang digunakan | 100% |

Target tersebut merupakan target teknis untuk pengujian proyek dan bukan klaim efektivitas medis.

---

## 7. Target Users dan Persona

### 7.1 Runner Pemula

**Karakteristik:**

- Baru mulai rutin berlari.
- Memiliki pengalaman event yang terbatas.
- Belum memahami kategori jarak yang sesuai.
- Mencari panduan sederhana dan mudah dipahami.
- Mungkin baru mulai merekam aktivitas lari atau belum memiliki riwayat lari yang panjang.

**Kebutuhan:**

- Event ramah pemula.
- Penjelasan setiap kategori jarak.
- Rekomendasi berdasarkan aktivitas.
- Peringatan jika kategori terlalu berat.
- Saran persiapan sebelum event.

**Tujuan:** Mendaftar event pertama dengan kategori yang realistis.

### 7.2 Runner Aktif

**Karakteristik:**

- Berlari beberapa kali dalam seminggu.
- Memiliki riwayat aktivitas yang relatif lengkap.
- Pernah mengikuti event lari.
- Memiliki target peningkatan jarak atau performa.

**Kebutuhan:**

- Rekomendasi kategori yang menantang tetapi masih realistis.
- Ringkasan tren latihan.
- Estimasi kesiapan berdasarkan data terbaru.
- Saran persiapan menuju event berikutnya.

**Tujuan:** Menemukan perlombaan yang sesuai dengan perkembangan latihan.

### 7.3 Event Organizer

**Karakteristik:**

- Menyelenggarakan event lari.
- Membutuhkan sistem pendaftaran dan ticketing.
- Mengelola beberapa kategori tiket.
- Membutuhkan data peserta dan validasi tiket.

**Kebutuhan:**

- Membuat event.
- Menambahkan kategori dan kuota.
- Melihat transaksi.
- Melihat daftar peserta.
- Memvalidasi QR Code.
- Melihat statistik penjualan.

**Tujuan:** Mengelola pendaftaran peserta secara terpusat dan efisien.

### 7.4 Administrator

**Karakteristik:**

- Mengelola operasional keseluruhan sistem.
- Memastikan data pengguna, organizer, dan event sesuai ketentuan.
- Memantau transaksi dan penggunaan fitur rekomendasi.

**Kebutuhan:**

- Mengelola pengguna.
- Memverifikasi organizer.
- Memoderasi event.
- Memantau transaksi.
- Melihat log rekomendasi.
- Menangani laporan dan masalah sistem.

**Tujuan:** Menjaga keamanan, konsistensi, dan kelancaran operasional StrideTix.

---

## 8. User Journey

### 8.1 Journey Runner dengan Universal Fitness Sync

1. Pengguna membuka StrideTix.
2. Pengguna melihat daftar event tanpa harus login.
3. Pengguna memilih salah satu event.
4. Pengguna membuka detail event.
5. Pengguna melakukan registrasi atau login.
6. Pengguna membuka fitur **Universal Fitness Sync** pada dashboard atau halaman rekomendasi.
7. Pengguna memilih metode input: upload file aktivitas GPX/CSV, mengisi Formulir Penilaian Mandiri Cepat, atau memilih Preset Persona Simulator.
8. Sistem memproses data aktivitas lari dalam periode analisis (4–8 minggu terakhir).
9. Sistem menghitung indikator aktivitas: jarak rata-rata, long run terjauh, frekuensi mingguan, pace, dan konsistensi.
10. Rule-Based Scoring Engine menentukan kategori jarak rekomendasi (5K, 10K, Half Marathon, Full Marathon).
11. LLM Explanation Layer menghasilkan narasi penjelasan rekomendasi dan catatan keselamatan.
12. Pengguna melihat lencana **Recommended for You** pada kategori event.
13. Pengguna memilih kategori tiket.
14. Jika kategori berada di atas rekomendasi, sistem menampilkan safety warning.
15. Pengguna mengisi data peserta.
16. Pengguna membuat pesanan dan melakukan pembayaran.
17. Sistem menerbitkan e-ticket dan QR Code.
18. Pengguna menunjukkan QR Code saat check-in.
19. Organizer memindai QR Code.
20. Sistem mengubah status tiket menjadi sudah digunakan.

### 8.2 Journey Runner tanpa Sinkronisasi Kebugaran

1. Pengguna melihat event.
2. Pengguna memilih event dan kategori.
3. Sistem menawarkan opsi pengisian data kebugaran mandiri atau upload file lari.
4. Pengguna memilih untuk melewati proses tersebut.
5. Pengguna tetap dapat membeli tiket.
6. Sistem tidak menampilkan rekomendasi personal (menampilkan kategori 5K sebagai opsi aman atau status Insufficient Data).
7. Sistem dapat menampilkan informasi umum mengenai kategori jarak.
8. Pengguna menyelesaikan pembayaran.
9. Sistem menerbitkan e-ticket.

Sinkronisasi kebugaran bersifat **opsional**, bukan syarat wajib untuk membeli tiket.

### 8.3 Journey Organizer

1. Organizer melakukan registrasi.
2. Admin melakukan verifikasi organizer.
3. Organizer login ke dashboard.
4. Organizer membuat event.
5. Organizer menetapkan kategori, harga, kuota, dan jadwal.
6. Organizer mengirim event untuk ditinjau.
7. Admin menyetujui atau menolak event.
8. Event yang disetujui ditampilkan kepada pengguna.
9. Organizer memantau penjualan.
10. Organizer melihat data peserta.
11. Organizer memvalidasi QR Code saat event.
12. Organizer melihat laporan pelaksanaan event.

---

## 9. User Stories dan Acceptance Criteria

### 9.1 Runner/User

#### US-01: Registrasi akun

**User story:**

> Sebagai pengguna, saya ingin membuat akun agar dapat membeli dan menyimpan tiket event.

**Acceptance criteria:**

- Pengguna dapat mengisi nama, email, password, dan konfirmasi password.
- Sistem memvalidasi format email.
- Sistem menolak email yang sudah terdaftar.
- Sistem memvalidasi ketentuan kekuatan password.
- Password disimpan dalam bentuk hash.
- Sistem memberikan informasi ketika registrasi berhasil atau gagal.

#### US-02: Login

**User story:**

> Sebagai pengguna terdaftar, saya ingin login agar dapat mengakses profil dan tiket saya.

**Acceptance criteria:**

- Pengguna dapat login menggunakan email dan password.
- Sistem menolak kredensial yang salah.
- Sistem mengarahkan pengguna ke dashboard setelah login.
- Sistem menyediakan fungsi logout.
- Sistem membatasi percobaan login berulang.

#### US-03: Mencari event

**User story:**

> Sebagai pelari, saya ingin mencari event berdasarkan lokasi, tanggal, dan kategori agar dapat menemukan event yang relevan.

**Acceptance criteria:**

- Sistem menampilkan event aktif.
- Pengguna dapat mencari berdasarkan nama event.
- Pengguna dapat memfilter berdasarkan lokasi.
- Pengguna dapat memfilter berdasarkan tanggal.
- Pengguna dapat memfilter berdasarkan kategori jarak.
- Sistem menampilkan kondisi kosong jika event tidak ditemukan.

#### US-04: Melihat detail event

**User story:**

> Sebagai pelari, saya ingin melihat informasi lengkap event sebelum membeli tiket.

**Acceptance criteria:**

- Sistem menampilkan nama, organizer, lokasi, tanggal, waktu, dan deskripsi event.
- Sistem menampilkan kategori jarak.
- Sistem menampilkan harga dan sisa kuota.
- Sistem menampilkan batas waktu penjualan.
- Sistem menampilkan syarat dan ketentuan.
- Sistem menampilkan tombol pembelian jika tiket masih tersedia.

#### US-05: Sinkronisasi Aktivitas Lari (Universal Fitness Sync)

**User story:**

> Sebagai pengguna, saya ingin menyinkronkan data aktivitas lari saya (melalui upload file GPX/CSV, formulir mandiri, atau simulasi profil) agar StrideTix dapat menganalisis kapasitas fisik dan riwayat latihan saya.

**Acceptance criteria:**

- Pengguna dapat memilih metode sinkronisasi kebugaran: Upload File GPX/CSV, Formulir Penilaian Mandiri Cepat, atau Preset Persona Simulator.
- Sistem dapat mem-parse file GPX/CSV dan mengekstrak metrik jarak, waktu bergerak, pace, dan tanggal aktivitas.
- Sistem memungkinkan pengguna mengisi formulir mandiri (jarak long run terjauh, frekuensi mingguan, dan rata-rata pace).
- Sistem memvalidasi kelengkapan data sebelum dihitung oleh Scoring Engine.
- Pengguna dapat memperbarui atau mereset data kebugaran kapan saja.
- Sistem menampilkan status keberhasilan, sumber sinkronisasi, dan waktu sinkronisasi terakhir.

#### US-06: Mendapatkan rekomendasi jarak

**User story:**

> Sebagai pelari, saya ingin memperoleh rekomendasi kategori berdasarkan latihan agar dapat memilih jarak secara lebih terarah.

**Acceptance criteria:**

- Sistem mengambil aktivitas lari dalam periode analisis yang ditentukan.
- Sistem menghitung indikator jarak, pace, frekuensi, long run, dan konsistensi.
- Sistem memeriksa apakah data mencukupi.
- Sistem menghasilkan satu kategori rekomendasi utama.
- Sistem menampilkan tingkat kesiapan.
- Sistem menampilkan ringkasan alasan.
- Sistem menampilkan confidence level.
- Sistem menampilkan waktu terakhir rekomendasi diperbarui.

#### US-07: Mendapatkan safety warning

**User story:**

> Sebagai pengguna, saya ingin mendapatkan peringatan ketika memilih kategori di atas rekomendasi agar memahami konsekuensi keputusan tersebut.

**Acceptance criteria:**

- Peringatan muncul ketika kategori yang dipilih berada di atas kategori rekomendasi.
- Peringatan menjelaskan alasan secara singkat.
- Peringatan tidak membuat diagnosis medis.
- Pengguna tetap dapat melanjutkan jika kebijakan produk mengizinkan.
- Pengguna harus menyatakan telah memahami peringatan.
- Persetujuan pengguna dicatat dalam sistem.

#### US-08: Membeli tiket

**User story:**

> Sebagai pengguna, saya ingin membeli tiket agar dapat mengikuti event.

**Acceptance criteria:**

- Pengguna dapat memilih kategori yang masih tersedia.
- Sistem menghitung total pembayaran.
- Pengguna dapat mengisi data peserta.
- Sistem meminta persetujuan terhadap syarat dan ketentuan.
- Sistem membuat kode pesanan unik.
- Status pesanan berubah sesuai hasil pembayaran.
- Kuota berkurang hanya setelah pembayaran berhasil atau sesuai aturan reservasi.

#### US-09: Melihat e-ticket

**User story:**

> Sebagai peserta, saya ingin melihat tiket digital agar dapat menggunakannya ketika check-in.

**Acceptance criteria:**

- E-ticket hanya dibuat untuk transaksi berhasil.
- E-ticket memiliki nomor unik.
- E-ticket memiliki QR Code.
- E-ticket menampilkan identitas event, kategori, peserta, dan tanggal.
- Pengguna dapat mengakses tiket dari riwayat pemesanan.
- QR Code tidak menampilkan data sensitif secara langsung.

#### US-10: Menggunakan chatbot

**User story:**

> Sebagai pelari, saya ingin bertanya kepada chatbot agar mendapatkan panduan umum tentang latihan dan persiapan event.

**Acceptance criteria:**

- Pengguna dapat mengirim pesan melalui antarmuka obrolan.
- Chatbot dapat memanfaatkan profil dan ringkasan aktivitas jika pengguna mengizinkan.
- Chatbot dapat menjawab pertanyaan umum tentang persiapan lomba.
- Chatbot menyatakan keterbatasannya.
- Chatbot tidak memberikan diagnosis medis.
- Untuk keluhan fisik serius, chatbot mengarahkan pengguna mencari bantuan profesional.
- Riwayat percakapan dapat dihapus oleh pengguna.

### 9.2 Event Organizer

#### US-11: Membuat event

**User story:**

> Sebagai organizer, saya ingin membuat event agar tiket dapat dijual melalui StrideTix.

**Acceptance criteria:**

- Organizer dapat mengisi nama, deskripsi, lokasi, tanggal, dan waktu event.
- Organizer dapat mengunggah gambar event.
- Organizer dapat menambahkan kategori lomba.
- Organizer dapat menentukan harga dan kuota.
- Organizer dapat menyimpan event sebagai draft.
- Organizer dapat mengirim event untuk ditinjau admin.

#### US-12: Mengelola kategori tiket

**User story:**

> Sebagai organizer, saya ingin mengelola kategori tiket agar setiap jarak memiliki harga dan kuota yang sesuai.

**Acceptance criteria:**

- Organizer dapat menambahkan kategori 5K, 10K, Half Marathon, dan Full Marathon.
- Organizer dapat menggunakan kategori khusus jika diizinkan.
- Organizer dapat menentukan harga.
- Organizer dapat menentukan kuota.
- Organizer dapat menentukan periode penjualan.
- Sistem tidak mengizinkan kuota bernilai negatif.

#### US-13: Memvalidasi tiket

**User story:**

> Sebagai organizer, saya ingin memindai QR Code agar tiket dapat diverifikasi saat check-in.

**Acceptance criteria:**

- Organizer dapat memindai QR Code.
- Sistem memeriksa keaslian tiket.
- Sistem menampilkan identitas peserta secara terbatas.
- Sistem menolak tiket yang tidak valid.
- Sistem menolak tiket yang sudah digunakan.
- Sistem mencatat waktu dan petugas check-in.

### 9.3 Administrator

#### US-14: Verifikasi organizer

**User story:**

> Sebagai admin, saya ingin memverifikasi organizer agar hanya penyelenggara yang valid dapat menerbitkan event.

**Acceptance criteria:**

- Admin dapat melihat permohonan organizer.
- Admin dapat melihat dokumen atau data pendukung.
- Admin dapat menyetujui atau menolak permohonan.
- Admin dapat memberikan alasan penolakan.
- Sistem menyimpan riwayat verifikasi.

#### US-15: Moderasi event

**User story:**

> Sebagai admin, saya ingin meninjau event agar informasi yang dipublikasikan memenuhi ketentuan platform.

**Acceptance criteria:**

- Admin dapat melihat event berstatus menunggu.
- Admin dapat menyetujui, menolak, atau meminta revisi.
- Admin dapat menambahkan catatan.
- Hanya event disetujui yang dapat dipublikasikan.
- Perubahan status tercatat dalam audit log.

---

## 10. Functional Requirements

### 10.1 Autentikasi dan Pengguna

- **FR-AUTH-01:** Sistem harus menyediakan registrasi akun.
- **FR-AUTH-02:** Sistem harus menyediakan login dan logout.
- **FR-AUTH-03:** Sistem harus menerapkan hak akses berdasarkan peran.
- **FR-AUTH-04:** Sistem harus memungkinkan pengguna memperbarui profil.
- **FR-AUTH-05:** Sistem harus menyediakan reset password.
- **FR-AUTH-06:** Sistem harus mencatat waktu login terakhir.
- **FR-AUTH-07:** Sistem harus membatasi akses dashboard berdasarkan role.

### 10.2 Event Discovery

- **FR-EVT-01:** Sistem harus menampilkan event aktif.
- **FR-EVT-02:** Sistem harus menyediakan pencarian event.
- **FR-EVT-03:** Sistem harus menyediakan filter lokasi.
- **FR-EVT-04:** Sistem harus menyediakan filter tanggal.
- **FR-EVT-05:** Sistem harus menyediakan filter kategori jarak.
- **FR-EVT-06:** Sistem harus menampilkan detail event.
- **FR-EVT-07:** Sistem harus menampilkan ketersediaan tiket.
- **FR-EVT-08:** Sistem harus menyembunyikan event yang dihapus atau tidak disetujui.

### 10.3 Ticketing

- **FR-TIX-01:** Sistem harus memungkinkan pengguna memilih kategori tiket.
- **FR-TIX-02:** Sistem harus melakukan validasi kuota.
- **FR-TIX-03:** Sistem harus membuat pesanan unik.
- **FR-TIX-04:** Sistem harus menghitung total pembayaran.
- **FR-TIX-05:** Sistem harus mencatat status pembayaran.
- **FR-TIX-06:** Sistem harus menerbitkan e-ticket setelah pembayaran berhasil.
- **FR-TIX-07:** Sistem harus membuat QR Code unik.
- **FR-TIX-08:** Sistem harus menyimpan riwayat tiket.
- **FR-TIX-09:** Sistem harus mendukung pembatalan sesuai kebijakan.
- **FR-TIX-10:** Sistem harus mencegah penggunaan tiket lebih dari satu kali.

### 10.4 Universal Fitness Sync

- **FR-FIT-01:** Sistem harus menyediakan metode sinkronisasi kebugaran serbaguna (Upload GPX/CSV, Formulir Penilaian Mandiri, Preset Persona Simulator).
- **FR-FIT-02:** Sistem harus dapat mem-parse file GPX dan CSV untuk mengekstrak metrik aktivitas lari (jarak, moving time, pace, tanggal).
- **FR-FIT-03:** Sistem harus menyediakan formulir penilaian mandiri cepat bagi pengguna yang tidak memiliki file rekaman jam olahraga.
- **FR-FIT-04:** Sistem harus menyediakan simulasi persona pelari untuk demonstrasi dan evaluasi kesiapan sistem (Pemula 5K, Rekreasi 10K, Half Marathoner, Marathoner).
- **FR-FIT-05:** Sistem harus memvalidasi integritas data dan memisahkan aktivitas lari dari aktivitas olahraga lain.
- **FR-FIT-06:** Sistem harus menyimpan ringkasan metrik latihan turunan ke basis data pengguna (`user_fitness_sync` dan `runner_profiles`).
- **FR-FIT-07:** Sistem harus menampilkan sumber sinkronisasi, jumlah sesi aktivitas, dan waktu sinkronisasi terakhir.
- **FR-FIT-08:** Sistem harus memungkinkan pengguna mereset atau memperbarui data kebugaran kapan saja secara mandiri.
- **FR-FIT-09:** Sistem harus menangani file yang rusak atau format tidak didukung dengan pesan kesalahan yang jelas.
- **FR-FIT-10:** Sistem dapat mendukung koneksi OAuth eksternal (Strava) sebagai opsi tambahan jika kredensial API tersedia.

### 10.5 Smart Distance Recommendation

- **FR-REC-01:** Sistem harus memeriksa kecukupan data.
- **FR-REC-02:** Sistem harus menghitung rata-rata jarak.
- **FR-REC-03:** Sistem harus menghitung long run terpanjang.
- **FR-REC-04:** Sistem harus menghitung frekuensi latihan.
- **FR-REC-05:** Sistem harus menghitung pace rata-rata.
- **FR-REC-06:** Sistem harus menghitung konsistensi latihan.
- **FR-REC-07:** Sistem harus menghasilkan kategori rekomendasi.
- **FR-REC-08:** Sistem harus menghasilkan tingkat kesiapan.
- **FR-REC-09:** Sistem harus menghasilkan alasan rekomendasi.
- **FR-REC-10:** Sistem harus menghasilkan confidence level.
- **FR-REC-11:** Sistem harus menampilkan safety warning.
- **FR-REC-12:** Sistem harus menyimpan riwayat rekomendasi.
- **FR-REC-13:** Sistem harus memungkinkan rekomendasi diperbarui.
- **FR-REC-14:** Sistem harus menunjukkan indikator yang digunakan.
- **FR-REC-15:** Sistem harus menolak menghasilkan rekomendasi pasti jika data tidak mencukupi.

### 10.6 AI Running Assistant

- **FR-CHAT-01:** Sistem harus menyediakan antarmuka chatbot.
- **FR-CHAT-02:** Chatbot harus menerima pertanyaan bahasa alami.
- **FR-CHAT-03:** Chatbot dapat menggunakan ringkasan aktivitas dengan persetujuan pengguna.
- **FR-CHAT-04:** Chatbot dapat memberikan saran persiapan event.
- **FR-CHAT-05:** Chatbot dapat memberikan checklist event.
- **FR-CHAT-06:** Chatbot harus menampilkan batasan layanan.
- **FR-CHAT-07:** Chatbot harus menolak memberikan diagnosis medis.
- **FR-CHAT-08:** Sistem harus menyimpan atau menghapus riwayat sesuai pilihan pengguna.
- **FR-CHAT-09:** Sistem harus membatasi jumlah permintaan sesuai kapasitas layanan.

### 10.7 Organizer

- **FR-ORG-01:** Organizer harus dapat membuat event.
- **FR-ORG-02:** Organizer harus dapat memperbarui event.
- **FR-ORG-03:** Organizer harus dapat membuat kategori tiket.
- **FR-ORG-04:** Organizer harus dapat mengelola harga dan kuota.
- **FR-ORG-05:** Organizer harus dapat melihat peserta.
- **FR-ORG-06:** Organizer harus dapat melihat ringkasan penjualan.
- **FR-ORG-07:** Organizer harus dapat memvalidasi QR Code.
- **FR-ORG-08:** Organizer hanya dapat mengelola event miliknya.

### 10.8 Admin

- **FR-ADM-01:** Admin harus dapat mengelola pengguna.
- **FR-ADM-02:** Admin harus dapat memverifikasi organizer.
- **FR-ADM-03:** Admin harus dapat memoderasi event.
- **FR-ADM-04:** Admin harus dapat melihat transaksi.
- **FR-ADM-05:** Admin harus dapat melihat log rekomendasi tanpa mengekspos data sensitif secara berlebihan.
- **FR-ADM-06:** Admin harus dapat menonaktifkan event atau akun.
- **FR-ADM-07:** Sistem harus menyediakan audit log aktivitas administratif.

---

## 11. Non-Functional Requirements

### 11.1 Performance

- Halaman utama ditargetkan dimuat maksimal 3 detik dalam kondisi jaringan normal.
- Pencarian dan filter ditargetkan memberikan hasil maksimal 2 detik.
- Proses rekomendasi ditargetkan selesai maksimal 10 detik.
- Validasi QR Code ditargetkan selesai maksimal 3 detik.
- Sistem harus menggunakan pagination untuk daftar event, transaksi, dan peserta.

### 11.2 Security

- Password harus disimpan menggunakan algoritma hashing yang aman.
- Koneksi harus menggunakan HTTPS pada lingkungan produksi.
- Token API eksternal tidak boleh ditampilkan pada frontend.
- Sistem harus menerapkan validasi input.
- Sistem harus memiliki perlindungan terhadap akses tanpa otorisasi.
- QR Code harus berisi token atau identifier, bukan seluruh data peserta.
- Endpoint harus menerapkan pemeriksaan role dan ownership.
- Data sensitif tidak boleh dicatat secara terbuka pada log.

### 11.3 Privacy

- Pengguna harus memberikan persetujuan sebelum data kebugaran atau file aktivitas diproses.
- Sistem hanya mengambil data yang diperlukan untuk kalkulasi metrik lari.
- Pengguna dapat mereset atau memperbarui data kebugaran tersimpan kapan saja.
- Pengguna dapat meminta penghapusan riwayat data aktivitas tersimpan.
- Sistem harus menjelaskan penggunaan data untuk rekomendasi secara transparan.
- Riwayat percakapan chatbot harus dapat dihapus.
- Data kesehatan dan kebugaran tidak boleh digunakan sebagai diagnosis.

### 11.4 Reliability

- Transaksi dan penerbitan tiket harus konsisten.
- Sistem tidak boleh menerbitkan dua tiket untuk satu transaksi yang sama kecuali pesanan memang mencakup lebih dari satu peserta.
- Sistem harus mencegah pemakaian QR Code berulang.
- Kegagalan API eksternal tidak boleh merusak proses ticketing utama.
- Sistem harus memiliki mekanisme pencatatan error.

### 11.5 Usability

- Antarmuka harus responsif.
- Informasi harga, kategori, dan kuota harus mudah ditemukan.
- Rekomendasi harus menggunakan bahasa sederhana.
- Safety warning harus terlihat tetapi tidak menimbulkan kepanikan.
- Status pesanan dan pembayaran harus mudah dipahami.
- Sistem harus memberikan feedback setelah setiap tindakan penting.

### 11.6 Compatibility

MVP ditargetkan mendukung:

- Google Chrome versi modern.
- Microsoft Edge versi modern.
- Mozilla Firefox versi modern.
- Safari versi modern.
- Tampilan desktop dan mobile browser.

### 11.7 Maintainability

- Frontend, backend, rekomendasi, dan integrasi eksternal harus dipisahkan secara modular.
- Konfigurasi API harus disimpan melalui environment variable.
- Kode harus menggunakan penamaan yang konsisten.
- Endpoint harus didokumentasikan.
- Fungsi penting harus memiliki pengujian.

### 11.8 Accessibility

- Kontras teks harus mencukupi.
- Input harus memiliki label.
- Tombol harus dapat diidentifikasi dengan jelas.
- Informasi utama tidak boleh hanya dibedakan berdasarkan warna.
- Pesan kesalahan harus spesifik dan mudah dipahami.

---

## 12. System Scope

### 12.1 Ruang Lingkup MVP

#### Modul Pengguna

- Registrasi.
- Login dan logout.
- Pengelolaan profil.
- Pencarian event.
- Filter event.
- Detail event.
- Pemilihan kategori.
- Pemesanan tiket.
- Simulasi atau sandbox pembayaran.
- E-ticket dan QR Code.
- Riwayat tiket.

#### Modul Universal Fitness Sync dan Rekomendasi

- Universal Fitness Sync (Upload GPX/CSV, Formulir Mandiri, Preset Persona).
- Sinkronisasi dan ekstraksi aktivitas lari.
- Perhitungan indikator latihan.
- Rule-Based Smart Distance Recommendation.
- LLM Explanation Layer (penjelasan narasi rekomendasi).
- Confidence level.
- Safety warning dan acknowledgment.
- Riwayat rekomendasi sederhana.

#### Modul Chatbot

- Chat berbasis teks.
- Saran umum latihan.
- Persiapan lomba.
- Hidrasi dan pemulihan umum.
- Checklist hari perlombaan.
- Konteks terbatas dari profil pengguna.

#### Modul Organizer

- Dashboard organizer.
- Pengelolaan event.
- Pengelolaan kategori.
- Pengelolaan kuota.
- Daftar peserta.
- Pemindaian atau input QR Code.
- Ringkasan penjualan.

#### Modul Admin

- Dashboard admin.
- Pengelolaan pengguna.
- Verifikasi organizer.
- Moderasi event.
- Pemantauan transaksi.
- Pemantauan log sistem.

### 12.2 Ruang Lingkup Fase Mendatang

- Aplikasi mobile.
- Perhitungan estimasi finish time.
- Rekomendasi event lintas kota.
- Program latihan otomatis.
- Sinkronisasi Garmin, Fitbit, dan Coros.
- Refund otomatis.
- Transfer kepemilikan tiket.
- Race result integration.
- Community feature.
- Kalender latihan.
- Sistem loyalty.
- Dynamic pricing.
- Multi-language.
- Notifikasi WhatsApp dan push notification.

---

## 13. Out of Scope

1. Diagnosis cedera atau kondisi medis.
2. Penggantian fungsi dokter, fisioterapis, atau pelatih profesional.
3. Pemantauan posisi peserta secara langsung selama event.
4. Penyediaan asuransi perlombaan.
5. Prediksi medis mengenai risiko individual.
6. Program latihan adaptif jangka panjang.
7. Integrasi API wearable proprietary berbayar (misalnya Strava API Subscriber program).
8. Social feed dan jejaring komunitas.
9. Marketplace perlengkapan lari.
10. Ticket resale.
11. Refund otomatis yang kompleks.
12. Verifikasi identitas berbasis biometrik.
13. Prediksi cuaca real-time.
14. Pengelolaan race timing chip.
15. Penentuan keputusan akhir apakah seseorang secara medis layak mengikuti lomba.

---

## 14. Feature Specification

### 14.1 Event Discovery

**Tujuan:** Membantu pengguna menemukan event berdasarkan preferensi.

**Input:**

- Kata kunci.
- Lokasi.
- Tanggal.
- Kategori jarak.
- Nama organizer.

**Output:**

- Daftar event.
- Gambar event.
- Tanggal.
- Lokasi.
- Harga mulai.
- Kategori yang tersedia.
- Status tiket.

**Kondisi Khusus:**

- Event selesai tidak muncul pada daftar aktif.
- Event tanpa persetujuan admin tidak dapat dipublikasikan.
- Kategori yang habis harus diberi label **Sold Out**.

### 14.2 Smart Distance Recommendation

**Tujuan:** Memberikan rekomendasi kategori jarak yang sesuai berdasarkan data latihan pengguna.

**Data yang Digunakan:**

- Total aktivitas selama periode analisis.
- Rata-rata jarak setiap aktivitas.
- Total jarak mingguan.
- Long run terpanjang.
- Frekuensi berlari per minggu.
- Pace rata-rata.
- Konsistensi latihan.
- Recency atau waktu sejak aktivitas terakhir.
- Riwayat kategori event, jika tersedia.

**Output:**

**Recommended for You: 10K**

**Tingkat kesiapan:** Siap dengan persiapan lanjutan  
**Confidence:** 82%

**Alasan:**

- Rata-rata latihan dilakukan tiga kali per minggu.
- Long run terpanjang mendekati kebutuhan dasar kategori 10K.
- Pace dan volume latihan relatif konsisten selama periode analisis.

**Safety note:**

> Berdasarkan aktivitas yang tersedia, kategori Half Marathon berada di atas rekomendasi saat ini. Tingkatkan long run dan konsistensi latihan secara bertahap sebelum memilih jarak tersebut.

**Kondisi Data Tidak Cukup:**

> Data aktivitas belum cukup untuk menghasilkan rekomendasi personal (< 3 sesi lari). Rekam dan upload minimal 3 sesi lari (file GPX/CSV) atau lengkapi formulir penilaian mandiri untuk mengaktifkan analisis rekomendasi.

Sebagai alternatif, sistem dapat menampilkan panduan kategori umum tanpa menyebutnya sebagai rekomendasi personal.

### 14.3 AI Running Assistant

**Topik yang Didukung:**

- Persiapan sebelum lomba.
- Checklist perlengkapan.
- Penyesuaian latihan secara umum.
- Pemulihan dasar.
- Hidrasi umum.
- Nutrisi umum.
- Strategi pace umum.
- Informasi kategori jarak.
- Penjelasan hasil rekomendasi.

**Batasan:**

Chatbot tidak boleh:

- Mendiagnosis cedera.
- Menentukan kondisi medis.
- Menjamin pengguna dapat menyelesaikan perlombaan.
- Menggantikan konsultasi profesional.
- Memberikan instruksi berbahaya.
- Mendorong pengguna mengabaikan rasa sakit atau tanda bahaya.

**Respons terhadap Keluhan Fisik:**

Jika pengguna menyebutkan nyeri berat, pingsan, sesak, atau gejala serius, chatbot harus menyarankan untuk menghentikan aktivitas dan mencari bantuan profesional yang tepat, tanpa melakukan diagnosis.

### 14.4 E-Ticket dan QR Code

E-ticket minimal memuat:

- Nomor tiket.
- Nama event.
- Nama peserta.
- Kategori.
- Tanggal event.
- Lokasi.
- QR Code.
- Status tiket.

Status tiket:

- Pending.
- Paid.
- Issued.
- Checked-in.
- Cancelled.
- Expired.

---

## 15. AI Recommendation Workflow

### 15.1 Arsitektur yang Disarankan

Untuk meningkatkan konsistensi dan keamanan, keputusan kategori sebaiknya **tidak sepenuhnya diserahkan kepada LLM**.

Pendekatan yang disarankan adalah sistem hibrida:

1. **Data Processing Layer**: Mengolah data aktivitas menjadi indikator numerik.
2. **Rule-Based atau Scoring Engine**: Menentukan kategori rekomendasi berdasarkan aturan yang telah ditetapkan.
3. **LLM Explanation Layer**: Mengubah hasil perhitungan menjadi penjelasan yang mudah dipahami.

Dengan pendekatan ini, LLM berperan sebagai **AI Running Assistant dan explanation generator**, bukan satu-satunya penentu kesiapan fisik.

### 15.2 Alur Rekomendasi

1. Pengguna menyinkronkan data aktivitas via **Universal Fitness Sync** (Upload file GPX/CSV, Formulir Penilaian Mandiri Cepat, atau Preset Persona Simulator).
2. Sistem mem-parse, memvalidasi, dan mengekstrak metrik aktivitas lari.
3. Backend menyimpan ringkasan metrik ke tabel `user_fitness_sync` dan `runner_profiles`.
4. Sistem menyaring aktivitas non-lari jika terdapat data multiolehraga.
5. Sistem melakukan normalisasi unit (meter ke kilometer, detik ke menit/km).
6. Sistem menghitung jarak rata-rata, long run, frekuensi mingguan, total volume, pace rata-rata, konsistensi, dan recency.
7. Sistem memeriksa kecukupan data (minimal 3 sesi lari untuk status data cukup).
8. Rule-Based Scoring Engine menghitung skor kesiapan untuk setiap kategori (5K, 10K, Half Marathon, Full Marathon).
9. Sistem memilih kategori rekomendasi utama berdasarkan kriteria ambang batas keselamatan.
10. Sistem menghitung confidence level (Low, Medium, High).
11. LLM Explanation Layer (Groq Cloud API) menerima objek JSON ringkasan metrik untuk menyusun narasi penjelasan dan catatan keselamatan.
12. LLM menghasilkan penjelasan ramah dan objektif tanpa mengubah hasil hitungan engine.
13. Safety layer memverifikasi keluaran LLM.
14. Sistem menyimpan riwayat hasil rekomendasi ke tabel `event_recommendations`.
15. Antarmuka menampilkan lencana **Recommended for You** pada kategori tiket event.

### 15.3 Status Rekomendasi

Kategori hasil rekomendasi:

- **Insufficient Data**
- **Recommended 5K**
- **Recommended 10K**
- **Recommended Half Marathon**
- **Recommended Full Marathon**

Tingkat kesiapan:

- Belum cukup data.
- Perlu persiapan tambahan.
- Cukup siap.
- Siap.
- Sangat siap berdasarkan data yang tersedia.

Tingkat kesiapan tersebut harus dipahami sebagai hasil sistem berdasarkan data aktivitas, bukan penilaian medis.

### 15.4 Confidence Level

Confidence level harus dihitung dari faktor yang dapat dijelaskan, misalnya:

- Jumlah aktivitas yang tersedia.
- Kelengkapan periode latihan.
- Konsistensi data.
- Recency aktivitas.
- Stabilitas pola latihan.

Contoh klasifikasi:

- **Low:** data terbatas (< 3 sesi) atau tidak konsisten.
- **Medium:** data cukup, tetapi terdapat kesenjangan aktivitas.
- **High:** data cukup lengkap, konsisten, dan terbaru.

Hindari menggunakan angka confidence yang dibuat langsung oleh LLM tanpa dasar perhitungan.

---

## 16. Universal Fitness Sync Flow (GPX, CSV, Manual & Persona)

### 16.1 Arsitektur Universal Fitness Sync

Untuk mengatasi kendala ketergantungan pada API berbayar pihak ketiga (seperti pendaftaran Strava API v3 yang kini berbayar), StrideTix menerapkan pendekatan **Universal Fitness Sync** yang mencakup 4 metode pengumpulan data aktivitas lari:

1. **Metode 1: Upload File GPX (GPS Exchange Format)**
   - Mendukung file `.gpx` standar yang diekspor dari smartwatch olahraga (Garmin, Coros, Suunto, Apple Watch) atau aplikasi lari (Strava, Nike Run Club).
   - Parser membaca tag XML `<trkpt>`, menghitung jarak kumulatif antar-koordinat menggunakan formula Haversine, mengekstrak total moving time, elevasi, dan menghitung pace rata-rata secara presisi.

2. **Metode 2: Upload File CSV (Activity Log)**
   - Mendukung file spreadsheet ringkasan aktivitas `.csv` dengan kolom tanggal, jarak (km), moving time, dan pace.
   - Sistem memvalidasi header kolom dan baris data agar sesuai skema.

3. **Metode 3: Formulir Penilaian Mandiri Cepat (Self-Assessment Form)**
   - Formulir 3 pertanyaan sederhana bagi pelari yang tidak memiliki file rekaman jam olahraga: jarak long run terjauh dalam 4–8 minggu terakhir, frekuensi lari mingguan, dan estimasi pace rata-rata.
   - Sistem secara deterministik menghitung metrik kebugaran sintetis yang realistis.

4. **Metode 4: Preset Persona Simulator**
   - Profil terkalibrasi untuk keperluan pengujian dan demonstrasi sidang:
     * *Pelari Pemula (5K Ready)*: Long run 4.5 km, frekuensi 2x/minggu, pace 6.8 min/km.
     * *Pelari Rekreasi (10K Ready)*: Long run 9.5 km, frekuensi 3x/minggu, pace 5.6 min/km.
     * *Pelari Half Marathon (HM Ready)*: Long run 16.0 km, frekuensi 4x/minggu, pace 5.2 min/km.
     * *Pelari Marathon (FM Ready)*: Long run 32.0 km, frekuensi 5x/minggu, pace 4.9 min/km.

5. **Metode 5: Integrasi OAuth Eksternal (Strava API v3 - Opsi Tambahan/Legacy)**
   - Tetap dipertahankan sebagai opsi integrasi langsung jika kredensial `client_id` dan `client_secret` resmi tersedia.

### 16.2 Data Processing & Storage

1. Data dari file GPX/CSV atau formulir mandiri divalidasi integritasnya di backend server.
2. Aktivitas bertipe non-lari difilter keluar.
3. Unit distandarisasi ke kilometer dan menit/kilometer.
4. Metrik dihitung dan disimpan ke tabel PostgreSQL:
   - `public.user_fitness_sync`: Status koneksi, sumber sync, jumlah aktivitas, tanggal sinkronisasi.
   - `public.runner_profiles`: Ringkasan metrik fisik (jarak mingguan, long run, pace, frekuensi, konsistensi).
   - `public.raw_fitness_activities`: Rincian per sesi lari individual.
5. Ringkasan metrik dikirim ke Rule-Based Scoring Engine.

### 16.3 Penanganan Error & Validasi

Sistem menangani:

- Format file tidak didukung (bukan `.gpx` atau `.csv`).
- File GPX rusak (*malformed XML*).
- Struktur kolom CSV tidak sesuai standar.
- Ukuran file melebihi batas upload (maksimal 10 MB).
- Input angka pada formulir mandiri di luar batas wajar (misal pace negatif atau long run > 100 km).
- Sesi autentikasi pengguna tidak valid saat menyimpan data.

### 16.4 Prinsip Privasi

- Data aktivitas hanya digunakan untuk keperluan kalkulasi rekomendasi jarak dan kontekstualisasi chatbot.
- File GPX tidak dipublikasikan ke publik.
- Pengguna memiliki kontrol penuh untuk mereset atau memperbarui data kebugaran kapan saja.
- Data kebugaran tidak pernah dibagikan kepada pihak ketiga untuk keperluan komersial.

---

## 17. User Flow

### 17.1 Alur Pembelian dengan Rekomendasi

**Home** → Daftar event → Filter event → Detail event → Login/registrasi → Universal Fitness Sync (GPX/CSV/Manual Form/Persona) → Proses rekomendasi → Tampilkan kategori yang direkomendasikan → Pilih kategori → Isi data peserta → Review pesanan → Pembayaran → Pembayaran berhasil → E-ticket diterbitkan → Tiket tersimpan pada akun.

### 17.2 Alur Pemilihan di Atas Rekomendasi

Pilih kategori → Bandingkan dengan hasil rekomendasi → Kategori berada di atas rekomendasi → Tampilkan safety warning → Pengguna membaca peringatan → Pengguna memilih kategori rekomendasi atau tetap melanjutkan → Catat acknowledgment → Lanjutkan pemesanan.

### 17.3 Alur Check-in

Organizer login → Pilih event → Buka fitur check-in → Pindai QR Code → Validasi token tiket → Periksa status pembayaran → Periksa status penggunaan → Tampilkan hasil → Tandai tiket sebagai checked-in.

### 17.4 Alur Chatbot

Pengguna membuka chatbot → Sistem memeriksa status login → Pengguna mengirim pertanyaan → Sistem menambahkan konteks yang diizinkan (profil kebugaran pelari dan daftar event aktif dari DB) → Modul AI membuat respons terstruktur → Tampilkan jawaban → Simpan riwayat jika diizinkan.

---

## 18. Assumptions and Constraints

### 18.1 Asumsi

1. Pengguna memiliki file aktivitas lari (GPX/CSV) atau bersedia mengisi formulir penilaian mandiri untuk mengaktifkan rekomendasi personal.
2. Pengguna memberikan izin pemrosesan data secara sukarela.
3. Data aktivitas yang diinput cukup merepresentasikan latihan fisik pengguna.
4. Event organizer mengisi data event dan kategori lomba dengan benar.
5. Admin meninjau organizer dan memoderasi event.
6. Pengguna memiliki perangkat yang dapat membuka web dan menampilkan QR Code.
7. Pembayaran dapat menggunakan sandbox atau simulasi untuk kebutuhan akademik.
8. Modul AI Groq dapat diakses melalui API LPU yang tersedia selama pengembangan.
9. Rekomendasi bersifat informatif dan tidak wajib diikuti.
10. Pengguna tetap dapat membeli tiket tanpa melakukan sinkronisasi kebugaran.

### 18.2 Constraints

1. Ketersediaan inferensi AI bergantung pada koneksi internet dan API Groq Cloud.
2. API pihak ketiga dapat memiliki rate limit atau batasan kuota.
3. Kualitas rekomendasi bergantung pada kejujuran input formulir mandiri atau akurasi file GPX/CSV.
4. Elevasi lintasan, cuaca ekstrem, dan kondisi kesehatan personal dapat memengaruhi performa lari aktual di hari perlombaan.
5. Riwayat aktivitas tidak selalu menggambarkan kondisi fisik terkini (misal sedang demam atau cedera mendadak).
6. Tim pengembang memiliki waktu dan sumber daya terbatas dalam lingkup skripsi/tugas akhir.
7. Sistem rekomendasi belum divalidasi sebagai alat penentu kelayakan medis.
8. Implementasi payment gateway produksi dapat memerlukan badan usaha legal.
9. Full Marathon memiliki risiko dan persyaratan lebih kompleks sehingga rekomendasinya perlu aturan lebih ketat.

---

## 19. Future Enhancements

### 19.1 Pengembangan AI

- Prediksi waktu finish.
- Rekomendasi pace perlombaan.
- Deteksi tren peningkatan atau penurunan latihan.
- Rencana latihan menuju event.
- Penyesuaian rekomendasi berdasarkan tanggal lomba.
- Training readiness score.
- Analisis elevation gain.
- Rekomendasi recovery week.
- Penjelasan visual mengenai perkembangan latihan.

### 19.2 Pengembangan Ticketing

- Pembayaran produksi.
- Refund otomatis.
- Transfer tiket.
- Waiting list.
- Promo code.
- Bundling tiket.
- Merchandise.
- E-mail dan WhatsApp notification.
- Dynamic QR Code.
- Offline QR verification.

### 19.3 Pengembangan Integrasi

- Garmin Connect Cloud API.
- Fitbit Web API.
- Coros Cloud API.
- Apple HealthKit / Google Health Connect.
- Sistem race timing profesional.
- Kalender pengguna.
- Peta interaktif rute event.

### 19.4 Pengembangan Komunitas

- Klub lari.
- Teman latihan.
- Leaderboard.
- Review event.
- Bagikan tiket.
- Event recommendation berdasarkan lokasi.
- Tantangan bulanan.

---

## 20. Risk Analysis

| Risiko | Dampak | Kemungkinan | Mitigasi |
|---|---|---|---|
| Data aktivitas tidak cukup (< 3 sesi) | Rekomendasi kurang akurat | Tinggi | Terapkan status insufficient data dan anjurkan kategori 5K |
| File GPX/CSV rusak atau format salah | Ekstraksi data gagal | Sedang | Validasi skema, pesan error informatif, dan sediakan formulir mandiri |
| Pengguna tidak memiliki smartwatch | Fitur rekomendasi tidak terpakai | Sedang | Sediakan Formulir Penilaian Mandiri Cepat dan simulasi persona |
| Token API AI bocor | Pembobolan kuota | Rendah | Backend-only Groq API key, isolasi server-side environment |
| LLM menghasilkan informasi keliru | Pengguna menerima saran tidak tepat | Sedang | Batasi konteks, kunci guardrails PRD, dan terapkan penolakan diagnosis medis |
| LLM menentukan kategori secara acak | Hasil berubah-ubah | Tinggi | Gunakan Rule-Based Scoring Engine untuk keputusan dan LLM hanya untuk narasi penjelasan |
| Pengguna menganggap rekomendasi sebagai vonis medis | Risiko salah paham | Sedang | Tampilkan medical disclaimer permanen pada UI |
| Pengguna memilih jarak ekstrem | Risiko keselamatan | Sedang | Safety warning dan modal konfirmasi tanggung jawab mandiri |
| Pembayaran gagal tetapi kuota berkurang | Ketidaksesuaian transaksi | Sedang | Gunakan status reservasi dan timeout 2 jam |
| QR Code digunakan dua kali | Penyalahgunaan tiket | Sedang | Validasi server dan penanda status checked-in sekali pakai |
| Organizer melihat data yang tidak diperlukan | Pelanggaran privasi | Sedang | Batasi data berdasarkan role via Supabase RLS |
| Biaya API AI meningkat | Operasional terganggu | Sedang | Optimasi model Groq, token limit, dan kuota interaksi |
| Event palsu dipublikasikan | Kerugian pengguna | Sedang | Verifikasi organizer dan moderasi event oleh admin |
| Pengguna tidak ingin mengisi data kebugaran | Transaksi terhambat | Rendah | Sinkronisasi bersifat opsional, pengguna tetap bisa beli tiket langsung |
| Jadwal tugas akhir terbatas | MVP tidak selesai | Tinggi | Prioritaskan fungsi inti ticketing, scoring engine, dan AI explainer |

---

## 21. Prioritas MVP

### Must Have

- Registrasi dan login.
- Role user, organizer, dan admin.
- Daftar dan detail event.
- Filter event.
- Kategori tiket.
- Pemesanan tiket.
- Simulasi pembayaran.
- E-ticket.
- QR Code unik.
- Validasi tiket scanner.
- Universal Fitness Sync (Upload GPX/CSV, Formulir Mandiri, Persona Simulator).
- Ekstraksi metrik aktivitas lari.
- Perhitungan indikator latihan.
- Rule-Based Smart Distance Recommendation.
- Safety warning.
- Chatbot AI dengan PRD Guardrails & Medical Refusal.
- Dashboard organizer.
- Dashboard admin.

### Should Have

- Riwayat rekomendasi.
- Sinkronisasi ulang aktivitas.
- Statistik penjualan.
- E-mail konfirmasi.
- Event moderation.
- Confidence level.
- Penjelasan data yang digunakan.

### Could Have

- Wishlist event.
- Promo code.
- Review event.
- Rekomendasi event berdasarkan kota.
- Unduh tiket dalam format PDF.
- Visualisasi grafik aktivitas.
- Estimasi finish time.

### Won't Have pada MVP

- Aplikasi mobile.
- Live tracking.
- Marketplace.
- Integrasi banyak wearable.
- Diagnosis cedera.
- Training plan otomatis lengkap.
- Social feed.
- Dynamic pricing.

---

## 22. Implementasi dengan Metode Waterfall

### Tahap 1: Analisis Kebutuhan

**Output:**

- Identifikasi masalah.
- Analisis sistem berjalan.
- Kebutuhan pengguna.
- Kebutuhan fungsional.
- Kebutuhan nonfungsional.
- Batasan sistem.
- PRD.
- Spesifikasi kebutuhan perangkat lunak.

### Tahap 2: Perancangan Sistem

**Output:**

- Use case diagram.
- Activity diagram.
- Sequence diagram.
- Class diagram.
- Entity Relationship Diagram.
- Struktur database.
- Arsitektur sistem.
- Rancangan API.
- Wireframe.
- High-fidelity user interface.

### Tahap 3: Implementasi

**Output:**

- Frontend pengguna.
- Backend dan database.
- Dashboard organizer.
- Dashboard admin.
- Universal Fitness Sync (GPX/CSV/Manual Assessment/Persona).
- Recommendation engine (Rule-Based Scoring).
- Integrasi LLM (Groq Cloud API Explainer & Chatbot).
- QR Code dan tiket digital.
- Simulasi pembayaran.

### Tahap 4: Pengujian

**Output:**

- Black-box testing.
- Unit testing.
- Integration testing.
- API testing.
- Role and authorization testing.
- Recommendation scenario testing.
- QR Code validation testing.
- Usability testing.
- Dokumentasi hasil pengujian.

### Tahap 5: Deployment dan Pemeliharaan

**Output:**

- Deployment aplikasi.
- Konfigurasi environment.
- Monitoring error.
- Backup database.
- Perbaikan bug.
- Dokumentasi pengguna.
- Dokumentasi teknis.

---

## 23. Kesimpulan Produk

StrideTix dirancang sebagai platform e-ticket khusus event lari yang menggabungkan proses pencarian event, pemesanan tiket, dan validasi QR Code dengan fitur rekomendasi kategori jarak berdasarkan data aktivitas.

Fokus utama MVP tetap berada pada **sistem ticketing**, sedangkan AI menjadi pembeda yang membantu pengguna mengambil keputusan sebelum membeli tiket. Untuk menjaga konsistensi, hasil kategori sebaiknya ditentukan melalui **scoring atau rule-based recommendation engine**, kemudian LLM digunakan untuk menjelaskan hasil dan mendukung chatbot.

Dengan ruang lingkup tersebut, StrideTix memiliki kebutuhan sistem yang cukup kaya untuk tugas akhir karena mencakup:

- Sistem multi-role.
- Transaksi e-ticket.
- QR Code.
- Integrasi API eksternal.
- Pengolahan data.
- Implementasi AI.
- Perancangan UML.
- Manajemen basis data.
- Keamanan dan privasi.
- Pengujian sistem berbasis Waterfall.

**Perubahan utama yang diterapkan:** PRD ini membedakan keputusan rekomendasi dari penjelasan LLM, memperjelas batas MVP, serta menempatkan aspek keselamatan sebagai peringatan informatif, bukan diagnosis medis. Ini membuat rancangan lebih realistis untuk dikembangkan, diuji, dan dipertanggungjawabkan saat presentasi tugas akhir.
