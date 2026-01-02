# Deployment Guide to Free Hosting

This guide explains how to host your KRC! Coffee Website for free using **MongoDB Atlas** (Database), **Render** (Backend), and **Vercel** (Frontend).

## Prerequisites
- GitHub Account
- MongoDB Atlas Account (Free)
- Render Account (Free)
- Vercel Account (Free)

---

## Step 1: Push Code to GitHub
1.  Make sure your project is initialized with Git.
2.  Create a strict `.gitignore` in the root and in the backend/frontend folders to avoid uploading `node_modules` or `.env` files.
3.  Commit and push your code to a new public or private repository on GitHub.

## Step 2: Setup Database (MongoDB Atlas)
1.  Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a new project and a **free Shared Cluster (M0)**.
3.  Go to **Database Access** -> Create a new user (remember username/password).
4.  Go to **Network Access** -> Add IP Address -> `0.0.0.0/0` (Allow access from anywhere).
5.  Go to **Clusters** -> Connect -> Connect your application.
6.  Copy the connection string (looks like `mongodb+srv://<username>:<password>@cluster0...`).

## Step 3: Deploy Backend (Render)
1.  Log in to [Render](https://render.com/).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  Select the `backend` folder as the **Root Directory**.
5.  **Build Command:** `npm install`
6.  **Start Command:** `node server.js`
7.  **Environment Variables:**
    - `MONGO_URI`: (Paste your MongoDB connection string here)
    - `JWT_SECRET`: (Create a confusing random string)
    - `PORT`: `10000` (Render usually expects this, but your code defaults to 5000. Render sets PORT env var automatically).
8.  Click **Create Web Service**.
9.  Wait for it to deploy. Copy the **Service URL** (e.g., `https://krc-backend.onrender.com`).

## Step 4: Deploy Frontend (Vercel)
1.  Log in to [Vercel](https://vercel.com/).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Framework Preset:** Vite
5.  **Root Directory:** `frontend`
6.  **Environment Variables:**
    - `VITE_API_URL`: (Paste your Render Backend URL here, NOT ending with a slash, e.g., `https://krc-backend.onrender.com`)
7.  Click **Deploy**.

## Step 5: Final Check
- Open your Vercel URL.
- Test login, registration, and product loading.
- Note: The free version of Render "sleeps" if not used. The first request might take 30-50 seconds.

## Troubleshooting
- **CORS Errors:** If you see CORS errors in the browser console, you might need to update `backend/server.js` to allow the specific Vercel domain or all domains `cors({ origin: '*' })`.
- **Images:** If using local file uploads, images won't persist on Render's free tier (they vanish on restart). For production, use Cloudinary or similar. For now, this guide assumes basic free hosting.
