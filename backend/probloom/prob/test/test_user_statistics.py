from django.test import TestCase, Client
from prob.models import User, UserStatistics, ProblemSet


class UserStatisticsTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(
            username="USER", email="USER@asd.com", password="123"
        )
        user_stat = UserStatistics.objects.create(user=cls.user)
        ProblemSet.objects.create(
            title="TITLE",
            is_open=False,
            difficulty=1,
            description="CONTENT",
            creator=user_stat,
        )

    def test_statistics_count(self):
        self.assertEqual(UserStatistics.objects.all().count(), 1)

    def test_get_user_id(self):
        client = Client()
        response = client.get(f"/api/user/{self.user.pk}/statistics/")

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, '"lastActiveDays": null')

        response = client.post(
            "/api/signin/",
            {"id": "USER", "password": "123"},
            content_type="application/json",
        )
        response = client.get(f"/api/user/{self.user.pk}/statistics/")

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, '"lastActiveDays": 0')
