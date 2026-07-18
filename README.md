# Todo List Application - Laravel + Docker + CI/CD

Aplikasi Todo List sederhana menggunakan Laravel yang diintegrasikan dengan Docker, Docker Compose, dan GitHub Actions untuk CI/CD.

## 📋 Deskripsi Aplikasi

Aplikasi ini adalah sistem manajemen tugas (Todo List) sederhana dengan fitur:
- Membuat, membaca, memperbarui, dan menghapus todo (CRUD)
- RESTful API untuk manajemen todo
- Health check endpoint untuk monitoring
- MariaDB/MySQL container untuk penyimpanan data runtime, SQLite untuk testing lokal

## 🛠️ Teknologi yang Digunakan

- **PHP 8.3** dengan **Laravel 13.8**
- **MariaDB/MySQL** sebagai database runtime, **SQLite** untuk testing lokal
- **Docker** untuk containerization
- **Docker Compose** untuk orchestration
- **GitHub Actions** untuk CI/CD pipeline
- **PHPUnit** untuk automated testing

## 📁 Struktur Folder

```
todo-app/
├── app/
│   ├── Console/Commands/HealthCheck.php    # Health check command
│   ├── Http/Controllers/TodoController.php  # Todo API controller
│   └── Models/Todo.php                      # Todo model
├── database/
│   ├── factories/TodoFactory.php            # Factory untuk testing
│   └── migrations/                          # Database migrations
├── routes/api.php                           # API routes
├── tests/Feature/TodoApiTest.php            # Automated tests
├── Dockerfile                               # Docker image definition
├── docker-compose.yml                       # Docker Compose configuration
├── .github/workflows/ci.yml                 # GitHub Actions workflow
└── README.md
```

## 🚀 Cara Menjalankan Aplikasi

### Prasyarat
- Docker Desktop terinstal
- Docker Compose tersedia

### Menjalankan dengan Docker Compose

```bash
# Build dan jalankan container
docker compose up -d --build

# Cek status container
docker compose ps

# Akses aplikasi di http://localhost:8080

# Health check endpoint
curl http://localhost:8080/api/health

# API endpoints
curl http://localhost:8080/api/todos
curl -X POST http://localhost:8080/api/todos -H "Content-Type: application/json" -d '{"title": "Belajar Docker", "description": "Mempelajari Docker untuk Cloud Computing"}'

# Stop container
docker compose down
```

### Menjalankan Secara Lokal (Tanpa Docker)

```bash
# Install dependencies
composer install

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Jalankan server
php artisan serve
```

## 🧪 Automated Testing

### Menjalankan Test Secara Lokal

```bash
php artisan test
```

### Test yang Tersedia
- `test_can_list_todos` - Menguji listing todos
- `test_can_create_todo` - Menguji pembuatan todo
- `test_can_show_todo` - Menguji detail todo
- `test_can_update_todo` - Menguji update todo
- `test_can_delete_todo` - Menguji penghapusan todo
- `test_validates_title_required` - Validasi field title wajib diisi

## 🐳 Docker Configuration

### Dockerfile
- Base image: `php:8.3-cli-alpine`
- Install PHP extensions: `pdo`, `pdo_sqlite`, `pdo_mysql`, `mbstring`, `xml`, `gd`, `bcmath`
- Copy source code dan install dependencies
- Generate app key
- Expose port 8000
- Jalankan `docker/entrypoint.sh` untuk menunggu database lalu menjalankan migrasi saat container start

### Docker Compose
- Service: `app` dan `db`
- Port mapping: `8080:8000`
- Volume `db_data` untuk persistence database
- Network `todo-network`
- `depends_on` untuk memastikan database siap sebelum app start
- Health check via `/api/health` endpoint
- Restart policy: `unless-stopped`

## 🔄 CI/CD Pipeline (GitHub Actions)

Workflow `.github/workflows/ci.yml` melakukan:
1. **Checkout** source code
2. **Setup PHP 8.3** dengan extensions yang diperlukan
3. **Cache** Composer packages
4. **Install dependencies** dengan Composer
5. **Generate** application key
6. **Run migrations** database SQLite untuk test lokal di CI
7. **Run automated tests** (PHPUnit)
8. **Build Docker image**
9. **Menjalankan stack multi-container** dengan Docker Compose
10. **Verifikasi health check** dan endpoint yang terhubung ke database

### Trigger Pipeline
- Push ke branch `main`
- Pull request ke branch `main`

### Simulasi Pipeline Gagal & Berhasil
1. Buat perubahan yang menyebabkan test gagal (misal: hapus validasi di test)
2. Commit dan push ke GitHub
3. Lihat pipeline gagal di GitHub Actions
4. Perbaiki kesalahan
5. Commit dan push kembali
6. Lihat pipeline berhasil

## K. Format Pengumpulan

- Nama/NIM/Kelas: Purna Siswantomo / C2C023160 / [Kelas Anda]
- Nama/NIM/Kelas: Erifa Dwi Astuti / C2C023161 / [Kelas Anda]
- Nama aplikasi: Todo List Application
- Link repository GitHub: https://github.com/Purna-Siswantomo/Todo-docker.git
- Link pipeline gagal: https://github.com/Purna-Siswantomo/Todo-docker/actions/runs/28741426116
- Link pipeline berhasil: https://github.com/Purna-Siswantomo/Todo-docker/actions/runs/28741450472
- Link video demonstrasi: [belum tersedia]
- Link image registry (opsional): [belum tersedia]
- Link aplikasi online (opsional): [belum tersedia]

### Bukti UAS yang perlu disertakan
- Link workflow GitHub Actions yang gagal
- Link workflow GitHub Actions yang berhasil
- Screenshot `docker compose ps`
- Bukti data tetap ada setelah `docker compose down` lalu `docker compose up -d`
- Bukti `php artisan test` berjalan minimal 3 test
- Bukti health check dan simulasi restart atau stop container

## 📡 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/health` | Health check |
| GET | `/api/todos` | List semua todos |
| POST | `/api/todos` | Buat todo baru |
| GET | `/api/todos/{id}` | Detail todo |
| PUT/PATCH | `/api/todos/{id}` | Update todo |
| DELETE | `/api/todos/{id}` | Hapus todo |

### Contoh Request/Response

**Create Todo:**
```bash
curl -X POST http://localhost:8080/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Belajar Laravel", "description": "Mempelajari framework Laravel"}'
```

**Response:**
```json
{
  "id": 1,
  "title": "Belajar Laravel",
  "description": "Mempelajari framework Laravel",
  "completed": false,
  "created_at": "2026-07-05T12:00:00.000000Z",
  "updated_at": "2026-07-05T12:00:00.000000Z"
}
```

## 📚 Referensi Praktikum

Tugas ini memenuhi praktikum:
- **Pertemuan 11**: Docker dalam Cloud Computing
- **Pertemuan 12**: Container Orchestration dengan Docker Compose
- **Pertemuan 13**: CI/CD dan Otomatisasi Pipeline

## 👨‍🎓 Identitas Mahasiswa

- **Nama**: Purna Siswantomo
- **NIM**: [NIM Anda]
- **Kelas**: [Kelas Anda]
- **Mata Kuliah**: Komputasi Awan (Cloud Computing)
- **Pertemuan**: 14

## 📄 Lisensi

Proyek ini dibuat untuk keperluan pembelajaran/praktikum.
