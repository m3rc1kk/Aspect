import factory
from django.contrib.auth import get_user_model

User = get_user_model()

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    email = factory.Sequence(lambda n: f'user{n}@example.com')
    username = factory.Sequence(lambda n: f'user{n}')
    nickname = factory.Faker('first_name')
    is_active = True

    @factory.post_generation
    def password(self, create, extracted, **kwargs):
        password = extracted or 'defaulttestpass123'
        self.set_password(password)
        if create:
            self.save()
        return self