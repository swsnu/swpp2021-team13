from django.urls import path
from . import views

urlpatterns = [
    path("signup/", views.SignUpView.as_view(), name="signup"),
    path("signin/", views.SignInView.as_view(), name="signin"),
    path("signout/", views.SignOutView.as_view(), name="signout"),
    path("user/<int:u_id>/profile/", views.UserProfileView.as_view()),
    path("user/<int:id>/statistics/", views.userStatistics),
    path("comment/", views.CommentListView.as_view(), name="comment_list"),
    path("comment/<int:id>/", views.CommentInfoView.as_view(), name="comment_info"),
    path("token/", views.TokenView.as_view(), name="token"),
]
