from django.test import TestCase, Client
from prob.models import User, UserStatistics, ProblemSet


class UserStatisticsTestCase(TestCase):
    def setUp(self):
        user = User.objects.create_user(username="USER", email="USER@asd.com", password="123")
        user_stat = UserStatistics.objects.create(lastActiveDays=1, user=user)
        ProblemSet.objects.create(
            title="TITLE",
            is_open=False,
            tag="TAG",
            difficulty=1,
            content="CONTENT",
            creator=user_stat,
        )

    def test_statistics_count(self):
        self.assertEqual(UserStatistics.objects.all().count(), 1)

    def test_get_user_id(self):
        client = Client()
        res = []
        response = client.get("/api/user/1/statistics/")
        res = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertIn("1", response.content.decode())
        self.assertEqual(res, response.json())
