from django.test import TestCase, Client
from .models import User
from .models import UserStatistics

# Create your tests here.
class SignInTestCase(TestCase):
  def setUp(self):
    User.objects.create(username="a", email="b", password="c", logged_in=False)

  def test_statistics_count(self):
    self.assertEqual(User.objects.all().count(), 1)

  def test_get_user_id(self):
    client = Client()
    response_1 = client.get('/api/user/1/')

    self.assertEqual(response_1.status_code, 200)
    self.assertIn('1', response_1.content.decode())
class UserStatisticsTestCase(TestCase):
  def setUp(self):
    UserStatistics.objects.create(lastActiveDays=1)
    UserStatistics.objects.create(lastActiveDays=2)

  def test_statistics_count(self):
    self.assertEqual(UserStatistics.objects.all().count(), 2)

  def test_get_user_id(self):
    client = Client()
    response_1 = client.get('/api/user/1/statistics/')
    response_2 = client.get('/api/user/2/statistics/')

    self.assertEqual(response_1.status_code, 200)
    self.assertIn('1', response_1.content.decode())

    self.assertEqual(response_2.status_code, 200)
    self.assertIn('2', response_2.content.decode())
