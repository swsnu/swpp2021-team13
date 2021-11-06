from django.test import TestCase, Client
from .models import User
from .models import UserStatistics
import json

# Create your tests here.
class SignTestCase(TestCase):
    def setUp(self):
        User.objects.create_user(username="John", email="12@asd.com", password="123")
        User.objects.create_user(username="Anna", email="23@asd.com", password="123")

    def test_signup(self):
        client = Client()
        request = {
            "username": "b",
            "email": "11@asd.com",
            "password": "d",
        }
        response = client.post("/api/signup/", request, content_type="application/json")
        self.assertEqual(User.objects.all().count(), 3)
        self.assertEqual(response.status_code, 201)

        request = {
            "username": "John",
            "email": "12@asd.com",
            "password": "123",
        }
        response = client.post("/api/signup/", request, content_type="application/json")
        self.assertEqual(response.status_code, 401)

        response = client.get("/api/signup/")
        self.assertEqual(response.status_code, 405)

    def test_signin(self):
        client = Client()
        request = {
            "id": "11@asd.com",
            "password": "d",
        }
        response = client.post("/api/signin/", request, content_type="application/json")
        self.assertEqual(response.status_code, 401)
        request = {
            "id": "b",
            "password": "d",
        }
        response = client.post("/api/signin/", request, content_type="application/json")
        self.assertEqual(response.status_code, 401)

        request = {
            "id": "John",
            "password": "123",
        }
        response = client.post("/api/signin/", request, content_type="application/json")
        self.assertEqual(response.status_code, 201)

        request = {
            "username": "John",
        }
        response = client.post("/api/signin/", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)

        response = client.get("/api/signin/")
        self.assertEqual(response.status_code, 405)

    def test_signout(self):
        client = Client()
        request = {
            "id": "b",
            "password": "d",
        }
        response = client.post(
            "/api/signout/", request, content_type="application/json"
        )
        self.assertEqual(response.status_code, 405)

        response = client.get("/api/signout/")
        self.assertEqual(response.status_code, 401)

        request = {
            "id": "John",
            "password": "123",
        }
        response = client.post("/api/signin/", request, content_type="application/json")
        response = client.get("/api/signout/")
        self.assertEqual(response.status_code, 204)


class TokenTestCase(TestCase):
    def test_token(self):
        client = Client()
        response = client.post(
            "/api/token/",
            json.dumps({"username": "chris", "password": "chris"}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 405)

    def test_csrf(self):
        # By default, csrf checks are disabled in test client
        # To test csrf protection we enforce csrf checks here
        client = Client(enforce_csrf_checks=True)
        response = client.post(
            "/api/signup/",
            json.dumps({"username": "chris", "password": "chris"}),
            content_type="application/json",
        )
        self.assertEqual(
            response.status_code, 403
        )  # Request without csrf token returns 403 response

        response = client.get("/api/token/")
        csrftoken = response.cookies["csrftoken"].value  # Get csrf token from cookie

        response = client.post(
            "/api/signup/",
            json.dumps(
                {"username": "chris", "email": "12@asd.com", "password": "chris"}
            ),
            content_type="application/json",
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(response.status_code, 201)  # Pass csrf protection


class UserStatisticsTestCase(TestCase):
    def setUp(self):
        UserStatistics.objects.create(lastActiveDays=1)
        UserStatistics.objects.create(lastActiveDays=2)

    def test_statistics_count(self):
        self.assertEqual(UserStatistics.objects.all().count(), 2)

    def test_get_user_id(self):
        client = Client()
        response_1 = client.get("/api/user/1/statistics/")
        response_2 = client.get("/api/user/2/statistics/")

        self.assertEqual(response_1.status_code, 200)
        self.assertIn("1", response_1.content.decode())

        self.assertEqual(response_2.status_code, 200)
        self.assertIn("2", response_2.content.decode())
