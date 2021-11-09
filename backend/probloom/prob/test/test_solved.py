from django.test import TestCase, Client
from prob.models import User, UserStatistics, ProblemSet, Solved

class SolvedTestCase(TestCase):
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
        Solved.objects.create(
            solver=user_stat_1, problem=problem_set_1, result=True
        )

    def test_solved_prob_get(self):
        client = Client()
        res = client.get("/api/solved/1/")
        self.assertEqual(res.status_code, 401)

        req = {"id": "test_name_1", "password": "test_password_1"}
        res = client.post("/api/signin/", req, content_type="application/json")
        res = client.get("/api/solved/0/")
        self.assertEqual(res.status_code, 404)

        res = client.get("/api/solved/1/")
        self.assertEqual(res.status_code, 200)
        self.assertIn('"userID": 1', res.content.decode())

    def test_solved_prob_not_allowed(self):
        client = Client()
        res = client.post("/api/solved/1/", {}, content_type="application/json")
        self.assertEqual(res.status_code, 405)
        res = client.put("/api/solved/1/", {}, content_type="application/json")
        self.assertEqual(res.status_code, 405)
        res = client.delete("/api/solved/1/")
        self.assertEqual(res.status_code, 405)

    def test_solved_result_get(self):
        client = Client()
        res = client.get("/api/solved/1/1/")
        self.assertEqual(res.status_code, 401)

        req = {"id": "test_name_1", "password": "test_password_1"}
        res = client.post("/api/signin/", req, content_type="application/json")
        res = client.get("/api/solved/0/1/")
        self.assertEqual(res.status_code, 404)

        res = client.get("/api/solved/1/1/")
        self.assertEqual(res.status_code, 200)
        self.assertIn('"result": true', res.content.decode())

    def test_solved_result_post(self):
        client = Client()
        res = client.post("/api/solved/1/2/", {}, content_type="application/json")
        self.assertEqual(res.status_code, 400)

        req = {"result": True}
        res = client.post("/api/solved/1/2/", req, content_type="application/json")
        self.assertEqual(res.status_code, 401)

        req = {"id": "test_name_1", "password": "test_password_1"}
        res = client.post("/api/signin/", req, content_type="application/json")
        req = {"result": True}
        res = client.post("/api/solved/0/2/", req, content_type="application/json")
        self.assertEqual(res.status_code, 404)

        res = client.post("/api/solved/1/2/", req, content_type="application/json")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(Solved.objects.all().count(), 2)
        self.assertIn('"result": true', res.content.decode())

    def test_solved_result_not_allowed(self):
        client = Client()
        res = client.put("/api/solved/1/2/", {}, content_type="application/json")
        self.assertEqual(res.status_code, 405)
        res = client.delete("/api/solved/1/2/")
        self.assertEqual(res.status_code, 405)
