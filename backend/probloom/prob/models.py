from typing import Any, Dict

from django.db.models import *
from django.contrib.auth.models import AbstractUser
import datetime

# Create your models here.
class User(AbstractUser):
    pass


class UserProfile(Model):
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
    lastActiveDays = IntegerField(default=0)
    user = OneToOneField(User, on_delete=CASCADE, related_name="statistics", null=True)

    def __str__(self):
        return str(self.lastActiveDays)


class ProblemSet(Model):
    title = CharField(max_length=100, default="default title")
    date = DateTimeField(auto_now_add=True, blank=True)
    type = BooleanField(default=False)
    tag = CharField(max_length=100, default="default tag")
    difficulty = SmallIntegerField(default=0)
    content = TextField(max_length=1000, default="default content")
    creator = OneToOneField(
        UserStatistics, related_name="created_problem", on_delete=CASCADE
    )
    recommender = ManyToManyField(
        UserStatistics, blank=True, related_name="recommended_problem"
    )
    solver = ManyToManyField(UserStatistics, blank=True, related_name="solved_problem")

    def info_dict(self):
        return {
            "id": self.id,
            "userID": self.creator.user.id,
            "username": self.creator.user.username,
            "date": self.date,
            "title": self.title,
            "content": str(self.content),
        }

    def solver_dict(self):
        sovler_set = self.solver.all()
        res = []
        for solver in sovler_set:
            res.append({"userID": solver.user.id, "username": solver.user.username})
        return res

    def __str__(self):
        return self.title


class Comment(Model):
    date = DateTimeField(auto_now=True)
    content = TextField(max_length=1000, default="default content")
    creator = ForeignKey(
        UserStatistics, related_name="created_comment", on_delete=CASCADE
    )
    problem_set = ForeignKey(ProblemSet, related_name="comment", on_delete=CASCADE)

    def to_dict(self):
        return {
            "id": self.id,
            "userID": self.creator.user.id,
            "username": self.creator.user.username,
            "problemSetID": self.problem_set.id,
            "date": self.date,
            "content": str(self.content),
        }
