from django.test import TestCase, Client
from .models import UserStatistics

# Create your tests here.
class UserStatisticsTestCase(TestCase):
  def setUp(self):
    UserStatistics.objects.create(lastActiveDays=1)
    UserStatistics.objects.create(lastActiveDays=2)

  def test_statistics_count(self):
    self.assertEqual(UserStatistics.objects.all().count(), 2)

  def test_hero_id(self):
    client = Client()
    response_1 = client.get('/api/user/1/statistics/')
    response_2 = client.get('/api/user/2/statistics/')

    self.assertEqual(response_1.status_code, 200)
    self.assertIn('1', response_1.content.decode())

    self.assertEqual(response_2.status_code, 200)
    self.assertIn('2', response_2.content.decode())
