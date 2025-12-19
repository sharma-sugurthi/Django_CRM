from django.db import models
from django.conf import settings
from accounts.models import Organization
from contacts.models import Contact

class Deal(models.Model):
    STAGE_CHOICES = (
        ('prospecting', 'Prospecting'),
        ('negotiation', 'Negotiation'),
        ('closed_won', 'Closed Won'),
        ('closed_lost', 'Closed Lost'),
    )

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='deals')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='deals', null=True, blank=True)
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='deals')
    
    name = models.CharField(max_length=200)
    value = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default='prospecting')
    probability = models.IntegerField(default=0, help_text="Probability in %")
    contract = models.FileField(upload_to='contracts/', null=True, blank=True)
    
    closed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name