# 🚀 Django CRM API

![Tests](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/Django%20CRM%20Tests/badge.svg)
![Coverage](https://img.shields.io/badge/coverage-92%25-brightgreen)
![Python](https://img.shields.io/badge/python-3.10%2B-blue)
![Django](https://img.shields.io/badge/django-5.0%2B-green)
![License](https://img.shields.io/badge/license-MIT-blue)

A production-ready Customer Relationship Management (CRM) API built with **Django REST Framework**. Features JWT authentication, comprehensive tagging system, automated testing (92% coverage), and enterprise-grade security.

## 🌟 Features

- ✅ **Complete CRM Entities**: Leads, Contacts, Deals, Activities, Tags
- 🔐 **JWT Authentication**: Secure token-based auth with SimpleJWT
- 🏷️ **Advanced Tagging**: Categorize and filter leads, contacts, and deals
- 📊 **Organization Management**: Multi-tenant with API key support
- 🔍 **Filtering & Search**: Django-filter integration with pagination
- 📚 **Auto-generated API Docs**: Swagger/OpenAPI via drf-spectacular
- 🧪 **High Test Coverage**: 92% coverage with 60+ tests
- 🚀 **Production Ready**: Deployed on Render with PostgreSQL

---

## 📐 Architecture

```mermaid
graph TD
    A[User/Organization] --> B[Leads]
    A --> C[Contacts]
    A --> D[Deals]
    A --> E[Activities]

    B --> F[Tags]
    C --> F
    D --> F

    B -.Convert.-> C
    C --> D
    C --> E
    D --> E
    B --> E

    style A fill:#e1f5ff
    style B fill:#fff9c4
    style C fill:#c8e6c9
    style D fill:#ffccbc
    style E fill:#f8bbd0
    style F fill:#e1bee7
```

### **Model Relationships**

- **User/Organization**: Base authentication and multi-tenancy
- **Leads**: Potential customers → Can convert to Contacts
- **Contacts**: Qualified leads/customers → Linked to Deals and Activities
- **Deals**: Sales opportunities → Tied to Contacts
- **Activities**: Calls, emails, meetings → Track engagement with Leads/Contacts/Deals
- **Tags**: Flexible categorization across all entities

---

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- pip
- Virtual environment (recommended)

### Installation

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd dcrm

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env  # Edit with your values

# Run migrations
python3 manage.py migrate

# Create superuser
python3 manage.py createsuperuser

# Populate sample tags (optional)
python3 manage.py populate_tags

# Start development server
python3 manage.py runserver
```

Server runs at: **http://127.0.0.1:8000/**

---

## 📖 API Documentation

Interactive API documentation available at:

- **Swagger UI**: http://127.0.0.1:8000/api/docs/
- **ReDoc**: http://127.0.0.1:8000/api/redoc/

---

## 💻 API Examples

### 1. Authentication

**Get JWT Token:**
```bash
curl -X POST http://localhost:8000/api/v1/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "yourpassword"
  }'
```

**Response:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### 2. Create a Lead with Tags

```bash
curl -X POST http://localhost:8000/api/leads/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Sarah",
    "last_name": "Johnson",
    "email": "sarah@enterprise.com",
    "phone": "+1234567890",
    "status": "new",
    "source": "website",
    "tags": [1, 4, 5]
  }'
```

### 3. List All Tags

```bash
curl -X GET http://localhost:8000/api/tags/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Create a Contact

```bash
curl -X POST http://localhost:8000/api/contacts/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "address": "123 Main St, Tech City",
    "description": "VIP Client - Decision Maker",
    "tags": [7, 16]
  }'
```

### 5. Create a Deal

```bash
curl -X POST http://localhost:8000/api/deals/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Enterprise SaaS License",
    "value": "50000.00",
    "stage": "prospecting",
    "probability": 50,
    "contact": 1,
    "tags": [11, 15]
  }'
```

### 6. Filter Leads by Tags

```bash
# Get all hot enterprise leads
curl -X GET "http://localhost:8000/api/leads/?tags=1,4" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 7. Update Deal Stage

```bash
curl -X PATCH http://localhost:8000/api/deals/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "stage": "negotiation",
    "probability": 75
  }'
```

---

## 📂 Project Structure

```
dcrm/
├── accounts/          # User & Organization management
├── leads/             # Lead tracking & conversion
├── contacts/          # Contact management
├── deals/             # Sales pipeline
├── activities/        # Activity logging (calls, emails, meetings)
├── tags/              # Tagging system
├── api/               # API configuration & routing
├── tests/             # Comprehensive test suite
│   ├── factories.py   # Factory-boy test data generators
│   ├── test_models.py # Model tests (34 tests)
│   └── test_api.py    # API tests (25 tests)
├── dcrm/              # Project settings
├── manage.py
└── requirements.txt
```

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
pytest

# Run with coverage report
pytest --cov=. --cov-report=html

# Run specific test file
pytest tests/test_models.py

# Run with verbose output
pytest -v
```

### Coverage

Current test coverage: **92%** (exceeds 70% industry standard)

- 60 comprehensive tests
- Model validation tests
- API endpoint tests
- Authentication & permission tests
- Factory-boy for test data generation

---

## 🔧 Code Quality

### Pre-commit Hooks

```bash
# Install pre-commit hooks
pre-commit install

# Run manually
pre-commit run --all-files
```

### Linting & Formatting

```bash
# Format code
black .

# Sort imports
isort .

# Lint code
flake8 .

# Security scan
bandit -r .
```

---

## 📊 Available Tags (Pre-populated)

| Category | Tags |
|----------|------|
| **Leads** | hot-lead, cold-lead, qualified, enterprise, smb, demo-scheduled |
| **Contacts** | decision-maker, technical, influencer, champion |
| **Deals** | high-priority, needs-approval, renewal, upsell, Q1-target |
| **General** | vip, urgent |

Use tags for:
- Lead categorization
- Contact segmentation
- Deal prioritization
- Filtering and reporting

---

## 🚀 Deployment

### Render Deployment

This project is configured for [Render](https://render.com) deployment.

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Environment Variables

Required environment variables:

```env
SECRET_KEY=your-secret-key-here
DEBUG=False
DATABASE_URL=postgresql://user:pass@host:5432/dbname
ALLOWED_HOSTS=.render.com,yourdomain.com
FRONTEND_URL=https://your-frontend.vercel.app
```

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes with tests
4. Run tests and linters
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Django REST Framework** - Powerful REST API toolkit
- **SimpleJWT** - JWT authentication for Django
- **drf-spectacular** - OpenAPI 3 schema generation
- **factory-boy** - Test fixtures replacement

---

## 📧 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review API docs at `/api/docs/`

---

**Built with ❤️ using Django REST Framework**
