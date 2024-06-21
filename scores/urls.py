from django.urls import path
from .views import score_list

urlpatterns = [
    path('', score_list, name='score_list'),
]
