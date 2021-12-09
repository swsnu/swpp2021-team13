from typing import Callable, Mapping, NamedTuple

from django.http.response import HttpResponse
from django.test import Client, TestCase

from prob.models import ProblemSet, ProblemSetComment, User, UserStatistics


class RequestData(NamedTuple):
    method: Callable[..., HttpResponse]
    kwargs: Mapping = {}


class CommentListTestCase(TestCase):
    request_user1 = {"id": "John", "password": "123"}
    request_user2 = {"id": "Anna", "password": "123"}

    request_comment = {"content": "John"}

    @classmethod
    def setUpTestData(cls):
        cls.john = User.objects.create_user(
            username="John", email="12@asd.com", password="123"
        )
        cls.anna = User.objects.create_user(
            username="Anna", email="23@asd.com", password="123"
        )
        cls.john_statistics = UserStatistics.objects.create(user=cls.john)
        cls.anna_statistics = UserStatistics.objects.create(user=cls.anna)
        cls.john_prob = ProblemSet.objects.create(
            title="abc", creator=cls.john_statistics
        )

    def setUp(self):
        self.client = Client()

    def tearDown(self):
        self.client.logout()

    def test_comment_list_not_found(self):
        requests = [
            RequestData(self.client.get),
            RequestData(
                self.client.post,
                {"data": self.request_comment, "content_type": "application/json"},
            ),
        ]

        # User Sign-in
        self.client.post(
            "/api/signin/", self.request_user1, content_type="application/json"
        )

        for request in requests:
            with self.subTest(method=request.method.__name__):
                response = request.method(
                    path="/api/problem_set/2/comment/", **request.kwargs
                )
                self.assertEqual(response.status_code, 404)

    def test_comment_list_bad_request(self):
        request = {
            "username": "John",
        }

        # User Sign-in
        self.client.post(
            "/api/signin/", self.request_user1, content_type="application/json"
        )

        response = self.client.post(
            "/api/problem_set/1/comment/", request, content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)

    def test_comment_list(self):
        # User Sign-in
        self.client.post(
            "/api/signin/", self.request_user1, content_type="application/json"
        )

        response = self.client.post(
            "/api/problem_set/1/comment/",
            self.request_comment,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 201)

        response = self.client.get("/api/problem_set/1/comment/")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, '"content": "John"')


class CommentInfoTestCase(TestCase):
    request_user1 = {"id": "John", "password": "123"}
    request_user2 = {"id": "Anna", "password": "123"}

    request_revised_comment = {"content": "123"}

    @classmethod
    def setUpTestData(cls):
        cls.john = User.objects.create_user(
            username="John", email="12@asd.com", password="123"
        )
        cls.anna = User.objects.create_user(
            username="Anna", email="23@asd.com", password="123"
        )
        cls.john_statistics = UserStatistics.objects.create(user=cls.john)
        cls.anna_statistics = UserStatistics.objects.create(user=cls.anna)
        cls.john_prob = ProblemSet.objects.create(
            title="abc", creator=cls.john_statistics
        )
        # Create comment
        cls.john_comment = ProblemSetComment.objects.create(
            content="John", creator_id=cls.john.pk, problem_set=cls.john_prob
        )

    def setUp(self):
        self.client = Client()

    def tearDown(self):
        self.client.logout()

    def test_comment_info_not_found(self):
        requests = [
            RequestData(self.client.get),
            RequestData(
                self.client.put,
                {
                    "data": self.request_revised_comment,
                    "content_type": "application/json",
                },
            ),
            RequestData(self.client.delete),
        ]

        # User Sign-in
        self.client.post(
            "/api/signin/", self.request_user1, content_type="application/json"
        )

        for request in requests:
            with self.subTest(method=request.method.__name__):
                response = request.method(
                    path="/api/problem_set/2/comment/1/", **request.kwargs
                )
                self.assertEqual(response.status_code, 404)
                response = request.method(
                    path="/api/problem_set/1/comment/2/", **request.kwargs
                )
                self.assertEqual(response.status_code, 404)

    def test_comment_info_forbidden(self):
        requests = [
            RequestData(
                self.client.put,
                {
                    "data": self.request_revised_comment,
                    "content_type": "application/json",
                },
            ),
            RequestData(self.client.delete),
        ]

        # User Sign-in
        self.client.post(
            "/api/signin/", self.request_user2, content_type="application/json"
        )

        for request in requests:
            with self.subTest(method=request.method.__name__):
                response = request.method(
                    path="/api/problem_set/1/comment/1/", **request.kwargs
                )
                self.assertEqual(response.status_code, 403)

    def test_comment_info_bad_request(self):
        request = {
            "user": "123",
        }

        # User Sign-in
        self.client.post(
            "/api/signin/", self.request_user1, content_type="application/json"
        )

        response = self.client.put(
            "/api/problem_set/1/comment/1/", request, content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)

    def test_comment_info(self):
        # User Sign-in
        self.client.post(
            "/api/signin/", self.request_user1, content_type="application/json"
        )

        # get
        response = self.client.get("/api/problem_set/1/comment/1/")
        self.assertEqual(response.status_code, 200)

        # put
        request = {"content": "123"}
        response = self.client.put(
            "/api/problem_set/1/comment/1/", request, content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)

        # delete
        response = self.client.delete(
            "/api/problem_set/1/comment/1/", request, content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
