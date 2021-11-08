from django.urls import path
from . import views

urlpatterns = [
    path("signup/", views.signup, name="signup"),
    path("signin/", views.signin, name="signin"),
    path("signout/", views.signout, name="signout"),
    path("user/<int:u_id>/profile/", views.UserProfileView.as_view()),
    path("user/<int:id>/statistics/", views.userStatistics),
    path("problem/", views.problem_set),
    path("solved/<int:u_id>/", views.solved_prob),
    path("solved/<int:u_id>/<int:p_id>/", views.solved_result),
    path("token/", views.token, name="token"),
]
