from django.test import TestCase, Client
from prob.models import (
    Content,
    MultipleChoiceProblem,
    Solved,
    User,
    UserStatistics,
    ProblemSet,
)


class SolvedTestCase(TestCase):
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
            solver_id=cls.meitner.pk, problem=cls.problem1_1, result=True
        )
        Solved.objects.create(
            solver_id=cls.meitner.pk, problem=cls.problem1_2, result=False
        )
        Solved.objects.create(
            solver_id=cls.turing.pk, problem=cls.problem2_1, result=False
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

    def test_find_solvers(self):
        client = Client()

        client.login(username="turing", password="turing_password")

        find_by_solver = lambda res_json, username: next(
            entry for entry in res_json if entry["username"] == username
        )

        res = client.get("/api/problem_set/1/solvers/")
        res_json = res.json()
        res_turing = find_by_solver(res_json, "turing")
        self.assertEqual(res_turing["problems"], [True, True])
        self.assertEqual(res_turing["result"], True)
        res_meitner = find_by_solver(res_json, "meitner")
        self.assertEqual(res_meitner["problems"], [True, False])
        self.assertEqual(res_meitner["result"], False)

        res = client.get("/api/problem_set/2/solvers/")
        res_json = res.json()
        res_turing = find_by_solver(res_json, "turing")
        self.assertEqual(res_turing["problems"], [False, None])
        self.assertEqual(res_turing["result"], False)
        self.assertContains(res, '"username": "turing"')
        self.assertNotContains(res, '"username": "meitner"')

    def test_get_solver(self):
        client = Client()

        client.login(username="turing", password="turing_password")

        res = client.get("/api/problem_set/1/solvers/1/")
        res_json = res.json()
        self.assertEqual(res_json["problems"], [True, True])
        self.assertEqual(res_json["result"], True)

        res = client.get("/api/problem_set/1/solvers/2/")
        res_json = res.json()
        self.assertEqual(res_json["problems"], [True, False])
        self.assertEqual(res_json["result"], False)

        res = client.get("/api/problem_set/1/solvers/3/")
        res_json = res.json()
        self.assertEqual(res_json["problems"], [None, None])
        self.assertEqual(res_json["result"], False)
