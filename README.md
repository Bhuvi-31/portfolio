# Bhuvaneshwari S - Production Full Stack Portfolio Website

A production-ready full-stack portfolio web application built for Bhuvaneshwari S (Final Year B.E. CSE Student & Frontend Developer). Features an high-performance, dark-themed responsive frontend connected to a Node.js / Express backend with Firebase Admin SDK, Firestore database persistence, rate-limited APIs, and Gmail SMTP Nodemailer notifications.

---

## 🌟 Technology Stack

- **Frontend:** HTML5, CSS3 (Vanilla Custom Properties & Flexbox/Grid), JavaScript (ES6+), FontAwesome Icons.
- **Backend:** Node.js, Express.js.
- **Database & Authentication:** Firebase Admin SDK, Cloud Firestore, Firebase Auth.
- **Email Notifications:** Nodemailer (Gmail SMTP).
- **Security Middleware:** Helmet, CORS, Express Rate Limit, Validator.

---

## 📁 Repository Directory Structure

```text
portfolio/
├── index.html               # Main frontend single-page application
├── style.css                # Global CSS styling & design system
├── README.md                # Project documentation & deployment guide
├── .gitignore               # Git ignore rules
└── backend/
    ├── server.js            # Express server entry point
    ├── package.json         # Backend dependencies & scripts
    ├── .env.example         # Environment variables template
    ├── .env                 # Environment variables file (ignored in git)
    ├── .gitignore           # Backend git ignore rules
    ├── config/
    │   └── db.js            # Environment configuration module
    ├── controllers/
    │   ├── contactController.js
    │   ├── projectsController.js
    │   ├── certificatesController.js
    │   ├── profileController.js
    │   └── newsletterController.js
    ├── firebase/
    │   └── firebaseAdmin.js  # Firebase Admin SDK initializer
    ├── middleware/
    │   ├── errorHandler.js   # Global error handling middleware
    │   ├── rateLimiter.js    # Express rate limiters (spam prevention)
    │   └── validator.js      # Input validation & sanitization
    ├── routes/
    │   ├── contact.js
    │   ├── projects.js
    │   ├── certificates.js
    │   ├── profile.js
    │   └── newsletter.js
    ├── services/
    │   ├── emailService.js   # Nodemailer email notification service
    │   └── firebaseService.js# Firestore database operations service
    └── utils/
        └── logger.js        # Logging utility
```

---

## 🔑 Environment Variables Setup

Create a `.env` file in the `backend/` directory based on `.env.example`:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Firebase Credentials
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
FIREBASE_APP_ID=your-firebase-app-id
FIREBASE_MESSAGING_SENDER_ID=1234567890

# Nodemailer SMTP Credentials (Gmail)
EMAIL_USER=bhuvitamil3262@gmail.com
EMAIL_PASS=your-gmail-app-password

# Security Secrets
JWT_SECRET=your-jwt-secret-key
API_SECRET=your-api-secret-key
```

> **Note on Gmail SMTP:** To obtain `EMAIL_PASS`, generate an **App Password** from Google Account Settings -> Security -> 2-Step Verification -> App Passwords.

---

## 🚀 Firebase Setup Guide

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Firestore Database** in production mode.
3. Enable **Firebase Authentication** if needed.
4. Go to **Project Settings** -> **Service Accounts**.
5. Click **Generate New Private Key** to download the JSON key file.
6. Copy `project_id`, `client_email`, and `private_key` into your backend `.env` file.

---

## 💻 Running Locally

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Start Backend Server
For development mode:
```bash
npm run dev
```
For production mode:
```bash
npm start
```
The server will run at `http://localhost:5000`. You can test server health at `http://localhost:5000/health`.

### 3. Open Frontend
You can open `index.html` directly in any web browser or use a live server extension (e.g. `npx serve .` or VS Code Live Server).

---

## 🌐 API Endpoint Reference

| Method | Endpoint | Description | Validation | Rate Limited |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/contact` | Submit contact form, save to Firestore, send Gmail notification | Yes | 5 req / hour |
| `GET` | `/api/projects` | Fetch all project items | No | 100 req / 15 min |
| `GET` | `/api/certificates` | Fetch all certificate items | No | 100 req / 15 min |
| `GET` | `/api/profile` | Fetch portfolio profile data | No | 100 req / 15 min |
| `POST` | `/api/newsletter` | Subscribe email to newsletter | Yes | 100 req / 15 min |

---

## 🚢 Deployment Guide

### Deploy Backend on Render

1. Push your repository to GitHub.
2. Log in to [Render Console](https://dashboard.render.com/) and create a new **Web Service**.
3. Connect your GitHub repository.
4. Set **Root Directory** to `backend`.
5. Set **Build Command** to: `npm install`.
6. Set **Start Command** to: `npm start`.
7. In the **Environment Variables** section, add all variables defined in `.env`:
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (or leave default)
   - `FRONTEND_URL` = `https://your-site.netlify.app`
   - `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`, etc.
   - `EMAIL_USER`, `EMAIL_PASS`
8. Click **Create Web Service**. Your backend URL will be `https://your-backend.onrender.com`.

---

### Deploy Frontend on Netlify

1. Log in to [Netlify Console](https://app.netlify.com/).
2. Click **Add new site** -> **Import an existing project**.
3. Select your GitHub repository.
4. Set **Publish directory** to `.`.
5. (Optional) If hosting backend on Render, update the `fetch('/api/contact')` URL in `index.html` to `https://your-backend.onrender.com/api/contact` or set up a proxy redirect rule in `_redirects`:
   ```text
   /api/*  https://your-backend.onrender.com/api/:splat  200
   ```
6. Click **Deploy Site**.

---

## 🛡️ License & Copyright

© 2026 Bhuvaneshwari S. All rights reserved.
