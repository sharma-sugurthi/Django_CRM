from rest_framework import viewsets, permissions
from .models import Organization
from .serializers import OrganizationSerializer

class OrganizationViewSet(viewsets.ModelViewSet):
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Organization.objects.all()