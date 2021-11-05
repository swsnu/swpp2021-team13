# from django.shortcuts import render
from django.http import (
    HttpResponse,
    HttpResponseNotAllowed,
    HttpResponseBadRequest,
    JsonResponse,
)
from django.contrib.auth import authenticate, login, logout
import json
from json.decoder import JSONDecodeError
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import User, UserStatistics

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
        isEmail = id.find("@") >= 0
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
            print(res)
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
def token(request):
    if request.method == "GET":
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(["GET"])
