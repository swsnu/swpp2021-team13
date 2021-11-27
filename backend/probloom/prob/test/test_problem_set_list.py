import json
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
        user_stat_1 = UserStatistics.objects.create(user=user_1)
        user_stat_2 = UserStatistics.objects.create(user=user_2)
        problem_set_1 = ProblemSet.objects.create(
            title="test_title_1",
            is_open=False,
            difficulty=1,
            description="test_content_1",
            creator=user_stat_1,
        )
        problem_set_1.recommenders.add(user_stat_1, user_stat_2)
        problem_set_2 = ProblemSet.objects.create(
            title="test_title_2",
            is_open=True,
            difficulty=2,
            description="test_content_2",
            creator=user_stat_2,
        )
        problem_set_2.recommenders.add(user_stat_1)
        # Solved.objects.create(solver=user_stat_1, problem=problem_set_1, result=True)

    def test_problems_get(self):
        client = Client()

        req = {"id": "test_name_1", "password": "test_password_1"}
        res = client.post("/api/signin/", req, content_type="application/json")
        res = client.get("/api/problem_set/")
        self.assertEqual(res.status_code, 200)
        self.assertIn('"title": "test_title_1"', res.content.decode())
        self.assertIn('"title": "test_title_2"', res.content.decode())

    def test_problems_post(self):
        client = Client()

        req = {"id": "test_name_1", "password": "test_password_1"}
        res = client.post("/api/signin/", req, content_type="application/json")

        res = client.post("/api/problem_set/", {}, content_type="application/json")
        self.assertEqual(res.status_code, 400)

        req = {
            "title": "test_title_3",
            "scope": "scope-private",
            "tag": ["philosophy"],
            "difficulty": 1,
            "content": "test_content_3",
        }
        res = client.post(
            "/api/problem_set/", json.dumps(req), content_type="application/json"
        )
        self.assertEqual(res.status_code, 200)
        self.assertEqual(ProblemSet.objects.count(), 3)
        self.assertIn('"title": "test_title_3"', res.content.decode())

        req = {
            "title": "The Ultimate Problem Set",
            "scope": "scope-public",
            "tag": ["philosophy"],
            "difficulty": 1,
            "content": "This is an ultimate problem set. No one can stop this problem set from being submitted.",
            "problems": [
                {
                    "problemType": "multiple-choice",
                    "problemNumber": 1,
                    "content": "What is the answer to life, the universe, and everything?",
                    "choices": ["40", "41", "42", "43", "44"],
                    "solution": [3],
                },
                {
                    "problemType": "subjective",
                    "problemNumber": 2,
                    "content": "What is \\( 12 / 4 (2+1) \\)?",
                    "solutions": ["1", "9"],
                },
            ],
        }
        res = client.post(
            "/api/problem_set/", json.dumps(req), content_type="application/json"
        )
        self.assertEqual(res.status_code, 200)
        self.assertEqual(ProblemSet.objects.count(), 4)
        self.assertIn('"title": "The Ultimate Problem Set"', res.content.decode())

    def test_problems_not_allowed(self):
        client = Client()

        req = {"id": "test_name_1", "password": "test_password_1"}
        res = client.post("/api/signin/", req, content_type="application/json")

        res = client.put("/api/problem_set/", {}, content_type="application/json")
        self.assertEqual(res.status_code, 405)
        res = client.delete("/api/problem_set/")
        self.assertEqual(res.status_code, 405)
