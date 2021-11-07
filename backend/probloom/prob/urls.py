from django.urls import path
from . import views

urlpatterns = [
    path("signup/", views.signup, name="signup"),
    path("signin/", views.signin, name="signin"),
    path("signout/", views.signout, name="signout"),
    path("user/<int:user_id>/profile/", views.UserProfileView.as_view()),
    path("user/<int:id>/statistics/", views.userStatistics),
    path("token/", views.token, name="token"),
]
