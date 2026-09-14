# PRD: Shopee Price Tracker & Telegram Notification

## 1. Informasi Produk

| Item | Detail |
|---|---|
| Nama produk | Shopee Price Tracker |
| Versi PRD | v1.1 |
| Platform | Web application + Telegram bot |
| Target rilis MVP | 4–6 minggu |
| Status | Draft untuk development |
| Stack utama | Angular, Express.js, PostgreSQL, Sequelize, Axios, Cheerio, grammY, Telegram Bot |

---

## 2. Latar Belakang

Banyak pengguna Shopee ingin membeli barang, tetapi menunggu harga turun atau diskon. Saat ini, pengguna biasanya harus mengecek produk secara manual dari waktu ke waktu.

Aplikasi ini dibuat untuk membantu pengguna memantau harga produk Shopee dan mendapatkan notifikasi otomatis ketika harga turun atau mencapai target harga yang ditentukan.

---

## 3. Masalah Pengguna

1. User harus mengecek produk Shopee secara manual.
2. User tidak tahu kapan harga produk turun.
3. User bisa melewatkan diskon atau flash sale.
4. User tidak punya riwayat perubahan harga.
5. User lupa produk yang ingin dibeli.

---

## 4. Tujuan Produk

### Tujuan utama

Membuat aplikasi web yang memungkinkan user:

1. Menambahkan produk Shopee yang ingin dipantau.
2. Melihat harga terakhir produk.
3. Melihat riwayat perubahan harga.
4. Mengatur target harga atau aturan notifikasi.
5. Menerima notifikasi Telegram saat harga turun.

### Tujuan bisnis

1. Mendapatkan user awal.
2. Memvalidasi kebutuhan fitur price tracker.
3. Mengetahui apakah user aktif menggunakan notifikasi Telegram.
4. Menjadi dasar pengembangan fitur premium di masa depan.

---

## 5. Target Pengguna

### Pengguna utama

Orang yang sering belanja di Shopee dan ingin menunggu harga turun sebelum checkout.

### Karakteristik

- Usia 17–35 tahun.
- Terbiasa menggunakan smartphone.
- Sering membandingkan harga.
- Menunggu diskon sebelum membeli.
- Menggunakan Telegram atau bersedia memakai Telegram untuk notifikasi.

---

## 6. Persona

### Persona 1: Pemburu Diskon

- Sering memasukkan barang ke keranjang.
- Menunggu promo atau harga turun.
- Tidak mau mengecek produk satu per satu setiap hari.
- Ingin dapat notifikasi saat harga turun.

### Persona 2: Pembeli Rasional

- Punya target harga tertentu.
- Hanya membeli jika harga sesuai budget.
- Ingin melihat riwayat harga sebelum membeli.

---

## 7. Nilai Utama Produk

Tambah link produk → sistem pantau otomatis → user dapat notifikasi saat harga turun.

Nilai utama:

1. Hemat waktu.
2. Tidak perlu cek manual.
3. Tidak ketinggalan diskon.
4. Bisa beli di harga terbaik.

---

## 8. Ruang Lingkup MVP

### In Scope

1. Registrasi dan login user.
2. Autentikasi JWT access token + refresh token.
3. Dashboard user.
4. Tambah produk Shopee melalui link.
5. Parsing data produk menggunakan Axios + Cheerio.
6. Simpan produk ke PostgreSQL.
7. Simpan riwayat harga.
8. Scheduler pengecekan harga.
9. Binding akun Telegram ke user.
10. Notifikasi Telegram saat harga turun.
11. Log notifikasi.
12. Pengaturan alert sederhana.
13. Halaman detail produk.
14. Health check API.
15. Logging dasar.
16. Struktur proyek terpisah antara backend dan frontend.

### Out of Scope MVP

1. Akses otomatis ke keranjang Shopee user.
2. Login menggunakan akun Shopee.
3. Checkout otomatis.
4. Pembayaran.
5. Notifikasi WhatsApp.
6. Notifikasi email.
7. Aplikasi mobile native.
8. Prediksi harga.
9. Rekomendasi produk.
10. Sistem affiliate.
11. Fitur premium / subscription.
12. Admin dashboard lanjutan.
13. Multi-marketplace.
14. Voucher personal user.
15. Pelacakan stok semua varian secara lengkap.

---

## 9. Asumsi dan Kendala

### Asumsi

1. User dapat memberikan link produk Shopee secara manual.
2. Produk yang dipantau adalah produk publik.
3. Telegram user sudah memiliki akun Telegram.
4. Sistem tidak perlu menyimpan akun Shopee user.
5. Data harga dapat diambil dari halaman publik atau sumber resmi jika tersedia.

### Kendala

1. Struktur halaman Shopee bisa berubah.
2. Harga bisa dimuat lewat JavaScript.
3. Ada risiko rate limit atau pemblokiran.
4. Perlu memperhatikan ketentuan layanan Shopee.
5. Telegram memiliki limit pengiriman pesan.
6. Notifikasi tidak boleh spam.

---

## 10. Prinsip Produk

1. Jangan spam user.
2. Jangan meminta password Shopee.
3. Hormati rate limit.
4. Utamakan data publik atau API resmi.
5. Sederhana dulu, scale belakangan.
6. Semua proses penting harus dilog.
7. Notifikasi harus bisa dilacak.
8. Backend dan frontend harus dipisahkan secara struktur proyek.

---

## 11. Fitur MVP

### 11.1 Autentikasi User

User dapat membuat akun, login, logout, dan mengakses dashboard.

Metode auth: JWT Access Token + Refresh Token.

- Access token berumur pendek.
- Refresh token disimpan di database.
- Password di-hash menggunakan Argon2 atau bcrypt.
- Endpoint autentikasi harus dilindungi rate limit.

User story: Sebagai user, saya ingin mendaftar dan login agar data produk pantauan saya tersimpan.

Functional requirements:

| ID | Requirement |
|---|---|
| AUTH-01 | User dapat register dengan email dan password |
| AUTH-02 | User dapat login dengan email dan password |
| AUTH-03 | Sistem menghasilkan access token dan refresh token |
| AUTH-04 | Access token digunakan untuk mengakses endpoint privat |
| AUTH-05 | Refresh token dapat digunakan untuk memperbarui access token |
| AUTH-06 | User dapat logout |
| AUTH-07 | Password tidak boleh disimpan plain text |
| AUTH-08 | Endpoint login harus memiliki rate limit |

Acceptance criteria:

1. User berhasil register dengan email valid.
2. User tidak bisa register dengan email yang sudah dipakai.
3. Password disimpan sebagai hash.
4. Login sukses mengembalikan access token dan refresh token.
5. Login gagal tidak membocorkan apakah email terdaftar atau tidak.
6. Endpoint privat menolak request tanpa token valid.

---

### 11.2 Dashboard User

Dashboard menampilkan daftar produk yang dipantau user.

User story: Sebagai user, saya ingin melihat semua produk yang saya pantau di satu halaman.

Functional requirements:

| ID | Requirement |
|---|---|
| DASH-01 | User dapat melihat daftar produk |
| DASH-02 | User dapat melihat nama produk |
| DASH-03 | User dapat melihat gambar produk jika tersedia |
| DASH-04 | User dapat melihat harga terakhir |
| DASH-05 | User dapat melihat status produk |
| DASH-06 | User dapat melihat tanggal terakhir dicek |
| DASH-07 | User dapat membuka detail produk |
| DASH-08 | User dapat menghapus produk |
| DASH-09 | User dapat pause/activekan alert |

Status produk: active, paused, error, not_found, out_of_stock.

---

### 11.3 Tambah Produk

User menambahkan produk Shopee dengan cara paste link.

User story: Sebagai user, saya ingin menambahkan produk Shopee dengan menempelkan link produk agar sistem bisa memantau harga produk tersebut.

Functional requirements:

| ID | Requirement |
|---|---|
| PROD-01 | User dapat paste link Shopee |
| PROD-02 | Sistem memvalidasi URL |
| PROD-03 | Sistem menormalisasi URL |
| PROD-04 | Sistem mengekstrak ID produk jika memungkinkan |
| PROD-05 | Sistem mengambil data dasar produk |
| PROD-06 | Sistem menyimpan produk ke database |
| PROD-07 | Sistem menyimpan harga awal |
| PROD-08 | Sistem menampilkan hasil tambah produk |
| PROD-09 | Jika parsing gagal, sistem menampilkan pesan error |
| PROD-10 | User tidak dapat menambah URL yang bukan Shopee |

Data produk yang disimpan: name, source_url, normalized_url, shopee_item_id, shopee_shop_id, image_url, current_price, currency, status, created_at, updated_at.

Acceptance criteria:

1. URL Shopee valid dapat disimpan.
2. URL non-Shopee ditolak.
3. Produk duplikat untuk user yang sama dapat dicegah.
4. Jika parsing gagal, produk tetap bisa disimpan dengan status error atau ditolak sesuai keputusan produk.
5. Harga awal tercatat di price_snapshots.

---

### 11.4 Detail Produk

Halaman detail menampilkan informasi produk dan riwayat harga.

User story: Sebagai user, saya ingin melihat detail produk dan riwayat harga untuk menentukan waktu terbaik membeli.

Functional requirements:

| ID | Requirement |
|---|---|
| DET-01 | User dapat melihat nama produk |
| DET-02 | User dapat melihat gambar produk |
| DET-03 | User dapat melihat harga saat ini |
| DET-04 | User dapat melihat harga awal |
| DET-05 | User dapat melihat perubahan harga terakhir |
| DET-06 | User dapat melihat riwayat harga |
| DET-07 | User dapat mengatur alert |
| DET-08 | User dapat menghapus produk |
| DET-09 | User dapat pause/activekan produk |
| DET-10 | User dapat membuka link produk ke Shopee |

Riwayat harga minimal menampilkan tanggal, harga, dan status.

---

### 11.5 Alert / Notifikasi

User dapat mengatur kapan notifikasi dikirim.

User story: Sebagai user, saya ingin mendapat notifikasi saat harga turun sesuai aturan yang saya pilih.

Jenis alert MVP:

| Jenis Alert | Penjelasan |
|---|---|
| any_drop | Kirim saat harga turun berapa pun |
| target_price | Kirim saat harga mencapai target |
| min_drop_percentage | Kirim saat harga turun minimal X% |

Functional requirements:

| ID | Requirement |
|---|---|
| ALERT-01 | User dapat mengaktifkan alert |
| ALERT-02 | User dapat menonaktifkan alert |
| ALERT-03 | User dapat memilih target price |
| ALERT-04 | User dapat memilih minimum penurunan harga |
| ALERT-05 | Sistem hanya mengirim notifikasi jika kondisi terpenuhi |
| ALERT-06 | Sistem mencegah notifikasi duplikat |
| ALERT-07 | Sistem menerapkan cooldown |
| ALERT-08 | Sistem mencatat setiap pengiriman notifikasi |

Aturan notifikasi:

- Jika harga turun dari Rp120.000 ke Rp100.000 dan user memilih minimum drop 5%, maka penurunan 16.67% dan notifikasi dikirim.
- Jika harga turun dari Rp120.000 ke Rp119.000, penurunan 0.83%, notifikasi tidak dikirim jika minimum drop 5%.

Cooldown: satu produk hanya mengirim maksimal 1 notifikasi per 6 jam (dapat dikonfigurasi).

Prevent duplicate notification: sistem menyimpan last_notified_price dan last_notified_at. Jika harga masih sama dengan harga terakhir yang sudah dinotifikasi, sistem tidak mengirim ulang.

---

### 11.6 Telegram Binding

User menghubungkan akun web dengan akun Telegram.

User story: Sebagai user, saya ingin menghubungkan akun Telegram agar bisa menerima notifikasi.

Flow binding:

1. User login ke web.
2. User buka halaman Settings / Telegram.
3. Sistem membuat binding code unik.
4. User membuka Telegram bot.
5. User mengirim /start BINDING_CODE.
6. Telegram bot mengirim update ke backend.
7. Backend mencocokkan binding code.
8. Backend menyimpan telegram_user_id.
9. Web menampilkan status Telegram terhubung.

Functional requirements:

| ID | Requirement |
|---|---|
| TG-01 | Sistem dapat membuat binding code unik |
| TG-02 | Binding code memiliki expired time |
| TG-03 | Bot dapat menerima command /start |
| TG-04 | Bot dapat menerima binding code |
| TG-05 | Sistem dapat menghubungkan Telegram user ke web user |
| TG-06 | User dapat unlink Telegram |
| TG-07 | Sistem menyimpan telegram_user_id |
| TG-08 | Sistem menampilkan status binding |
| TG-09 | Bot dapat mengirim pesan test |

Command bot MVP: /start, /bind, /help, /status, /test.

Contoh pesan bot:

/start:
Halo! Saya bot Shopee Price Tracker. Kirim kode binding dari website untuk menghubungkan akunmu.

Bind sukses:
Akun Telegram berhasil dihubungkan. Kamu akan menerima notifikasi harga turun dari sini.

Test notification:
Ini adalah notifikasi test. Jika kamu melihat pesan ini, Telegram sudah terhubung.

---

### 11.7 Price Checker

Sistem mengambil data harga produk secara berkala.

User story: Sebagai sistem, saya perlu mengecek harga produk secara otomatis agar user mendapat notifikasi saat harga turun.

Teknologi: Axios + Cheerio. Fallback: Playwright.

Flow price checker:

1. Scheduler mengambil produk aktif.
2. Sistem memanggil price checker.
3. Axios fetch URL produk.
4. Cheerio parse HTML.
5. Sistem mengambil nama produk, harga, gambar, stok.
6. Sistem menyimpan price snapshot.
7. Sistem membandingkan dengan harga sebelumnya.
8. Jika memenuhi kondisi alert, sistem membuat notification job.
9. Notifikasi dikirim ke Telegram.

Functional requirements:

| ID | Requirement |
|---|---|
| PC-01 | Sistem dapat mengambil produk aktif dari database |
| PC-02 | Sistem dapat memanggil URL produk |
| PC-03 | Sistem dapat parse data produk |
| PC-04 | Sistem dapat menyimpan price snapshot |
| PC-05 | Sistem dapat menandai produk error jika parsing gagal |
| PC-06 | Sistem dapat menandai produk not_found |
| PC-07 | Sistem dapat menandai produk out_of_stock |
| PC-08 | Sistem menggunakan delay antar request |
| PC-09 | Sistem memiliki timeout |
| PC-10 | Sistem melakukan retry terbatas |
| PC-11 | Sistem mencatat hasil price check |

Scheduler MVP: node-cron. Contoh cek harga setiap 30 menit atau 1 jam. Untuk MVP hindari cek terlalu sering.

Rate limiting: delay antar produk 2–5 detik, timeout request 15 detik, retry maksimal 2 kali.

---

### 11.8 Notifikasi Telegram

Sistem mengirim pesan Telegram saat kondisi alert terpenuhi.

User story: Sebagai user, saya ingin menerima pesan Telegram saat harga produk turun.

Functional requirements:

| ID | Requirement |
|---|---|
| NOTIF-01 | Sistem dapat mengirim pesan Telegram |
| NOTIF-02 | Sistem hanya mengirim ke user yang binding Telegram aktif |
| NOTIF-03 | Sistem menggunakan message template |
| NOTIF-04 | Sistem menyimpan log notifikasi |
| NOTIF-05 | Sistem menandai notifikasi sukses/gagal |
| NOTIF-06 | Sistem melakukan retry jika gagal sementara |
| NOTIF-07 | Sistem tidak mengirim duplikat |
| NOTIF-08 | Sistem menghormati cooldown |

Template notifikasi:

Harga Produk Turun!
Produk: Mouse Wireless
Harga lama: Rp120.000
Harga baru: Rp89.000
Turun: Rp31.000 (25.8%)
Cek produk: https://shopee.co.id/...

Target Harga Tercapai!
Produk: Mouse Wireless
Target: Rp90.000
Harga sekarang: Rp89.000
Cek produk: https://shopee.co.id/...

---

### 11.9 Logging

Sistem mencatat event penting untuk debugging dan audit. Tools: Pino atau Winston.

Event yang harus dilog: user register, user login, refresh token, product created, product deleted, price check started, price check success, price check failed, alert triggered, notification sent, notification failed, telegram binding success, telegram unbind, scheduler run, scheduler error.

Contoh log:

INFO user_login user_id=10
INFO product_created product_id=15 user_id=10
INFO price_check_success product_id=15 old_price=120000 new_price=89000
INFO notification_sent product_id=15 telegram_user_id=123456
ERROR price_check_failed product_id=15 error="timeout"

---

### 11.10 Monitoring

Sistem memantau kesehatan aplikasi. Tools MVP: Sentry, UptimeRobot / Better Stack, endpoint /health.

Endpoint health: GET /health

Response contoh:

{
  "status": "ok",
  "database": "connected",
  "telegram": "ok",
  "scheduler": "ok",
  "timestamp": "2026-06-20T10:00:00Z"
}

Monitoring penting: API uptime, database connection, Telegram bot status, scheduler status, price check failure rate, notification failure rate, API latency.

---

## 12. Non-Functional Requirements

### 12.1 Keamanan

| Requirement | Detail |
|---|---|
| Password hashing | Argon2 / bcrypt |
| HTTPS | Wajib production |
| JWT expiry | Access token pendek |
| Refresh token rotation | Disarankan |
| CORS | Hanya domain frontend |
| Rate limiting | Login, register, add product |
| Input validation | Semua endpoint |
| Secret management | Environment variables |
| Jangan simpan password Shopee | Wajib |
| Jangan akses data privat user | Wajib |

### 12.2 Performa

| Komponen | Target awal |
|---|---|
| Load dashboard | < 2 detik |
| API endpoint sederhana | < 300ms |
| Tambah produk | < 5 detik jika parsing cepat |
| Price checker batch | Tidak boleh memblokir API utama |
| Notifikasi Telegram | Dikirim dalam < 5 menit setelah trigger |

### 12.3 Keandalan

- Notifikasi tidak boleh duplikat.
- Job gagal harus dicatat.
- Price checker gagal tidak boleh membuat sistem crash.
- Scheduler harus tetap jalan meskipun beberapa produk error.

### 12.4 Skalabilitas

MVP: node-cron + Express.
Scale: Redis + BullMQ, worker terpisah, database connection pooling, queue retry.

### 12.5 Struktur Kode dan Proyek

- Backend dan frontend harus berada dalam folder terpisah.
- Tidak disarankan mencampurkan source code Angular ke dalam folder Express.
- Backend hanya berisi API, worker, scheduler, integrasi Telegram, dan price checker.
- Frontend hanya berisi UI Angular.
- Dokumentasi disimpan terpisah di folder docs.

---

## 13. Arsitektur Sistem

Arsitektur MVP:

Angular Frontend → Express.js API → PostgreSQL + Sequelize → Scheduler / Price Checker → Axios + Cheerio → Product Data → Alert Engine → Telegram Bot via grammY → User Telegram.

Komponen sistem:

| Komponen | Tanggung jawab |
|---|---|
| Angular | UI user |
| Express API | Auth, product, alert, Telegram binding |
| PostgreSQL | Data utama |
| Sequelize | ORM dan migration |
| Scheduler | Menjalankan price check berkala |
| Price checker | Fetch dan parse data produk |
| Alert engine | Menentukan apakah perlu notifikasi |
| Telegram service | Kirim pesan ke user |
| Logging | Mencatat event |
| Monitoring | Memantau kesehatan sistem |

---

## 14. Data Model

### users

id UUID PK
email VARCHAR UNIQUE
password_hash VARCHAR
name VARCHAR
created_at TIMESTAMP
updated_at TIMESTAMP

### refresh_tokens

id UUID PK
user_id UUID FK
token_hash VARCHAR
expires_at TIMESTAMP
revoked_at TIMESTAMP NULL
created_at TIMESTAMP

### telegram_bindings

id UUID PK
user_id UUID FK
telegram_user_id VARCHAR
telegram_username VARCHAR NULL
binding_code VARCHAR UNIQUE
is_active BOOLEAN
created_at TIMESTAMP
updated_at TIMESTAMP

### products

id UUID PK
user_id UUID FK
name VARCHAR
source_url TEXT
normalized_url TEXT
shopee_item_id VARCHAR NULL
shopee_shop_id VARCHAR NULL
image_url TEXT NULL
current_price INTEGER NULL
currency VARCHAR
status VARCHAR
last_checked_at TIMESTAMP NULL
last_notified_price INTEGER NULL
last_notified_at TIMESTAMP NULL
created_at TIMESTAMP
updated_at TIMESTAMP

### price_snapshots

id UUID PK
product_id UUID FK
price INTEGER NULL
original_price INTEGER NULL
discount_price INTEGER NULL
stock_status VARCHAR NULL
raw_data JSONB NULL
created_at TIMESTAMP

### alerts

id UUID PK
user_id UUID FK
product_id UUID FK
is_active BOOLEAN
alert_type VARCHAR
target_price INTEGER NULL
min_drop_percentage NUMERIC NULL
cooldown_minutes INTEGER
created_at TIMESTAMP
updated_at TIMESTAMP

### notification_logs

id UUID PK
user_id UUID FK
product_id UUID FK
alert_id UUID FK
channel VARCHAR
status VARCHAR
telegram_message_id VARCHAR NULL
error_message TEXT NULL
sent_at TIMESTAMP

### price_check_logs

id UUID PK
product_id UUID FK
status VARCHAR
error_message TEXT NULL
duration_ms INTEGER NULL
created_at TIMESTAMP

---

## 15. API Endpoint MVP

Auth:
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET /api/auth/me

Products:
GET /api/products
POST /api/products
GET /api/products/:id
DELETE /api/products/:id
PATCH /api/products/:id

Alerts:
GET /api/products/:id/alert
PUT /api/products/:id/alert

Telegram:
GET /api/telegram/status
POST /api/telegram/bind
POST /api/telegram/unbind
POST /api/telegram/test

System:
GET /health
POST /webhook/telegram

---

## 16. Flow Utama

### Flow tambah produk

1. User login.
2. User paste link Shopee.
3. Frontend kirim POST /api/products.
4. Backend validasi URL.
5. Backend panggil price checker.
6. Price checker fetch data produk.
7. Data disimpan ke products.
8. Harga awal disimpan ke price_snapshots.
9. Frontend menampilkan produk berhasil ditambahkan.

### Flow price check

1. Scheduler jalan tiap X menit.
2. Ambil semua produk aktif.
3. Loop produk dengan delay.
4. Fetch harga produk.
5. Simpan price snapshot.
6. Update current_price.
7. Bandingkan dengan harga sebelumnya.
8. Cek aturan alert.
9. Jika memenuhi syarat, buat notifikasi.
10. Kirim Telegram.
11. Simpan notification_logs.

### Flow notifikasi

1. Alert engine mendeteksi harga turun.
2. Cek apakah user punya Telegram binding aktif.
3. Cek cooldown.
4. Cek duplikasi last_notified_price.
5. Kirim pesan Telegram.
6. Simpan log sukses/gagal.

### Flow Telegram binding

1. User request bind di web.
2. Sistem generate binding code.
3. User kirim /start BINDING_CODE ke bot.
4. Telegram update masuk ke backend.
5. Backend validasi code.
6. Backend simpan telegram_user_id.
7. Web menampilkan status terhubung.

---

## 17. Aturan Bisnis Penting

Notifikasi dikirim jika:
- alert aktif
- produk aktif
- harga baru valid
- kondisi alert terpenuhi
- cooldown terpenuhi
- tidak duplikat
- user memiliki Telegram binding aktif

Kondisi alert:

any_drop: harga baru < harga lama.
target_price: harga baru <= target_price.
min_drop_percentage: persentase turun >= min_drop_percentage.

Rumus:
drop_percentage = ((old_price - new_price) / old_price) * 100

Cooldown: jika notifikasi terakhir untuk produk yang sama dikirim kurang dari cooldown, maka jangan kirim dulu.

Duplikasi: jika last_notified_price sama dengan new_price, jangan kirim ulang.

---

## 18. Edge Cases

| Kondisi | Sistem harus melakukan |
|---|---|
| Link tidak valid | Tolak request |
| Link bukan Shopee | Tolak request |
| Produk tidak ditemukan | Tandai not_found |
| Harga tidak bisa diambil | Tandai error |
| Produk stok habis | Tandai out_of_stock |
| Parsing gagal | Catat log dan retry terbatas |
| Telegram user block bot | Tandai binding gagal/inactive |
| Telegram API error | Retry dan log |
| Harga naik | Jangan kirim notifikasi |
| Harga turun sangat kecil | Ikuti aturan alert |
| Produk sudah pernah dinotifikasi pada harga sama | Jangan kirim ulang |
| Scheduler gagal | Catat log |
| Database connection error | Health check gagal |

---

## 19. Kebutuhan UI/UX

### Landing page
Penjelasan singkat, cara kerja, CTA daftar / login.

### Register / Login
Email, password, submit, error handling.

### Dashboard
Daftar produk, harga terakhir, status, tombol tambah produk, tombol detail.

### Tambah produk
Input link Shopee, tombol cek produk, preview produk jika berhasil, tombol simpan.

### Detail produk
Gambar produk, nama produk, harga saat ini, riwayat harga, pengaturan alert, link ke Shopee, tombol pause/delete.

### Settings / Telegram
Status binding Telegram, binding code, tombol connect, tombol disconnect, tombol test notification.

---

## 20. Kebutuhan Telegram Bot

Command MVP: /start, /help, /bind, /test, /status.

| Command | Fungsi |
|---|---|
| /start | Mulai bot dan menerima binding code |
| /help | Menampilkan bantuan |
| /bind | Alternatif binding manual |
| /test | Kirim notifikasi test |
| /status | Menampilkan jumlah produk aktif |

Mode:
Development: long polling.
Production: webhook.

Webhook production endpoint: POST /webhook/telegram.
Kebutuhan: HTTPS, validasi secret token, respond cepat, process update secara async jika perlu.

---

## 21. Logging & Monitoring Requirements

Logging wajib: auth event, product event, price check event, alert event, notification event, telegram binding event, scheduler event, error event.

Monitoring wajib: API uptime, database health, telegram bot health, scheduler health, price check failure rate, notification failure rate.

Alert internal contoh: API down, database tidak bisa connect, Telegram bot error, scheduler gagal 3x berturut-turut, price checker failure rate > 30%, notification failure rate > 20%.

---

## 22. Keamanan

Authentication: JWT access token, refresh token, Argon2/bcrypt.

Authorization: user hanya bisa mengakses data miliknya. Contoh: GET /api/products/:id harus cek product.user_id === current_user.id.

Input validation: email, password, URL, product name, target price, percentage.

Rate limiting endpoint sensitif: POST /api/auth/login, POST /api/auth/register, POST /api/products, POST /api/telegram/bind.

Secret management: .env, tidak commit secret, environment variable.

---

## 23. Teknologi Final

Frontend: Angular, Tailwind CSS / Angular Material, Reactive Forms, HttpClient, Angular Signals / Services.

Backend: Express.js, TypeScript, Sequelize, PostgreSQL, Zod, Pino, Helmet, CORS, express-rate-limit.

Auth: JWT access token, refresh token, Argon2 / bcrypt.

Price checker: Axios, Cheerio, Playwright sebagai fallback opsional.

Scheduler / Queue: MVP node-cron, scale Redis + BullMQ.

Telegram: grammY, long polling untuk development, webhook untuk production.

Monitoring: Sentry, UptimeRobot / Better Stack, endpoint /health.

Deployment: Docker, VPS / Railway / Render, Nginx / Caddy, PostgreSQL managed / self-hosted.

---

## 24. Struktur Proyek dan Repository

### 24.1 Aturan umum

Backend dan frontend harus dipisahkan secara struktur folder.

Tidak disarankan menyatukan source code frontend Angular ke dalam folder backend Express, kecuali untuk kebutuhan deployment sederhana yang bersifat sementara.

Tujuan pemisahan:

1. Memisahkan tanggung jawab antara UI dan API.
2. Memudahkan deployment terpisah.
3. Memudahkan maintenance.
4. Memudahkan onboarding developer baru.
5. Menghindari konflik antar module.
6. Memudahkan scale ke arsitektur microservice atau multi-app di masa depan.

---

### 24.2 Rekomendasi struktur MVP

Untuk MVP, disarankan menggunakan satu repository dengan struktur monorepo sederhana.

Contoh:

```txt
shopee-price-tracker/
├── backend/
├── frontend/
├── docs/
├── docker-compose.yml
├── .gitignore
└── README.md
```

Jika ingin menggunakan penamaan eksplisit:

```txt
shopee-price-tracker/
├── shopee-price-tracker-backend/
├── shopee-price-tracker-frontend/
├── docs/
├── docker-compose.yml
├── .gitignore
└── README.md
```

Namun untuk kesederhanaan, nama folder berikut sudah cukup:

```txt
backend/
frontend/
docs/
```

---

### 24.3 Struktur folder backend

Contoh struktur backend:

```txt
backend/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── models/
│   ├── middlewares/
│   ├── validators/
│   ├── jobs/
│   ├── integrations/
│   ├── utils/
│   └── types/
├── tests/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── Dockerfile
└── README.md
```

Tanggung jawab folder backend:

| Folder | Fungsi |
|---|---|
| config | Konfigurasi env, database, Telegram, CORS |
| routes | Definisi endpoint API |
| controllers | Handler request HTTP |
| services | Business logic |
| repositories | Akses data ke database |
| models | Model Sequelize |
| middlewares | Auth, error handler, rate limit |
| validators | Validasi input |
| jobs | Scheduler dan background job |
| integrations | Telegram dan price checker Shopee |
| utils | Helper umum |
| types | TypeScript types/interfaces |

---

### 24.4 Struktur folder frontend

Contoh struktur frontend Angular:

```txt
frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   ├── shared/
│   │   ├── layout/
│   │   └── features/
│   ├── assets/
│   ├── environments/
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
├── tsconfig.json
├── proxy.conf.json
├── Dockerfile
└── README.md
```

Tanggung jawab folder frontend:

| Folder | Fungsi |
|---|---|
| core | Auth service, interceptor, guard, model |
| shared | Komponen reusable, pipe, utility |
| layout | Layout utama aplikasi |
| features | Halaman berbasis fitur |
| environments | Konfigurasi API URL development/production |

---

### 24.5 Folder dokumentasi

Dokumentasi proyek disimpan terpisah.

Contoh:

```txt
docs/
├── PRD.md
├── architecture.md
├── database-schema.md
├── api-contract.md
├── deployment.md
└── telegram-bot.md
```

---

### 24.6 Pemisahan environment

Backend dan frontend harus memiliki konfigurasi environment masing-masing.

Backend menggunakan:

```txt
.env
.env.example
```

Frontend Angular menggunakan:

```txt
src/environments/environment.ts
src/environments/environment.prod.ts
```

Contoh environment frontend:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

Contoh environment production:

```ts
export const environment = {
  production: true,
  apiUrl: 'https://api.domainkamu.com/api'
};
```

---

### 24.7 Aturan komunikasi frontend dan backend

1. Frontend hanya berkomunikasi ke backend melalui HTTP API.
2. Frontend tidak boleh mengakses database secara langsung.
3. Backend tidak boleh bergantung pada struktur folder frontend.
4. Semua endpoint API backend menggunakan prefix `/api`.
5. Endpoint webhook Telegram berada di backend.
6. CORS backend hanya mengizinkan domain frontend yang sah.

---

### 24.8 Opsi repository

#### Opsi A: Satu repository monorepo

Direkomendasikan untuk MVP dan solo developer.

Contoh:

```txt
shopee-price-tracker/
├── backend/
├── frontend/
└── docs/
```

Kelebihan:

1. Lebih mudah dikelola.
2. Perubahan frontend dan backend bisa dilakukan dalam satu commit.
3. Dokumentasi terpusat.
4. Setup lebih sederhana.

#### Opsi B: Dua repository terpisah

Digunakan jika tim atau deployment sudah benar-benar terpisah.

Contoh:

```txt
shopee-price-tracker-backend
shopee-price-tracker-frontend
```

Kelebihan:

1. CI/CD bisa terpisah.
2. Rilis frontend dan backend tidak harus bersamaan.
3. Cocok untuk tim besar.

Kekurangan:

1. Lebih rumit untuk solo developer.
2. Dokumentasi bisa terpisah.
3. Perlu sinkronisasi versi API.

---

### 24.9 Aturan deployment

1. Frontend dan backend harus bisa di-deploy secara terpisah.
2. Frontend Angular dapat di-deploy ke Vercel, Netlify, Cloudflare Pages, atau VPS dengan Nginx.
3. Backend Express dapat di-deploy ke Railway, Render, Fly.io, atau VPS.
4. Database PostgreSQL sebaiknya menggunakan managed database jika production.
5. Jika menggunakan Docker, setiap service memiliki Dockerfile masing-masing.
6. Docker-compose digunakan untuk development lokal.

Contoh service Docker:

```txt
frontend
backend
worker
db
redis
```

---

### 24.10 Acceptance criteria struktur proyek

1. Folder backend dan frontend terpisah.
2. Tidak ada source code Angular di dalam folder backend.
3. Tidak ada source code Express di dalam folder frontend.
4. Backend memiliki file environment example.
5. Frontend memiliki environment configuration.
6. Dokumentasi disimpan di folder docs.
7. Aplikasi frontend dapat berjalan sendiri dengan perintah `npm start` atau `ng serve`.
8. Aplikasi backend dapat berjalan sendiri dengan perintah `npm run dev`.
9. Backend dan frontend dapat di-deploy secara terpisah.

---

## 25. Success Metrics MVP

| Metric | Target awal |
|---|---|
| User berhasil register | 100 user pertama |
| User menambah produk | Minimal 1 produk per user |
| User binding Telegram | > 50% user aktif |
| Notifikasi berhasil terkirim | > 95% |
| Price check sukses | > 80% tergantung stabilitas source |
| Retensi mingguan | User kembali dalam 7 hari |
| Error rate API | < 5% |
| Duplikasi notifikasi | 0 kasus |

---

## 26. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Struktur Shopee berubah | Price checker gagal | Logging, alert, parser modular |
| Rate limit/block | Tidak bisa cek harga | Delay, retry terbatas, jangan agresif |
| Data harga tidak ada di HTML | Parsing gagal | Siapkan fallback Playwright |
| Telegram limit | Notifikasi gagal | Queue, batching, retry |
| Notifikasi spam | User risih | Cooldown, threshold, duplicate prevention |
| Server down | Notifikasi telat | Monitoring, health check, auto restart |
| Database penuh | Performa turun | Backup, cleanup log lama |
| Scraping melanggar ToS | Risiko legal | Utamakan API resmi/data publik, jangan akses akun user |
| Struktur proyek tercampur | Sulit maintenance | Pisahkan backend dan frontend sejak awal |

---

## 27. Roadmap Pengembangan

### Phase 1: MVP
Aplikasi bisa dipakai untuk memantau harga dan mengirim notifikasi Telegram.
Fitur: auth, CRUD produk, price checker, scheduler, Telegram binding, notifikasi Telegram, logging dasar, health check, struktur proyek terpisah.

### Phase 2: Stability
Sistem lebih stabil dan tidak spam.
Fitur: retry mechanism, alert cooldown, notification logs, price check logs, monitoring dashboard, error alerting.

### Phase 3: Scale
Mendukung lebih banyak user dan produk.
Fitur: Redis + BullMQ, worker terpisah, queue monitoring, database optimization, caching, rate limiter lanjutan.

### Phase 4: Growth
Menambah fitur yang meningkatkan value.
Fitur: grafik harga, email notification, WhatsApp notification, target price lanjutan, alert stok tersedia, produk favorit, referral/affiliate, premium plan.

---

## 28. Definisi Selesai MVP

MVP dianggap selesai jika:

1. User dapat register dan login.
2. User dapat menambah produk Shopee dari link.
3. Sistem dapat menyimpan produk ke database.
4. Sistem dapat mengambil harga produk minimal untuk sebagian besar link yang didukung.
5. Sistem dapat menyimpan riwayat harga.
6. Scheduler dapat mengecek harga secara berkala.
7. User dapat binding Telegram.
8. Sistem dapat mengirim notifikasi Telegram saat harga turun.
9. Notifikasi tidak duplikat.
10. Logging dasar aktif.
11. Endpoint health tersedia.
12. Aplikasi bisa di-deploy ke production.
13. Struktur folder backend dan frontend terpisah dengan rapi.

---

## 29. Catatan Penting

Aplikasi ini sebaiknya tidak diposisikan sebagai akses otomatis ke keranjang Shopee user, karena itu membutuhkan data login user dan berisiko.

Lebih aman diposisikan sebagai price tracker untuk produk Shopee yang ditambahkan user secara manual.

Positioning aman: "Pantau harga produk Shopee dan dapatkan notifikasi saat harga turun."

Bukan: "Akses keranjang Shopee user secara otomatis."

---

## 30. Ringkasan Eksekutif

Aplikasi ini adalah web price tracker untuk produk Shopee. User menambahkan link produk, sistem memantau harga secara berkala, dan user mendapat notifikasi Telegram saat harga turun atau mencapai target.

Stack MVP: Angular, Express.js, PostgreSQL, Sequelize, JWT + Refresh Token, Axios, Cheerio, node-cron, grammY, Telegram Bot, Pino, Sentry, Docker.

Fokus MVP: auth, tambah produk, parsing harga, simpan riwayat harga, scheduler, alert engine, Telegram binding, notifikasi Telegram, logging & monitoring dasar, serta struktur proyek terpisah antara backend dan frontend.