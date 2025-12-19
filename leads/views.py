from rest_framework import viewsets, permissions
from .models import Lead
from .serializers import LeadSerializer

class LeadViewSet(viewsets.ModelViewSet):
    serializer_class = LeadSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['status', 'organization']
    search_fields = ['first_name', 'last_name', 'email', 'status']
    ordering_fields = ['created_at', 'status']

    def get_queryset(self):
        return Lead.objects.filter(owner=self.request.user)