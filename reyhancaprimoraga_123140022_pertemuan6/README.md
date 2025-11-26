# Aplikasi Manajemen Matakuliah dengan Pyramid Framework

## Deskripsi Proyek

Aplikasi ini adalah implementasi API CRUD sederhana untuk manajemen data matakuliah menggunakan:

- **Framework**: Pyramid Web Framework
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Migrasi**: Alembic
- **Template Engine**: Jinja2

Aplikasi ini mengikuti standar Pyramid Framework dan best practices REST API dengan response format production-grade.

---

## Fitur Utama

✅ **CRUD Operations** - Operasi lengkap Create, Read, Update, Delete
✅ **REST API** - Endpoint terstruktur dengan HTTP methods yang tepat
✅ **Database Migration** - Manajemen skema database dengan Alembic
✅ **Validasi Input** - Validasi field wajib dan tipe data
✅ **Error Handling** - Penanganan error yang komprehensif dengan logging
✅ **Response Format** - Response JSON yang konsisten dan production-grade
✅ **Pretty JSON** - Output JSON yang terformat rapi dengan indentasi

---

## Persyaratan Sistem

- Python 3.8+
- PostgreSQL 12+
- pip (Python Package Manager)
- Virtual Environment (venv)

---

## Cara Instalasi

### 1. Setup Virtual Environment

```bash
# Windows (PowerShell)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Linux/macOS
python3 -m venv venv
source venv/bin/activate
```

### 2. Instalasi Dependensi

```bash
pip install -e ".[testing]"
```

File `setup.py` akan menginstal semua dependencies yang diperlukan:

- pyramid
- pyramid_jinja2
- pyramid_debugtoolbar
- SQLAlchemy
- Alembic
- psycopg2 (PostgreSQL adapter)
- waitress (WSGI server)

### 3. Konfigurasi Database PostgreSQL

#### A. Buat Database PostgreSQL

```sql
-- Menggunakan psql atau DBeaver
CREATE DATABASE matakuliah_db;
```

#### B. Update Koneksi di development.ini

```ini
sqlalchemy.url = postgresql://postgres:pwpostgre@localhost:5432/matakuliah_db
```

**Format koneksi:**

```
postgresql://[user]:[password]@[host]:[port]/[database_name]
```

- **user**: Username PostgreSQL (default: postgres)
- **password**: Password PostgreSQL
- **host**: Host database (default: localhost)
- **port**: Port PostgreSQL (default: 5432)
- **database_name**: Nama database (matakuliah_db)

### 4. Migrasi Database

```bash
# Generate migration dari model (jika belum ada)
alembic -c development.ini revision --autogenerate -m "create_matakuliah_table"

# Terapkan migration ke database
alembic -c development.ini upgrade head

# Verifikasi status migration
alembic -c development.ini current
```

---

## Cara Menjalankan

### 1. Aktifkan Virtual Environment

```bash
# Windows (PowerShell)
.\venv\Scripts\Activate.ps1

# Linux/macOS
source venv/bin/activate
```

### 2. Jalankan Server

```bash
# Mode development dengan auto-reload
pserve development.ini --reload

# Mode production (tanpa reload)
pserve development.ini
```

Server akan berjalan di: **http://localhost:6543**

### 3. Akses Aplikasi

- **Home Page**: http://localhost:6543/
- **Debug Toolbar**: http://localhost:6543/\_debug_toolbar/
- **API Endpoint**: http://localhost:6543/api/matakuliah

---

## Testing & Screenshots

Bagian ini menunjukkan hasil testing semua endpoint API dengan curl commands dan actual terminal responses.

Screenshot disimpan di: `screenshots/`

### 📸 Screenshot Testing - Test Case 1: CREATE (POST)

**File: screenshots/01_create_success.png**

![Create Success](./screenshots/01_create_success.png)

```bash
$ curl -X POST http://localhost:6543/api/matakuliah \
  -H "Content-Type: application/json" \
  -d '{"kode_mk":"IF101","nama_mk":"Algoritma dan Pemrograman","sks":3,"semester":1}'
{
  "code": 201,
  "data": {
    "matakuliah": {
      "id": 1,
      "kode_mk": "IF101",
      "nama_mk": "Algoritma dan Pemrograman",
      "semester": 1,
      "sks": 3
    }
  },
  "message": "Matakuliah created successfully",
  "success": true,
  "timestamp": "2025-11-26T12:38:18.639713Z"
}
```

---

**File: screenshots/02_create_validation_error.png**

![Create Validation Error](./screenshots/02_create_validation_error.png)

```bash
$ curl -X POST http://localhost:6543/api/matakuliah \
  -H "Content-Type: application/json" \
  -d '{"kode_mk":"IF101"}'
{
  "code": 400,
  "errors": {
    "missing_fields": [
      "nama_mk",
      "sks",
      "semester"
    ]
  },
  "message": "Validation failed",
  "success": false,
  "timestamp": "2025-11-26T12:38:26.916914Z"
}
```

---

**File: screenshots/03_create_type_error.png**

![Create Type Error](./screenshots/03_create_type_error.png)

```bash
$ curl -X POST http://localhost:6543/api/matakuliah \
  -H "Content-Type: application/json" \
  -d '{"kode_mk":"IF101","nama_mk":"Algoritma dan Pemrograman","sks":"tiga","semester":1}'
{
  "code": 400,
  "errors": {
    "sks": "Must be a positive integer"
  },
  "message": "Validation failed",
  "success": false,
  "timestamp": "2025-11-26T12:46:16.645344Z"
}
```

---

### 📸 Screenshot Testing - Test Case 2: READ ALL (GET)

**File: screenshots/04_read_all_success.png**

![Read All Success](./screenshots/04_read_all_success.png)

```bash
$ curl -X GET http://localhost:6543/api/matakuliah
{
  "code": 200,
  "data": {
    "matakuliahs": [
      {
        "id": 1,
        "kode_mk": "IF101",
        "nama_mk": "Algoritma dan Pemrograman",
        "semester": 1,
        "sks": 3
      }
    ],
    "total": 1
  },
  "message": "Matakuliah data retrieved successfully",
  "success": true,
  "timestamp": "2025-11-26T12:46:33.036747Z"
}
```

---

**File: screenshots/05_read_all_empty.png**

![Read All Empty](./screenshots/05_read_all_empty.png)

```bash
$ curl -X GET http://localhost:6543/api/matakuliah
{
  "code": 200,
  "data": {
    "matakuliahs": [],
    "total": 0
  },
  "message": "Matakuliah data retrieved successfully",
  "success": true,
  "timestamp": "2025-11-26T13:13:21.188933Z"
}
```

---

### 📸 Screenshot Testing - Test Case 3: READ ONE (GET by ID)

**File: screenshots/06_read_one_success.png**

![Read One Success](./screenshots/06_read_one_success.png)

```bash
$ curl -X GET http://localhost:6543/api/matakuliah/1
{
  "code": 200,
  "data": {
    "matakuliah": {
      "id": 1,
      "kode_mk": "IF101",
      "nama_mk": "Algoritma dan Pemrograman",
      "semester": 1,
      "sks": 3
    }
  },
  "message": "Matakuliah data retrieved successfully",
  "success": true,
  "timestamp": "2025-11-26T12:46:42.037414Z"
}
```

---

**File: screenshots/07_read_one_not_found.png**

![Read One Not Found](./screenshots/07_read_one_not_found.png)

```bash
$ curl -X GET http://localhost:6543/api/matakuliah/1
{
  "code": 404,
  "errors": {
    "resource": "Matakuliah with id 1 does not exist"
  },
  "message": "Matakuliah not found",
  "success": false,
  "timestamp": "2025-11-26T13:16:43.482522Z"
}
```

---

### 📸 Screenshot Testing - Test Case 4: UPDATE (PUT)

**File: screenshots/08_update_success.png**

![Update Success](./screenshots/08_update_success.png)

```bash
$ curl -X PUT http://localhost:6543/api/matakuliah/1 \
  -H "Content-Type: application/json" \
  -d '{"sks":4,"semester":2}'
{
  "code": 200,
  "data": {
    "matakuliah": {
      "id": 1,
      "kode_mk": "IF101",
      "nama_mk": "Algoritma dan Pemrograman",
      "semester": 2,
      "sks": 4
    }
  },
  "message": "Matakuliah updated successfully",
  "success": true,
  "timestamp": "2025-11-26T12:46:51.897011Z"
}
```

---

**File: screenshots/09_update_validation_error.png**

![Update Validation Error](./screenshots/09_update_validation_error.png)

```bash
$ curl -X PUT http://localhost:6543/api/matakuliah/2 \
  -H "Content-Type: application/json" \
  -d '{"sks":"empat","semester":"dua"}'
{
  "code": 400,
  "errors": {
    "sks": "Must be a positive integer"
  },
  "message": "Validation failed",
  "success": false,
  "timestamp": "2025-11-26T13:23:33.105832Z"
}
```

---

**File: screenshots/10_update_not_found.png**

![Update Not Found](./screenshots/10_update_not_found.png)

```bash
$ curl -X PUT http://localhost:6543/api/matakuliah/1 \
  -H "Content-Type: application/json" \
  -d '{"sks":4,"semester":2}'
{
  "code": 404,
  "errors": {
    "resource": "Matakuliah with id 1 does not exist"
  },
  "message": "Matakuliah not found",
  "success": false,
  "timestamp": "2025-11-26T13:19:14.776741Z"
}
```

---

### 📸 Screenshot Testing - Test Case 5: DELETE

**File: screenshots/11_delete_success.png**

![Delete Success](./screenshots/11_delete_success.png)

```bash
$ curl -X DELETE http://localhost:6543/api/matakuliah/1
{
  "code": 200,
  "data": {
    "deleted_matakuliah": {
      "id": 1,
      "kode_mk": "IF101",
      "nama_mk": "Algoritma dan Pemrograman",
      "semester": 2,
      "sks": 4
    }
  },
  "message": "Matakuliah deleted successfully",
  "success": true,
  "timestamp": "2025-11-26T12:47:00.197985Z"
}
```

---

**File: screenshots/12_delete_not_found.png**

![Delete Not Found](./screenshots/12_delete_not_found.png)

```bash
$ curl -X DELETE http://localhost:6543/api/matakuliah/1
{
  "code": 404,
  "errors": {
    "resource": "Matakuliah with id 1 does not exist"
  },
  "message": "Matakuliah not found",
  "success": false,
  "timestamp": "2025-11-26T13:26:01.742100Z"
}
```

---

## Struktur Model Data

### Tabel: matakuliah

| Atribut  | Tipe    | Deskripsi            | Constraint       |
| -------- | ------- | -------------------- | ---------------- |
| id       | Integer | Primary key          | Auto increment   |
| kode_mk  | Text    | Kode mata kuliah     | Unique, Not null |
| nama_mk  | Text    | Nama mata kuliah     | Not null         |
| sks      | Integer | Jumlah SKS           | Not null, > 0    |
| semester | Integer | Semester pengambilan | Not null, > 0    |

### Model Class (SQLAlchemy)

```python
class Matakuliah(Base):
    __tablename__ = 'matakuliah'

    id = Column(Integer, primary_key=True)
    kode_mk = Column(Text, unique=True, nullable=False)
    nama_mk = Column(Text, nullable=False)
    sks = Column(Integer, nullable=False)
    semester = Column(Integer, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'kode_mk': self.kode_mk,
            'nama_mk': self.nama_mk,
            'sks': self.sks,
            'semester': self.semester,
        }
```

---

## API Endpoints

### 1. GET Semua Matakuliah

**Request:**

```bash
curl -X GET http://localhost:6543/api/matakuliah \
  -H "Content-Type: application/json"
```

**Response (200 OK):**

```json
{
  "success": true,
  "code": 200,
  "message": "Matakuliah data retrieved successfully",
  "timestamp": "2025-11-26T01:45:00.123456Z",
  "data": {
    "matakuliahs": [
      {
        "id": 1,
        "kode_mk": "IF101",
        "nama_mk": "Algoritma dan Pemrograman",
        "sks": 3,
        "semester": 1
      },
      {
        "id": 2,
        "kode_mk": "IF102",
        "nama_mk": "Struktur Data",
        "sks": 3,
        "semester": 1
      }
    ],
    "total": 2
  }
}
```

---

### 2. GET Detail Satu Matakuliah

**Request:**

```bash
curl -X GET http://localhost:6543/api/matakuliah/1 \
  -H "Content-Type: application/json"
```

**Response (200 OK):**

```json
{
  "success": true,
  "code": 200,
  "message": "Matakuliah data retrieved successfully",
  "timestamp": "2025-11-26T01:45:00.123456Z",
  "data": {
    "matakuliah": {
      "id": 1,
      "kode_mk": "IF101",
      "nama_mk": "Algoritma dan Pemrograman",
      "sks": 3,
      "semester": 1
    }
  }
}
```

**Response (404 Not Found):**

```json
{
  "success": false,
  "code": 404,
  "message": "Matakuliah not found",
  "timestamp": "2025-11-26T01:45:00.123456Z",
  "errors": {
    "resource": "Matakuliah with id 999 does not exist"
  }
}
```

---

### 3. POST Tambah Matakuliah Baru

**Request:**

```bash
curl -X POST http://localhost:6543/api/matakuliah \
  -H "Content-Type: application/json" \
  -d '{
    "kode_mk": "IF101",
    "nama_mk": "Algoritma dan Pemrograman",
    "sks": 3,
    "semester": 1
  }'
```

**Response (201 Created):**

```json
{
  "success": true,
  "code": 201,
  "message": "Matakuliah created successfully",
  "timestamp": "2025-11-26T01:45:00.123456Z",
  "data": {
    "matakuliah": {
      "id": 1,
      "kode_mk": "IF101",
      "nama_mk": "Algoritma dan Pemrograman",
      "sks": 3,
      "semester": 1
    }
  }
}
```

**Response (400 Bad Request - Missing Fields):**

```json
{
  "success": false,
  "code": 400,
  "message": "Validation failed",
  "timestamp": "2025-11-26T01:45:00.123456Z",
  "errors": {
    "missing_fields": ["kode_mk", "nama_mk"]
  }
}
```

**Response (400 Bad Request - Invalid Type):**

```json
{
  "success": false,
  "code": 400,
  "message": "Validation failed",
  "timestamp": "2025-11-26T01:45:00.123456Z",
  "errors": {
    "sks": "Must be a positive integer",
    "semester": "Must be a positive integer"
  }
}
```

---

### 4. PUT Update Matakuliah

**Request:**

```bash
curl -X PUT http://localhost:6543/api/matakuliah/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nama_mk": "Algoritma dan Pemrograman Lanjut",
    "sks": 4
  }'
```

**Response (200 OK):**

```json
{
  "success": true,
  "code": 200,
  "message": "Matakuliah updated successfully",
  "timestamp": "2025-11-26T01:45:00.123456Z",
  "data": {
    "matakuliah": {
      "id": 1,
      "kode_mk": "IF101",
      "nama_mk": "Algoritma dan Pemrograman Lanjut",
      "sks": 4,
      "semester": 1
    }
  }
}
```

**Response (404 Not Found):**

```json
{
  "success": false,
  "code": 404,
  "message": "Matakuliah not found",
  "timestamp": "2025-11-26T01:45:00.123456Z",
  "errors": {
    "resource": "Matakuliah with id 999 does not exist"
  }
}
```

---

### 5. DELETE Hapus Matakuliah

**Request:**

```bash
curl -X DELETE http://localhost:6543/api/matakuliah/1 \
  -H "Content-Type: application/json"
```

**Response (200 OK):**

```json
{
  "success": true,
  "code": 200,
  "message": "Matakuliah deleted successfully",
  "timestamp": "2025-11-26T01:45:00.123456Z",
  "data": {
    "deleted_matakuliah": {
      "id": 1,
      "kode_mk": "IF101",
      "nama_mk": "Algoritma dan Pemrograman",
      "sks": 3,
      "semester": 1
    }
  }
}
```

---

## Testing

### Menggunakan Curl

#### 1. Create Data (3 Matakuliah)

```bash
# Matakuliah 1
curl -X POST http://localhost:6543/api/matakuliah \
  -H "Content-Type: application/json" \
  -d '{"kode_mk":"IF101","nama_mk":"Algoritma dan Pemrograman","sks":3,"semester":1}'

# Matakuliah 2
curl -X POST http://localhost:6543/api/matakuliah \
  -H "Content-Type: application/json" \
  -d '{"kode_mk":"IF102","nama_mk":"Struktur Data","sks":3,"semester":1}'

# Matakuliah 3
curl -X POST http://localhost:6543/api/matakuliah \
  -H "Content-Type: application/json" \
  -d '{"kode_mk":"IF201","nama_mk":"Pemrograman Berorientasi Objek","sks":4,"semester":2}'
```

#### 2. Get All Data

```bash
curl -X GET http://localhost:6543/api/matakuliah
```

#### 3. Get Detail Data

```bash
curl -X GET http://localhost:6543/api/matakuliah/1
curl -X GET http://localhost:6543/api/matakuliah/2
curl -X GET http://localhost:6543/api/matakuliah/3
```

#### 4. Update Data

```bash
curl -X PUT http://localhost:6543/api/matakuliah/1 \
  -H "Content-Type: application/json" \
  -d '{"sks":4}'
```

#### 5. Delete Data

```bash
curl -X DELETE http://localhost:6543/api/matakuliah/1
```

### Menggunakan Postman

1. Import collection dari file: `matakuliah_api_postman.json`
2. Atau manual:
   - Buat request GET ke `http://localhost:6543/api/matakuliah`
   - Buat request POST ke `http://localhost:6543/api/matakuliah` dengan body JSON
   - Set header: `Content-Type: application/json`
   - Kirim request dan periksa response

---

## Struktur Direktori

```
c:\Users\reyha\pyramid_matakuliah\
├── matakuliah_app/                 # Aplikasi Pyramid
│   ├── __init__.py
│   ├── routes.py
│   ├── models/
│   ├── views/
│   ├── templates/
│   ├── static/
│   ├── scripts/
│   └── alembic/
├── tests/                          # Unit tests
├── screenshots/                    # Screenshot testing
│   ├── 01_create_success.png
│   ├── 02_create_validation_error.png
│   ├── 03_create_type_error.png
│   ├── 04_read_all_success.png
│   ├── 05_read_all_empty.png
│   ├── 06_read_one_success.png
│   ├── 07_read_one_not_found.png
│   ├── 08_update_success.png
│   ├── 09_update_validation_error.png
│   ├── 10_update_not_found.png
│   ├── 11_delete_success.png
│   └── 12_delete_not_found.png
├── venv/                           # Virtual environment
├── alembic.ini                     # Alembic configuration
├── development.ini                # Development config
├── production.ini                 # Production config
├── testing.ini                    # Testing config
├── setup.py                       # Setup configuration
└── README.md                      # Dokumentasi (file ini)
```

---

## Konfigurasi Pyramid

### development.ini

File konfigurasi utama untuk environment development:

```ini
[app:main]
use = egg:matakuliah_app

pyramid.reload_templates = true
pyramid.debug_authorization = false
pyramid.debug_notfound = false
pyramid.debug_routematch = false
pyramid.default_locale_name = en
pyramid.includes =
    pyramid_debugtoolbar

sqlalchemy.url = postgresql://postgres:pwpostgre@localhost:5432/matakuliah_db

[server:main]
use = egg:waitress#main
listen = localhost:6543
```

### Routes (routes.py)

```python
def includeme(config):
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('home', '/')

    # API Routes
    config.add_route('matakuliah_collection', '/api/matakuliah')
    config.add_route('matakuliah_detail', '/api/matakuliah/{id}')
```

---

## Response Format

### Success Response Format

```json
{
  "success": true,
  "code": 200,
  "message": "Operation successful message",
  "timestamp": "2025-11-26T01:45:00.123456Z",
  "data": {
    // Response data here
  }
}
```

### Error Response Format

```json
{
  "success": false,
  "code": 400,
  "message": "Error message",
  "timestamp": "2025-11-26T01:45:00.123456Z",
  "errors": {
    "field_name": "Error detail"
  }
}
```

### HTTP Status Codes

| Code | Deskripsi             | Use Case                 |
| ---- | --------------------- | ------------------------ |
| 200  | OK                    | GET, PUT success         |
| 201  | Created               | POST success             |
| 400  | Bad Request           | Validation error         |
| 404  | Not Found             | Resource tidak ditemukan |
| 500  | Internal Server Error | Server error             |

---

## Logging & Error Handling

### Logging Configuration

Aplikasi menggunakan Python logging module dengan level:

- **DEBUG**: Informasi detail untuk debugging
- **INFO**: General informational messages
- **WARNING**: Warning messages
- **ERROR**: Error messages

Logs akan ditampilkan di console dan dapat dikonfigurasi di `development.ini`

### Error Handling

Semua endpoint memiliki try-except untuk:

1. Menangani validation errors
2. Menangani database errors
3. Mencatat error ke log (tidak ke client)
4. Return error response yang aman (tanpa sensitive info)

---

## Best Practices yang Diimplementasikan

✅ **RESTful API Design** - HTTP methods yang tepat (GET, POST, PUT, DELETE)
✅ **Consistent Response Format** - Response format yang selalu sama
✅ **Input Validation** - Validasi field wajib dan tipe data
✅ **Error Handling** - Error handling yang komprehensif
✅ **Logging** - Semua operasi penting di-log
✅ **Security** - Tidak ada sensitive info di response
✅ **Code Documentation** - Docstrings untuk semua functions
✅ **Code Style** - Mengikuti PEP 8 Python style guide
✅ **Modular Structure** - Separation of concerns (models, views, routes)

---

## Troubleshooting

### Problem: Database Connection Error

**Error**: `Could not connect to server: No connection could be made because the target machine actively refused it`

**Solusi**:

1. Pastikan PostgreSQL service berjalan
2. Periksa connection string di `development.ini`
3. Periksa username dan password PostgreSQL
4. Periksa apakah database sudah dibuat

### Problem: Migration Error

**Error**: `Can't locate revision identified by 'xxxx'`

**Solusi**:

1. Periksa file migration di `alembic/versions/`
2. Pastikan file migration ada di folder yang benar
3. Jalankan: `alembic -c development.ini current`

### Problem: Module Import Error

**Error**: `ModuleNotFoundError: No module named 'xxx'`

**Solusi**:

1. Pastikan virtual environment aktif
2. Reinstall dependencies: `pip install -e ".[testing]"`

### Problem: Port Already in Use

**Error**: `Address already in use` pada port 6543

**Solusi**:

1. Matikan aplikasi lain yang menggunakan port 6543
2. Atau gunakan port lain: `pserve development.ini listen=localhost:6544`

## Resources & Referensi

- [Pyramid Documentation](https://docs.pylonsproject.org/projects/pyramid/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/en/20/orm/)
- [Alembic Migrations](https://alembic.sqlalchemy.org/)
- [RESTful API Design](https://restfulapi.net/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## Kontak & Support

Untuk pertanyaan atau issues, silakan hubungi instruktur praktikum atau buka issue di repository.

---

**Last Updated**: 26 November 2025
**Framework Version**: Pyramid 2.0+
**Python Version**: 3.8+
