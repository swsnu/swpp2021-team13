from django.test import TestCase, Client
from .models import User

# Create your tests here.
class SignInTestCase(TestCase):
  def setUp(self):
    User.objects.create(username="a", email="b", password="c", logged_in=False)

  def test_statistics_count(self):
    self.assertEqual(User.objects.all().count(), 1)

  def test_hero_id(self):
    client = Client()
    response_1 = client.get('/api/user/1/')

    self.assertEqual(response_1.status_code, 200)
    self.assertIn('1', response_1.content.decode())
