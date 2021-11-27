import uuid
from typing import Any, Dict, Mapping, Optional

from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import BadRequest
from django.db.models import (
    BooleanField,
    CharField,
    DateField,
    DateTimeField,
    ForeignKey,
    ManyToManyField,
    Model,
    OneToOneField,
    PositiveSmallIntegerField,
    SmallIntegerField,
    TextField,
    UUIDField,
)
from django.db.models.deletion import CASCADE, RESTRICT, SET
from polymorphic.models import PolymorphicModel


# Create your models here.
class User(AbstractUser):
    """User model.

    Attributes
    ----------------
    username : str
    email : str
    password : str
    profile : UserProfile
    statistics : UserStatistics
    inventory : UserInventory
    """


def get_sentinel_user():
    return get_user_model().objects.get_or_create(username="[deleted]")[0]


class UserProfile(Model):
    """User profile model.

    Attributes
    ------
    user : User
    introduction : str, default=""
    """

    user = OneToOneField(
        User, on_delete=CASCADE, related_name="profile", primary_key=True
    )
    introduction = TextField(default="", blank=True)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "user": self.user.pk,
            "introduction": str(self.introduction),
        }


class UserStatistics(Model):
    """User statistics model.

    Attributes
    ------
    user : User
    created_time : datetime
    last_login_date : date
    created_problem_sets : QuerySet[ProblemSet]
    recommended_problem_sets : QuerySet[ProblemSet]
    created_comments : QuerySet[ProblemSetComment]
    created_problems : QuerySet[Problem]
    solved_problems : QuerySet[Problem]
    created_explanations : QuerySet[Explanation]
    recommended_explanations : QuerySet[Explanation]
    """

    user = OneToOneField(
        User, on_delete=CASCADE, related_name="statistics", primary_key=True
    )
    created_time = DateTimeField(auto_now_add=True)
    last_login_date = DateField(blank=True, null=True)


def get_sentinel_user_statistics():
    return UserStatistics.objects.get_or_create(user=get_sentinel_user())[0]


class Tag(Model):
    """Tag model.

    Attributes
    ------
    name : str
    level : int
    parent : Optional[Tag]
    children : QuerySet[Tag]
    problem_sets : QuerySet[ProblemSet]
    """

    name = CharField(max_length=100)
    level = PositiveSmallIntegerField()
    parent = ForeignKey(
        "self", related_name="children", on_delete=CASCADE, blank=True, null=True
    )


class ProblemSet(Model):
    """Problem set model.

    Attributes
    ------
    title : str
    created_time : datetime
    modified_time : datetime
    is_open : bool
    difficulty : int
    description : str
    creator : UserStatistics
    recommenders : QuerySet[UserStatistics]
    tags : QuerySet[Tag]
    problems : QuerySet[Problem]
    solved_set : QuerySet[Solved]
    comments : QuerySet[ProblemSetComment]
    """

    title = CharField(max_length=100, default="default title")
    created_time = DateTimeField(auto_now_add=True, blank=True)
    modified_time = DateTimeField(auto_now=True)
    is_open = BooleanField(default=False)
    difficulty = SmallIntegerField(default=0)
    description = TextField(max_length=1000, default="default content")
    creator = ForeignKey(
        UserStatistics, related_name="created_problem_sets", on_delete=CASCADE
    )
    recommenders = ManyToManyField(
        UserStatistics, related_name="recommended_problem_sets", blank=True
    )
    tags = ManyToManyField(Tag, related_name="problem_sets", blank=True)

    def info_dict(self):
        recommended_num = self.recommenders.all().count()
        return {
            "id": self.pk,
            "title": self.title,
            "createdTime": self.created_time,
            "modifiedTime": self.modified_time,
            "isOpen": self.is_open,
            "tag": [],
            "difficulty": self.difficulty,
            "content": self.description,
            "userID": self.creator.user.pk,
            "username": self.creator.user.username,
            "solvedNum": 0,
            "recommendedNum": recommended_num,
        }


class Content(Model):
    """Content model.

    Attributes
    ------
    text : str
    images : QuerySet[ContentImage]
    """

    text = TextField()


class ContentImage(Model):
    """Content image model.

    Attributes
    ------
    id : UUID
    content : Content
    image : File
    """

    id = UUIDField(primary_key=True, default=uuid.uuid4, editable=False)


class ProblemSetComment(Model):
    """Problem set comment model.

    Attributes
    ------
    created_time : datetime
    content : text
    creator : UserStatistics
    problem_set : ProblemSet
    """

    created_time = DateTimeField(auto_now=True)
    content = TextField(max_length=1000, default="default content")
    creator = ForeignKey(
        UserStatistics, on_delete=CASCADE, related_name="created_comments"
    )
    problem_set = ForeignKey(ProblemSet, on_delete=CASCADE, related_name="comments")

    def to_dict(self):
        return {
            "id": self.pk,
            "userID": self.creator.user.pk,
            "username": self.creator.user.username,
            "problemSetID": self.problem_set.pk,
            "createdTime": self.created_time,
            "content": self.content,
        }


class Problem(PolymorphicModel):
    """Base model for problems.

    Attributes
    ------
    problem_set : ProblemSet
    number : int
    created_time : datetime
    content : Content
    creator : UserStatistics
    solvers : QuerySet[UserStatistics]
    explanations : QuerySet[Explanation]
    """

    problem_set = ForeignKey(
        ProblemSet, on_delete=CASCADE, related_name="problems", db_index=True
    )
    number = SmallIntegerField()
    created_time = DateTimeField(auto_now_add=True)
    content = OneToOneField(Content, on_delete=RESTRICT)
    creator = ForeignKey(
        UserStatistics,
        related_name="created_problems",
        on_delete=SET(get_sentinel_user_statistics),
    )
    solvers = ManyToManyField(
        UserStatistics, through="Solved", through_fields=("problem", "solver")
    )

    def info_dict(self, with_solution=True):
        return {
            "id": self.pk,
            "problemType": "",
            "problemSetID": self.problem_set.pk,
            "problemNumber": self.number,
            "creatorID": self.creator.pk,
            "createdTime": self.created_time,
            "content": self.content.text,
            "solverIDs": [],  ## TODO
        }


class MultipleChoiceProblem(Problem):
    """Multiple-choice problem model.

    Attributes
    ------
    solution : str
    choices : QuerySet[MultipleChoiceProblemChoice]
    """

    solution = CharField(max_length=30)

    def info_dict(self, with_solution=True):
        ret = super().info_dict()
        choices = self.choices.order_by("number").values(
            "number", "is_solution", "content__text"
        )
        ret.update(
            {
                "problemType": "multiple-choice",
                "choices": [value["content__text"] for value in choices],
            }
        )
        if with_solution:
            ret["solution"] = [
                value["number"] for value in choices if value["is_solution"]
            ]
        return ret


class MultipleChoiceProblemChoice(Model):
    """Choice model for multiple-choice problems.

    Attributes
    ------
    problem : MultipleChoiceProblem
    number : int
    is_solution : bool
    content : Content
    """

    problem = ForeignKey(
        MultipleChoiceProblem, on_delete=CASCADE, related_name="choices", db_index=True
    )
    number = SmallIntegerField()
    is_solution = BooleanField()
    content = OneToOneField(Content, on_delete=RESTRICT)


class SubjectiveProblem(Problem):
    """Subjective problem model.

    Attributes
    ----------------------------------
    solutions : QuerySet[SubjectiveProblemSolution]
    """

    def info_dict(self, with_solution=True):
        ret = super().info_dict()
        ret["problemType"] = "subjective"
        if with_solution:
            ret["solutions"] = [
                value["text"] for value in self.solutions.values("text")
            ]
        return ret


class SubjectiveProblemSolution(Model):
    """Solution model for subjective problems.

    Attributes
    ------
    problem : SubjectiveProblem
    text : str
    """

    problem = ForeignKey(
        SubjectiveProblem, on_delete=CASCADE, related_name="solutions", db_index=True
    )
    text = CharField(max_length=200)


def verify_problem_request(request: Mapping[str, str]):
    try:
        problem_type = request["problemType"]
        assert isinstance(problem_type, str), "problemType should be a string"
        assert isinstance(request["content"], str), "content should be a string"
        problem_number = request.get("problemNumber")
        if problem_number is not None:
            assert isinstance(problem_number, int), "problemNumber should be an integer"
        if problem_type == "multiple-choice":
            assert isinstance(request["choices"], list), "choices should be an array"
            assert isinstance(request["solution"], list), "solution should be an array"
        elif problem_type == "subjective":
            assert isinstance(
                request["solutions"], list
            ), "solutions should be an array"
    except (KeyError, AssertionError) as error:
        raise BadRequest() from error


def create_problem(
    request: Mapping[str, str], creator_id: int, ps_id: int, p_id: Optional[int] = None
):
    kwargs = {}
    if p_id is not None:
        kwargs["pk"] = p_id

    problem_number = request["problemNumber"]
    problem_content = Content.objects.create(text=request["content"])
    if request["problemType"] == "multiple-choice":
        new_problem = MultipleChoiceProblem.objects.create(
            problem_set_id=ps_id,
            number=problem_number,
            content=problem_content,
            creator_id=creator_id,
            solution="",
            **kwargs
        )
        choices = request["choices"]
        is_solution_list = [False] * len(choices)
        for solution_number in request["solution"]:
            is_solution_list[solution_number - 1] = True
        for i, (is_solution, choice_text) in enumerate(zip(is_solution_list, choices)):
            choice_content = Content.objects.create(text=choice_text)
            MultipleChoiceProblemChoice.objects.create(
                problem=new_problem,
                number=i + 1,
                is_solution=is_solution,
                content=choice_content,
            )
    else:
        new_problem = SubjectiveProblem.objects.create(
            problem_set_id=ps_id,
            number=problem_number,
            content=problem_content,
            creator_id=creator_id,
            **kwargs
        )
        for solution_text in request["solutions"]:
            SubjectiveProblemSolution.objects.create(
                problem=new_problem, text=solution_text
            )

    return new_problem


class Solved(Model):
    """Problem solving status model.

    Attributes
    ------
    solver : UserStatistics
    problem : Problem
    result : bool
    """

    solver = ForeignKey(
        UserStatistics, related_name="solved_problems", on_delete=CASCADE
    )
    problem = ForeignKey(Problem, on_delete=CASCADE)
    result = BooleanField(default=False)

    def to_dict(self):
        return {
            "userID": self.solver.user.pk,
            "username": self.solver.user.username,
            "problemID": self.problem_set.pk,
            "problemtitle": self.problem_set.title,
            "result": self.result,
        }
