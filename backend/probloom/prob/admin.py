from django.contrib import admin
from .models import User, UserStatistics, UserProfile, ProblemSet, Comment, Solved
from django.contrib.auth.admin import UserAdmin

admin.site.register(User, UserAdmin)
admin.site.register(UserStatistics)
admin.site.register(UserProfile)
admin.site.register(ProblemSet)
admin.site.register(Comment)
admin.site.register(Solved)
