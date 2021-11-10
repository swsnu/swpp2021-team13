from django.test import TestCase, Client
from prob.models import User, UserStatistics, ProblemSet

class CommentTestCase(TestCase):
    def setUp(self):
        self.john = User.objects.create_user(
            username="John", email="12@asd.com", password="123"
        )
        self.anna = User.objects.create_user(
            username="Anna", email="23@asd.com", password="123"
        )
        self.john_statistics = UserStatistics(user=self.john)
        self.john_statistics.save()
        self.john_prob = ProblemSet(title="abc", creator=self.john_statistics)
        self.john_prob.save()

    def test_comment_list(self):
        client1 = Client()

        response = client1.get("/api/comment/")
        self.assertEqual(response.status_code, 401)
        request = {
            "userID": self.john.id,
            "username": "John",
            "problemSetID": self.john_prob.id,
            "content": "123",
        }
        response = client1.post(
            "/api/comment/", request, content_type="application/json"
        )
        self.assertEqual(response.status_code, 401)

        # User Sign-in
        request_user1 = {
            "id": "John",
            "password": "123",
        }
        response = client1.post(
            "/api/signin/", request_user1, content_type="application/json"
        )
        self.assertEqual(response.status_code, 201)

        response = client1.post(
            "/api/comment/", request, content_type="application/json"
        )
        self.assertEqual(response.status_code, 201)

        res = []
        response = client1.get("/api/comment/")
        self.assertEqual(response.status_code, 201)
        res = response.json()
        self.assertEqual(response.json(), res)

        request = {"title": "123"}
        response = client1.post(
            "/api/comment/", request, content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)

    def test_comment_info(self):
        client1 = Client()
        client2 = Client()

        response = client1.get("/api/comment/1/")
        self.assertEqual(response.status_code, 401)
        response = client1.delete("/api/comment/1/")
        self.assertEqual(response.status_code, 401)
        request = {"content": "123"}
        response = client1.put(
            "/api/comment/1/", request, content_type="application/json"
        )
        self.assertEqual(response.status_code, 401)

        # User Sign-in
        request_user1 = {
            "id": "John",
            "password": "123",
        }
        request_user2 = {
            "id": "Anna",
            "password": "123",
        }
        response = client1.post(
            "/api/signin/", request_user1, content_type="application/json"
        )
        response = client2.post(
            "/api/signin/", request_user2, content_type="application/json"
        )

        response = client1.get("/api/comment/1/")
        self.assertEqual(response.status_code, 404)
        response = client1.delete("/api/comment/1/")
        self.assertEqual(response.status_code, 404)
        response = client1.put(
            "/api/comment/1/", request, content_type="application/json"
        )
        self.assertEqual(response.status_code, 404)

        # Create comment
        request_com = {
            "userID": self.john.id,
            "username": "John",
            "problemSetID": self.john_prob.id,
            "content": "123",
        }
        response = client1.post(
            "/api/comment/", request_com, content_type="application/json"
        )

        response = client2.delete("/api/comment/1/")
        self.assertEqual(response.status_code, 403)
        response = client2.put(
            "/api/comment/1/", request, content_type="application/json"
        )
        self.assertEqual(response.status_code, 403)

        response = client1.get("/api/comment/1/")
        self.assertEqual(response.status_code, 201)
        response = client1.put(
            "/api/comment/1/", request, content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)

        request = {"title": "123"}
        response = client1.put(
            "/api/comment/1/", request, content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)

        response = client1.delete("/api/comment/1/")
        self.assertEqual(response.status_code, 200)