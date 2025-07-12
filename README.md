# Think Forward API

RESTful API untuk manajemen pelaporan hazard, voice member, dan review berbasis Express.js, Sequelize, dan MSSQL.

## Fitur Utama

- CRUD untuk entitas Submission, Hazard Assessment, Hazard Report, Hazard Evaluation, Review, dsb
- Validasi data dengan Joi (schema terpisah)
- Logging otomatis ke tabel Log untuk setiap aksi create, update, delete
- Struktur modular: routes, controllers, services, models, middlewares, config, enums, schemas
- Support environment variable (.env)
- Request logging dengan morgan
- Transaksi database untuk operasi penting
- **Response sukses & error global, konsisten di seluruh API**

## Struktur Folder

```
├── config/           # Konfigurasi database & environment
├── controllers/      # Logic utama per resource
├── enums/            # Enum (pilihan value tetap)
├── middlewares/      # Middleware (logging, error handler, auth, dsb)
├── models/           # Definisi model Sequelize
├── routes/           # Definisi endpoint per resource
├── schemas/          # Schema validasi Joi
├── services/         # Business logic & utility (termasuk logService)
├── .env              # Variabel environment (jangan commit ke git)
├── .gitignore        # File/folder yang diabaikan git
├── package.json      # Dependensi & script
├── server.js         # Entry point aplikasi
└── README.md         # Dokumentasi ini
```

## Instalasi & Setup

1. **Clone repo & install dependencies**
   ```bash
   git clone <repo-url>
   cd think-forward
   npm install
   ```
2. **Buat file `.env`**
   ```env
   PORT=3000
   DB_USER=your_db_user
   DB_PASS=your_db_password
   DB_NAME=your_db_name
   DB_HOST=localhost
   DB_PORT=1433
   ```
3. **Jalankan server**
   ```bash
   npm run dev
   # atau
   npm start
   ```

## Contoh Response API

### Response Sukses (Create Submission)

```json
{
  "success": true,
  "message": "Submission created successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "submissionNumber": "SUB-001",
    "type": "hazard",
    "shift": "red",
    "incidentDate": "2024-06-01",
    "incidentTime": "08:00:00",
    "workProcess": "Maintenance",
    "location": "Plant A",
    "status": "waiting review",
    "createdAt": "2024-06-01T08:00:00.000Z",
    "updatedAt": "2024-06-01T08:00:00.000Z"
  }
}
```

### Response Error (Validasi)

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "userId is required",
    "shift must be one of: red, white, non-shift"
  ]
}
```

### Response Not Found

```json
{
  "success": false,
  "message": "Submission not found"
}
```

### Response List (GET All)

```json
{
  "success": true,
  "message": "List of submissions",
  "data": [
    { "id": 1, ... },
    { "id": 2, ... }
  ]
}
```

## Best Practice yang Digunakan

- **Modular Structure**: Setiap concern dipisah per folder (service, controller, dsb)
- **Validation**: Semua input tervalidasi sebelum masuk DB
- **Transaction**: Operasi penting dibungkus transaction agar data konsisten
- **Logging**: Semua perubahan data penting tercatat di tabel Log
- **.env**: Semua credential & config sensitif diatur lewat environment variable
- **ESModules**: Modern JS (import/export)
- **Global Response**: Semua response sukses & error konsisten (format: success, message, data/errors)

## Kontribusi

Pull request & issue sangat terbuka untuk pengembangan lebih lanjut!
