from django.test import TestCase, Client
from .models import User
from .models import UserStatistics

# Create your tests here.
class SignInUpTestCase(TestCase):
  def setUp(self):
    User.objects.create(username="a", email="b", password="c", logged_in=False)

  def test_statistics_count(self):
    self.assertEqual(User.objects.all().count(), 1)

  def test_get_user(self):
    client = Client()
    response = client.get('/api/user/')

    self.assertEqual(response.status_code, 200)
    self.assertIn('1', response.content.decode())

  def test_get_user_id(self):
    client = Client()
    response = client.get('/api/user/1/')

    self.assertEqual(response.status_code, 200)
    self.assertIn('1', response.content.decode())
  
  def test_sign_up(self):
        client = Client()
        request = {
            'username': "b", 
            'email': "c", 
            'password': "d", 
            'logged_in': False
        }
        response = client.post('/api/user/', request, content_type='application/json')
        self.assertEqual(response.status_code, 200)

  def test_sign_in(self):
        client = Client()
        request = {
            'username': "a", 
            'email': "b", 
            'password': "c", 
            'logged_in': True
        }
        response = client.put('/api/user/1/', request, content_type='application/json')
        self.assertEqual(response.status_code, 200)
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
