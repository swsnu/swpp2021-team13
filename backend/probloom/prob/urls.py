from django.urls import path
from . import views

urlpatterns = [
    path('', views.userList),
    path('<int:id>/statistics/', views.userStatistics),
    path('<int:id>/', views.userInfo),
]
