<p align="center">
  <img src="./public/logo-risalatech.png" width="160" alt="RISALATECH Logo" />
</p>

# RISALATECH — Frontend Client Application

This is the responsive, high-performance, premium React frontend client application for **RISALATECH**. It connects to the Express API to collect form information, display live character-by-character generation streaming, handle document previews, trigger PDF downloads, and manage user sessions.

---

## 🛠️ Tech Stack

* **Framework**: React v18 (built with Vite)
* **Styling**: TailwindCSS & Vanilla CSS
* **Routing**: React Router DOM v6
* **State Management**: Zustand
* **API Client**: Axios (configured with request-response interceptors for automatic JWT refresh)
* **Internationalization**: i18next (supporting English, French, and Arabic RTL layouts)
* **Icons**: Heroicons v2

---

## 📂 Folder Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── forms/       # Input forms for motivation & recommendation letters
│   │   ├── layout/      # Sidebar, Navbar, and layout wrapper shell
│   │   ├── preview/     # Live Preview Modal & PDF download utilities
│   │   └── ui/          # Generic reusable UI (Buttons, Inputs, Toasts, Skeletons)
│   ├── hooks/           # Reusable React hooks (form state persistence)
│   ├── i18n/            # Translations (en, fr, ar) and layout switcher config
│   ├── pages/           # High level view components (Dashboard, History, Login, etc.)
│   ├── services/        # Axios client instance and API endpoint configurations
│   ├── store/           # Zustand centralized stores (Auth, theme settings, notifications)
│   ├── styles/          # Styling files (index.css with premium gradient themes)
│   ├── utils/           # Client validators and parsing utilities
│   ├── App.jsx          # Route mappings and ProtectedRoute wrappers
│   └── main.jsx         # App bootstrapping
├── public/              # Static assets (logos, images, and fonts)
├── Dockerfile           # Nginx build containerization script
├── package.json         # Frontend packages and dependencies
└── vite.config.js       # Vite server proxy and aliases configuration
```

---

## 🔐 Auth & Axios Interceptors

The frontend implements a silent token rotation mechanism. 
1. **Request Interceptor**: Extracts the `accessToken` from Zustand local memory and appends it as a `Bearer` token inside the `Authorization` header.
2. **Response Interceptor**: Captures `401 Unauthorized` responses. Upon interception, it triggers a background request to `/api/auth/refresh` to rotate the HTTP-only cookie refresh token, updates the access token in memory, and retries the original request seamlessly without user intervention.

---

## 🚀 Setup & Launch

### Prerequisites
- Node.js v20+

### Commands

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start development server:**
   ```bash
   npm run dev
   ```
   *The application will boot on [http://localhost:3000](http://localhost:3000) and proxy API requests automatically to [http://localhost:5000/api](http://localhost:5000/api).*

3. **Build for production:**
   ```bash
   npm run build
   ```
   *Compiles and optimizes assets inside the `dist/` directory, ready to be served by Nginx.*

---

## 🐳 Docker Containerization

The frontend incorporates a dual-stage `Dockerfile`:
1. **Build Stage**: Compiles and minifies assets inside an Alpine Node container.
2. **Serve Stage**: Copies the build artifact `dist/` into a lightweight Nginx container to serve the static assets.

To build the image manually:
```bash
docker build -t risalatech-frontend .
```
