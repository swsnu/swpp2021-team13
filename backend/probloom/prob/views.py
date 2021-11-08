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
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic.detail import SingleObjectMixin
from .models import User, UserProfile, UserStatistics, ProblemSet, Comment

# Create your views here.
class SignUpView(View):
    def post(self, request: HttpRequest, **kwargs) -> HttpResponse:
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


class CommentListView(View):
    def get(self, request: HttpRequest, **kwargs):
        if request.user.is_authenticated:
            comment_set = Comment.objects.all()
            res = []
            for comment in comment_set:
                res.append(comment.to_dict())

            return JsonResponse(res, status=201, safe=False)
        else:
            return HttpResponse(status=401)

    def post(self, request: HttpRequest, **kwargs):
        if request.user.is_authenticated:
            try:
                req_data = json.loads(request.body.decode())
                user_id = req_data["userID"]
                username = req_data["username"]
                problem_set_id = req_data["problemSetID"]
                content = req_data["content"]
            except (KeyError, JSONDecodeError) as e:
                return HttpResponseBadRequest()

            user = User.objects.get(username=username)
            creator = user.statistics

            problem_set = ProblemSet.objects.get(id=problem_set_id)
            comment = Comment(content=content, creator=creator, problem_set=problem_set)
            comment.save()

            res = comment.to_dict()
            return JsonResponse(res, status=201, safe=False)
        else:
            return HttpResponse(status=401)


class CommentInfoView(View):
    def get(self, request: HttpRequest, id, **kwargs):
        if request.user.is_authenticated:
            try:
                comment = Comment.objects.get(id=id)
            except:
                return HttpResponse(status=404)

            res = comment.to_dict()
            return JsonResponse(res, status=201, safe=False)
        else:
            return HttpResponse(status=401)

    def put(self, request: HttpRequest, id, **kwargs):
        if request.user.is_authenticated:
            try:
                comment = Comment.objects.get(id=id)
            except:
                return HttpResponse(status=404)

            if request.user.id == comment.creator.user.id:
                try:
                    req_data = json.loads(request.body.decode())
                    content = req_data["content"]
                except (KeyError, JSONDecodeError) as e:
                    return HttpResponseBadRequest()

                comment.content = content
                comment.save()
                res = comment.to_dict()
                return JsonResponse(res, status=200)
            else:
                return HttpResponse(status=403)
        else:
            return HttpResponse(status=401)

    def delete(self, request: HttpRequest, id, **kwargs):
        if request.user.is_authenticated:
            try:
                comment = Comment.objects.get(id=id)
            except:
                return HttpResponse(status=404)

            if request.user.id == comment.creator.user.id:
                comment.delete()
                return HttpResponse(status=200)
            else:
                return HttpResponse(status=403)
        else:
            return HttpResponse(status=401)


class TokenView(View):
    @method_decorator(ensure_csrf_cookie)
    def get(self, request: HttpRequest, **kwargs) -> HttpResponse:
        return HttpResponse(status=204)
