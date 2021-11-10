from django.db.models import *
from django.contrib.auth.models import AbstractUser
from typing import Any, Dict

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
    created_time = DateTimeField(auto_now_add=True, blank=True)
    is_open = BooleanField(default=False)
    tag = CharField(max_length=100, default="default tag")
    difficulty = SmallIntegerField(default=0)
    content = TextField(max_length=1000, default="default content")
    creator = ForeignKey(
        UserStatistics, related_name="created_problem", on_delete=CASCADE
    )
    recommender = ManyToManyField(
        UserStatistics, blank=True, related_name="recommended_problem"
    )

    def info_dict(self):
        solved_num = self.solved_user.all().count()
        recommended_num = self.recommender.all().count()
        return {
            "id": self.id,
            "title": self.title,
            "created_time": self.created_time,
            "is_open": self.is_open,
            "tag": self.tag,
            "difficulty": self.difficulty,
            "content": str(self.content),
            "userID": self.creator.user.id,
            "username": self.creator.user.username,
            "solved_num": solved_num,
            "recommended_num": recommended_num,
        }

    def solver_dict(self):
        sovler_set = self.solver.all()
        res = []
        for solver in sovler_set:
            res.append(
                {
                    "userID": solver.solved_user.user.id,
                    "username": solver.solved_user.user.username,
                }
            )
        return res


class Solved(Model):
    solver = ForeignKey(
        UserStatistics, related_name="solved_problem", on_delete=CASCADE
    )
    problem = ForeignKey(ProblemSet, related_name="solved_user", on_delete=CASCADE)
    result = BooleanField(default=False)

    def to_dict(self):
        return {
            "userID": self.solver.user.id,
            "username": self.solver.user.username,
            "problemID": self.problem.id,
            "problemtitle": self.problem.title,
            "result": self.result,
        }


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
