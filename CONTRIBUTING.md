# 🤝 Contributing to Django CRM

Thank you for considering contributing to Django CRM! This document provides guidelines for contributions.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Commit Message Guidelines](#commit-message-guidelines)

---

## 🤗 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- No harassment, discrimination, or toxic behavior

---

## 🚀 Getting Started

### 1. Fork & Clone

```bash
# Fork repo on GitHub, then:
git clone https://github.com/YOUR_USERNAME/django-crm.git
cd django-crm/dcrm
```

### 2. Set Up Environment

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install pre-commit hooks
pre-commit install

# Run migrations
python3 manage.py migrate

# Create superuser
python3 manage.py createsuperuser
```

### 3. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
# Or: bugfix/issue-number-description
```

---

## 🔧 Development Workflow

### 1. Make Changes

- Follow [Code Standards](#code-standards)
- Add tests for new features
- Update documentation if needed

### 2. Run Quality Checks

```bash
# Format code
black .
isort .

# Lint
flake8 .

# Security scan
bandit -r accounts activities api contacts deals leads tags

# Run tests
pytest
```

### 3. Commit Changes

```bash
git add .
git commit -m "feat: add lead conversion feature"
```

### 4. Push & Create PR

```bash
git push origin feature/your-feature-name
```

Then create Pull Request on GitHub.

---

## 📐 Code Standards

### Python Style Guide

- **PEP 8** compliance (enforced by flake8)
- **Black** for formatting (100 char line length)
- **isort** for import sorting

### Django Best Practices

- Follow [Django Coding Style](https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/)
- Use class-based views where appropriate
- Keep views thin, models fat
- Use serializers for data validation
- Document complex business logic

### Code Organization

```python
# Standard library imports
import os
from datetime import datetime

# Third-party imports
from django.db import models
from rest_framework import serializers

# Local imports
from accounts.models import User
```

### Naming Conventions

- **Variables/Functions**: `snake_case`
- **Classes**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Private methods**: `_leading_underscore`

---

## 🧪 Testing Requirements

### Coverage Requirement

- Maintain **minimum 70% code coverage**
- Strive for **90%+ coverage** for new code

### Test Organization

```
tests/
├── factories.py       # Factory-boy test data
├── test_models.py     # Model tests
├── test_api.py        # API endpoint tests
└── test_integration.py # Integration tests
```

### Writing Tests

#### Model Tests

```python
@pytest.mark.django_db
def test_lead_creation():
    """Test creating a lead with valid data"""
    lead = LeadFactory(first_name="John", last_name="Doe")
    assert lead.id is not None
    assert str(lead) == "John Doe"
```

#### API Tests

```python
@pytest.mark.django_db
def test_create_lead_api(authenticated_client):
    """Test lead creation via API"""
    url = reverse("lead-list")
    data = {"first_name": "Jane", "last_name": "Smith", ...}
    response = authenticated_client.post(url, data)
    assert response.status_code == status.HTTP_201_CREATED
```

### Running Tests

```bash
# All tests
pytest

# Specific file
pytest tests/test_models.py

# With coverage
pytest --cov=. --cov-report=html

# Watch mode (requires pytest-watch)
ptw
```

---

## 📝 Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass (`pytest`)
- [ ] Coverage threshold met (70%+)
- [ ] Documentation updated
- [ ] Pre-commit hooks pass
- [ ] No merge conflicts with main

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] Coverage maintained/improved

## Checklist
- [ ] Code follows project style
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
```

### Review Process

1. Automated checks must pass:
   - GitHub Actions CI
   - Linting (flake8)
   - Tests (pytest)
   - Coverage threshold

2. At least 1 approval from maintainer

3. No unresolved comments

4. Squash and merge when approved

---

## 📨 Commit Message Guidelines

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(leads): add lead to contact conversion

- Implement convert_to_contact API endpoint
- Add tests for conversion logic
- Update documentation

Closes #42
```

```bash
fix(auth): resolve JWT token expiration issue

Token lifetime was too short, causing frequent re-auth.
Increased from 5min to 60min.

Fixes #123
```

---

## 🐛 Reporting Bugs

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the issue

**To Reproduce**
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen

**Environment**
- OS: [e.g., Ubuntu 22.04]
- Python version: [e.g., 3.10.12]
- Django version: [e.g., 5.0.0]

**Additional context**
Error logs, screenshots, etc.
```

---

## ✨ Feature Requests

### Feature Request Template

```markdown
**Is your feature related to a problem?**
Description of the problem

**Describe the solution**
What you want to happen

**Describe alternatives**
Other solutions you've considered

**Additional context**
Mockups, examples, etc.
```

---

## 🏗️ Project Structure

Understanding the codebase:

```
dcrm/
├── accounts/          # Authentication, users, organizations
├── leads/             # Lead management & conversion
├── contacts/          # Contact management
├── deals/             # Sales pipeline
├── activities/        # Activity tracking
├── tags/              # Tagging system
├── api/               # API routing & configuration
├── tests/             # Test suite
└── dcrm/              # Project settings
```

---

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Two Scoops of Django](https://www.feldroy.com/books/two-scoops-of-django-3-x)
- [pytest-django](https://pytest-django.readthedocs.io/)
- [Factory Boy](https://factoryboy.readthedocs.io/)

---

## ❓ Questions?

- Open a [GitHub Discussion](https://github.com/YOUR_USERNAME/YOUR_REPO/discussions)
- Check existing [Issues](https://github.com/YOUR_USERNAME/YOUR_REPO/issues)
- Review [Documentation](README.md)

---

## 🙏 Thank You!

Every contribution makes this project better. Whether it's:
- Reporting a bug
- Suggesting a feature
- Improving documentation
- Submitting code

**We appreciate you!** ❤️
