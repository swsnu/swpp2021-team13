import http

from django.test import TestCase, Client
from prob.models import User, UserStatistics, ProblemSet, Problem, create_problem


class ProblemInfoTestCase(TestCase):
    not_pk = 1339  # This number should not match any of the IDs

    problem1 = {
        "problemType": "multiple-choice",
        "problemNumber": 1,
        "content": "Who am I?",
        "choices": ["Suring", "Turing", "Uuring", "Vuring"],
        "solution": [2],
    }
    problem2 = {
        "problemType": "multiple-choice",
        "problemNumber": 2,
        "content": "What did I make?",
        "choices": [
            "Suring Machine",
            "Turing Machine",
            "Uuring Machine",
            "Vuring Machine",
        ],
        "solution": [2],
    }

    revised_problem1 = {
        "problemType": "multiple-choice",
        "content": "I edited the problem.",
        "choices": ["Suring", "Turing", "Uuring", "Vuring"],
        "solution": [2],
    }
    revised_problem1_with_choices = {
        "problemType": "multiple-choice",
        "content": "I think I should add more choices.",
        "choices": ["Ruring", "Suring", "Turing", "Uuring", "Vuring", "Wuring"],
        "solution": [3],
    }
    revised_problem1_subjective = {
        "problemType": "subjective",
        "content": "Who am I?",
        "solutions": ["Turing"],
    }
    revised_problem1_with_number = {
        "problemType": "multiple-choice",
        "problemNumber": 2,
        "content": "I edited the problem.",
        "choices": ["Suring", "Turing", "Uuring", "Vuring"],
        "solution": [2],
    }

    def setUp(self):
        self.turing = User.objects.create_user(
            username="turing",
            email="turing@example.com",
            password="turing_password",
        )
        self.meitner = User.objects.create_user(
            username="meitner",
            email="meitner@example.com",
            password="meitner_password",
        )
        self.turing_stat = UserStatistics.objects.create(user=self.turing)
        self.meitner_stat = UserStatistics.objects.create(user=self.meitner)
        self.turing_problem_set = ProblemSet.objects.create(
            pk=1,
            title="Turing Test",
            is_open=False,
            difficulty=1,
            description="This is a problem set.",
            creator_id=self.turing.pk,
        )
        self.turing_problem_set.recommenders.add(self.turing_stat, self.meitner_stat)

        create_problem(self.problem1, self.turing.pk, self.turing_problem_set.pk, 1)
        create_problem(self.problem2, self.turing.pk, self.turing_problem_set.pk, 2)

        self.client = Client()

    def tearDown(self):
        self.client.logout()
        Problem.objects.all().delete()
        ProblemSet.objects.all().delete()
        User.objects.all().delete()

    def test_login_required(self):
        response = self.client.get("/api/problem/1/")
        self.assertEqual(response.status_code, http.HTTPStatus.FOUND)
        self.assertEqual(response.headers["Location"], "/api/signin/")

        response = self.client.put(
            "/api/problem/1/", self.revised_problem1, content_type="application/json"
        )
        self.assertEqual(response.status_code, http.HTTPStatus.FOUND)
        self.assertEqual(response.headers["Location"], "/api/signin/")

        response = self.client.delete("/api/problem/1/")
        self.assertEqual(response.status_code, http.HTTPStatus.FOUND)
        self.assertEqual(response.headers["Location"], "/api/signin/")

    def test_not_found(self):
        self.client.login(username="turing", password="turing_password")

        response = self.client.get(f"/api/problem/{self.not_pk}/")
        self.assertEqual(response.status_code, http.HTTPStatus.NOT_FOUND)

        response = self.client.put(
            f"/api/problem/{self.not_pk}/",
            self.revised_problem1,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, http.HTTPStatus.NOT_FOUND)

        response = self.client.delete(f"/api/problem/{self.not_pk}/")
        self.assertEqual(response.status_code, http.HTTPStatus.NOT_FOUND)

    def test_forbidden(self):
        self.client.login(username="meitner", password="meitner_password")

        response = self.client.put(
            "/api/problem/1/", self.revised_problem1, content_type="application/json"
        )
        self.assertEqual(response.status_code, http.HTTPStatus.FORBIDDEN)

        response = self.client.delete("/api/problem/1/")
        self.assertEqual(response.status_code, http.HTTPStatus.FORBIDDEN)

    def test_bad_request(self):
        self.client.login(username="turing", password="turing_password")

        bad_request = {
            "surprise": "no",
        }
        response = self.client.put(
            "/api/problem/1/", bad_request, content_type="application/json"
        )
        self.assertEqual(response.status_code, http.HTTPStatus.BAD_REQUEST)

        worse_request = '{"this request data": "is not even a json"'
        response = self.client.put(
            "/api/problem/1/", worse_request, content_type="application/json"
        )
        self.assertEqual(response.status_code, http.HTTPStatus.BAD_REQUEST)

    def test_get(self):
        self.client.login(username="turing", password="turing_password")

        response = self.client.get("/api/problem/1/")
        self.assertEqual(response.status_code, http.HTTPStatus.OK)
        response_json = response.json()
        self.assertEqual(response_json["id"], 1)
        self.assertEqual(response_json["problemType"], "multiple-choice")
        self.assertEqual(response_json["problemSetID"], self.turing_problem_set.pk)
        self.assertEqual(response_json["problemNumber"], 1)
        self.assertEqual(response_json["creatorID"], self.turing.pk)
        self.assertEqual(response_json["content"], "Who am I?")
        self.assertEqual(
            response_json["choices"], ["Suring", "Turing", "Uuring", "Vuring"]
        )
        self.assertEqual(response_json["solution"], [2])

    def test_put(self):
        self.client.login(username="turing", password="turing_password")

        response = self.client.put(
            "/api/problem/1/", self.revised_problem1, content_type="application/json"
        )
        self.assertEqual(response.status_code, http.HTTPStatus.OK)
        response_json = response.json()
        self.assertEqual(response_json["content"], "I edited the problem.")
        response = self.client.get("/api/problem/1/")
        response_json = response.json()
        self.assertEqual(response_json["content"], "I edited the problem.")

        response = self.client.put(
            "/api/problem/1/",
            self.revised_problem1_with_choices,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, http.HTTPStatus.OK)
        response_json = response.json()
        self.assertEqual(
            response_json["choices"],
            ["Ruring", "Suring", "Turing", "Uuring", "Vuring", "Wuring"],
        )
        response = self.client.get("/api/problem/1/")
        response_json = response.json()
        self.assertEqual(
            response_json["choices"],
            ["Ruring", "Suring", "Turing", "Uuring", "Vuring", "Wuring"],
        )

        response = self.client.put(
            "/api/problem/1/",
            self.revised_problem1_subjective,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, http.HTTPStatus.OK)
        response_json = response.json()
        self.assertEqual(response_json["problemType"], "subjective")
        self.assertEqual(response_json["solutions"], ["Turing"])
        response = self.client.get("/api/problem/1/")
        response_json = response.json()
        self.assertEqual(response_json["problemType"], "subjective")
        self.assertEqual(response_json["solutions"], ["Turing"])

        response = self.client.put(
            "/api/problem/1/",
            self.revised_problem1_with_number,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, http.HTTPStatus.OK)
        self.assertQuerysetEqual(
            self.turing_problem_set.problems.order_by("number").values("id", "number"),
            [{"id": 2, "number": 1}, {"id": 1, "number": 2}],
        )

        revised_problem1_with_wrong_number = dict(self.revised_problem1_with_number)
        revised_problem1_with_wrong_number["problemNumber"] = 1000
        response = self.client.put(
            "/api/problem/1/",
            revised_problem1_with_wrong_number,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, http.HTTPStatus.CONFLICT)

    def test_delete(self):
        self.client.login(username="turing", password="turing_password")

        response = self.client.delete("/api/problem/1/")
        self.assertEqual(response.status_code, http.HTTPStatus.OK)
        self.assertQuerysetEqual(
            self.turing_problem_set.problems.order_by("number").values("id", "number"),
            [{"id": 2, "number": 1}],
        )
