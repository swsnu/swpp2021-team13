from django.test import TestCase, Client
from .models import User, UserStatistics, Problem, Solved
import json

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


class TokenTestCase(TestCase):
    def test_token(self):
        client = Client()
        response = client.post(
            "/api/token/",
            json.dumps({"username": "chris", "password": "chris"}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 405)

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


class ProblemsTestCase(TestCase):
    def setUp(self):
        user_1 = User.objects.create_user(
            username='test_name_1',
            email='test_email_1@test.test', 
            password='test_password_1')
        user_2 = User.objects.create_user(
            username='test_name_2',
            email='test_email_2@test.test', 
            password='test_password_2')
        user_stat_1 = UserStatistics.objects.create(
            lastActiveDays=1, 
            user=user_1)
        user_stat_2 = UserStatistics.objects.create(
            lastActiveDays=2, 
            user=user_2)
        problem_1 = Problem.objects.create(
            title='test_title_1',
            type=False, 
            tag='test_tag_1', 
            difficulty=1,
            content='test_content_1', 
            solution='test_solution_1',
            creator=user_stat_1)
        problem_1.recommender.add(user_stat_1, user_stat_2)
        problem_2 = Problem.objects.create(
            title='test_title_2',
            type=True, 
            tag='test_tag_2', 
            difficulty=2,
            content='test_content_2', 
            solution='test_solution_2',
            creator=user_stat_2)
        problem_2.recommender.add(user_stat_1)
        solved_1 = Solved.objects.create(
            solver=user_stat_1,
            problem=problem_1,
            result=True
        )

    def test_problems_get(self):
        client = Client()
        res = client.get('/api/problem/')
        self.assertEqual(res.status_code, 401)
        
        req = {
            'id': 'test_name_1',
            'password': 'test_password_1'
        }
        res = client.post('/api/signin/', req, 
            content_type='application/json')
        res = client.get('/api/problem/')
        self.assertEqual(res.status_code, 200)
        self.assertIn('"title": "test_title_1"',
            res.content.decode())
        self.assertIn('"title": "test_title_2"',
            res.content.decode())

    def test_problems_post(self):
        client = Client()
        res = client.post('/api/problem/', {},
            content_type='application/json')
        self.assertEqual(res.status_code, 400)
        
        req = {
            'title': 'test_title_3',
            'type': False,
            'tag': 'test_tag_3',
            'difficulty': 1,
            'content': 'test_content_3',
            'solution': 'test_solution_3'
        }
        res = client.post('/api/problem/', req,
            content_type='application/json')
        self.assertEqual(res.status_code, 401)

        req = {
            'id': 'test_name_1',
            'password': 'test_password_1'
        }
        client.post('/api/signin/', req, 
            content_type='application/json')
        req = {
            'title': 'test_title_3',
            'type': False,
            'tag': 'test_tag_3',
            'difficulty': 1,
            'content': 'test_content_3',
            'solution': 'test_solution_3'
        }
        res = client.post('/api/problem/', req,
            content_type='application/json')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(Problem.objects.all().count(), 3)
        self.assertIn('"title": "test_title_3"',
            res.content.decode())

    def test_problems_not_allowed(self):
        client = Client()
        res = client.put('/api/problem/', {},
            content_type='application/json')
        self.assertEqual(res.status_code, 405)
        res = client.delete('/api/problem/')
        self.assertEqual(res.status_code, 405)


class SolvedTestCase(TestCase):
    def setUp(self):
        user_1 = User.objects.create_user(
            username='test_name_1',
            email='test_email_1@test.test', 
            password='test_password_1')
        user_2 = User.objects.create_user(
            username='test_name_2',
            email='test_email_2@test.test', 
            password='test_password_2')
        user_stat_1 = UserStatistics.objects.create(
            lastActiveDays=1, 
            user=user_1)
        user_stat_2 = UserStatistics.objects.create(
            lastActiveDays=2, 
            user=user_2)
        problem_1 = Problem.objects.create(
            title='test_title_1',
            type=False, 
            tag='test_tag_1', 
            difficulty=1,
            content='test_content_1', 
            solution='test_solution_1',
            creator=user_stat_1)
        problem_1.recommender.add(user_stat_1, user_stat_2)
        problem_2 = Problem.objects.create(
            title='test_title_2',
            type=True, 
            tag='test_tag_2', 
            difficulty=2,
            content='test_content_2', 
            solution='test_solution_2',
            creator=user_stat_2)
        problem_2.recommender.add(user_stat_1)
        solved_1 = Solved.objects.create(
            solver=user_stat_1,
            problem=problem_1,
            result=True)

    def test_solved_prob_get(self):
        client = Client()
        res = client.get('/api/solved/1/')
        self.assertEqual(res.status_code, 401)

        req = {
            'id': 'test_name_1',
            'password': 'test_password_1'
        }
        res = client.post('/api/signin/', req, 
            content_type='application/json')    
        res = client.get('/api/solved/0/')
        self.assertEqual(res.status_code, 404)

        res = client.get('/api/solved/1/')
        self.assertEqual(res.status_code, 200)
        self.assertIn('"solved_problem": 1',
            res.content.decode())

    def test_solved_prob_not_allowed(self):
        client = Client()
        res = client.post('/api/solved/1/', {},
            content_type='application/json')
        self.assertEqual(res.status_code, 405)
        res = client.put('/api/solved/1/', {},
            content_type='application/json')
        self.assertEqual(res.status_code, 405)
        res = client.delete('/api/solved/1/')
        self.assertEqual(res.status_code, 405)

    def test_solved_result_get(self):
        client = Client()
        res = client.get('/api/solved/1/1/')
        self.assertEqual(res.status_code, 401)

        req = {
            'id': 'test_name_1',
            'password': 'test_password_1'
        }
        res = client.post('/api/signin/', req, 
            content_type='application/json')    
        res = client.get('/api/solved/0/1/')
        self.assertEqual(res.status_code, 404)

        res = client.get('/api/solved/1/1/')
        self.assertEqual(res.status_code, 200)
        self.assertIn('"result": true',
            res.content.decode())

    def test_solved_result_post(self):
        client = Client()
        res = client.post('/api/solved/1/2/', {},
            content_type='application/json')
        self.assertEqual(res.status_code, 400)

        req = {
            'result': True
        }
        res = client.post('/api/solved/1/2/', req,
            content_type='application/json')
        self.assertEqual(res.status_code, 401)

        req = {
            'id': 'test_name_1',
            'password': 'test_password_1'
        }
        res = client.post('/api/signin/', req, 
            content_type='application/json')
        req = {
            'result': True
        }
        res = client.post('/api/solved/0/2/', req,
            content_type='application/json')
        self.assertEqual(res.status_code, 404)

        res = client.post('/api/solved/1/2/', req,
            content_type='application/json')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(Solved.objects.all().count(), 2)
        self.assertIn('"result": true',
            res.content.decode())

    def test_solved_result_not_allowed(self):
        client = Client()
        res = client.put('/api/solved/1/2/', {},
            content_type='application/json')
        self.assertEqual(res.status_code, 405)
        res = client.delete('/api/solved/1/2/')
        self.assertEqual(res.status_code, 405)