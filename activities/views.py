from rest_framework import viewsets, permissions
from .models import Activity
from .serializers import ActivitySerializer

class ActivityViewSet(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['activity_type']
    search_fields = ['summary', 'details']
    ordering_fields = ['date']

    def get_queryset(self):
        return Activity.objects.filter(user=self.request.user)