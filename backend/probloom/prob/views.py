# from django.shortcuts import render
import datetime
import http
import json
from json.decoder import JSONDecodeError

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required as login_required_
from django.contrib.auth.mixins import LoginRequiredMixin as LoginRequiredMixin_
from django.core.exceptions import BadRequest, PermissionDenied
from django.db.models.aggregates import Count, Max
from django.db.models.expressions import F, OuterRef, Subquery, Value
from django.db.models.functions import Coalesce
from django.http import (
    HttpResponse,
    HttpResponseBadRequest,
    HttpResponseNotFound,
    JsonResponse,
)
from django.http.request import HttpRequest
from django.views import View
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_http_methods, require_POST
from django.views.generic.detail import SingleObjectMixin

from .models import (
    Problem,
    ProblemSet,
    ProblemSetComment,
    Solved,
    User,
    UserProfile,
    UserStatistics,
    create_problem,
    verify_problem_request,
)


class LoginRequiredMixin(LoginRequiredMixin_):
    login_url = "/api/signin/"
    redirect_field_name = None


login_required = login_required_(redirect_field_name=None, login_url="/api/signin/")


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
        user_profile = UserProfile(user=new_user)
        user_profile.save()
        userStatistics = UserStatistics(user=new_user)
        userStatistics.save()
        res = {
            "id": new_user.pk,
            "username": new_user.username,
            "email": new_user.email,
            "logged_in": True,
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
            user_statistics = UserStatistics.objects.get(user=user_)
            user_statistics.last_login_date = datetime.date.today()
            user_statistics.save()

            res = {
                "id": user_.pk,
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


@require_GET
def get_user(_: HttpRequest, u_id: int) -> HttpResponse:
    """Get a specific user.

    .. rubric:: How to use

    Send a ``GET`` request to ``/api/user/:u_id/``.

    .. rubric:: Behavior

    If a user with id ``u_id`` exists, respond with ``200 (OK)`` and the
    following data:

    .. code-block:: typescript

       interface GetUserResponse {
         id: number;
         username: string;
         email: string;
       }

    If a user with id ``u_id`` does not exist, respond with ``404 (Not Found)``.
    """
    try:
        user = User.objects.get(pk=u_id)
    except User.DoesNotExist:
        return HttpResponseNotFound()
    res = {
        "id": user.pk,
        "username": user.username,
        "email": user.email,
    }
    return JsonResponse(res)


@require_GET
def get_current_user(request: HttpRequest) -> HttpResponse:
    """Get current user.

    .. rubric:: How to use

    Send a ``GET`` request to ``/api/user/current/``.

    .. rubric:: Behavior

    If a user was signed in, respond with ``200 (OK)`` and ``GetUserResponse``
    from :func:`get_user`.

    If there is no signed in user, respond with ``404 (Not Found)``.
    """
    if request.user.is_authenticated:
        res = {
            "id": request.user.pk,
            "username": request.user.username,
            "email": request.user.email,
            "logged_in": True,
        }
        return JsonResponse(res)
    else:
        return HttpResponseNotFound()


class UserProfileView(LoginRequiredMixin, SingleObjectMixin, View):
    """View methods related to model :class:`UserProfile`."""

    model = UserProfile
    pk_url_kwarg = "u_id"

    def get(self, request: HttpRequest, **kwargs) -> HttpResponse:
        """Get profile of specific user.

        .. rubric:: How to use

        Send a ``GET`` request to ``/api/user/:u_id/profile/``.

        .. rubric:: Behavior

        If a user with id ``u_id`` exists, respond with ``200 (OK)`` and the
        following data:

        .. code-block:: typescript

            interface GetUserProfileResponse {
                introduction: string;
            }

        If a user with id ``u_id`` does not exist, respond with ``404 (Not
        Found)``.
        """
        user_profile = self.get_object()
        return JsonResponse(user_profile.to_dict())

    def put(self, request: HttpRequest, **kwargs) -> HttpResponse:
        """Edit introduction of the user.

        .. rubric:: How to use

        Send a ``PUT`` request to ``/api/user/:u_id/profile/`` with the following
        data:

        .. code-block:: typescript

           interface UpdateUserIntroductionRequest {
             introduction: string;
           }

        .. rubric:: Behavior

        If a user with id ``u_id`` exists and ``introduction`` follows the
        constraints of the corresponding field of ``UserProfile``, update the
        introduction and respond with ``200 (OK)``.

        If a user with id ``u_id`` does not exist, respond with ``404 (Not
        Found)``.

        If a user with id ``u_id`` exists but ``introduction`` does not follow
        the constraints of the corresponding field of ``UserProfile``, respond
        with ``400 (Bad Request)``.
        """
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


@require_GET
def get_user_statistics(request: HttpRequest, u_id: int) -> HttpResponse:
    """Get statistics of specific user.

    .. rubric:: How to use

    Send a ``GET`` request to ``/api/user/:u_id/statistics/``.

    .. rubric:: Behavior

    If a user with id ``u_id`` exists, respond with ``200 (OK)`` and the
    following data:

    .. code-block:: typescript

       interface GetUserStatisticsResponse {
         lastActiveDays: number | null;
       }

    ``lastActiveDays`` equals to the number of days since the user's last sign
    in. If the user never signed in, ``lastActiveDays`` equals to ``null``.

    If a user with id ``u_id`` does not exist, respond with ``404 (Not Found)``.
    """
    user_statistics = UserStatistics.objects.get(pk=u_id)
    if user_statistics.last_login_date is None:
        last_active_days = None
    else:
        last_active_days = (
            datetime.date.today() - user_statistics.last_login_date
        ).days

    return JsonResponse(
        {
            "id": user_statistics.pk,
            "lastActiveDays": last_active_days,
        },
        safe=False,
    )


class ProblemSetListView(LoginRequiredMixin, View):
    """List view methods related to model :class:`ProblemSet`."""

    def get(self, request: HttpRequest, **kwargs) -> HttpResponse:
        """Get list of problem sets matching given query.

        .. rubric:: How to use

        Send a ``GET`` request to ``/api/problem_set/``.

        .. rubric:: Behavior

        Respond with ``200 (OK)`` and an array of following data:

        .. code-block:: typescript

           type FindProblemSetsResponse = FindProblemSetsResponseEntry[];

        where ``FindProblemSetsResponseEntry`` is defined as follows:

        .. code-block:: typescript

           interface FindProblemSetsResponseEntry {
             id: number;
             title: string;
             createdTime: string;
             modifiedTime: string;
             isOpen: boolean;
             tag: string[][];
             difficulty: number;
             content: string;
             userID: number;
             username: string;
             solvedNum: number;
             recommendedNum: number;
           }

        Each entry of ``tag`` consists of list of paths to each tag. For
        example, if the problem set has tags 'Statistics' and 'Mathematics' and
        both tags are children of 'Science' tag, the tag entry will be as
        follows:

        .. code-block:: json

           {
             "tag": [
               ["Science", "Statistics"],
               ["Science", "Mathematics"]
             ]
           }
        """
        num_problems_query = ProblemSet.objects.values(
            "id", num_problems=Count("problems")
        ).filter(id=OuterRef("problem_set"))
        solved_query = (
            Solved.objects.filter(result__exact=True)
            .values("solver", problem_set=F("problem__problem_set"))
            .annotate(
                unsolved_problems=(
                    Subquery(num_problems_query.values("num_problems"))
                    - Count("problem_set")
                )
            )
            .filter(unsolved_problems__lte=0)
            .values("problem_set", solvedNum=Count("solver", distinct=True))
            .filter(problem_set=OuterRef("pk"))
        )
        res = (
            ProblemSet.objects.select_related("creator__user")
            .values(
                "id",
                "title",
                "created_time",
                "modified_time",
                "is_open",
                "tags",
                "difficulty",
                "description",
                "creator_id",
                "creator__user__username",
                solvedNum=Coalesce(
                    Subquery(solved_query.values("solvedNum")), Value(0)
                ),
                recommendedNum=Count("recommenders"),
            )
            .all()
        )
        res = list(
            map(
                lambda value: {
                    "id": value["id"],
                    "title": value["title"],
                    "createdTime": value["created_time"],
                    "modifiedTime": value["modified_time"],
                    "isOpen": value["is_open"],
                    "tag": value["tags"],
                    "difficulty": value["difficulty"],
                    "content": value["description"],
                    "userID": value["creator_id"],
                    "username": value["creator__user__username"],
                    "solvedNum": value["solvedNum"],
                    "recommendedNum": value["recommendedNum"],
                },
                res,
            )
        )

        return JsonResponse(data=res, safe=False)

    def post(self, request: HttpRequest, **kwargs) -> HttpResponse:
        """Create a new problem set.

        .. How to use

        Send a ``POST`` request to ``/api/problem_set/`` with the following data:

        .. code-block:: typescript

           interface CreateProblemSetRequest {
             title: string;
             scope: 'scope-private' | 'scope-public';
             tag: string[];
             difficulty: number;
             content: string;
             problems?: CreateProblemRequest[];
           }

        where ``CreateProblemRequest`` is defined in
        :meth:`ProblemSetInfoView.post`.

        Each entry of ``tag`` consists of leaf tags. For example, suppose that
        'Philosophy' is a child tag of 'Humanities' and 'Statistics' is a child
        tag of 'Mathematics'. If a problem set has tag 'Philosophy' and
        'Science', the tag field should be as follows:

        .. code-block:: json

           {
             "tag": ["Philosophy", "Science"]
           }

        If you send a request with the following tag field:

        .. code-block:: json

           {
             "tag": ["Humanities", "Philosophy", "Science"]
           }

        the 'Humanities' tag will be ignored.

        .. rubric:: Behavior

        If request data follows the constraints of the fields of ``ProblemSet``,
        create a new problem set and respond with ``201 (Created)`` and the
        following data:

        .. code-block:: typescript

           interface GetProblemSetResponse {
             id: number;
             title: string;
             createdTime: string;
             modifiedTime: string;
             isOpen: boolean;
             tag: string[][];
             difficulty: number;
             content: string;
             userID: number;
             username: string;
             solvedNum: number;
             recommendedNum: number;
           }

        If request data does not follow the constraints of the fields of
        ``ProblemSet``, respond with ``400 (Bad Request)``.

        If `tag` field follows the constraints of the corresponding fields of
        ``Tag`` but there is no tag found matching the given ``tag``, respond
        with ``200 (OK)`` and the following data:

        .. code-block:: typescript

           interface CreateProblemSetResponseFailure {
             id: 'FAILURE';
             cause: 'TAG_NOT_FOUND';
           }
        """
        try:
            req_data = json.loads(request.body)
            title = req_data["title"]
            description = req_data["content"]
            is_open = req_data["scope"] == "scope-public"
            tags_list = req_data["tag"]  # TODO
            assert isinstance(tags_list, list), "tag should be an array"
            difficulty = int(req_data["difficulty"])
        except (JSONDecodeError, KeyError, AssertionError, ValueError) as error:
            raise BadRequest() from error

        creator = request.user.statistics
        new_problem_set = ProblemSet.objects.create(
            title=title,
            is_open=is_open,
            difficulty=difficulty,
            description=description,
            creator=creator,
        )

        if "problems" not in req_data:
            return JsonResponse(data=new_problem_set.info_dict())

        problems = req_data["problems"]

        for problem in problems:
            create_problem(problem, creator.pk, new_problem_set.pk)

        return JsonResponse(data=new_problem_set.info_dict())


class ProblemSetInfoView(LoginRequiredMixin, View):
    """Detail view methods related to model :class:`ProblemSet`."""

    def get(self, request: HttpRequest, ps_id: int, **kwargs):
        """Get details of specific problem set.

        .. rubric:: How to use

        Send a ``GET`` request to ``/api/problem_set/:ps_id/``.

        .. rubric:: Behavior

        If a problem set with id ``ps_id`` exists, respond with ``200 (OK)`` and following data:

        .. code-block:: typescript

           interface GetProblemSetResponse {
             id: number;
             title: string;
             createdTime: string;
             modifiedTime: string;
             isOpen: boolean;
             tag: string[][];
             difficulty: number;
             content: string;
             userID: number;
             username: string;
             solverIDs: number[];
             recommendedNum: number;
             problems: GetProblemResponse[];
           }

        where ``GetProblemResponse`` is defined in :meth:`ProblemInfoView.get`.

        If a problem set with id ``ps_id`` does not exist, respond with ``404 (Not Found)``.
        """
        try:
            problem_set = ProblemSet.objects.get(pk=ps_id)
        except:
            return HttpResponseNotFound()

        res = problem_set.info_dict()
        problems_list = problem_set.problems.order_by("number").values("id").all()
        res["problems"] = list(map(lambda entry: entry["id"], problems_list))
        return JsonResponse(res)

    def post(self, request: HttpRequest, ps_id: int, **kwargs):
        """Create a new problem in the problem set.

        .. rubric:: How to use

        Send a ``POST`` request to ``/api/problem_set/:ps_id/`` with the following data:

        .. code-block:: typescript

           type CreateProblemRequest =
             | CreateMultipleChoiceProblemRequest
             | CreateSubjectiveProblemRequest;

           interface CreateProblemRequestBase {
             problemType: string;
             problemNumber?: number;
             content: string;
           }

           interface CreateMultipleChoiceProblemRequest extends CreateProblemRequestBase {
             problemType: 'multiple-choice';
             choices: string[];
             solution: number[];
           }

           interface CreateSubjectiveProblemRequest extends CreateProblemRequestBase {
             problemType: 'subjective';
             solutions: string[];
           }

        .. rubric:: Behavior

        If a problem set with id ``ps_id`` exists and request data follows the
        constraints, do the following:

        #. If ``problemNumber`` is not set in the request, it is set to the
           smallest unassigned number.
        #. If there exists a problem with the same problem set and problem
           number, the problem numbers of that problem and all later problems
           will increment by 1 to prevent overwriting.
        #. Create a new problem. If ``problemType`` is ``'multiple-choice'``,
           :class:`MultipleChoiceProblem` will be used.  If ``problemType`` is
           ``subjective``, :class:`SubjectiveProblem` will be used.
        #. Respond with ``201 (Created)`` and ``GetProblemResponse`` of
           :meth:`ProblemInfoView.get`.

        If a problem set with id ``ps_id`` does not exist, respond with ``404
        (Not Found)``.

        If a problem set with id ``ps_id`` exists but request data does not
        follow the constraints, respond with ``400 (Bad Request)``.
        """
        try:
            problem_set = ProblemSet.objects.get(id=ps_id)
        except:
            return HttpResponseNotFound()

        if request.user.pk != problem_set.creator.user.pk:
            raise PermissionDenied()

        try:
            req_data = json.loads(request.body)
            verify_problem_request(req_data)
        except JSONDecodeError as error:
            raise BadRequest() from error

        problem_number = req_data.get("problemNumber")
        last_number = problem_set.problems.aggregate(Max("number"))["number__max"]
        if last_number is None:
            last_number = 0
        if problem_number is None:
            req_data["problemNumber"] = last_number + 1
        elif problem_number > last_number:
            raise BadRequest()
        else:
            modified_problems = problem_set.problems.filter(number__gte=problem_number)
            modified_problems.update(number=F("number") + 1)
        new_problem = create_problem(req_data, request.user.pk, ps_id)

        res = new_problem.info_dict()
        return JsonResponse(res)

    def put(self, request: HttpRequest, ps_id, **kwargs):
        """Edit details of specific problem set.

        .. rubric:: How to use

        Send a ``PUT`` request to ``/api/problem_set/:ps_id/`` with the following
        data:

        .. code-block:: typescript

           interface UpdateProblemSetRequest {
             title: string;
             isOpen: boolean;
             tag: string[][];
             difficulty: number;
             content: string;
           }

        .. rubric:: Behavior

        If a problem set with id ``ps_id`` exists and the request follows the
        constraints of the corresponding fields of ``ProblemSet``, update the
        problem set and respond with ``200 (OK)`` and ``GetProblemSetResponse``
        of :meth:`ProblemSetInfoView.get`.

        if a problem set with id ``ps_id`` does not exist, respond with ``404
        (Not Found)``.

        If a problem set with id ``ps_id`` exists but the request does not
        follow the constraints of the corresponding fields of ``UserProfile``,
        respond with ``400 (Bad Request)``.
        """
        try:
            problem_set = ProblemSet.objects.get(id=ps_id)
        except:
            return HttpResponseNotFound()

        if request.user.pk != problem_set.creator.user.pk:
            raise PermissionDenied()

        try:
            req_data = json.loads(request.body)
            title = req_data["title"]
            is_open = req_data["isOpen"]
            # tags = req_data["tag"]  # TODO
            difficulty = int(req_data["difficulty"])
            content = req_data["content"]
        except (KeyError, ValueError, JSONDecodeError) as e:
            return HttpResponseBadRequest()

        problem_set.title = title
        problem_set.description = content
        problem_set.is_open = is_open
        problem_set.difficulty = difficulty
        problem_set.save()

        res = problem_set.info_dict()
        problems_list = problem_set.problems.order_by("number").values("id").all()
        res["problems"] = list(map(lambda entry: entry["id"], problems_list))
        return JsonResponse(res, safe=False)

    def delete(self, request: HttpRequest, ps_id, **kwargs):
        """Delete a specific problem set.

        .. rubric:: How to use

        Send a ``DELETE`` request to ``/api/problem_set/:ps_id/``.

        .. rubric:: Behavior

        If a problem set with id ``ps_id`` exists, delete the problem set and
        respond with ``200 (OK)``.

        If a problem set with id ``ps_id`` does not exist, respond with ``404
        (Not Found)``.
        """
        try:
            problem_set = ProblemSet.objects.get(id=ps_id)
        except:
            return HttpResponseNotFound()

        if request.user.pk != problem_set.creator.user.pk:
            raise PermissionDenied()

        for problem in problem_set.problems.all():
            problem.delete()
        problem_set.delete()
        return HttpResponse()


@require_http_methods(["PUT"])
def update_problem_set_recommendation(request: HttpRequest, ps_id: int) -> HttpResponse:
    """Update recommendation status of a specific problem set.

    .. rubric:: How to use

    Send a ``PUT`` request to ``/api/problem_set/:ps_id/recommend/`` with the
    following data:

    .. code-block:: typescript

       interface UpdateProblemSetRecommendationRequest {
         recommend: boolean;
       }

    .. rubric:: Behavior

    If a problem set with id ``ps_id`` exists and request data is valid, set
    current user's recommendation status to ``recommend`` and respond with ``204
    (No Content)``.

    If a problem set with id ``ps_id`` does not exist, respond with ``404 (Not
    Found)``

    If a problem set with id ``ps_id`` exists but request data is invalid,
    respond with ``400 (Bad Request)``.
    """


class ProblemSetCommentListView(LoginRequiredMixin, View):
    """List view methods related to model :class:`ProblemSetComment`."""

    def get(self, request: HttpRequest, ps_id: int, **kwargs):
        """Get comments of specific problem set.

        .. rubric:: How to use

        Send a ``GET`` request to ``/api/problem_set/:ps_id/comment/``.

        .. rubric:: Behavior

        If a problem set with id ``ps_id`` exists, respond with ``200 (OK)`` and
        an array of following data:

        .. code-block:: typescript

           type FindProblemSetCommentsResponse = FindProblemSetCommentsResponseEntry[];

        where ``FindProblemSetCommentsResponseEntry`` is defined as follows:

        .. code-block:: typescript

           interface FindProblemSetCommentsResponseEntry {
             id: number;
             userID: number;
             username: string;
             problemSetID: number;
             createdTime: string;
             content: string;
           }

        If a problem set with id ``ps_id`` does not exist, respond with ``404
        (Not Found)``.
        """
        if not ProblemSet.objects.filter(pk=ps_id).exists():
            return HttpResponseNotFound()
        comment_set = ProblemSetComment.objects.filter(problem_set_id=ps_id)

        res = []
        for comment in comment_set:
            res.append(comment.to_dict())

        return JsonResponse(res, safe=False)

    def post(self, request: HttpRequest, ps_id: int, **kwargs):
        """Create a new comment to a specific problem set.

        .. rubric:: How to use

        Send a ``POST`` request to ``/api/problem_set/:ps_id/comment/`` with the following data:

        .. code-block:: typescript

           interface CreateProblemSetCommentRequest {
             content: string;
           }

        .. rubric:: Behavior

        If a problem set with id ``ps_id`` exists and request data follows the
        constraints of the fields of ``ProblemSetComment``, create a new comment
        to the problem set and respond with ``200 (OK)``.

        If a problem set with id ``ps_id`` does not exist, respond with ``404
        (Not Found)``.

        If a problem set with id ``ps_id`` exists but request data does not
        follow the constraints of the fields of ``ProblemSetComment``, respond
        with ``400 (Bad Request)``.
        """
        try:
            problem_set = ProblemSet.objects.get(id=ps_id)
        except ProblemSet.DoesNotExist:
            return HttpResponseNotFound()

        try:
            req_data = json.loads(request.body)
            content = req_data["content"]
        except (KeyError, JSONDecodeError) as e:
            return HttpResponseBadRequest()

        creator = request.user.statistics
        comment = ProblemSetComment.objects.create(
            content=content, creator=creator, problem_set=problem_set
        )

        res = comment.to_dict()
        return JsonResponse(res, status=201, safe=False)


class ProblemSetCommentInfoView(LoginRequiredMixin, View):
    """Detail view methods related to model :class:`ProblemSetComment`."""

    def get(self, request: HttpRequest, ps_id: int, c_id: int, **kwargs):
        """Get a specific comment to a specific problem set.

        .. rubric:: How to use

        Send a ``GET`` request to ``/api/problem_set/:ps_id/comment/:c_id/``.

        .. rubric:: Behavior

        If a problem set with id ``ps_id`` exists and a comment to the problem
        set with id ``c_id`` exists, respond with ``200 (OK)`` and following
        data:

        .. code-block:: typescript

           interface GetProblemSetCommentResponse {
             id: number;
             userID: number;
             username: string;
             problemSetID: number;
             createdTime: string;
             content: string;
           }

        If either problem set or comment does not exist, respond with ``404 (Not
        Found)``.
        """
        if not ProblemSet.objects.filter(pk=ps_id).exists():
            return HttpResponseNotFound()

        try:
            comment = ProblemSetComment.objects.get(id=c_id, problem_set_id=ps_id)
        except:
            return HttpResponseNotFound()

        res = comment.to_dict()
        return JsonResponse(res, safe=False)

    def put(self, request: HttpRequest, ps_id: int, c_id: int, **kwargs):
        """Edit a specific comment to a specific problem set.

        .. rubric:: How to use

        Send a ``PUT`` request to ``/api/problem_set/:ps_id/comment/:c_id/``
        with the following data:

        .. code-block:: typescript

           interface UpdateProblemSetCommentRequest {
             content: string;
           }

        .. rubric:: Behavior

        If a problem set with id ``ps_id`` exists, a comment to the problem set
        with id ``c_id`` exists, and ``content`` follows the constraints of the
        corresponding fields of ``ProblemSetComment``, update the comment and
        reqpond with ``200 (OK)``.

        If either problem set or comment does not exist, respond with ``404 (Not
        Found)``.

        If both problem set and comment exist but ``content`` does not follow
        the constraints of the corresponding fields of ``ProblemSetComment``,
        respond with ``400 (Bad Request)``.
        """
        if not ProblemSet.objects.filter(pk=ps_id).exists():
            return HttpResponseNotFound()

        try:
            comment = ProblemSetComment.objects.get(id=c_id, problem_set_id=ps_id)
        except:
            return HttpResponseNotFound()

        if request.user.pk != comment.creator.user.pk:
            raise PermissionDenied()

        try:
            req_data = json.loads(request.body.decode())
            content = req_data["content"]
        except (KeyError, JSONDecodeError) as e:
            return HttpResponseBadRequest()

        comment.content = content
        comment.save()

        res = comment.to_dict()
        return JsonResponse(res)

    def delete(self, request: HttpRequest, ps_id: int, c_id: int, **kwargs):
        """Delete a specific comment to a specific problem set.

        .. rubric:: How to use

        Send a ``DELETE`` request to ``/api/problem_set/:ps_id/comment/:c_id/``.

        .. rubric:: Behavior

        If a problem set with id ``ps_id`` exists and a comment to the problem
        set with id ``c_id`` exists, delete the comment and respond with ``200
        (OK)``.

        If either problem set or comment does not exist, respond with ``404 (Not
        Found)``.
        """
        if not ProblemSet.objects.filter(pk=ps_id).exists():
            return HttpResponseNotFound()

        try:
            comment = ProblemSetComment.objects.get(id=c_id, problem_set_id=ps_id)
        except:
            return HttpResponseNotFound()

        if request.user.pk != comment.creator.user.pk:
            raise PermissionDenied()

        comment.delete()
        return HttpResponse()


class ProblemInfoView(LoginRequiredMixin, View):
    """Detail view methods related to model :class:`Problem`.

    Note
    ----
    Problem numbers (specified with ``problemNumber`` field) and choice numbers
    of multi-choice problems (used when getting and submitting solutions) have
    1-based indices. In other words, the first problem has number 1.
    """

    def get(self, request: HttpRequest, p_id: int, **kwargs) -> HttpResponse:
        """Get details of a specific problem.

        .. rubric:: How to use

        Send a ``GET`` request to ``/api/problem/p_id/``.

        .. rubric:: Behavior

        If a problem with id ``p_id`` exists, respond with ``200 (OK)`` and
        following data:

        .. code-block:: typescript

           type GetProblemResponse =
             | GetMultipleChoiceProblemResponse
             | GetSubjectiveProblemResponse;

           interface GetProblemResponseBase {
             id: number;
             problemType: string;
             problemSetID: number;
             problemNumber: number;
             creatorID: number;
             createdTime: string;
             content: string;
             solverIDs: number[];
             // explanations: FindProblemExplanationsResponse[];
           }

           interface GetMultipleChoiceProblemResponse extends GetProblemResponseBase {
             problemType: 'multiple-choice'
             choices: string[];
             solution?: number[];
           }

           interface GetSubjectiveProblemResponse extends GetProblemResponseBase {
             problemType: 'subjective';
             solutions?: string[];
           }

        ``solution`` field of ``GetMultipleChoiceProblemResponse`` and
        ``solutions`` field of ``GetSubjectiveProblemResponse`` are available
        only to the author of the problem.

        If a problem with id ``p_id`` does not exist, respond with ``404 (Not
        Found)``.
        """
        try:
            problem = Problem.objects.get(pk=p_id)
        except:
            return HttpResponseNotFound()

        res = problem.info_dict()
        return JsonResponse(res)

    def put(self, request: HttpRequest, p_id: int, **kwargs) -> HttpResponse:
        """Edit details of a specific problem.

        .. rubric:: How to use

        Send a ``PUT`` request to ``/api/problem/p_id/`` with the following data:

        .. code-block:: typescript

           type UpdateProblemRequest =
             | UpdateMultipleChoiceProblemRequest
             | UpdateSubjectiveProblemRequest

           interface UpdateProblemRequestBase {
             problemType: string;
             problemNumber?: number;
             content: string;
           }

           interface UpdateMultipleChoiceProblemRequest extends UpdateProblemRequestBase {
             problemType: 'multiple-choice';
             choices: string[];
             solution: number[];
           }

           interface UpdateSubjectiveProblemRequest extends UpdateProblemRequestBase {
             problemType: 'subjective';
             solutions: string[];
           }

        .. rubric:: Behavior

        If a problem with id ``p_id`` exists and the request follows the
        constraints, do the following:

        #. If ``problemNumber`` is set in the request, different from the
           current problem number, and a problem in the same problem set having
           ``problemNumber`` as its number exists, set its problem number to the
           original problem number of the problem in the request (i.e. swap the
           problem numbers).
        #. Update the problem and respond with ``200 (OK)`` and
           ``GetProblemResponse`` of :meth:`ProblemInfoView.get`.

        If a problem with id ``p_id`` does not exist, respond with ``404 (Not
        Found)``.

        If a problem with id ``p_id`` exists, but the request does not follow
        the constraints, respond with ``400 (Bad Request)``.
        """
        try:
            problem = Problem.objects.get(pk=p_id)
        except:
            return HttpResponseNotFound()

        if request.user.pk != problem.creator.pk:
            raise PermissionDenied()

        try:
            pending_problem = json.loads(request.body)
            verify_problem_request(pending_problem)
        except (JSONDecodeError, KeyError) as error:
            raise BadRequest() from error

        problem_number = pending_problem.get("problemNumber")
        if problem_number is not None and problem_number != problem.number:
            try:
                existing_problem = Problem.objects.get(
                    problem_set_id=problem.problem_set.pk, number=problem_number
                )
            except Problem.DoesNotExist:
                return HttpResponse(status=http.HTTPStatus.CONFLICT)
            existing_problem.number = problem.number
            existing_problem.save()
        else:
            pending_problem["problemNumber"] = problem.number

        ps_id = problem.problem_set.pk
        problem.delete()
        new_problem = create_problem(pending_problem, request.user.pk, ps_id, p_id)

        res = new_problem.info_dict()
        return JsonResponse(res)

    def delete(self, request: HttpRequest, p_id: int, **kwargs):
        """Delete a specific problem.

        .. rubric:: How to use

        Send a ``DELETE`` request to ``/api/problem/:p_id/``.

        .. rubric:: Behavior

        If a problem with id ``p_id`` exists, delete the problem and respond
        with ``200 (OK)``.

        If a problem with id ``p_id`` does not exist, respond with ``404 (Not
        Found)``.
        """
        try:
            problem = Problem.objects.get(pk=p_id)
        except:
            return HttpResponseNotFound()

        if request.user.pk != problem.creator.pk:
            raise PermissionDenied()

        modified_problems = problem.problem_set.problems.filter(
            number__gte=problem.number
        )
        modified_problems.update(number=F("number") - 1)
        problem.delete()
        return HttpResponse()


@require_POST
def solve_problem(_: HttpRequest, p_id: int) -> HttpResponse:
    """Post a solution to a specific problem.

    .. rubric:: How to use

    Send a ``POST`` request to ``/api/problem/:p_id/solve/`` with the following
    data:

    .. code-block:: typescript

       type SolveProblemRequest =
         | SolveMultipleChoiceProblemRequest
         | SolveSubjectiveProblemRequest;

       interface SolveMultipleChoiceProblemRequest {
         solution: number[];
       }

       interface SolveSubjectiveProblemRequest {
         solution: string;
       }

    .. rubric:: Behavior

    If a problem with id ``p_id`` exists and request has correct data type for
    corresponding problem's type, update the user's solved status and respond
    with ``200 (OK)`` and following data:

    .. code-block:: typescript

       interface SolveProblemResponseSuccess {
         result: 'SUCCESS';
         correct: boolean;
       }

    ``correct`` should be true if and only if the user solved the problem
    correctly.

    If a problem with id ``p_id`` exists but the types of request and problem do
    not match (e.g. user tries to solve subjective question with a number
    array), respond with ``200 (OK)`` and following data:

    .. code-block:: typescript

       interface SolveProblemResponseFailure {
         result: 'FAILURE';
         cause: 'INCORRECT_PROBLEM_TYPE';
       }

    If a problem with id ``p_id`` does not exist, respond with ``404 (Not
    Found)``.

    If a problem with id ``p_id`` exists but the request does not follow the
    constraints, respond with ``400 (Bad Request)``.
    """
    return HttpResponse(status_code=http.HTTPStatus.NOT_IMPLEMENTED)


@login_required
@require_GET
def find_solvers(_: HttpRequest, ps_id: int) -> HttpResponse:
    """Get progresses of users who tried a specific problem set.

    .. rubric:: How to use

    Send a ``GET`` request to ``/api/problem_set/:ps_id/solvers/``.

    .. rubric:: Behavior

    If a problem set with id ``ps_id`` exists, respond with ``200 (OK)`` and the
    following data:

    .. code-block:: typescript

       type FindSolversResponse = GetSolverResponse[];

       interface GetSolverResponse {
         userID: number;
         username: string;
         result: boolean;
         problems: (boolean | null)[];
       }

    An entry of ``problems`` is null if and only if the user did not try that
    problem.

    If a problem set with id ``ps_id`` does not exist, respond with ``404 (Not
    Found)``.
    """
    try:
        num_problems = ProblemSet.objects.get(id=ps_id).problems.count()
    except ProblemSet.DoesNotExist:
        return HttpResponseNotFound()

    solved_query = (
        Solved.objects.prefetch_related("solver__user")
        .filter(problem__problem_set=ps_id)
        .annotate(number=F("problem__number"))
        .order_by("solver", "number")
    )

    res = []
    last_user = 0
    res_entry = {}
    for record in solved_query:
        if record.solver.user.pk != last_user:
            if last_user != 0:
                res_entry["result"] = all(res_entry["problems"])
                res.append(res_entry)
            last_user = record.solver.user.pk
            res_entry = {
                "userID": record.solver.user.pk,
                "username": record.solver.user.username,
                "result": False,
                "problems": [None] * num_problems,
            }
        res_entry["problems"][record.number - 1] = record.result
    res_entry["result"] = all(res_entry["problems"])
    res.append(res_entry)

    return JsonResponse(res, safe=False)


@login_required
@require_GET
def get_solver(_: HttpRequest, ps_id: int, u_id: int) -> HttpResponse:
    """Get progress of a user for a specific problem set.

    .. rubric:: How to use

    Send a ``GET`` request to ``/api/problem_set/:ps_id/solvers/:u_id/``.

    .. rubric:: Behavior

    If a problem set with id ``ps_id`` exists and a user with id ``u_id``
    exists, respond with ``200 (OK)`` and the following data:

    .. code-block:: typescript

       interface GetSolverResponse {
         userID: number;
         username: string;
         result: boolean;
         problems: (boolean | null)[];
       }

    An entry of ``problems`` is null if and only if the user did not try that
    problem.

    If either problem set or user does not exist, respond with ``404 (Not
    Found)``.
    """
    try:
        num_problems = ProblemSet.objects.get(id=ps_id).problems.count()
        user = User.objects.get(pk=u_id)
    except (ProblemSet.DoesNotExist, User.DoesNotExist):
        return HttpResponseNotFound()

    solved_query = (
        Solved.objects.prefetch_related("solver__user")
        .filter(problem__problem_set=ps_id, solver_id=u_id)
        .annotate(number=F("problem__number"))
        .order_by("number")
        .values("number", "result")
    )

    problems = [None] * num_problems
    for record in solved_query:
        problems[record["number"] - 1] = record["result"]

    res = {
        "userID": user.pk,
        "username": user.username,
        "result": all(problems),
        "problems": problems,
    }

    return JsonResponse(res)


@ensure_csrf_cookie
@require_GET
def token(_: HttpRequest) -> HttpResponse:
    """Issue a new CSRF Token.

    .. rubric:: How to use

    Send a ``GET`` request to ``/api/token/``.

    .. rubric:: Behavior

    Respond with ``204 (No Content)``.
    """
    return HttpResponse(status=204)
