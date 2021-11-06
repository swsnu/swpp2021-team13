from django.db.models import *
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    pass


class UserStatistics(Model):
    lastActiveDays = IntegerField(default=0)
    user = ForeignKey(User, on_delete=CASCADE, related_name="statistics")

    def __str__(self):
        return str(self.lastActiveDays)

class Problem(Model):
    title = CharField(max_length=100, default='default title')
    date = DateTimeField(auto_now_add=True)
    type = BooleanField(default=False)
    tag = CharField(max_length=100, default='default tag')
    difficulty = SmallIntegerField(default=0)
    content = TextField(max_length=1000, default='default content')
    solution = TextField(max_length=1000, default='default solution')
    creator = ForeignKey(UserStatistics, 
        related_name='created_problem',
        on_delete=CASCADE)
    recommender = ManyToManyField(UserStatistics)

    def __str__(self):
        return self.title

class Solved(Model):
    solver = ForeignKey(UserStatistics,
        related_name='solved_problem',
        on_delete=CASCADE)
    problem = ForeignKey(Problem,
        on_delete=CASCADE)
    result = BooleanField(default=False)

    def __str__(self):
        return self.solver.user.name+'_'+self.problem.title