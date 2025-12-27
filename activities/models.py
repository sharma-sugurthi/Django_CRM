from django.conf import settings
from django.db import models

from contacts.models import Contact
from leads.models import Lead


class Activity(models.Model):
    TYPE_CHOICES = (
        ("call", "Call"),
        ("email", "Email"),
        ("meeting", "Meeting"),
        ("note", "Note"),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="activities"
    )

    contact = models.ForeignKey(
        Contact,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="activities",
    )
    lead = models.ForeignKey(
        Lead, on_delete=models.CASCADE, null=True, blank=True, related_name="activities"
    )

    activity_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    summary = models.CharField(max_length=255)
    details = models.TextField(blank=True)

    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_activity_type_display()}: {self.summary}"
