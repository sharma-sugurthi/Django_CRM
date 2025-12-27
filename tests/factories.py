"""
Factories for creating test data using factory_boy.
These factories generate fake data for all CRM models.
"""

import factory
from django.contrib.auth import get_user_model
from factory.django import DjangoModelFactory

from accounts.models import Organization
from activities.models import Activity
from contacts.models import Contact
from deals.models import Deal
from leads.models import Lead
from tags.models import Tag

User = get_user_model()


class UserFactory(DjangoModelFactory):
    class Meta:
        model = User

    username = factory.Sequence(lambda n: f"user{n}")
    email = factory.LazyAttribute(lambda obj: f"{obj.username}@example.com")
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    is_organizer = True
    is_agent = False

    @factory.post_generation
    def password(obj, create, extracted, **kwargs):
        if create:
            obj.set_password(extracted or "testpass123")
            obj.save()


class OrganizationFactory(DjangoModelFactory):
    class Meta:
        model = Organization

    name = factory.Faker("company")
    owner = factory.SubFactory(UserFactory)


class TagFactory(DjangoModelFactory):
    class Meta:
        model = Tag

    name = factory.Sequence(lambda n: f"tag-{n}")
    color = factory.Faker("hex_color")


class LeadFactory(DjangoModelFactory):
    class Meta:
        model = Lead

    owner = factory.SubFactory(UserFactory)
    organization = factory.SubFactory(OrganizationFactory)
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    email = factory.Faker("email")
    phone = factory.Faker("phone_number")
    status = "new"
    source = factory.Faker("word")

    @factory.post_generation
    def tags(self, create, extracted, **kwargs):
        if not create:
            return
        if extracted:
            for tag in extracted:
                self.tags.add(tag)


class ContactFactory(DjangoModelFactory):
    class Meta:
        model = Contact

    owner = factory.SubFactory(UserFactory)
    organization = factory.SubFactory(OrganizationFactory)
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    email = factory.Faker("email")
    address = factory.Faker("address")
    description = factory.Faker("text")

    @factory.post_generation
    def tags(self, create, extracted, **kwargs):
        if not create:
            return
        if extracted:
            for tag in extracted:
                self.tags.add(tag)


class DealFactory(DjangoModelFactory):
    class Meta:
        model = Deal

    owner = factory.SubFactory(UserFactory)
    organization = factory.SubFactory(OrganizationFactory)
    contact = factory.SubFactory(ContactFactory)
    name = factory.Faker("catch_phrase")
    value = factory.Faker("pydecimal", left_digits=6, right_digits=2, positive=True)
    stage = "prospecting"
    probability = factory.Faker("pyint", min_value=0, max_value=100)

    @factory.post_generation
    def tags(self, create, extracted, **kwargs):
        if not create:
            return
        if extracted:
            for tag in extracted:
                self.tags.add(tag)


class ActivityFactory(DjangoModelFactory):
    class Meta:
        model = Activity

    user = factory.SubFactory(UserFactory)
    contact = factory.SubFactory(ContactFactory)
    lead = factory.SubFactory(LeadFactory)
    summary = factory.Faker("sentence")
    details = factory.Faker("text")
    activity_type = "call"
