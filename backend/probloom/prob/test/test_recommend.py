from django.http.response import HttpResponse
from django.test import TestCase, Client

from prob.models import User, UserStatistics, ProblemSet


class RecommendTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user_1 = User.objects.create_user(
            username="John", email="12@asd.com", password="123"
        )
        cls.user_stat_1 = UserStatistics.objects.create(user=cls.user_1)

        cls.problem_set_1 = ProblemSet.objects.create(
            pk=1,
            title="test_title_1",
            is_open=True,
            difficulty=1,
            description="test_content_1",
            creator=cls.user_stat_1,
        )

    def test_update_recommend(self):
        client = Client()

        # User sign in
        request = {
            "id": "John",
            "password": "123",
        }
        response = client.post("/api/signin/", request, content_type="application/json")

        request_fail = {
            "FAIL": "John",
        }
        response = client.put(
            "/api/problem_set/2/recommend/",
            request_fail,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 404)
        response = client.put(
            "/api/problem_set/1/recommend/",
            request_fail,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 400)

        request_success = {
            "recommend": True,
        }
        response = client.put(
            "/api/problem_set/1/recommend/",
            request_success,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 204)

    def test_get_is_recommender(self):
        client = Client()

        # User sign in
        request = {
            "id": "John",
            "password": "123",
        }
        response = client.post("/api/signin/", request, content_type="application/json")

        response = client.get("/api/problem_set/2/recommend/")
        self.assertEqual(response.status_code, 404)
        response = client.get("/api/problem_set/1/recommend/")
        self.assertEqual(response.status_code, 200)
