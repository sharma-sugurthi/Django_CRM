from rest_framework import viewsets, permissions
from .models import Deal
from .serializers import DealSerializer

class DealViewSet(viewsets.ModelViewSet):
    serializer_class = DealSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['stage', 'organization']
    search_fields = ['name', 'value', 'stage']
    ordering_fields = ['created_at', 'value', 'stage']

    def get_queryset(self):
        return Deal.objects.filter(owner=self.request.user)