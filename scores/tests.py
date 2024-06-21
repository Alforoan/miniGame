from django.urls import path
from . import views

urlpatterns = [
    path('', views.score_list, name='score_list'),
]
