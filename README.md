# 🎵 Music Stream & Management Application

A full-stack, enterprise-grade music streaming platform and administration system built with **Express 5**, **TypeScript**, **Pug**, **MongoDB (Atlas)**, and **Cloudinary**. The platform features both a user-facing client interface with audio playback capabilities and a secure, feature-rich admin dashboard with Role-Based Access Control (RBAC).

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
  - [Production Build](#production-build)
  - [Type Checking](#type-checking)
- [Docker & Deployment](#-docker--deployment)
  - [Running with Docker Compose](#running-with-docker-compose)
  - [Environment Overrides](#environment-overrides)
- [API & Route Architecture](#-api--route-architecture)
- [Data Models](#-data-models)
- [Security Best Practices](#-security-best-practices)
- [License](#-license)

---

## ✨ Features

### Client Portal
- 🎶 **Music Player & Catalog**: Browse top topics, featured songs, and detailed song pages with audio streaming.
- 🔍 **Interactive Search**: Real-time song and singer search functionality.
- ❤️ **Favorites System**: Bookmark and manage favorite songs per user session/account.
- 🔐 **User Authentication**: Secure user registration, login, and cookie-based session management.

### Admin Portal
- 📊 **Dashboard**: High-level metrics and system overviews.
- 🎼 **Song & Singer Management**: Complete CRUD operations for audio tracks, metadata, and artist profiles.
- 🏷️ **Topic Management**: Categorize music tracks by genre, mood, and topic.
- 🛡️ **Role-Based Access Control (RBAC)**: Create granular roles with permission matrices (Create, Read, Update, Delete across modules).
- 👥 **Account & User Management**: Manage administrative staff accounts and registered end-users.
- ☁️ **Direct Cloud Uploads**: Seamless image cover and audio track uploads directly to Cloudinary using streaming buffers.

---

## 🛠️ Tech Stack

| Technology | Layer / Purpose | Description |
| :--- | :--- | :--- |
| **Node.js 22** | Runtime | Modern JavaScript runtime engine |
| **Express 5** | Backend Framework | Fast, unopinionated web framework for Node.js |
| **TypeScript 5+** | Language | Strongly typed programming language extending JS |
| **MongoDB Atlas** | Cloud Database / ORM | Cloud-hosted NoSQL database with Mongoose schema-based ODM |
| **Pug** | View Engine | High-performance server-side template engine |
| **Cloudinary** | Cloud Media | Cloud hosting for images and audio files |
| **JWT & Bcrypt** | Security | JSON Web Token authentication & password hashing |
| **Docker & Compose** | Containerization | Multi-stage Docker image and container runner |

---

## 📁 Project Directory Structure

```text
music-app/
├── config/                  # Database configuration & Mongoose connection
│   └── database-config.ts
├── controllers/             # Business logic layer
│   ├── admin/              # Controllers for Admin dashboard & management
│   └── client/             # Controllers for Client-facing music app
├── helpers/                 # Utility functions & Cloudinary buffer streaming
│   ├── filter-status-helper.ts
│   ├── pagination-helper.ts
│   ├── search-helper.ts
│   ├── slugify.ts
│   └── upload-cloudinary.ts
├── middlewares/             # Custom Express middlewares
│   └── admin/              # Authentication guards & Multer file uploaders
├── models/                  # Mongoose data schemas & TypeScript models
├── public/                  # Static web assets (CSS, JS, images, icons)
├── routers/                 # Route definitions & Express endpoints
│   ├── admin/              # Admin route modules
│   └── client/             # Client route modules
├── validations/             # Request payload & form validations
├── views/                   # Server-side rendered Pug template files
│   ├── admin/              # Admin views & layout components
│   └── client/             # Client views & media player components
├── .env.example             # Environment variable template
├── Dockerfile               # Multi-stage Docker build file
├── docker-compose.yml       # Docker Compose setup for app
├── index.ts                 # Application entry point
├── package.json             # NPM dependencies & lifecycle scripts
└── tsconfig.json            # TypeScript compiler configuration
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

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm start
   ```
   The application will start at [http://localhost:3000](http://localhost:3000) using `nodemon` and `tsx` with hot reload on TypeScript file changes.

### Production Build

1. **Compile TypeScript**:
   ```bash
   npm run build
   ```
   This generates JavaScript source code inside the `./dist` folder.

2. **Start Production Server**:
   ```bash
   npm run start:prod
   ```

### Type Checking

Validate TypeScript types without generating output files:
```bash
npm run type-check
```

---

## 🐳 Docker & Deployment

The application includes a production-optimized **multi-stage Dockerfile** that builds a lightweight Node 22 Alpine image running under an unprivileged `node` user.

### Running with Docker Compose

When using MongoDB Atlas, Docker Compose runs the containerized Express application, which automatically loads your MongoDB Atlas connection string from `.env`:

```bash
docker compose up --build -d
```

Access the application at [http://localhost:3000](http://localhost:3000).

### Stopping Containers

Stop running containers:
```bash
docker compose down
```

### Environment Overrides

Override default host ports using inline environment variables:

- **Linux / macOS**:
  ```bash
  PORT=8080 docker compose up --build
  ```

- **Windows PowerShell**:
  ```powershell
  $env:PORT=8080; docker compose up --build
  ```

---

## 🗺️ API & Route Architecture

### Client Routes

| HTTP Method | Route Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Home page showcasing topics & featured songs | Public |
| `GET` | `/topics` | Browse music topics & genres | Public |
| `GET` | `/songs` | Explore song listing & playback details | Public |
| `GET` | `/search` | Search songs and artists | Public |
| `GET`, `POST` | `/auth/register` | User registration | Public |
| `GET`, `POST` | `/auth/login` | User login | Public |

### Admin Routes

| HTTP Method | Route Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET`, `POST` | `/admin/auth/login` | Admin authentication login | Public |
| `GET` | `/admin/dashboard` | Dashboard metrics & overview | Authenticated Admin |
| `GET`, `POST`, `PATCH` | `/admin/topics` | Manage topic categories | Authenticated Admin |
| `GET`, `POST`, `PATCH` | `/admin/singers` | Manage singers & artist profiles | Authenticated Admin |
| `GET`, `POST`, `PATCH` | `/admin/songs` | Manage songs & audio track uploads | Authenticated Admin |
| `GET`, `POST`, `PATCH` | `/admin/roles` | Role & permission management | Authenticated Admin |
| `GET`, `POST`, `PATCH` | `/admin/accounts` | Admin staff account management | Authenticated Admin |
| `GET`, `POST`, `PATCH` | `/admin/users` | Customer user account management | Authenticated Admin |

---

## 📊 Data Models

| Model File | Collection Name | Key Responsibility |
| :--- | :--- | :--- |
| [song-model.ts](file:///d:/backend/SANPHAM/music-app/models/song-model.ts) | `songs` | Song metadata, Cloudinary audio URL, cover art, topic & singer references |
| [singer-model.ts](file:///d:/backend/SANPHAM/music-app/models/singer-model.ts) | `singers` | Artist profile details, avatar URL, bio, and status |
| [topic-model.ts](file:///d:/backend/SANPHAM/music-app/models/topic-model.ts) | `topics` | Topic title, avatar image, description, and status |
| [role-model.ts](file:///d:/backend/SANPHAM/music-app/models/role-model.ts) | `roles` | Role definitions and permissions matrix array |
| [account-model.ts](file:///d:/backend/SANPHAM/music-app/models/account-model.ts) | `accounts` | Admin accounts with role reference and hashed passwords |
| [user-model.ts](file:///d:/backend/SANPHAM/music-app/models/user-model.ts) | `users` | Client end-user credentials, profile info, and status |
| [favorite-song-model.ts](file:///d:/backend/SANPHAM/music-app/models/favorite-song-model.ts) | `favorite-songs` | Association between users/sessions and bookmarked songs |
| [session-model.ts](file:///d:/backend/SANPHAM/music-app/models/session-model.ts) | `sessions` | Web session persistence and token mapping |

---

## 🔒 Security Best Practices

- 🔑 **Credential Rotation**: Rotate MongoDB passwords, Cloudinary API secrets, and `ACCESS_TOKEN_SECRET` regularly.
- 🛡️ **Non-Root Docker Execution**: The Docker runtime executes under an unprivileged `USER node` context.
- 🍪 **HttpOnly Cookies**: Authentication tokens are stored in secure cookies to prevent XSS credential theft.
- 🔑 **Password Hashing**: User and admin passwords are encrypted using `bcrypt` before database storage.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
