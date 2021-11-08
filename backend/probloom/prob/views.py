# from django.shortcuts import render
from django.http import (
    HttpResponse,
    HttpResponseNotAllowed,
    HttpResponseBadRequest,
    JsonResponse,
)
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
import json
from json.decoder import JSONDecodeError
from django.core.exceptions import BadRequest, PermissionDenied
from django.http.request import HttpRequest
from django.views import View
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic.detail import SingleObjectMixin
from .models import User, UserProfile, UserStatistics

# Create your views here.
'''
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
'''
class SignUpView(View):
    def post(self, request: HttpRequest, **kwargs) -> HttpResponse:
        try:
            req_data = json.loads(request.body.decode())
            username = req_data["username"]
            email = req_data["email"]
            password = req_data["password"]
        except (KeyError, JSONDecodeError) as e:
            return BadRequest()

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

class SignInView(View):
    def post(self, request: HttpRequest, **kwargs) -> HttpResponse:
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

class SignOutView(View):
    def get(self, request: HttpRequest, **kwargs) -> HttpResponse:
        if request.user.is_authenticated:
            logout(request)
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=401)

class UserProfileView(LoginRequiredMixin, SingleObjectMixin, View):
    """View methods related to model `UserProfile`."""

    login_url = "/api/signin/"
    model = UserProfile
    pk_url_kwarg = "u_id"
    redirect_field_name = None

    def get(self, _: HttpRequest, **kwargs) -> HttpResponse:
        """Get profile of specific user."""
        user_profile = self.get_object()
        return JsonResponse(user_profile.to_dict())

    def put(self, request: HttpRequest, **kwargs) -> HttpResponse:
        """Edit introduction of the user."""
        try:
            pending_user_profile = json.loads(request.body)
            introduction = pending_user_profile["introduction"]
        except (JSONDecodeError, KeyError) as error:
            raise BadRequest() from error

        user_profile = self.get_object()
        if request.user.pk != user_profile.pk:
            raise PermissionDenied()

        user_profile.introduction = introduction
        user_profile.save()
        return HttpResponse()

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