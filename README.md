# 🎵 Music Stream & Management Application

A full-stack, enterprise-grade music streaming platform and administration system built with **MERN Stack (MongoDB, Express, React, Node.js)** and **Cloudinary**. The platform features both a user-facing client interface with audio playback capabilities and a secure, feature-rich admin dashboard with a fully integrated **Role-Based Access Control (RBAC)** system.

---

## 📋 Table of Contents

- [Features](#-features)
  - [Client Portal](#client-portal)
  - [Admin Portal](#admin-portal)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Prerequisites](#-prerequisites)
- [Environment Configuration](#-environment-configuration)
- [Getting Started](#-getting-started)
  - [Local Development](#local-development)
- [Docker & Deployment](#-docker--deployment)
  - [Running with Docker Compose](#running-with-docker-compose)
- [API & Route Architecture](#-api--route-architecture)
- [RBAC Permission System](#-rbac-permission-system)
- [Data Models](#-data-models)
- [Security Best Practices](#-security-best-practices)
- [License](#-license)

---

## ✨ Features

### Client Portal
- 🎶 **Music Player & Catalog**: Browse top topics, featured songs, and detailed song pages with audio streaming.
- 🔍 **Interactive Search**: Real-time song and singer search functionality.
- ❤️ **Favorites System**: Bookmark and manage favorite songs per user session/account.
- 🔐 **User Authentication**: Secure user registration, login, and cookie-based session management using JWT.
- 🚀 **Modern UI/UX**: Built with React and Vite for a seamless and highly responsive Single Page Application experience.

### Admin Portal
- 📊 **Dashboard**: High-level metrics and system overviews.
- 🎼 **Song & Singer Management**: Complete CRUD operations for audio tracks, metadata, and artist profiles.
- 🏷️ **Topic Management**: Categorize music tracks by genre, mood, and topic.
- 🛡️ **Granular RBAC**: Configure fine-grained permission matrices (view, create, edit, delete) per role via an interactive UI. Permissions are enforced on both the **backend** (middleware) and **frontend** (UI hiding).
- 👥 **Account & User Management**: Manage administrative staff accounts and registered end-users.
- ☁️ **Direct Cloud Uploads**: Seamless image cover and audio track uploads directly to Cloudinary using streaming buffers.

---

## 🛠️ Tech Stack

| Technology | Layer / Purpose | Description |
| :--- | :--- | :--- |
| **React 19 + Vite** | Frontend Framework | Extremely fast frontend setup with modern React |
| **Node.js 22** | Runtime | Modern JavaScript runtime engine |
| **Express 5** | Backend Framework | Fast, unopinionated web framework for Node.js |
| **TypeScript 5+** | Language | Strongly typed programming language extending JS |
| **MongoDB Atlas** | Cloud Database | Cloud-hosted NoSQL database with Mongoose ODM |
| **Cloudinary** | Cloud Media | Cloud hosting for images and audio files |
| **JWT & Bcrypt** | Security | JSON Web Token authentication & password hashing |
| **Docker & Compose** | Containerization | Multi-container setup for separate frontend/backend deployments |

---

## 📁 Project Directory Structure

```text
music-app/
├── api/                     # Backend API logic
│   └── v1/
│       ├── controllers/     # Business logic layer (admin & client)
│       ├── middlewares/     # Custom Express middlewares
│       │   └── admin/
│       │       ├── require-auth.ts        # JWT verification + role population
│       │       └── require-permission.ts  # RBAC permission guard
│       └── routers/         # Route definitions & Express endpoints
├── config/                  # Database configuration & Mongoose connection
├── frontend/                # React Frontend Application (Vite)
│   ├── public/              # Static web assets
│   ├── src/
│   │   ├── components/      # Reusable UI components (AdminSidebar, etc.)
│   │   ├── context/
│   │   │   ├── AuthContext.tsx       # Client user auth state
│   │   │   └── AdminAuthContext.tsx  # Admin account + permissions context
│   │   ├── layouts/         # AdminLayout, ClientLayout wrappers
│   │   └── pages/           # Route-level page components
│   ├── package.json         # Frontend NPM dependencies
│   └── Dockerfile           # Frontend Docker build file
├── helpers/                 # Utility functions & Cloudinary buffer streaming
├── models/                  # Mongoose data schemas & TypeScript models (api/v1/models)
├── .env.example             # Environment variable template
├── Dockerfile               # Backend Docker build file
├── docker-compose.yml       # Docker Compose setup for full stack
├── index.ts                 # Application entry point (API Server)
├── package.json             # Backend NPM dependencies
└── tsconfig.json            # Backend TypeScript configuration
```

---

## ⚙️ Prerequisites

- **Node.js**: `v22.0.0` or higher
- **npm**: `v10.0.0` or higher
- **MongoDB Atlas Connection URI**: Required for cloud database access
- **Cloudinary Account**: Required for uploading audio tracks and image covers

---

## 🔑 Environment Configuration

Create a `.env` file in the project root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Configure your environment variables as described below:

| Environment Variable | Description | Default / Example Value |
| :--- | :--- | :--- |
| `PORT` | Server listening port | `3000` |
| `MONGO` | MongoDB Atlas Connection URI | `mongodb+srv://user:pass@cluster.mongodb.net/music-app` |
| `CLOUD_NAME` | Cloudinary cloud account name | `your_cloud_name` |
| `CLOUD_API_KEY` | Cloudinary API access key | `your_api_key` |
| `CLOUD_API_SECRET` | Cloudinary API secret key | `your_api_secret` |
| `ACCESS_TOKEN_SECRET` | Secret key for signing JWT tokens | `your_super_secret_key` |

> [!WARNING]
> Never commit actual `.env` files or hardcode API secrets into source code. Always keep credentials strictly inside environment variables.

---

## 🚀 Getting Started

### Local Development

The project consists of two separate applications that need to be run concurrently: the Backend API and the React Frontend.

1. **Start Backend Server**:
   ```bash
   # In the root directory
   npm install
   npm start
   ```
   The backend API will start at [http://localhost:3000](http://localhost:3000).

2. **Start Frontend Client**:
   ```bash
   # In a new terminal, navigate to the frontend folder
   cd frontend
   npm install
   npm run dev
   ```
   The React frontend will start at [http://localhost:5173](http://localhost:5173).

---

## 🐳 Docker & Deployment

The application includes a production-ready **Docker Compose** setup which builds both the Node.js API (using multi-stage alpine images) and the React Frontend (served via Nginx).

### Running with Docker Compose

To build and spin up the entire application stack:

```bash
docker-compose up --build -d
```

- **Frontend** will be accessible at: [http://localhost:5173](http://localhost:5173) (mapped to Nginx port 80 internally)
- **Backend API** will be accessible at: [http://localhost:3000](http://localhost:3000)

### Stopping Containers

Stop running containers:
```bash
docker-compose down
```

---

## 🗺️ API & Route Architecture

### Client Routes (Backend)

| HTTP Method | Route Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Home page showcasing topics & featured songs |
| `GET` | `/topics` | Browse music topics & genres |
| `GET` | `/songs` | Explore song listing & playback details |
| `GET` | `/search` | Search songs and artists |
| `POST` | `/auth/register` | User registration |
| `POST` | `/auth/login` | User login |
| `GET` | `/auth/me` | Fetch currently logged in user info |

### Admin Routes (Backend)

| HTTP Method | Route Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/admin/auth/login` | Admin authentication login |
| `GET` | `/admin/auth/me` | Fetch logged-in admin account + role + permissions |
| `POST` | `/admin/auth/refresh-token` | Refresh access token using refresh token cookie |
| `POST` | `/admin/auth/logout` | Logout and invalidate refresh token |
| `GET` | `/admin/dashboard` | Dashboard metrics & overview |
| `GET/POST/PATCH/DELETE` | `/admin/topics/*` | Manage topic categories |
| `GET/POST/PATCH/DELETE` | `/admin/singers/*` | Manage singers & artist profiles |
| `GET/POST/PATCH/DELETE` | `/admin/songs/*` | Manage songs & audio track uploads |
| `GET/POST/PATCH/DELETE` | `/admin/roles/*` | Role management |
| `GET/PATCH` | `/admin/roles/permissions` | Read & update role permission matrices |
| `GET/POST/PATCH/DELETE` | `/admin/accounts/*` | Admin staff account management |
| `GET/PATCH/DELETE` | `/admin/users/*` | Customer user account management |

> [!NOTE]
> All `/admin/*` routes (except login & refresh-token) are protected by the `requireAuth` middleware. Individual resource actions are further protected by `requirePermission(permission_key)`.

---

## 🛡️ RBAC Permission System

The application implements a **two-layer RBAC** system — enforced on both the server and client.

### How it works

1. **Role setup**: Each `Role` document in MongoDB contains a `permissions` array of permission strings (e.g., `"song_create"`, `"topic_delete"`).
2. **Account linking**: Each `Account` has a `role_id` field referencing a `Role`.
3. **Backend enforcement**: The `requirePermission(permission)` middleware checks `account.role_id.permissions` on every request. Returns `403` if the permission is missing.
4. **Frontend enforcement**: The `AdminAuthContext` fetches the account's permissions via `GET /admin/auth/me` on load. The `hasPermission(perm)` helper is used throughout admin pages to conditionally render buttons and navigation links.

### Permission key naming convention

Permissions follow the format: `<resource>_<action>`

| Resource | Available Permissions |
| :--- | :--- |
| `song` | `song_view`, `song_create`, `song_edit`, `song_delete` |
| `topic` | `topic_view`, `topic_create`, `topic_edit`, `topic_delete` |
| `singer` | `singer_view`, `singer_create`, `singer_edit`, `singer_delete` |
| `user` | `user_view`, `user_edit`, `user_delete` |
| `account` | `account_view`, `account_create`, `account_edit`, `account_delete` |
| `role` | `role_view`, `role_create`, `role_edit`, `role_delete` |

### Updating permissions

Permissions can be updated in real-time from the **Phân quyền** (Permission Matrix) page in the Admin dashboard. Check/uncheck individual actions per role and click **Cập nhật** to save. Accounts must re-login (or wait for token refresh) to receive the new permission set.

---

## 📊 Data Models

| Model File | Collection Name | Key Responsibility |
| :--- | :--- | :--- |
| `song-model.ts` | `songs` | Song metadata, Cloudinary audio URL, cover art, topic & singer references |
| `singer-model.ts` | `singers` | Artist profile details, avatar URL, bio, and status |
| `topic-model.ts` | `topics` | Topic title, avatar image, description, and status |
| `role-model.ts` | `roles` | Role definitions and `permissions` array (e.g., `["song_view", "topic_create"]`) |
| `account-model.ts` | `accounts` | Admin accounts with `role_id` reference and hashed passwords |
| `user-model.ts` | `users` | Client end-user credentials, profile info, and status |
| `favorite-song-model.ts` | `favorite-songs` | Association between users/sessions and bookmarked songs |
| `session-model.ts` | `sessions` | Refresh token persistence and rotation records |

---

## 🔒 Security Best Practices

- 🔑 **Credential Rotation**: Rotate MongoDB passwords, Cloudinary API secrets, and `ACCESS_TOKEN_SECRET` regularly.
- 🛡️ **Non-Root Docker Execution**: The backend Docker runtime executes under an unprivileged `node` context.
- 🍪 **HttpOnly Cookies**: Authentication tokens are stored in secure `httpOnly` cookies to prevent XSS credential theft.
- 🔑 **Password Hashing**: User and admin passwords are encrypted using `bcrypt` before database storage.
- 🔄 **Refresh Token Rotation**: Refresh tokens are single-use and rotated on every renewal, preventing token replay attacks.
- 🚫 **RBAC Double Enforcement**: Permissions are checked on both the server (middleware) and the client (UI), reducing both unauthorized API access and accidental UI exposure.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
