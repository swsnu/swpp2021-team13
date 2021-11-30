from typing import Callable, Mapping, NamedTuple

from django.http.response import HttpResponse
from django.test import TestCase, Client

from prob.models import User, UserStatistics, ProblemSet


class ProblemSetTestCase(TestCase):
    request_user1 = {
        "id": "test_name_1",
        "password": "test_password_1",
    }
    request_user2 = {
        "id": "test_name_2",
        "password": "test_password_2",
    }

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

    @classmethod
    def setUpTestData(cls):
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
        cls.problem_set_1 = ProblemSet.objects.create(
            pk=1,
            title="test_title_1",
            is_open=False,
            difficulty=1,
            description="test_content_1",
            creator=user_stat_1,
        )
        cls.problem_set_1.recommenders.add(user_stat_1, user_stat_2)
        cls.problem_set_2 = ProblemSet.objects.create(
            pk=2,
            title="test_title_2",
            is_open=True,
            difficulty=2,
            description="test_content_2",
            creator=user_stat_2,
        )
        cls.problem_set_2.recommenders.add(user_stat_1)

    def setUp(self):
        self.client = Client()

    def tearDown(self):
        self.client.logout()

    class RequestData(NamedTuple):
        method: Callable[..., HttpResponse]
        kwargs: Mapping = {}

    def test_login_required(self):
        requests = [
            self.RequestData(self.client.get),
            self.RequestData(
                self.client.post,
                {"data": self.new_problem, "content_type": "application/json"},
            ),
            self.RequestData(
                self.client.put,
                {"data": self.revised_problem_set, "content_type": "application/json"},
            ),
            self.RequestData(self.client.delete),
        ]

        for request in requests:
            with self.subTest(method=request.method.__name__):
                response = request.method(path="/api/problem_set/1/", **request.kwargs)
                self.assertEqual(response.status_code, 302)
                self.assertEqual(response.headers["Location"], "/api/signin/")

    def test_not_found(self):
        requests = [
            self.RequestData(self.client.get),
            self.RequestData(
                self.client.post,
                {"data": self.new_problem, "content_type": "application/json"},
            ),
            self.RequestData(
                self.client.put,
                {"data": self.revised_problem_set, "content_type": "application/json"},
            ),
            self.RequestData(self.client.delete),
        ]

        # User Sign-in
        self.client.post(
            "/api/signin/", self.request_user1, content_type="application/json"
        )

        for request in requests:
            with self.subTest(method=request.method.__name__):
                response = request.method(path="/api/problem_set/3/", **request.kwargs)
                self.assertEqual(response.status_code, 404)

    def test_forbidden(self):
        requests = [
            self.RequestData(
                self.client.post,
                {"data": self.new_problem, "content_type": "application/json"},
            ),
            self.RequestData(
                self.client.put,
                {"data": self.revised_problem_set, "content_type": "application/json"},
            ),
            self.RequestData(self.client.delete),
        ]

        # User Sign-in
        self.client.post(
            "/api/signin/", self.request_user2, content_type="application/json"
        )

        for request in requests:
            with self.subTest(method=request.method.__name__):
                response = request.method(path="/api/problem_set/1/", **request.kwargs)
                self.assertEqual(response.status_code, 403)

    def test_bad_request(self):
        request_methods = [self.client.post, self.client.put]
        bad_request = {"no": "way"}
        worse_request = "Lorem ipsum dolor sit amet, consectetur adipiscing elit,"
        bad_requests = [bad_request, worse_request]

        # User Sign-in
        self.client.post(
            "/api/signin/", self.request_user1, content_type="application/json"
        )

        for request_method, bad_request in zip(request_methods, bad_requests):
            with self.subTest(method=request_method.__name__, data=bad_request):
                response = request_method(
                    path="/api/problem_set/1/",
                    data=bad_request,
                    content_type="application/json",
                )
                self.assertEqual(response.status_code, 400)

    def test_problem_set_info(self):
        response = self.client.post(
            "/api/signin/", self.request_user1, content_type="application/json"
        )

        # POST
        for num_problems in [1, 2]:
            response = self.client.post(
                "/api/problem_set/1/", self.new_problem, content_type="application/json"
            )
            self.assertEqual(response.status_code, 200)
            response = self.client.get("/api/problem_set/1/")
            self.assertEqual(response.status_code, 200)
            response_json = response.json()
            self.assertEqual(len(response_json["problems"]), num_problems)

        new_problem_with_number = dict(self.new_problem)
        new_problem_with_number["problemNumber"] = 1339
        response = self.client.post(
            "/api/problem_set/1/",
            new_problem_with_number,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 400)

        # POST with problem number set
        new_problem_with_number["problemNumber"] = 1
        response = self.client.post(
            "/api/problem_set/1/",
            new_problem_with_number,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        # Assert each problem number of problem set is unique
        self.assertEqual(len(set(self.problem_set_1.problems.values_list("number"))), 3)

        # PUT
        response = self.client.put(
            "/api/problem_set/1/",
            self.revised_problem_set,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        response = self.client.get("/api/problem_set/1/")
        self.assertEqual(response.status_code, 200)
        self.assertIn('"title": "123"', response.content.decode())

        # DELETE
        response = self.client.delete("/api/problem_set/1/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(ProblemSet.objects.count(), 1)
