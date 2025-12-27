from rest_framework import permissions, viewsets

from .models import Tag
from .serializers import TagSerializer


class TagViewSet(viewsets.ModelViewSet):
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Tag.objects.all()
