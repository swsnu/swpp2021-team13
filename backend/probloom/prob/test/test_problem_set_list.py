from django.test import TestCase, Client
from prob.models import User, UserStatistics, ProblemSet, Solved


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
        Solved.objects.create(solver=user_stat_1, problem=problem_set_1, result=True)

    def test_problems_get(self):
        client = Client()

        req = {"id": "test_name_1", "password": "test_password_1"}
        res = client.post("/api/signin/", req, content_type="application/json")
        res = client.get("/api/problem/")
        self.assertEqual(res.status_code, 200)
        self.assertIn('"title": "test_title_1"', res.content.decode())
        self.assertIn('"title": "test_title_2"', res.content.decode())

    def test_problems_post(self):
        client = Client()

        req = {"id": "test_name_1", "password": "test_password_1"}
        res = client.post("/api/signin/", req, content_type="application/json")

        res = client.post("/api/problem/", {}, content_type="application/json")
        self.assertEqual(res.status_code, 400)

        req = {"id": "test_name_1", "password": "test_password_1"}
        client.post("/api/signin/", req, content_type="application/json")
        req = {
            "title": "test_title_3",
            "scope": "scope-private",
            "tag": "test_tag_3",
            "difficulty": 1,
            "content": "test_content_3",
            "problems": [{"index":1, "problem_type":"choice", "problem_statement":"1", "solution":"1", "explanation":"1", "choice": ["1", "1", "1", "1"]}],
        }
        res = client.post("/api/problem/", req, content_type="application/json")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(ProblemSet.objects.all().count(), 3)
        self.assertIn('"title": "test_title_3"', res.content.decode())

    def test_problems_not_allowed(self):
        client = Client()

        req = {"id": "test_name_1", "password": "test_password_1"}
        res = client.post("/api/signin/", req, content_type="application/json")

        res = client.put("/api/problem/", {}, content_type="application/json")
        self.assertEqual(res.status_code, 405)
        res = client.delete("/api/problem/")
        self.assertEqual(res.status_code, 405)
