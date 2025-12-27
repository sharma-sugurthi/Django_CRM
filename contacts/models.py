from django.conf import settings
from django.db import models

from accounts.models import Organization
from tags.models import Tag


class Contact(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="contacts"
    )
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="contacts",
        null=True,
        blank=True,
    )

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Tags for categorization and filtering
    tags = models.ManyToManyField(Tag, blank=True, related_name="contacts")

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
