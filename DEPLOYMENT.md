# 🚀 Deployment Guide - Render + Vercel

Complete guide for deploying Django CRM backend to Render and React frontend to Vercel.

---

## 📋 Prerequisites

- GitHub account with code pushed
- [Render.com](https://render.com) account (free tier)
- [Vercel.com](https://vercel.com) account (optional, for frontend)
- Local environment working

---

## 🔧 Part 1: Backend Deployment (Render)

### Step 1: Create PostgreSQL Database

1. Login to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **PostgreSQL**
3. Configure:
   - **Name**: `django-crm-db`
   - **Database**: `crm` (auto-generated)
   - **User**: `crm_user` (auto-generated)
   - **Region**: Select closest to you
   - **PostgreSQL Version**: 15
   - **Instance Type**: **Free**
4. Click **Create Database**
5. **IMPORTANT**: Copy the **Internal Database URL** (starts with `postgres://`)

---

### Step 2: Create Web Service

1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure Service:

| Setting | Value |
|---------|-------|
| **Name** | `django-crm-api` |
| **Region** | Same as database |
| **Branch** | `main` |
| **Root Directory** | `dcrm` ⚠️ **CRITICAL** |
| **Runtime** | `Python 3` |
| **Build Command** | `./build.sh` |
| **Start Command** | `gunicorn dcrm.wsgi:application --workers 3` |
| **Instance Type** | `Free` |

---

### Step 3: Environment Variables

Click **Advanced** → **Add Environment Variable** and add these:

| Key | Value | Notes |
|-----|-------|-------|
| `PYTHON_VERSION` | `3.10.12` | Match your local version |
| `SECRET_KEY` | `<generate-random-string>` | Use [Django Secret Key Generator](https://djecrety.ir/) |
| `DEBUG` | `False` | **NEVER** `True` in production |
| `DATABASE_URL` | `postgres://...` | Paste Internal Database URL |
| `ALLOWED_HOSTS` | `.render.com` | Auto-configured |
| `CORS_ALLOW_ALL_ORIGINS` | `False` | Secure CORS |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` | Add after frontend deployed |

**Optional Environment Variables:**

| Key | Value | Purpose |
|-----|-------|---------|
| `AWS_ACCESS_KEY_ID` | Your AWS key | For S3 media storage |
| `AWS_SECRET_ACCESS_KEY` | Your AWS secret | For S3 media storage |
| `AWS_STORAGE_BUCKET_NAME` | Your bucket | For S3 media storage |

---

### Step 4: Deploy

1. Click **Create Web Service**
2. Monitor build logs for errors
3. Wait for:
   - Dependencies installation
   - Migration execution
   - Static files collection
   - Server start

**Build Process (`build.sh`):**
```bash
pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
```

4. Once deployed, copy your **Backend URL**: `https://django-crm-api.onrender.com`

---

## 🌐 Part 2: Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel

1. Login to [Vercel](https://vercel.com)
2. Click **Add New...** → **Project**
3. Import GitHub repository
4. Configure:
   - **Framework**: `Vite` (auto-detected)
   - **Root Directory**: `dcrm/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 2: Environment Variables

Add in Vercel project settings:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://django-crm-api.onrender.com/api/` |

### Step 3: Deploy

1. Click **Deploy**
2. Wait for build completion
3. Copy **Frontend URL**: `https://your-crm.vercel.app`

---

## 🔗 Part 3: Final Integration

### Update Backend Environment

1. Go to Render → django-crm-api → **Environment**
2. Update:
   - `FRONTEND_URL` = `https://your-crm.vercel.app`
3. Save changes (triggers redeploy)

---

## 👤 Create Superuser

### Option A: Render Shell (Recommended)

1. Render Dashboard → Web Service → **Shell** tab
2. Run:
```bash
python manage.py createsuperuser
```
3. Follow prompts (username, email, password)

### Option B: Auto-created (from build.sh)

The `build.sh` already creates:
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Change this immediately in production!**

---

## ✅ Verification Checklist

### Backend Health Checks

- [ ] Visit `https://your-api.onrender.com/api/health/`
  - Should return: `{"status": "ok"}`
- [ ] Visit `https://your-api.onrender.com/api/docs/`
  - Swagger UI loads successfully
- [ ] Visit `https://your-api.onrender.com/admin/`
  - Django admin panel accessible
- [ ] Check logs in Render dashboard for errors

### Frontend Checks

- [ ] Visit your Vercel URL
- [ ] Login with superuser credentials
- [ ] Create a lead/contact/deal
- [ ] Verify data saves and displays

---

## 🐛 Common Issues & Solutions

### Issue: "Application failed to respond"

**Cause**: Web service not starting

**Solutions**:
1. Check Render logs for errors
2. Verify `gunicorn` is in `requirements.txt`
3. Ensure `WSGI_APPLICATION = 'dcrm.wsgi.application'` in settings.py
4. Check `Start Command`: `gunicorn dcrm.wsgi:application`

---

### Issue: "DisallowedHost at /"

**Cause**: ALLOWED_HOSTS misconfiguration

**Solution**:
```python
# settings.py already handles this
ALLOWED_HOSTS = ['*']  # Render auto-configures with .onrender.com
```

---

### Issue: "CORS Error" in frontend

**Cause**: CORS not allowing frontend origin

**Solution**:
1. Add `FRONTEND_URL` to Render environment
2. Ensure `CORS_ALLOWED_ORIGINS` in settings includes it
3. Or temporarily set `CORS_ALLOW_ALL_ORIGINS=True` (not recommended)

---

### Issue: "No such table" errors

**Cause**: Migrations not run

**Solution**:
1. Check build logs - did migrations run?
2. Manually run in Render Shell:
```bash
python manage.py migrate
```

---

### Issue: "Static files not loading"

**Cause**: Static files not collected

**Solution**:
1. Verify `build.sh` runs `collectstatic`
2. Check `STATIC_ROOT` and `STATIC_URL` in settings
3. WhiteNoise already configured and should handle this

---

### Issue: "Database connection refused"

**Cause**: DATABASE_URL incorrect

**Solution**:
1. Verify DATABASE_URL in environment variables
2. Use **Internal Database URL** not external
3. Format: `postgres://user:password@host:5432/dbname`

---

## 🔒 Security Checklist

Before going live:

- [ ] `DEBUG = False` in production
- [ ] Strong `SECRET_KEY` (50+ characters, random)
- [ ] `ALLOWED_HOSTS` properly configured
- [ ] CORS restricted to specific origins
- [ ] Change default superuser password
- [ ] SSL/HTTPS enabled (Render provides this)
- [ ] Environment variables in Render, not in code
- [ ] `.env` file in `.gitignore`

---

## 📊 Monitoring

### Render Dashboard

- **Metrics**: View CPU, memory usage
- **Logs**: Real-time application logs
- **Events**: Deploy history and status

### Useful Commands (Render Shell)

```bash
# Check Django version
python manage.py --version

# List migrations
python manage.py showmigrations

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic

# Open Django shell
python manage.py shell

# Run custom commands
python manage.py populate_tags
```

---

## 🔄 Continuous Deployment

### Automatic Deploys

Render automatically deploys when you push to GitHub:

1. Make changes locally
2. Commit: `git commit -m "Update feature"`
3. Push: `git push origin main`
4. Render detects push
5. Runs `build.sh`
6. Deploys new version

### Manual Deploy

In Render Dashboard:
- Click **Manual Deploy** → **Deploy latest commit**

---

## 💰 Free Tier Limitations

### Render Free Tier

- ✅ 750 hours/month (enough for 1 service 24/7)
- ✅ Auto-spin down after 15 min inactivity
- ⚠️ **First request after spin-down takes ~30 seconds**
- ✅ PostgreSQL: 90 days data retention
- ✅ 1GB storage
- ❌ No SLA guarantees

### Upgrading

For production with users:
- **Starter Plan**: $7/month
  - No spin-down
  - Better performance
  - 24/7 availability

---

## 📈 Scaling Considerations

When to upgrade:

1. **Performance**: Slow response times
2. **Availability**: Need 99.9% uptime
3. **Storage**: >1GB database size
4. **Traffic**: >100 requests/day consistently

---

## 🔗 Useful Links

- [Render Documentation](https://render.com/docs)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)
- [Gunicorn Configuration](https://docs.gunicorn.org/en/stable/configure.html)
- [WhiteNoise Documentation](http://whitenoise.evans.io/)

---

## 🆘 Getting Help

1. Check Render logs first
2. Review this deployment guide
3. Check Django deployment checklist:
   ```bash
   python manage.py check --deploy
   ```
4. Search [Render Community Forum](https://community.render.com/)
5. Open GitHub issue with:
   - Error message
   - Build logs
   - Steps to reproduce

---

**🎉 Congratulations! Your Django CRM is now live!**
