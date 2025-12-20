from rest_framework import serializers
from .models import Lead

class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = '__all__'
        read_only_fields = ['owner', 'created_at', 'updated_at']
        
    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        # Automatically assign to the user's first organization if it exists
        if hasattr(self.context['request'].user, 'owned_organizations') and self.context['request'].user.owned_organizations.exists():
            validated_data['organization'] = self.context['request'].user.owned_organizations.first()
        return super().create(validated_data)