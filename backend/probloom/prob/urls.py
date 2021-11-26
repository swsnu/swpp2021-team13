from django.urls import path
from . import views

urlpatterns = [
    path("signup/", views.SignUpView.as_view(), name="signup"),
    path("signin/", views.SignInView.as_view(), name="signin"),
    path("signout/", views.SignOutView.as_view(), name="signout"),
    path("user/<int:u_id>/", views.get_user),
    path("user/current/", views.get_current_user),
    path("user/<int:u_id>/profile/", views.UserProfileView.as_view()),
    path("user/<int:u_id>/statistics/", views.get_user_statistics),
    path("problem_set/", views.ProblemSetListView.as_view()),
    path(
        "problem_set/<int:ps_id>/",
        views.ProblemSetInfoView.as_view(),
        name="problem_set_info",
    ),
    path("problem_set/<int:ps_id>/recommend/", views.update_problem_set_recommendation),
    path(
        "problem_set/<int:ps_id>/comment/",
        views.ProblemSetCommentListView.as_view(),
        name="problem_set_comment",
    ),
    path(
        "problem_set/<int:ps_id>/comment/<int:c_id>/",
        views.ProblemSetCommentInfoView.as_view(),
        name="comment_info",
    ),
    path("problem/<int:p_id>/", views.ProblemInfoView.as_view()),
    path("problem/<int:p_id>/solve/", views.solve_problem),
    path("solved/<int:u_id>/<int:p_id>/", views.ProblemSetSolvedView.as_view()),
    path("solved/<int:p_id>/", views.ProblemSetSolvedListView.as_view()),
    path("token/", views.token, name="token"),
]
