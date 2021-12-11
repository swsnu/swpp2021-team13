import http

from django.test import TestCase, Client

from prob.models import (
    Content,
    MultipleChoiceProblem,
    Solved,
    User,
    UserStatistics,
    ProblemSet,
)


class UserStatisticsTestCase(TestCase):
    """Tests for views.get_user_statistics.

    Summary:
    - Problem Set 1 (Creator: Turing)
      - Recommenders: Turing, Meitner
      - Problem 1-1 (Creator: Turing)
        - Turing (O)
        - Meitner (O)
      - Problem 1-2 (Creator: Turing)
        - Turing (O)
        - Meitner (O)
    - Problem Set 2 (Creator: Meitner)
      - Recommenders: Turing
      - Problem 2-1 (Creator: Meitner)
        - Turing (O)
        - Meitner (O)
      - Problem 2-2 (Creator: Meitner)
        - Turing (O)
        - Meitner (X)
    - Problem Set 3 (Creator: Turing)
      - Problem 3-1 (Creator: Turing)
        - Turing (X)
      - Problem 3-2 (Creator: Turing)
    """

    @classmethod
    def setUpTestData(cls):
        cls.turing = User.objects.create_user(
            pk=1,
            username="turing",
            email="turing@example.com",
            password="turing_password",
        )
        cls.meitner = User.objects.create_user(
            pk=2,
            username="meitner",
            email="meitner@example.com",
            password="meitner_password",
        )
        cls.ritchie = User.objects.create_user(
            pk=3,
            username="ritchie",
            email="ritchie@example.com",
            password="ritchie_password",
        )
        cls.turing_stat = UserStatistics.objects.create(user=cls.turing)
        cls.meitner_stat = UserStatistics.objects.create(user=cls.meitner)
        cls.ritchie_stat = UserStatistics.objects.create(user=cls.ritchie)

        cls.problem_set1 = ProblemSet.objects.create(
            pk=1,
            title="Turing's problem set",
            is_open=True,
            difficulty=1,
            description="This is Turing's problem set.",
            creator_id=cls.turing.pk,
        )
        cls.problem1_1 = MultipleChoiceProblem.objects.create(
            pk=1,
            problem_set=cls.problem_set1,
            number=1,
            content=Content.objects.create(text="This is problem 1-1."),
            creator_id=cls.turing.pk,
            solution="",
        )
        cls.problem1_2 = MultipleChoiceProblem.objects.create(
            pk=2,
            problem_set=cls.problem_set1,
            number=2,
            content=Content.objects.create(text="This is problem 1-2."),
            creator_id=cls.turing.pk,
            solution="",
        )

        cls.problem_set2 = ProblemSet.objects.create(
            pk=2,
            title="Meitner's problem set",
            is_open=True,
            difficulty=2,
            description="This is Meitner's problem set.",
            creator_id=cls.meitner.pk,
        )
        cls.problem2_1 = MultipleChoiceProblem.objects.create(
            pk=3,
            problem_set=cls.problem_set2,
            number=1,
            content=Content.objects.create(text="This is problem 2-1."),
            creator_id=cls.meitner.pk,
            solution="",
        )
        cls.problem2_2 = MultipleChoiceProblem.objects.create(
            pk=4,
            problem_set=cls.problem_set2,
            number=2,
            content=Content.objects.create(text="This is problem 2-2."),
            creator_id=cls.meitner.pk,
            solution="",
        )

        cls.problem_set3 = ProblemSet.objects.create(
            pk=3,
            title="Turing's another problem set",
            is_open=True,
            difficulty=1,
            description="This is Turing's another problem set.",
            creator_id=cls.turing.pk,
        )
        cls.problem3_1 = MultipleChoiceProblem.objects.create(
            pk=5,
            problem_set=cls.problem_set3,
            number=1,
            content=Content.objects.create(text="This is problem 3-1."),
            creator_id=cls.turing.pk,
            solution="",
        )
        cls.problem3_2 = MultipleChoiceProblem.objects.create(
            pk=6,
            problem_set=cls.problem_set3,
            number=1,
            content=Content.objects.create(text="This is problem 3-2."),
            creator_id=cls.turing.pk,
            solution="",
        )

        cls.problem_set1.recommenders.add(cls.turing_stat, cls.meitner_stat)
        cls.problem_set2.recommenders.add(cls.turing_stat)

        Solved.objects.create(
            solver_id=cls.turing.pk, problem=cls.problem1_1, result=True
        )
        Solved.objects.create(
            solver_id=cls.turing.pk, problem=cls.problem1_2, result=True
        )
        Solved.objects.create(
            solver_id=cls.meitner.pk, problem=cls.problem1_1, result=True
        )
        Solved.objects.create(
            solver_id=cls.meitner.pk, problem=cls.problem1_2, result=True
        )

        Solved.objects.create(
            solver_id=cls.turing.pk, problem=cls.problem2_1, result=True
        )
        Solved.objects.create(
            solver_id=cls.turing.pk, problem=cls.problem2_2, result=True
        )
        Solved.objects.create(
            solver_id=cls.meitner.pk, problem=cls.problem2_1, result=True
        )
        Solved.objects.create(
            solver_id=cls.meitner.pk, problem=cls.problem2_2, result=False
        )

        Solved.objects.create(
            solver_id=cls.turing.pk, problem=cls.problem3_1, result=False
        )

    def test_statistics_count(self):
        self.assertEqual(UserStatistics.objects.all().count(), 3)

    def test_get_user_id(self):
        client = Client()
        response = client.get(f"/api/user/{self.turing.pk}/statistics/")

        self.assertEqual(response.status_code, http.HTTPStatus.OK)
        self.assertContains(response, '"lastActiveDays": null')

        response = client.post(
            "/api/signin/",
            {"id": "turing", "password": "turing_password"},
            content_type="application/json",
        )
        response = client.get(f"/api/user/{self.turing.pk}/statistics/")

        self.assertEqual(response.status_code, http.HTTPStatus.OK)
        self.assertContains(response, '"lastActiveDays": 0')

    def test_statistics_value(self):
        test_cases = [
            {
                "pk": self.ritchie.pk,
                "name": "ritchie",
                "response": {
                    "numberOfCreatedProblems": 0,
                    "numberOfSolvedProblems": 0,
                    "numberOfCorrectProblems": 0,
                    "numberOfRecommendedProblemSets": 0,
                },
            },
            {
                "pk": self.turing.pk,
                "name": "turing",
                "response": {
                    "numberOfCreatedProblems": 4,
                    "numberOfSolvedProblems": 5,
                    "numberOfCorrectProblems": 4,
                    "numberOfRecommendedProblemSets": 2,
                },
            },
            {
                "pk": self.meitner.pk,
                "name": "meitner",
                "response": {
                    "numberOfCreatedProblems": 2,
                    "numberOfSolvedProblems": 4,
                    "numberOfCorrectProblems": 3,
                    "numberOfRecommendedProblemSets": 1,
                },
            },
        ]

        client = Client()
        client.login(username="turing", password="turing_password")
        for test_case in test_cases:
            with self.subTest(pk=test_case["pk"], name=test_case["name"]):
                response = client.get(f"/api/user/{test_case['pk']}/statistics/")
                self.assertEqual(response.status_code, http.HTTPStatus.OK)
                response_json = response.json()
                # Test if response contains all expected numbers
                self.assertLessEqual(
                    set(test_case["response"].items()), set(response_json.items())
                )
