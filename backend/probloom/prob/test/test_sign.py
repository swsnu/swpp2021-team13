from django.test import TestCase, Client
from prob.models import User


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

        request = {
            "username": "John",
        }
        response = client.post("/api/signup/", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)

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
