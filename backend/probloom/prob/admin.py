from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import (
    Content,
    MultipleChoiceProblem,
    MultipleChoiceProblemChoice,
    ProblemSet,
    ProblemSetComment,
    Solved,
    SubjectiveProblem,
    SubjectiveProblemSolution,
    User,
    UserProfile,
    UserStatistics,
)

admin.site.register(User, UserAdmin)
admin.site.register(UserStatistics)
admin.site.register(UserProfile)
admin.site.register(ProblemSet)
admin.site.register(Content)
admin.site.register(ProblemSetComment)
admin.site.register(MultipleChoiceProblem)
admin.site.register(MultipleChoiceProblemChoice)
admin.site.register(SubjectiveProblem)
admin.site.register(SubjectiveProblemSolution)
admin.site.register(Solved)
