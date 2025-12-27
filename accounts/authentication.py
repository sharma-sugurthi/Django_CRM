from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from .models import Organization


class ApiKeyAuthentication(BaseAuthentication):
    def authenticate(self, request):
        api_key = request.headers.get("X-API-KEY")
        if not api_key:
            return None

        try:
            organization = Organization.objects.get(api_key=api_key)
        except Organization.DoesNotExist:
            raise AuthenticationFailed("Invalid API Key")

        # Map the request to the organization owner
        # This allows the existing permission classes (IsAuthenticated) to pass
        return (organization.owner, None)
