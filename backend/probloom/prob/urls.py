from django.urls import path
from . import views

urlpatterns = [
    path("signup/", views.SignUpView.as_view(), name="signup"),
    path("signin/", views.SignInView.as_view(), name="signin"),
    path("signout/", views.SignOutView.as_view(), name="signout"),
    path("user/<int:u_id>/profile/", views.UserProfileView.as_view()),
    path("user/<int:u_id>/statistics/", views.get_user_statistics),
    path("solved/<int:u_id>/<int:p_id>/", views.ProblemSetSolvedView.as_view()),
    path("solved/<int:p_id>/", views.UserSolvedListView.as_view()),
    path(
        "problem/<int:id>/comment/",
        views.ProblemSetCommentView.as_view(),
        name="problem_set_comment",
    ),
    path(
        "problem/<int:id>/", views.ProblemSetInfoView.as_view(), name="problem_set_info"
    ),
    path("problem/", views.ProblemSetListView.as_view()),
    path(
        "comment/<int:id>/",
        views.ProblemSetCommentInfoView.as_view(),
        name="comment_info",
    ),
    path("comment/", views.ProblemSetCommentListView.as_view(), name="comment_list"),
    path("token/", views.token, name="token"),
]
