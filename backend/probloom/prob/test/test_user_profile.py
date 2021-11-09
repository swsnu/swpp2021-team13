from django.test import TestCase, Client
from prob.models import User, UserProfile
import http
import textwrap

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