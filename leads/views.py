from rest_framework import viewsets, permissions
from .models import Lead
from .serializers import LeadSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
import csv
import io

class LeadViewSet(viewsets.ModelViewSet):
    serializer_class = LeadSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['status', 'organization']
    search_fields = ['first_name', 'last_name', 'email', 'status']
    ordering_fields = ['created_at', 'status']
    @action(detail=False, methods=['POST'], parser_classes=[MultiPartParser, FormParser])
    def upload_csv(self, request):
        file_obj = request.FILES['file']
        decoded_file = file_obj.read().decode('utf-8')
        io_string = io.StringIO(decoded_file)
        reader = csv.DictReader(io_string)
        
        leads_created = 0
        
        for row in reader:
            Lead.objects.create(
                owner=request.user,
                first_name=row.get('first_name', ''),
                last_name=row.get('last_name', ''),
                email=row.get('email', ''),
                status='new'
            )
            leads_created += 1
            
        return Response({'status': f'Created {leads_created} leads'})
    
    def get_queryset(self):
        return Lead.objects.filter(owner=self.request.user)