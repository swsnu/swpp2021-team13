import functools
import http

from django.test import TestCase, Client

from prob.models import (
    Content,
    MultipleChoiceProblem,
    MultipleChoiceProblemChoice,
    Solved,
    SubjectiveProblem,
    SubjectiveProblemSolution,
    User,
    UserStatistics,
    ProblemSet,
)


class SolvedTestCase(TestCase):
    not_pk = 1339  # This number should not match any of the IDs

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

    def setUp(self):
        self.client = Client()
        self.client.login(username="turing", password="turing_password")

    def tearDown(self):
        self.client.logout()

    def test_problem_set_list_get(self):
        response = self.client.get("/api/problem_set/")
        self.assertEqual(response.status_code, http.HTTPStatus.OK)
        response_json = response.json()
        self.assertEqual(response_json[0]["id"], 1)
        self.assertEqual(response_json[0]["solvedNum"], 1)
        self.assertEqual(response_json[1]["id"], 2)
        self.assertEqual(response_json[1]["solvedNum"], 0)

    def test_login_required(self):
        paths = [
            "/api/problem_set/1/solvers/",
            "/api/problem_set/1/solvers/1/",
        ]

        self.client.logout()
        for path in paths:
            with self.subTest(path=path):
                response = self.client.get(path)
                self.assertEqual(response.status_code, http.HTTPStatus.FOUND)
                self.assertEqual(response.headers["Location"], "/api/signin/")

    def test_not_found(self):
        paths = [
            f"/api/problem_set/{self.not_pk}/solvers/",
            f"/api/problem_set/{self.not_pk}/solvers/1/",
            f"/api/problem_set/1/solvers/{self.not_pk}/",
        ]

        for path in paths:
            with self.subTest(path=path):
                response = self.client.get(path)
                self.assertEqual(response.status_code, http.HTTPStatus.NOT_FOUND)

    def test_find_solvers(self):
        find_by_solver = lambda res_json, username: next(
            entry for entry in res_json if entry["username"] == username
        )

        response = self.client.get("/api/problem_set/1/solvers/")
        self.assertEqual(response.status_code, http.HTTPStatus.OK)
        response_json = response.json()
        response_turing = find_by_solver(response_json, "turing")
        self.assertEqual(response_turing["problems"], [True, True])
        self.assertEqual(response_turing["result"], True)
        response_meitner = find_by_solver(response_json, "meitner")
        self.assertEqual(response_meitner["problems"], [True, False])
        self.assertEqual(response_meitner["result"], False)

        response = self.client.get("/api/problem_set/2/solvers/")
        self.assertEqual(response.status_code, http.HTTPStatus.OK)
        response_json = response.json()
        response_turing = find_by_solver(response_json, "turing")
        self.assertEqual(response_turing["problems"], [False, None])
        self.assertEqual(response_turing["result"], False)
        self.assertContains(response, '"username": "turing"')
        self.assertNotContains(response, '"username": "meitner"')

    def test_get_solver(self):
        test_cases = [
            {"userID": 1, "result": True, "problems": [True, True]},
            {"userID": 2, "result": False, "problems": [True, False]},
            {"userID": 3, "result": False, "problems": [None, None]},
        ]

        for test_case in test_cases:
            with self.subTest(userID=test_case["userID"]):
                response = self.client.get(
                    f"/api/problem_set/1/solvers/{test_case['userID']}/"
                )
                self.assertEqual(response.status_code, http.HTTPStatus.OK)
                response_json = response.json()
                self.assertEqual(response_json["problems"], test_case["problems"])
                self.assertEqual(response_json["result"], test_case["result"])


class SolveProblemTestCase(TestCase):
    not_pk = 1339  # This number should not match any of the IDs

    @classmethod
    def setUpTestData(cls):
        cls.turing = User.objects.create_user(
            pk=1,
            username="turing",
            email="turing@example.com",
            password="turing_password",
        )
        cls.turing_stat = UserStatistics.objects.create(user=cls.turing)

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
            content=Content.objects.create(text="Choose all even numbers."),
            creator_id=cls.turing.pk,
            solution="",
        )
        MultipleChoiceProblemChoice.objects.create(
            problem=cls.problem1_1,
            number=3,
            is_solution=False,
            content=Content.objects.create(text="Three"),
        )
        MultipleChoiceProblemChoice.objects.create(
            problem=cls.problem1_1,
            number=4,
            is_solution=True,
            content=Content.objects.create(text="Four"),
        )
        MultipleChoiceProblemChoice.objects.create(
            problem=cls.problem1_1,
            number=1,
            is_solution=False,
            content=Content.objects.create(text="One"),
        )
        MultipleChoiceProblemChoice.objects.create(
            problem=cls.problem1_1,
            number=2,
            is_solution=True,
            content=Content.objects.create(text="Two"),
        )

        cls.problem1_2 = SubjectiveProblem.objects.create(
            pk=2,
            problem_set=cls.problem_set1,
            number=2,
            content=Content.objects.create(text="This is problem 1-2."),
            creator_id=cls.turing.pk,
        )
        SubjectiveProblemSolution.objects.create(
            problem=cls.problem1_2, text="Solution1"
        )
        SubjectiveProblemSolution.objects.create(
            problem=cls.problem1_2, text="Solution2"
        )

    def setUp(self):
        self.client = Client()
        self.post = functools.partial(self.client.post, content_type="application/json")
        self.client.login(username="turing", password="turing_password")

    def tearDown(self):
        self.client.logout()

    def test_login_required(self):
        self.client.logout()
        response = self.post("/api/problem/1/solve/", {"solution": [2, 4]})
        self.assertEqual(response.status_code, http.HTTPStatus.FOUND)
        self.assertEqual(response.headers["Location"], "/api/signin/")

    def test_not_found(self):
        response = self.post(f"/api/problem/{self.not_pk}/solve/", {"solution": [2, 4]})
        self.assertEqual(response.status_code, http.HTTPStatus.NOT_FOUND)

    def test_bad_request(self):
        bad_requests = [
            {"surprise": "surprise!"},
            '{ "solution": "syntax error }',
            {"solution": True},
            {"solution": [1, "2", 3]},
            {"solution": [1, 1, 2, 3]},  # Duplicate number
        ]

        for bad_request in bad_requests:
            with self.subTest(request=bad_request):
                response = self.post("/api/problem/1/solve/", bad_request)
                self.assertEqual(response.status_code, http.HTTPStatus.BAD_REQUEST)

    def test_incorrect_problem_type(self):
        test_cases = [
            {"problemID": 1, "solution": "Solution1"},
            {"problemID": 2, "solution": [2, 4]},
        ]

        for test_case in test_cases:
            with self.subTest(**test_case):
                response = self.post(
                    f"/api/problem/{test_case['problemID']}/solve/",
                    {"solution": test_case["solution"]},
                )
                self.assertEqual(response.status_code, http.HTTPStatus.OK)
                response_json = response.json()
                self.assertEqual(response_json["result"], "FAILURE")
                self.assertEqual(response_json["cause"], "INCORRECT_PROBLEM_TYPE")

    def test_correctness(self):
        test_cases = [
            {"problemID": 1, "solution": [2, 4], "result": True},
            {"problemID": 1, "solution": [1, 3], "result": False},
            {"problemID": 1, "solution": [2, 3, 5], "result": False},
            {"problemID": 1, "solution": [2, 4, 5], "result": False},
            {"problemID": 1, "solution": [], "result": False},
            {"problemID": 2, "solution": "Solution1", "result": True},
            {"problemID": 2, "solution": "Solution2", "result": True},
            {"problemID": 2, "solution": "Not solution", "result": False},
        ]

        for test_case in test_cases:
            with self.subTest(**test_case):
                response = self.post(
                    f"/api/problem/{test_case['problemID']}/solve/",
                    {"solution": test_case["solution"]},
                )
                self.assertEqual(response.status_code, http.HTTPStatus.OK)
                response_json = response.json()
                self.assertEqual(response_json["result"], test_case["result"])

    def test_solved_persistence(self):
        solutions = [
            {"problemID": 1, "correct": [2, 4], "incorrect": [1]},
            {"problemID": 2, "correct": "Solution1", "incorrect": "Not solution"},
        ]
        test_cases = [
            {"old": None, "new": False, "result": False},
            {"old": None, "new": True, "result": True},
            {"old": False, "new": False, "result": False},
            {"old": False, "new": True, "result": True},
            {"old": True, "new": False, "result": True},
            {"old": True, "new": True, "result": True},
        ]

        for solution in solutions:
            with self.subTest(problemID=solution["problemID"]):
                for test_case in test_cases:
                    with self.subTest(**test_case):
                        if test_case["old"] is not None:
                            Solved.objects.create(
                                solver_id=self.turing.pk,
                                problem_id=solution["problemID"],
                                result=test_case["old"],
                            )
                        pending_solution = (
                            solution["correct"]
                            if test_case["new"]
                            else solution["incorrect"]
                        )
                        response = self.post(
                            f"/api/problem/{solution['problemID']}/solve/",
                            {"solution": pending_solution},
                        )
                        self.assertEqual(response.status_code, http.HTTPStatus.OK)
                        self.assertEqual(Solved.objects.count(), 1)
                        self.assertEqual(
                            Solved.objects.values("result").get(
                                solver_id=self.turing.pk,
                                problem_id=solution["problemID"],
                            )["result"],
                            test_case["result"],
                        )
                    Solved.objects.all().delete()
