# from django.shortcuts import render
from django.http import (
    HttpResponse,
    HttpResponseNotAllowed,
    HttpResponseBadRequest,
    HttpResponseNotFound,
    JsonResponse,
)
from django.contrib.auth import authenticate, login, logout
import json
from json.decoder import JSONDecodeError
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import User, UserStatistics, ProblemSet, Solved

# Create your views here.
def signup(request):
    if request.method == "POST":
        try:
            req_data = json.loads(request.body.decode())
            username = req_data["username"]
            email = req_data["email"]
            password = req_data["password"]
        except (KeyError, JSONDecodeError) as e:
            return HttpResponseBadRequest()

        user_set = User.objects.all()
        for user in user_set:
            if (user.username == username) or (user.email == email):
                return HttpResponse(status=401)

        User.objects.create_user(username=username, email=email, password=password)
        new_user = User.objects.get(username=username)
        res = {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email,
            "logged_in": False,
        }
        return JsonResponse(res, status=201, safe=False)
    else:
        return HttpResponseNotAllowed(["POST"])


def signin(request):
    if request.method == "POST":
        try:
            req_data = json.loads(request.body.decode())
            id = req_data["id"]
            password = req_data["password"]
        except (KeyError, JSONDecodeError) as e:
            return HttpResponseBadRequest()

        user_set = User.objects.all()
        isEmail = id.find("@") > 0
        try:
            if isEmail:
                username = User.objects.get(email=id).username
            else:
                username = id
        except:
            return HttpResponse(status=401)

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)

            user_ = User.objects.get(username=username)
            res = {
                "id": user_.id,
                "username": user_.username,
                "email": user_.email,
                "logged_in": True,
            }
            return JsonResponse(res, status=201, safe=False)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(["POST"])


def signout(request):
    if request.method == "GET":
        if request.user.is_authenticated:
            logout(request)
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(["GET"])


def userStatistics(request, id=0):
    if request.method == "GET":
        userStatistics = UserStatistics.objects.get(id=id)
        return JsonResponse(
            {"id": userStatistics.id, "lastActiveDays": userStatistics.lastActiveDays},
            safe=False,
        )


@ensure_csrf_cookie
def problem_set(request):
    if request.method == "GET":
        if not request.user.is_authenticated:
            return HttpResponse(status=401)

        prob_list = [prob for prob in ProblemSet.objects.all()]
        res = []
        for prob in prob_list:
            solved_num = Solved.objects.filter(problem=prob).count()
            recommend_num = prob.recommender.all().count()
            res.append(
                {
                    "id": prob.id,
                    "title": prob.title,
                    "date": prob.date,
                    "creator": prob.creator.user.username,
                    "solved": solved_num,
                    "recommended": recommend_num,
                }
            )

        return JsonResponse(data=res, safe=False)

    elif request.method == "POST":
        try:
            req_data = json.loads(request.body.decode())
            title = req_data["title"]
            type = req_data["type"]
            tag = req_data["tag"]
            difficulty = req_data["difficulty"]
            content = req_data["content"]
        except (KeyError, JSONDecodeError):
            return HttpResponseBadRequest()

        if not request.user.is_authenticated:
            return HttpResponse(status=401)

        creator = UserStatistics.objects.get(user=request.user)
        prob = ProblemSet(
            title=title,
            type=type,
            tag=tag,
            difficulty=difficulty,
            content=content,
            creator=creator,
        )
        prob.save()
        res = {
            "id": prob.id,
            "title": prob.title,
            "date": str(prob.date),
            "creator": prob.creator.user.username,
        }
        return JsonResponse(data=res)

    else:
        return HttpResponseNotAllowed(["GET", "POST"])


@ensure_csrf_cookie
def solved_prob(request, u_id=0):
    if request.method == "GET":
        if not request.user.is_authenticated:
            return HttpResponse(status=401)

        try:
            solver = User.objects.get(id=u_id)
            solver_stat = UserStatistics.objects.get(user=solver)
        except (User.DoesNotExist, UserStatistics.DoesNotExist):
            return HttpResponseNotFound()

        solved_num = Solved.objects.filter(solver=solver_stat).count()
        return JsonResponse(data={"solved_problem": solved_num})

    else:
        return HttpResponseNotAllowed(["GET"])


@ensure_csrf_cookie
def solved_result(request, u_id=0, p_id=0):
    if request.method == "GET":
        if not request.user.is_authenticated:
            return HttpResponse(status=401)

        try:
            solver = User.objects.get(id=u_id)
            solver_stat = UserStatistics.objects.get(user=solver)
            problem = ProblemSet.objects.get(id=p_id)
            res = Solved.objects.get(solver=solver_stat, problem=problem)
        except (User.DoesNotExist, UserStatistics.DoesNotExist, ProblemSet.DoesNotExist):
            return HttpResponseNotFound()

        return JsonResponse(data={"result": res.result})

    elif request.method == "POST":
        try:
            req_data = json.loads(request.body.decode())
            result = req_data["result"]
        except (KeyError, JSONDecodeError):
            return HttpResponseBadRequest()

        if not request.user.is_authenticated:
            return HttpResponse(status=401)

        try:
            solver = User.objects.get(id=u_id)
            solver_stat = UserStatistics.objects.get(user=solver)
            problem = ProblemSet.objects.get(id=p_id)
        except (User.DoesNotExist, UserStatistics.DoesNotExist, ProblemSet.DoesNotExist):
            return HttpResponseNotFound()

        res = Solved(solver=solver_stat, problem=problem, result=result)
        res.save()
        return JsonResponse(data={"result": result})

    else:
        return HttpResponseNotAllowed(["GET", "POST"])


@ensure_csrf_cookie
def token(request):
    if request.method == "GET":
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(["GET"])
