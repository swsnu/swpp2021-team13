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
        self.problem_set_1 = ProblemSet.objects.create(
            pk=1,
            title="test_title_1",
            is_open=False,
            difficulty=1,
            description="test_content_1",
            creator=user_stat_1,
        )
        self.problem_set_1.recommenders.add(user_stat_1, user_stat_2)
        self.problem_set_2 = ProblemSet.objects.create(
            pk=2,
            title="test_title_2",
            is_open=True,
            difficulty=2,
            description="test_content_2",
            creator=user_stat_2,
        )
        self.problem_set_2.recommenders.add(user_stat_1)

    def test_problem_set_info(self):
        client1 = Client()
        client2 = Client()

        choices = ["1", "2", "3", "4"]
        new_problem = {
            "problemType": "multiple-choice",
            "content": "state",
            "choices": choices,
            "solution": [3],
        }

        revised_problem_set = {
            "title": "123",
            "isOpen": True,
            "tag": ["mathematics"],
            "difficulty": "1",
            "content": "123",
        }

        response = client1.get("/api/problem_set/1/")
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.headers["Location"], "/api/signin/")
        response = client1.delete("/api/problem_set/1/")
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.headers["Location"], "/api/signin/")
        response = client1.post(
            "/api/problem_set/1/", new_problem, content_type="application/json"
        )
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.headers["Location"], "/api/signin/")
        response = client1.put(
            "/api/problem_set/1/", revised_problem_set, content_type="application/json"
        )
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.headers["Location"], "/api/signin/")

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

        response = client1.get("/api/problem_set/3/")
        self.assertEqual(response.status_code, 404)
        response = client1.delete("/api/problem_set/3/")
        self.assertEqual(response.status_code, 404)
        response = client1.post(
            "/api/problem_set/3/", new_problem, content_type="application/json"
        )
        self.assertEqual(response.status_code, 404)
        response = client1.put(
            "/api/problem_set/3/", revised_problem_set, content_type="application/json"
        )
        self.assertEqual(response.status_code, 404)

        response = client2.delete("/api/problem_set/1/")
        self.assertEqual(response.status_code, 403)
        response = client2.post(
            "/api/problem_set/1/", new_problem, content_type="application/json"
        )
        self.assertEqual(response.status_code, 403)
        response = client2.put(
            "/api/problem_set/1/", revised_problem_set, content_type="application/json"
        )
        self.assertEqual(response.status_code, 403)

        response = client1.post(
            "/api/problem_set/1/", new_problem, content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        response = client1.get("/api/problem_set/1/")
        self.assertEqual(response.status_code, 200)
        response_json = response.json()
        self.assertEqual(len(response_json["problems"]), 1)

        response = client1.post(
            "/api/problem_set/1/", new_problem, content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        response = client1.get("/api/problem_set/1/")
        self.assertEqual(response.status_code, 200)
        response_json = response.json()
        self.assertEqual(len(response_json["problems"]), 2)

        new_problem_with_number = dict(new_problem)
        new_problem_with_number["problemNumber"] = 1339
        response = client1.post(
            "/api/problem_set/1/",
            new_problem_with_number,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 400)

        new_problem_with_number["problemNumber"] = 1
        response = client1.post(
            "/api/problem_set/1/",
            new_problem_with_number,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        # Assert each problem number of problem set is unique
        self.assertEqual(len(set(self.problem_set_1.problems.values_list("number"))), 3)

        response = client1.put(
            "/api/problem_set/1/", revised_problem_set, content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        response = client1.get("/api/problem_set/1/")
        self.assertEqual(response.status_code, 200)
        self.assertIn('"title": "123"', response.content.decode())

        bad_request = {"no": "way"}

        response = client1.post(
            "/api/problem_set/1/", bad_request, content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)

        response = client1.put(
            "/api/problem_set/1/", bad_request, content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)

        worse_request = "Lorem ipsum dolor sit amet, consectetur adipiscing elit,"

        response = client1.post(
            "/api/problem_set/1/", worse_request, content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)

        response = client1.put(
            "/api/problem_set/1/", worse_request, content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)

        response = client1.delete("/api/problem_set/1/")
        self.assertEqual(response.status_code, 200)
