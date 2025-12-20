from rest_framework import viewsets, permissions, generics, status
from .models import Organization
from .serializers import OrganizationSerializer, UserRegistrationSerializer, UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
import uuid
from django.contrib.auth import get_user_model

User = get_user_model()

class OrganizationViewSet(viewsets.ModelViewSet):
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Organization.objects.all()

    @action(detail=True, methods=['post'], url_path='regenerate-key')
    def regenerate_api_key(self, request, pk=None):
        organization = self.get_object()
        organization.api_key = uuid.uuid4()
        organization.save()
        return Response({'api_key': organization.api_key})

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer

class UserDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user