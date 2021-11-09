import http
import json
import textwrap
from django.http import request

from django.test import TestCase, Client

from .models import ProblemSet, User, UserProfile, UserStatistics

# Create your tests here.
class SignTestCase(TestCase):
    def setUp(self):
        User.objects.create_user(username="John", email="12@asd.com", password="123")
        User.objects.create_user(username="Anna", email="23@asd.com", password="123")

    def test_signup(self):
        client = Client()
        request = {
            "username": "b",
            "email": "11@asd.com",
            "password": "d",
        }
        response = client.post("/api/signup/", request, content_type="application/json")
        self.assertEqual(User.objects.all().count(), 3)
        self.assertEqual(response.status_code, 201)

        request = {
            "username": "John",
            "email": "12@asd.com",
            "password": "123",
        }
        response = client.post("/api/signup/", request, content_type="application/json")
        self.assertEqual(response.status_code, 401)

        request = {
            "username": "John",
        }
        response = client.post("/api/signup/", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)

        response = client.get("/api/signup/")
        self.assertEqual(response.status_code, 405)

    def test_signin(self):
        client = Client()
        request = {
            "id": "11@asd.com",
            "password": "d",
        }
        response = client.post("/api/signin/", request, content_type="application/json")
        self.assertEqual(response.status_code, 401)
        request = {
            "id": "b",
            "password": "d",
        }
        response = client.post("/api/signin/", request, content_type="application/json")
        self.assertEqual(response.status_code, 401)

        request = {
            "id": "John",
            "password": "123",
        }
        response = client.post("/api/signin/", request, content_type="application/json")
        self.assertEqual(response.status_code, 201)

        request = {
            "username": "John",
        }
        response = client.post("/api/signin/", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)

        response = client.get("/api/signin/")
        self.assertEqual(response.status_code, 405)

    def test_signout(self):
        client = Client()
        request = {
            "id": "b",
            "password": "d",
        }
        response = client.post(
            "/api/signout/", request, content_type="application/json"
        )
        self.assertEqual(response.status_code, 405)

        response = client.get("/api/signout/")
        self.assertEqual(response.status_code, 401)

        request = {
            "id": "John",
            "password": "123",
        }
        response = client.post("/api/signin/", request, content_type="application/json")
        response = client.get("/api/signout/")
        self.assertEqual(response.status_code, 204)


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
            type=False,
            tag="test_tag_1",
            difficulty=1,
            content="test_content_1",
            creator=user_stat_1,
        )
        problem_set_1.recommender.add(user_stat_1, user_stat_2)
        problem_set_2 = ProblemSet.objects.create(
            title="test_title_2",
            type=True,
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

    def test_problem_set_solver(self):
        client1 = Client()

        response = client1.get("/api/solved/1/")
        self.assertEqual(response.status_code, 401)

        # User Sign-in
        request_user1 = {
            "id": "test_name_1",
            "password": "test_password_1",
        }
        response = client1.post(
            "/api/signin/", request_user1, content_type="application/json"
        )

        response = client1.get("/api/solved/3/")
        self.assertEqual(response.status_code, 404)

        response = client1.get("/api/solved/1/")
        self.assertEqual(response.status_code, 201)

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


class TokenTestCase(TestCase):
    def test_csrf(self):
        # By default, csrf checks are disabled in test client
        # To test csrf protection we enforce csrf checks here
        client = Client(enforce_csrf_checks=True)
        response = client.post(
            "/api/signup/",
            json.dumps({"username": "chris", "password": "chris"}),
            content_type="application/json",
        )
        self.assertEqual(
            response.status_code, 403
        )  # Request without csrf token returns 403 response

        response = client.get("/api/token/")
        csrftoken = response.cookies["csrftoken"].value  # Get csrf token from cookie

        response = client.post(
            "/api/signup/",
            json.dumps(
                {"username": "chris", "email": "12@asd.com", "password": "chris"}
            ),
            content_type="application/json",
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(response.status_code, 201)  # Pass csrf protection


class UserProfileTestCase(TestCase):
    not_pk = 1399  # This number should not match any of the IDs

    def setUp(self):
        User.objects.create_user(username="dummy", password="dummy")
        self.turing = User.objects.create_user(username="turing", password="turing")
        self.meitner = User.objects.create_user(username="meitner", password="meitner")

        # Since turing is the second user, self.turing.pk != self.turing_profile.pk
        # if UserProfile has its own primary key
        self.turing_profile = UserProfile.objects.create(
            user=self.turing, introduction="I love SWPP!"
        )
        self.meitner_profile = UserProfile.objects.create(
            user=self.meitner, introduction="I love SWPP too!"
        )
        self.client = Client()
        self.client.login(username="turing", password="turing")

    def tearDown(self):
        self.client.logout()
        UserProfile.objects.all().delete()
        User.objects.all().delete()

    def test_default_introduction_is_empty(self):
        temp_user = User.objects.create_user(username="fermi", password="fermi")
        temp_user_profile = UserProfile.objects.create(user=temp_user)
        self.assertEqual(temp_user_profile.introduction, "")

    def test_post_is_not_allowed(self):
        response = self.client.post(f"/api/user/{self.turing.pk}/profile/")
        self.assertEqual(response.status_code, http.HTTPStatus.METHOD_NOT_ALLOWED)

    def test_all_methods_responds_not_found(self):
        pending_profile_data = textwrap.dedent(
            """\
            {
                "introduction": "I changed my introduction!"
            }
            """
        )
        test_cases = [
            {"method": "get"},
            {"method": "put", "data": pending_profile_data},
        ]
        for test_case in test_cases:
            with self.subTest(method=test_case["method"]):
                response = self.client.generic(
                    path=f"/api/user/{self.not_pk}/profile/", **test_case
                )
                self.assertEqual(response.status_code, http.HTTPStatus.NOT_FOUND)

    def test_all_methods_redirects_anonymous_user(self):
        pending_profile_data = textwrap.dedent(
            """\
            {
                "introduction": "I changed my introduction!"
            }
            """
        )
        test_cases = [
            {"method": "get"},
            {"method": "put", "data": pending_profile_data},
        ]
        self.client.logout()
        for test_case in test_cases:
            with self.subTest(method=test_case["method"]):
                response = self.client.generic(
                    path=f"/api/user/{self.turing.pk}/profile/", **test_case
                )
                self.assertEqual(response.status_code, http.HTTPStatus.FOUND)
                self.assertEqual(response.url, "/api/signin/")

    def test_get_fetches_introduction(self):
        response = self.client.get(f"/api/user/{self.meitner.pk}/profile/")
        self.assertEqual(response.status_code, http.HTTPStatus.OK)
        expected_resonse = {"user": self.meitner.pk, "introduction": "I love SWPP too!"}
        self.assertJSONEqual(response.content.decode(), expected_resonse)

    def test_put_changes_introduction(self):
        pending_profile_data = textwrap.dedent(
            """\
            {
                "introduction": "I changed my introduction!"
            }
            """
        )
        response = self.client.put(
            f"/api/user/{self.turing.pk}/profile/", pending_profile_data
        )
        self.assertEqual(response.status_code, http.HTTPStatus.OK)
        new_introduction = UserProfile.objects.get(pk=self.turing.pk).introduction
        self.assertEqual(new_introduction, "I changed my introduction!")

    def test_put_responds_bad_request(self):
        pending_profile_data = textwrap.dedent(
            """\
            {
                "surprise": "This is the wrong request!"
            }
            """
        )
        response = self.client.put(
            f"/api/user/{self.turing.pk}/profile/", pending_profile_data
        )
        self.assertEqual(response.status_code, http.HTTPStatus.BAD_REQUEST)

    def test_put_responds_forbidden(self):
        pending_profile_data = textwrap.dedent(
            """\
            {
                "introduction": "Can I change others' introduction?"
            }
            """
        )
        response = self.client.put(
            f"/api/user/{self.meitner.pk}/profile/", pending_profile_data
        )
        self.assertEqual(response.status_code, http.HTTPStatus.FORBIDDEN)
        old_introduction = UserProfile.objects.get(pk=self.meitner.pk).introduction
        self.assertEqual(old_introduction, "I love SWPP too!")


class UserStatisticsTestCase(TestCase):
    def setUp(self):
        UserStatistics.objects.create(lastActiveDays=1)
        UserStatistics.objects.create(lastActiveDays=2)

    def test_statistics_count(self):
        self.assertEqual(UserStatistics.objects.all().count(), 2)

    def test_get_user_id(self):
        client = Client()
        response_1 = client.get("/api/user/1/statistics/")
        response_2 = client.get("/api/user/2/statistics/")

        self.assertEqual(response_1.status_code, 200)
        self.assertIn("1", response_1.content.decode())

        self.assertEqual(response_2.status_code, 200)
        self.assertIn("2", response_2.content.decode())
