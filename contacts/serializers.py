from rest_framework import serializers
from .models import Contact

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'
        read_only_fields = ['owner', 'created_at', 'updated_at']
    def create(self, validated_data):

        validated_data['owner'] = self.context['request'].user
        if hasattr(self.context['request'].user, 'owned_organizations') and self.context['request'].user.owned_organizations.exists():
            validated_data['organization'] = self.context['request'].user.owned_organizations.first()
        return super().create(validated_data)