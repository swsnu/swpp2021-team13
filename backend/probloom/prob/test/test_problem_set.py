from django.test import TestCase, Client
from prob.models import User, UserStatistics, ProblemSet


class ProblemSetTestCase(TestCase):
    def setUp(self):
        user_1 = User.objects.create_user(
            username="test_name_1",
            email="test_email_1@test.test",
            password="test_password_1",
        )
        user_2 = User.objects.create_user(
            username="test_name_2",
            email="test_email_2@test.test",
            password="test_password_2",
        )
        user_stat_1 = UserStatistics.objects.create(lastActiveDays=1, user=user_1)
        user_stat_2 = UserStatistics.objects.create(lastActiveDays=2, user=user_2)
        problem_set_1 = ProblemSet.objects.create(
            title="test_title_1",
            is_open=False,
            tag="test_tag_1",
            difficulty=1,
            content="test_content_1",
            creator=user_stat_1,
        )
        problem_set_1.recommender.add(user_stat_1, user_stat_2)
        problem_set_2 = ProblemSet.objects.create(
            title="test_title_2",
            is_open=True,
            tag="test_tag_2",
            difficulty=2,
            content="test_content_2",
            creator=user_stat_2,
        )
        problem_set_2.recommender.add(user_stat_1)

    def test_problem_set_info(self):
        client1 = Client()
        client2 = Client()

        response = client1.get("/api/problem/1/")
        self.assertEqual(response.status_code, 401)
        response = client1.delete("/api/problem/1/")
        self.assertEqual(response.status_code, 401)
        request = {"title": "123", "content": "123"}
        response = client1.put(
            "/api/problem/1/", request, content_type="application/json"
        )
        self.assertEqual(response.status_code, 401)

        # User Sign-in
        request_user1 = {
            "id": "test_name_1",
            "password": "test_password_1",
        }
        request_user2 = {
            "id": "test_name_2",
            "password": "test_password_2",
        }
        response = client1.post(
            "/api/signin/", request_user1, content_type="application/json"
        )
        response = client2.post(
            "/api/signin/", request_user2, content_type="application/json"
        )

        response = client1.get("/api/problem/3/")
        self.assertEqual(response.status_code, 404)
        response = client1.delete("/api/problem/3/")
        self.assertEqual(response.status_code, 404)
        response = client1.put(
            "/api/problem/3/", request, content_type="application/json"
        )
        self.assertEqual(response.status_code, 404)

        response = client2.delete("/api/problem/1/")
        self.assertEqual(response.status_code, 403)
        response = client2.put(
            "/api/problem/1/", request, content_type="application/json"
        )
        self.assertEqual(response.status_code, 403)

        response = client1.get("/api/problem/1/")
        self.assertEqual(response.status_code, 201)
        response = client1.put(
            "/api/problem/1/", request, content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)

        request = {"title": "123"}
        response = client1.put(
            "/api/problem/1/", request, content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)

        response = client1.delete("/api/problem/1/")
        self.assertEqual(response.status_code, 200)

    def test_problem_set_comment(self):
        client1 = Client()

        response = client1.get("/api/problem/1/comment/")
        self.assertEqual(response.status_code, 401)

        # User Sign-in
        request_user1 = {
            "id": "test_name_1",
            "password": "test_password_1",
        }
        response = client1.post(
            "/api/signin/", request_user1, content_type="application/json"
        )

        response = client1.get("/api/problem/3/comment/")
        self.assertEqual(response.status_code, 404)

        # Create comment
        request = {
            "userID": 1,
            "username": "test_name_1",
            "problemSetID": 1,
            "content": "123",
        }
        response = client1.post(
            "/api/comment/", request, content_type="application/json"
        )

        res = []
        response = client1.get("/api/problem/1/comment/")
        self.assertEqual(response.status_code, 201)
        res = response.json()
        self.assertEqual(response.json(), res)
