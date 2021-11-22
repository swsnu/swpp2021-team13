from typing import Any, Dict
import uuid

from django.db.models import (
    BooleanField,
    CharField,
    DateField,
    DateTimeField,
    ForeignKey,
    IntegerField,
    ManyToManyField,
    Model,
    OneToOneField,
    PositiveSmallIntegerField,
    SmallIntegerField,
    TextField,
    UUIDField,
)
from django.db.models.deletion import CASCADE, RESTRICT, SET
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser
from polymorphic.models import PolymorphicModel

# Create your models here.
class User(AbstractUser):
    """User model.

    Inherited Fields
    ----------------
    username : str
    email : str
    password : str

    Automatically Generated Properties
    ----------------------------------
    profile : UserProfile
    statistics : UserStatistics
    inventory : UserInventory
    """


def get_sentinel_user():
    return get_user_model().objects.get_or_create(username="[deleted]")[0]


class UserProfile(Model):
    """User profile model.

    Fields
    ------
    user : User
    introduction : str
    """

    user = OneToOneField(
        User, on_delete=CASCADE, related_name="profile", primary_key=True
    )
    introduction = TextField(default="")

    def to_dict(self) -> Dict[str, Any]:
        return {
            "user": self.user.pk,
            "introduction": str(self.introduction),
        }


class UserStatistics(Model):
    """User statistics model.

    Fields
    ------
    user : User
    created_time : datetime
    last_login_date : date

    Automatically Generated Properties
    ----------------------------------
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
    last_login_date = DateField(blank=True)


def get_sentinel_user_statistics():
    return UserStatistics.objects.get_or_create(user=get_sentinel_user())[0]


class Tag(Model):
    """Tag model.

    Fields
    ------
    name : str
    level : int
    parent : Optional[Tag]

    Automatically Generated Properties
    ----------------------------------
    children : QuerySet[Tag]
    problem_sets : QuerySet[ProblemSet]
    """

    name = CharField(max_length=100)
    level = PositiveSmallIntegerField()
    parent = ForeignKey("self", related_name="children", on_delete=CASCADE, null=True)


class ProblemSet(Model):
    """Problem set model.

    Fields
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

    Automatically Generated Properties
    ----------------------------------
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
        UserStatistics, related_name="recommended_problem_sets"
    )
    tags = ManyToManyField(Tag, related_name="problem_sets")

    def info_dict(self):
        solved_num = self.solved_user.all().count()
        recommended_num = self.recommenders.all().count()
        return {
            "id": self.pk,
            "title": self.title,
            "created_time": self.created_time,
            "modified_time": self.modified_time,
            "is_open": self.is_open,
            "tag": self.tags,
            "difficulty": self.difficulty,
            "content": str(self.description),
            "userID": self.creator.user.pk,
            "username": self.creator.user.username,
            "solved_num": solved_num,
            "recommended_num": recommended_num,
        }


class Problems(Model):
    index = IntegerField(blank=True, null=True)
    problem_type = CharField(max_length=100, default="default type")
    problem_statement = TextField(max_length=1000, default="default statement")
    solution = CharField(max_length=10, default="default solution")
    explanation = TextField(max_length=1000, default="default explanation")

    problemSet = ForeignKey(ProblemSet, related_name="problems", on_delete=CASCADE)


class Choice(Model):
    choice1 = TextField(max_length=1000, default="choice1")
    choice2 = TextField(max_length=1000, default="choice2")
    choice3 = TextField(max_length=1000, default="choice3")
    choice4 = TextField(max_length=1000, default="choice4")

    problems = OneToOneField(Problems, related_name="problem_choice", on_delete=CASCADE)


class Content(Model):
    """Content model.

    Fields
    ------
    text : str

    Automatically Generated Properties
    ----------------------------------
    images : QuerySet[ContentImage]
    """

    text = TextField()


class ContentImage(Model):
    """Content image model.

    Fields
    ------
    id : UUID
    content : Content
    image : File
    """

    id = UUIDField(primary_key=True, default=uuid.uuid4, editable=False)


class ProblemSetComment(Model):
    """Problem set comment model.

    Fields
    ------
    created_time : datetime
    content : Content
    creator : UserStatistics
    problem_set : ProblemSet
    """

    date = DateTimeField(auto_now=True)
    content = OneToOneField(Content, on_delete=RESTRICT)
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
            "date": self.date,
            "content": str(self.content),
        }


class Problem(PolymorphicModel):
    """Base model for problems.

    Fields
    ------
    problem_set : ProblemSet
    number : int
    created_time : datetime
    content : Content
    creator : UserStatistics
    solvers : QuerySet[UserStatistics]

    Automatically Generated Properties
    ----------------------------------
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


class MultipleChoiceProblem(Problem):
    """Multiple-choice problem model.

    Fields
    ------
    solution : str

    Automatically Generated Properties
    ----------------------------------
    choices : QuerySet[MultipleChoiceProblemChoice]
    """

    solution = CharField(max_length=30)


class MultipleChoiceProblemChoice(Model):
    """Choice model for multiple-choice problems.

    Fields
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

    Automatically Generated Properties
    ----------------------------------
    solutions : QuerySet[SubjectiveProblemSolution]
    """


class SubjectiveProblemSolution(Problem):
    """Solution model for subjective problems.

    Fields
    ------
    problem : SubjectiveProblem
    text : str
    """

    problem = ForeignKey(
        SubjectiveProblem, on_delete=CASCADE, related_name="solutions", db_index=True
    )
    text = CharField(max_length=200)


class Solved(Model):
    """Problem solving status model.

    Fields
    ------
    solver : UserStatistics
    problem : Problem
    problem_set : ProblemSet
    result : bool
    """

    solver = ForeignKey(
        UserStatistics, related_name="solved_problems", on_delete=CASCADE
    )
    problem = ForeignKey(Problem, on_delete=CASCADE)
    problem_set = ForeignKey(ProblemSet, on_delete=CASCADE)
    result = BooleanField(default=False)

    def to_dict(self):
        return {
            "userID": self.solver.user.pk,
            "username": self.solver.user.username,
            "problemID": self.problem_set.pk,
            "problemtitle": self.problem_set.title,
            "result": self.result,
        }
