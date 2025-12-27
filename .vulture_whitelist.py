# Vulture whitelist for intentionally unused code
# Django signals require these parameter names exactly

# Signal handlers (Django convention)
send_lead_welcome_email.sender  # noqa: F821 - leads/signals.py:10
send_lead_welcome_email.kwargs  # noqa: F821 - leads/signals.py:10

# DRF API views (required by framework)
regenerate_api_key._pk  # noqa: F821 - accounts/views.py:25
HealthCheckView.get._args  # noqa: F821 - api/views.py:9
HealthCheckView.get._kwargs  # noqa: F821 - api/views.py:9
