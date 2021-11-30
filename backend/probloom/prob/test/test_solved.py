from django.test import TestCase, Client
from prob.models import (
    Content,
    MultipleChoiceProblem,
    Solved,
    User,
    UserStatistics,
    ProblemSet,
)


class ProblemSetListTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.turing = User.objects.create_user(
            username="turing",
            email="turing@example.com",
            password="turing_password",
        )
        cls.meitner = User.objects.create_user(
            username="meitner",
            email="meitner@example.com",
            password="meitner_password",
        )
        cls.turing_stat = UserStatistics.objects.create(user=cls.turing)
        cls.meitner_stat = UserStatistics.objects.create(user=cls.meitner)

        cls.problem_set1 = ProblemSet.objects.create(
            pk=1,
            title="Turing's problem set",
            is_open=True,
            difficulty=1,
            description="This is Turing's problem set.",
            creator_id=cls.turing.pk,
        )
        cls.problem1_1 = MultipleChoiceProblem.objects.create(
            problem_set=cls.problem_set1,
            number=1,
            content=Content.objects.create(text="This is problem 1-1."),
            creator_id=cls.turing.pk,
            solution="",
        )
        cls.problem1_2 = MultipleChoiceProblem.objects.create(
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
            problem_set=cls.problem_set2,
            number=1,
            content=Content.objects.create(text="This is problem 2-1."),
            creator_id=cls.meitner.pk,
            solution="",
        )
        cls.problem2_2 = MultipleChoiceProblem.objects.create(
            problem_set=cls.problem_set2,
            number=2,
            content=Content.objects.create(text="This is problem 2-2."),
            creator_id=cls.meitner.pk,
            solution="",
        )

        Solved.objects.create(
            solver_id=cls.turing.pk, problem=cls.problem1_1, result=True
        )
        Solved.objects.create(
            solver_id=cls.turing.pk, problem=cls.problem1_2, result=True
        )
        Solved.objects.create(
            solver_id=cls.turing.pk, problem=cls.problem1_1, result=True
        )
        Solved.objects.create(
            solver_id=cls.turing.pk, problem=cls.problem1_2, result=False
        )
        Solved.objects.create(
            solver_id=cls.meitner.pk, problem=cls.problem1_1, result=False
        )

    def test_problems_get(self):
        client = Client()

        client.login(username="turing", password="turing_password")

        res = client.get("/api/problem_set/")
        self.assertEqual(res.status_code, 200)
        res_json = res.json()
        self.assertEqual(res_json[0]["id"], 1)
        self.assertEqual(res_json[0]["solvedNum"], 1)
        self.assertEqual(res_json[1]["id"], 2)
        self.assertEqual(res_json[1]["solvedNum"], 0)
