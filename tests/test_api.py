"""
API tests for CRM application.
Tests CRUD operations, authentication, permissions, and filtering.
"""

import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from tests.factories import (
    ContactFactory,
    DealFactory,
    LeadFactory,
    TagFactory,
    UserFactory,
)

# ============================================================================
# API TEST BASE SETUP
# ============================================================================


@pytest.fixture
def api_client():
    """Return an API client instance"""
    return APIClient()


@pytest.fixture
def authenticated_user():
    """Create and return an authenticated user"""
    user = UserFactory()
    return user


@pytest.fixture
def authenticated_client(api_client, authenticated_user):
    """Return an authenticated API client"""
    api_client.force_authenticate(user=authenticated_user)
    return api_client


# ============================================================================
# AUTHENTICATION TESTS
# ============================================================================


@pytest.mark.django_db
class TestAuthentication:
    def test_unauthenticated_request_fails(self, api_client):
        """Test that unauthenticated requests are rejected"""
        url = reverse("lead-list")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_authenticated_request_succeeds(self, authenticated_client):
        """Test that authenticated requests succeed"""
        url = reverse("lead-list")
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_200_OK


# ============================================================================
# LEAD API TESTS
# ============================================================================


@pytest.mark.django_db
class TestLeadAPI:
    def test_list_leads(self, authenticated_client, authenticated_user):
        """Test listing leads"""
        LeadFactory.create_batch(3, owner=authenticated_user)
        url = reverse("lead-list")
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 3

    def test_create_lead_valid_data(self, authenticated_client):
        """Test creating a lead with valid data"""
        url = reverse("lead-list")
        data = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john.doe@example.com",
            "phone": "+1234567890",
            "status": "new",
            "source": "website",
        }
        response = authenticated_client.post(url, data, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["first_name"] == "John"
        assert response.data["last_name"] == "Doe"

    def test_create_lead_missing_required_field(self, authenticated_client):
        """Test creating a lead with missing required fields fails"""
        url = reverse("lead-list")
        data = {"first_name": "John"}  # Missing email and last_name
        response = authenticated_client.post(url, data, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_retrieve_lead(self, authenticated_client, authenticated_user):
        """Test retrieving a specific lead"""
        lead = LeadFactory(owner=authenticated_user)
        url = reverse("lead-detail", args=[lead.id])
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["id"] == lead.id
        assert response.data["email"] == lead.email

    def test_update_lead(self, authenticated_client, authenticated_user):
        """Test updating a lead"""
        lead = LeadFactory(owner=authenticated_user, status="new")
        url = reverse("lead-detail", args=[lead.id])
        data = {"status": "qualified"}
        response = authenticated_client.patch(url, data, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["status"] == "qualified"

    def test_delete_lead(self, authenticated_client, authenticated_user):
        """Test deleting a lead"""
        lead = LeadFactory(owner=authenticated_user)
        url = reverse("lead-detail", args=[lead.id])
        response = authenticated_client.delete(url)
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_lead_with_tags(self, authenticated_client):
        """Test creating a lead with tags"""
        tag1 = TagFactory(name="hot-lead")
        tag2 = TagFactory(name="enterprise")
        url = reverse("lead-list")
        data = {
            "first_name": "Jane",
            "last_name": "Smith",
            "email": "jane@example.com",
            "tags": [tag1.id, tag2.id],
        }
        response = authenticated_client.post(url, data, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert len(response.data["tags"]) == 2


# ============================================================================
# CONTACT API TESTS
# ============================================================================


@pytest.mark.django_db
class TestContactAPI:
    def test_list_contacts(self, authenticated_client, authenticated_user):
        """Test listing contacts"""
        ContactFactory.create_batch(3, owner=authenticated_user)
        url = reverse("contact-list")
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 3

    def test_create_contact_valid_data(self, authenticated_client):
        """Test creating a contact with valid data"""
        url = reverse("contact-list")
        data = {
            "first_name": "Alice",
            "last_name": "Johnson",
            "email": "alice@example.com",
            "address": "123 Main St",
            "description": "VIP client",
        }
        response = authenticated_client.post(url, data, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["first_name"] == "Alice"

    def test_retrieve_contact(self, authenticated_client, authenticated_user):
        """Test retrieving a specific contact"""
        contact = ContactFactory(owner=authenticated_user)
        url = reverse("contact-detail", args=[contact.id])
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["id"] == contact.id

    def test_update_contact(self, authenticated_client, authenticated_user):
        """Test updating a contact"""
        contact = ContactFactory(owner=authenticated_user, description="Old desc")
        url = reverse("contact-detail", args=[contact.id])
        data = {"description": "New description"}
        response = authenticated_client.patch(url, data, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["description"] == "New description"

    def test_delete_contact(self, authenticated_client, authenticated_user):
        """Test deleting a contact"""
        contact = ContactFactory(owner=authenticated_user)
        url = reverse("contact-detail", args=[contact.id])
        response = authenticated_client.delete(url)
        assert response.status_code == status.HTTP_204_NO_CONTENT


# ============================================================================
# DEAL API TESTS
# ============================================================================


@pytest.mark.django_db
class TestDealAPI:
    def test_list_deals(self, authenticated_client, authenticated_user):
        """Test listing deals"""
        DealFactory.create_batch(3, owner=authenticated_user)
        url = reverse("deal-list")
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 3

    def test_create_deal_valid_data(self, authenticated_client, authenticated_user):
        """Test creating a deal with valid data"""
        contact = ContactFactory(owner=authenticated_user)
        url = reverse("deal-list")
        data = {
            "name": "Enterprise Sale",
            "value": "50000.00",
            "stage": "prospecting",
            "probability": 50,
            "contact": contact.id,
        }
        response = authenticated_client.post(url, data, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["name"] == "Enterprise Sale"

    def test_retrieve_deal(self, authenticated_client, authenticated_user):
        """Test retrieving a specific deal"""
        deal = DealFactory(owner=authenticated_user)
        url = reverse("deal-detail", args=[deal.id])
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["id"] == deal.id

    def test_update_deal_stage(self, authenticated_client, authenticated_user):
        """Test updating a deal stage"""
        deal = DealFactory(owner=authenticated_user, stage="prospecting")
        url = reverse("deal-detail", args=[deal.id])
        data = {"stage": "negotiation", "probability": 75}
        response = authenticated_client.patch(url, data, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["stage"] == "negotiation"
        assert response.data["probability"] == 75

    def test_delete_deal(self, authenticated_client, authenticated_user):
        """Test deleting a deal"""
        deal = DealFactory(owner=authenticated_user)
        url = reverse("deal-detail", args=[deal.id])
        response = authenticated_client.delete(url)
        assert response.status_code == status.HTTP_204_NO_CONTENT


# ============================================================================
# TAG API TESTS
# ============================================================================


@pytest.mark.django_db
class TestTagAPI:
    def test_list_tags(self, authenticated_client):
        """Test listing tags"""
        TagFactory.create_batch(5)
        url = reverse("tag-list")
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 5

    def test_create_tag(self, authenticated_client):
        """Test creating a tag"""
        url = reverse("tag-list")
        data = {"name": "urgent", "color": "#FF0000"}
        response = authenticated_client.post(url, data, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["name"] == "urgent"
        assert response.data["color"] == "#FF0000"

    def test_retrieve_tag(self, authenticated_client):
        """Test retrieving a specific tag"""
        tag = TagFactory()
        url = reverse("tag-detail", args=[tag.id])
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["id"] == tag.id


# ============================================================================
# ACTIVITY API TESTS
# ============================================================================


@pytest.mark.django_db
class TestActivityAPI:
    def test_list_activities(self, authenticated_client, authenticated_user):
        """Test listing activities"""
        from tests.factories import ActivityFactory

        ActivityFactory.create_batch(3, user=authenticated_user)
        url = reverse("activity-list")
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 3

    def test_create_activity(self, authenticated_client, authenticated_user):
        """Test creating an activity"""
        contact = ContactFactory(owner=authenticated_user)
        url = reverse("activity-list")
        data = {
            "summary": "Follow-up call",
            "details": "Discuss requirements",
            "activity_type": "call",
            "contact": contact.id,
        }
        response = authenticated_client.post(url, data, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["summary"] == "Follow-up call"


# ============================================================================
# HEALTH CHECK API TEST
# ============================================================================


@pytest.mark.django_db
def test_health_check(api_client):
    """Test health check endpoint"""
    url = reverse("health-check")
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert response.data == {"status": "ok"}
