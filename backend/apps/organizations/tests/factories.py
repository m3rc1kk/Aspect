import factory
from apps.accounts.tests.factories import UserFactory
from apps.organizations.models import Organization


class OrganizationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Organization

    owner = factory.SubFactory(UserFactory)
    username = factory.Sequence(lambda n: f'org{n}')
    nickname = factory.Faker('company')
