# Deployment Guide

This guide covers how to deploy the Django CRM (Backend) to Render and the React Frontend to Vercel/Netlify using free tiers.

## Prerequisites
- A GitHub account.
- Accounts on [Render.com](https://render.com) and [Vercel.com](https://vercel.com).
- Code pushed to a GitHub repository (both backend and frontend in the same repo is fine).

---

## Part 1: Deploy Backend (Django) to Render

1. **Log in to Render** and click **New +** -> **Web Service**.
2. **Connect your GitHub repository**.
3. **Configure the Service**:
   - **Name**: `django-crm-backend` (or similar)
   - **Region**: Closest to you.
   - **Branch**: `main` (or your working branch)
   - **Root Directory**: `dcrm` (IMPORTANT: This is where your `manage.py` is)
   - **Runtime**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn dcrm.wsgi:application`
   - **Instance Type**: `Free`

4. **Environment Variables** (Click "Advanced" or "Environment"):
   Add the following keys and values:
   - `PYTHON_VERSION`: `3.10.12` (or your local version)
   - `SECRET_KEY`: (Generate a strong random string)
   - `DEBUG`: `False`
   - `CORS_ALLOW_ALL_ORIGINS`: `True` (Initially, to ensure frontend can connect. You can restrict this later.)

5. **Database Setup (PostgreSQL)**:
   - In Render Dashboard, go to **New +** -> **PostgreSQL**.
   - Name: `crm-db`.
   - Instance Type: `Free`.
   - Create it.
   - Once created, copy the **Internal Database URL** key (it looks like `postgres://...`).
   - Go back to your **Web Service** -> **Environment** and add:
     - `DATABASE_URL`: (Paste the Internal Database URL here)

6. **Deploy**:
   - Click **Create Web Service**. 
   - Wait for the build to finish. It will migrate the database and start the server.
   - **Copy the Backend URL** (e.g., `https://django-crm-backend.onrender.com`).

---

## Part 2: Deploy Frontend (React) to Vercel

1. **Log in to Vercel** and click **Add New...** -> **Project**.
2. **Import your GitHub repository**.
3. **Configure the Project**:
   - **Framework Preset**: `Vite` (Should detect automatically)
   - **Root Directory**: Click "Edit" and select `dcrm/frontend`.
4. **Environment Variables**:
   - Add a new variable:
     - Name: `VITE_API_URL`
     - Value: `https://django-crm-backend.onrender.com/api/v1/` (Replace with your actual Render URL from Part 1. **Don't forget the `/api/v1/`**)
5. **Deploy**:
   - Click **Deploy**.
   - Vercel will build your React app.
   - Once done, you will get a **Frontend URL** (e.g., `https://your-crm.vercel.app`).

---

## Part 3: Final Integration

1. Go to your **Render Web Service** (Backend).
2. Update the Environment Variables:
   - `FRONTEND_URL`: `https://your-crm.vercel.app` (Your new Vercel URL)
   - (Optional) Set `CORS_ALLOW_ALL_ORIGINS` to `False` now that you have a specific frontend URL.
3. Your Deployment is complete!

### Admin Access
To create a superuser properly in production:
1. Go to Render Dashboard -> Web Service -> **Shell**.
2. Run: `python manage.py createsuperuser`
3. Follow the prompts.
