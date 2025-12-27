"""
Model tests for CRM application.
Tests model creation, validation, relationships, and business logic.
"""

import pytest
from django.contrib.auth import get_user_model
from django.db import IntegrityError

from tests.factories import (
    ActivityFactory,
    ContactFactory,
    DealFactory,
    LeadFactory,
    OrganizationFactory,
    TagFactory,
    UserFactory,
)

User = get_user_model()


# ============================================================================
# USER & ORGANIZATION TESTS
# ============================================================================


@pytest.mark.django_db
class TestUserModel:
    def test_create_user(self):
        """Test creating a user with valid data"""
        user = UserFactory()
        assert user.id is not None
        assert user.username is not None
        assert user.email.endswith("@example.com")
        assert user.is_organizer is True

    def test_user_str_representation(self):
        """Test user string representation returns username"""
        user = UserFactory(username="testuser")
        assert str(user) == "testuser"

    def test_user_password_is_hashed(self):
        """Test that user password is properly hashed"""
        user = UserFactory(password="mypassword")
        assert user.password != "mypassword"
        assert user.check_password("mypassword") is True


@pytest.mark.django_db
class TestOrganizationModel:
    def test_create_organization(self):
        """Test creating an organization"""
        org = OrganizationFactory()
        assert org.id is not None
        assert org.name is not None
        assert org.owner is not None
        assert org.api_key is not None

    def test_organization_str_representation(self):
        """Test organization string representation"""
        org = OrganizationFactory(name="Acme Corp")
        assert str(org) == "Acme Corp"

    def test_organization_owner_relationship(self):
        """Test organization has valid owner relationship"""
        user = UserFactory()
        org = OrganizationFactory(owner=user)
        assert org.owner == user
        assert org in user.owned_organizations.all()


# ============================================================================
# TAG TESTS
# ============================================================================


@pytest.mark.django_db
class TestTagModel:
    def test_create_tag(self):
        """Test creating a tag"""
        tag = TagFactory(name="hot-lead", color="#FF5733")
        assert tag.id is not None
        assert tag.name == "hot-lead"
        assert tag.color == "#FF5733"

    def test_tag_str_representation(self):
        """Test tag string representation"""
        tag = TagFactory(name="vip")
        assert str(tag) == "vip"

    def test_tag_unique_name(self):
        """Test that tag names must be unique"""
        TagFactory(name="unique-tag")
        with pytest.raises(IntegrityError):
            TagFactory(name="unique-tag")


# ============================================================================
# LEAD TESTS
# ============================================================================


@pytest.mark.django_db
class TestLeadModel:
    def test_create_lead(self):
        """Test creating a lead with valid data"""
        lead = LeadFactory()
        assert lead.id is not None
        assert lead.first_name is not None
        assert lead.last_name is not None
        assert lead.email is not None

    def test_lead_str_representation(self):
        """Test lead string representation"""
        lead = LeadFactory(first_name="John", last_name="Doe")
        assert str(lead) == "John Doe"

    def test_lead_default_status(self):
        """Test lead default status is 'new'"""
        lead = LeadFactory()
        assert lead.status == "new"

    def test_lead_status_choices(self):
        """Test lead status can be set to valid choices"""
        valid_statuses = ["new", "contacted", "qualified", "lost"]
        for status in valid_statuses:
            lead = LeadFactory(status=status)
            assert lead.status == status

    def test_lead_owner_relationship(self):
        """Test lead has valid owner relationship"""
        user = UserFactory()
        lead = LeadFactory(owner=user)
        assert lead.owner == user
        assert lead in user.leads.all()

    def test_lead_organization_relationship(self):
        """Test lead has valid organization relationship"""
        org = OrganizationFactory()
        lead = LeadFactory(organization=org)
        assert lead.organization == org
        assert lead in org.leads.all()

    def test_lead_tags_relationship(self):
        """Test lead can have multiple tags"""
        tag1 = TagFactory(name="hot-lead")
        tag2 = TagFactory(name="enterprise")
        lead = LeadFactory(tags=[tag1, tag2])
        assert tag1 in lead.tags.all()
        assert tag2 in lead.tags.all()
        assert lead.tags.count() == 2

    def test_lead_timestamps(self):
        """Test lead has created_at and updated_at timestamps"""
        lead = LeadFactory()
        assert lead.created_at is not None
        assert lead.updated_at is not None


# ============================================================================
# CONTACT TESTS
# ============================================================================


@pytest.mark.django_db
class TestContactModel:
    def test_create_contact(self):
        """Test creating a contact with valid data"""
        contact = ContactFactory()
        assert contact.id is not None
        assert contact.first_name is not None
        assert contact.last_name is not None

    def test_contact_str_representation(self):
        """Test contact string representation"""
        contact = ContactFactory(first_name="Jane", last_name="Smith")
        assert str(contact) == "Jane Smith"

    def test_contact_owner_relationship(self):
        """Test contact has valid owner relationship"""
        user = UserFactory()
        contact = ContactFactory(owner=user)
        assert contact.owner == user
        assert contact in user.contacts.all()

    def test_contact_organization_relationship(self):
        """Test contact has valid organization relationship"""
        org = OrganizationFactory()
        contact = ContactFactory(organization=org)
        assert contact.organization == org
        assert contact in org.contacts.all()

    def test_contact_tags_relationship(self):
        """Test contact can have multiple tags"""
        tag1 = TagFactory(name="decision-maker")
        tag2 = TagFactory(name="vip")
        contact = ContactFactory(tags=[tag1, tag2])
        assert tag1 in contact.tags.all()
        assert tag2 in contact.tags.all()


# ============================================================================
# DEAL TESTS
# ============================================================================


@pytest.mark.django_db
class TestDealModel:
    def test_create_deal(self):
        """Test creating a deal with valid data"""
        deal = DealFactory()
        assert deal.id is not None
        assert deal.name is not None
        assert deal.value is not None

    def test_deal_str_representation(self):
        """Test deal string representation"""
        deal = DealFactory(name="Enterprise Sale")
        assert str(deal) == "Enterprise Sale"

    def test_deal_default_stage(self):
        """Test deal default stage is 'prospecting'"""
        deal = DealFactory()
        assert deal.stage == "prospecting"

    def test_deal_stage_choices(self):
        """Test deal stage can be set to valid choices"""
        valid_stages = ["prospecting", "negotiation", "closed_won", "closed_lost"]
        for stage in valid_stages:
            deal = DealFactory(stage=stage)
            assert deal.stage == stage

    def test_deal_default_probability(self):
        """Test deal has probability field"""
        deal = DealFactory(probability=75)
        assert deal.probability == 75

    def test_deal_contact_relationship(self):
        """Test deal has valid contact relationship"""
        contact = ContactFactory()
        deal = DealFactory(contact=contact)
        assert deal.contact == contact
        assert deal in contact.deals.all()

    def test_deal_tags_relationship(self):
        """Test deal can have multiple tags"""
        tag1 = TagFactory(name="high-priority")
        tag2 = TagFactory(name="Q1-target")
        deal = DealFactory(tags=[tag1, tag2])
        assert tag1 in deal.tags.all()
        assert tag2 in deal.tags.all()


# ============================================================================
# ACTIVITY TESTS
# ============================================================================


@pytest.mark.django_db
class TestActivityModel:
    def test_create_activity(self):
        """Test creating an activity with valid data"""
        activity = ActivityFactory()
        assert activity.id is not None
        assert activity.summary is not None
        assert activity.activity_type is not None

    def test_activity_str_representation(self):
        """Test activity string representation"""
        activity = ActivityFactory(summary="Follow-up call")
        assert "Follow-up call" in str(activity)

    def test_activity_types(self):
        """Test activity can have different types"""
        valid_types = ["call", "email", "meeting", "note"]
        for activity_type in valid_types:
            activity = ActivityFactory(activity_type=activity_type)
            assert activity.activity_type == activity_type

    def test_activity_contact_relationship(self):
        """Test activity has valid contact relationship"""
        contact = ContactFactory()
        activity = ActivityFactory(contact=contact)
        assert activity.contact == contact

    def test_activity_lead_relationship(self):
        """Test activity has valid lead relationship"""
        lead = LeadFactory()
        activity = ActivityFactory(lead=lead)
        assert activity.lead == lead
