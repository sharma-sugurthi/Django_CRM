from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from .models import Lead
from django.conf import settings

@receiver(post_save, sender=Lead)
def send_lead_welcome_email(sender, instance, created, **kwargs):
    if created and instance.email:
        subject = f"Welcome, {instance.first_name}!"
        message = f"""
        Hi {instance.first_name},

        Thanks for being interested in our Organization: {instance.organization}.
        We have added you to our CRM and an agent will contact you shortly.

        Best,
        The CRM Team
        """
        
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [instance.email],
            fail_silently=False,
        )