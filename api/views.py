from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class HealthCheckView(APIView):
    permission_classes = []

    def get(self, request, *args, **kwargs):
        return Response({"status": "ok"},
        status=status.HTTP_200_OK)