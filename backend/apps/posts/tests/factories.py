import factory
from apps.accounts.tests.factories import UserFactory
from apps.posts.models import Post


class PostFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Post

    author = factory.SubFactory(UserFactory)
    content = factory.Faker('paragraph')
