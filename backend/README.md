# RISALATECH — Backend API Service

This is the production-ready Node.js/Express backend service for **RISALATECH**, an AI-powered SaaS platform that automatically generates professional HR documents. It features JWT authentication, Redis caching, BullMQ background worker queuing for PDF generation, S3 object storage caching, multi-provider AI fallbacks, rate limiting, and GDPR compliance endpoints.

---

## 🛠️ Tech Stack

* **Runtime**: Node.js v20+
* **Framework**: Express.js
* **Database**: MongoDB (via Mongoose)
* **Caching & Queues**: Redis (via ioredis and BullMQ)
* **Object Storage**: S3-Compatible API (e.g. MinIO / AWS S3)
* **Logging**: Pino (structured JSON logs)
* **PDF Engine**: Headless Chromium (via Puppeteer)
* **AI Access**: Axios client connecting to HuggingFace Inference API, Groq, and OpenAI

---

## 🏛️ Architecture Overview

The backend uses a layered architecture adhering to SOLID principles:
1. **Routing Layer (`src/routes/`)**: Declares API routes and maps validation middleware.
2. **Middleware Layer (`src/middleware/`)**: Handles authentication, CORS, compression, request logging, input sanitization, rate limiting, and unified error handling.
3. **Controller Layer (`src/controllers/`)**: Manages the HTTP request/response cycle, sanitizes inputs, and delegates business operations to services.
4. **Service Layer (`src/services/`)**: Contains the core business logic, database queries, AI prompt executions, caching, and storage updates.
5. **Model Layer (`src/models/`)**: Defines MongoDB Mongoose schemas with indexing.
6. **Queue & Worker Layer (`src/workers/`)**: BullMQ worker daemon that pulls PDF rendering jobs from Redis and runs them concurrently outside the HTTP thread.

---

## 📂 Folder Structure

```
backend/
├── src/
│   ├── config/          # Configurations (Database, Redis, S3, Queues)
│   ├── controllers/     # HTTP Request controllers
│   ├── middleware/      # Middlewares (Auth, Rate Limit, Sanitizer, Error)
│   ├── models/          # MongoDB Mongoose Schemas
│   ├── routes/          # Express API route declarations
│   ├── services/        # Business logic services (AI, Cache, S3, Email)
│   ├── utils/           # Shared utility tools (Validators, Templates, Logger)
│   ├── workers/         # BullMQ PDF background workers
│   └── index.js         # Express App entrypoint
├── Dockerfile           # Backend containerization script
├── package.json         # Node dependencies
└── .env.example         # Template configuration env file
```

---

## 🔑 Environment Variables (`.env`)

Create a `.env` file in `backend/` or the project root. The backend automatically searches parents for it.

```env
PORT=5000                                 # Port to listen on
NODE_ENV=development                      # development | production
CORS_ORIGIN=*                             # CORS allowed hosts

MONGODB_URI=mongodb://localhost:27017/db  # MongoDB Connection URI
REDIS_URL=redis://localhost:6379           # Redis Server URL

S3_ENDPOINT=http://localhost:9000         # S3 endpoint (empty for AWS S3)
S3_ACCESS_KEY=minioadmin                  # S3 access key ID
S3_SECRET_KEY=minioadminpassword          # S3 secret access key
S3_BUCKET=risalatech                      # S3 bucket name
S3_REGION=us-east-1                       # S3 region code

JWT_SECRET=accessTokenSecretKey           # JWT signing key
JWT_REFRESH_SECRET=refreshTokenSecretKey  # JWT refresh signing key

HUGGINGFACE_API_KEY=hf_...                # HuggingFace API Token
HUGGINGFACE_MODEL=mistralai/...           # HuggingFace Model slug

GROQ_API_KEY=gsk_...                      # (Optional) Groq fallback API key
OPENAI_API_KEY=sk-proj-...                # (Optional) OpenAI fallback API key

SMTP_HOST=                                # (Optional) SMTP Server
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_SECURE=false
```

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)
* `POST /api/auth/register`: Create a new user account.
* `POST /api/auth/login`: Authenticate credentials, set Refresh Cookie, return Access Token.
* `POST /api/auth/refresh`: Validate refresh token cookie and rotate tokens.
* `POST /api/auth/logout`: Clear session refresh cookies.
* `POST /api/auth/oauth`: Authenticate OAuth2 token from Google/GitHub.

### 📝 Motivation Letters (`/api/motivation`)
* `POST /api/motivation/generate` (Optional Auth): Generate a letter draft.
* `POST /api/motivation/download-pdf` (Optional Auth): Synthesize and download PDF.
* `POST /api/motivation/stream` (Optional Auth): Server-Sent Events (SSE) word-by-word streaming generation.

### 🎓 Recommendation Letters (`/api/recommendation`)
* `POST /api/recommendation/generate` (Optional Auth): Generate a recommendation draft.
* `POST /api/recommendation/download-pdf` (Optional Auth): Synthesize and download PDF.
* `POST /api/recommendation/stream` (Optional Auth): Server-Sent Events (SSE) word-by-word streaming generation.

### 📜 Document History (`/api/history`)
* `GET /api/history` (Auth Required): Paginated list of owned documents.
* `GET /api/history/:id` (Auth Required): Specific document details.
* `GET /api/history/:id/pdf` (Auth Required): Download PDF associated with document.
* `DELETE /api/history/:id` (Auth Required): Delete document record.

### 🛡️ GDPR Compliance (`/api/gdpr`)
* `GET /api/gdpr/export` (Auth Required): Export all user details, documents, and audit logs.
* `DELETE /api/gdpr/delete` (Auth Required): Anonymize and delete all user records and S3 cache caches.

---

## 🚀 Setup & Launch

### Prerequisites
- Node.js v20+
- MongoDB
- Redis (Optional, but required for Caching and Workers)

### Commands

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Download Chromium (Puppeteer postinstall):**
   ```bash
   npx puppeteer browsers install chrome
   ```
3. **Run local development mode (with nodemon hot reloading):**
   ```bash
   npm run dev
   ```
4. **Start production server:**
   ```bash
   npm start
   ```

---

## 🐳 Docker Deployment

The backend contains a production-ready `Dockerfile` featuring a multi-stage Alpine build, Puppeteer system dependencies configuration, and standalone Chromium engine injection.

To build the image manually:
```bash
docker build -t risalatech-backend .
```
