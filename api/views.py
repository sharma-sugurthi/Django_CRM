from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class HealthCheckView(APIView):
    permission_classes = []

    def get(self, request, *_args, **_kwargs):
        return Response({"status": "ok"}, status=status.HTTP_200_OK)
