from rest_framework import viewsets, permissions
from .models import Contact
from .serializers import ContactSerializer

class ContactViewSet(viewsets.ModelViewSet):
    serializer_class = ContactSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['organization', 'email']
    search_fields = ['first_name', 'last_name', 'email', 'description']
    ordering_fields = ['created_at', 'first_name']
    
    def get_queryset(self):
        return Contact.objects.filter(owner=self.request.user)
