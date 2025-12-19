# 🚀 Django CRM API (Industry-Grade)

A robust, production-ready Customer Relationship Management (CRM) backend built with **Django REST Framework**. This API serves as a universal backend for Web (React/Vue), Mobile (iOS/Android), and third-party integrations.

## 🌟 Key Features

*   **Architecture**: Modular design with separate apps for Contacts, Leads, Deals, and Activities.
*   **Authentication**: Secure **JWT (JSON Web Token)** authentication via `SimpleJWT`.
*   **Security**: Built-in **Throttling** (Rate Limiting) to prevent abuse.
*   **Performance**: Optimized with **Pagination**, **Filtering**, and **Search** capabilities using `django-filter`.
*   **Database**: Configured for **MySQL** (Production Standard).
*   **Documentation**: Auto-generated **Swagger/OpenAPI** documentation via `drf-spectacular`.

---

## 🛠️ Installation & Setup

### 1. Prerequisites
*   Python 3.8+
*   MySQL Server (or SQLite for quick testing)

### 2. Setup Valid Environment
```bash
# Clone the repo
git clone <your-repo-url>
cd dcrm

# Create virtual environment
python3 -m venv env
source env/bin/activate

# Install dependencies
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers mysql-connector-python django-filter drf-spectacular
```

### 3. Database Configuration
Ensure your MySQL server is running and create the database:
```sql
CREATE DATABASE crmdb;
```
*Note: Update `dcrm/settings.py` `DATABASES` section with your MySQL credentials.*

### 4. Run Migrations
apk
```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Admin User
```bash
python manage.py createsuperuser
```

### 6. Start Server
```bash
python manage.py runserver
```

---

## 📖 API Documentation

Once the server is running, access the interactive API manual:

*   **Swagger UI**: [http://127.0.0.1:8000/api/docs/](http://127.0.0.1:8000/api/docs/)
*   **ReDoc**: [http://127.0.0.1:8000/api/redoc/](http://127.0.0.1:8000/api/redoc/)

---

## ⚡ Usage Examples (cURL)

You can test the API directly from your terminal.

### 1. Login (Get Token)
```bash
curl -X POST http://127.0.0.1:8000/api/v1/token/ \
     -H "Content-Type: application/json" \
     -d '{"username": "your_username", "password": "your_password"}'
```
*Response:*
```json
{"refresh": "...", "access": "eyJ0eXAi..."}
```

### 2. Create a Lead
Replace `<YOUR_ACCESS_TOKEN>` with the "access" string from the login response.

```bash
curl -X POST http://127.0.0.1:8000/api/v1/leads/ \
     -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{
           "first_name": "Elon",
           "last_name": "Musk",
           "email": "elon@spacex.com",
           "status": "new",
           "organization": 1
         }'
```

---

## 📂 Project Structure

*   **/api**: Main router and API configuration.
*   **/accounts**: User & Organization management.
*   **/contacts**: CRM Contacts logic.
*   **/leads**: Lead generation and tracking.
*   **/deals**: Sales pipeline and opportunities.
*   **/activities**: Logging calls, emails, and meetings.
