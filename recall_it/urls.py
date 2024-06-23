from django.urls import path
from .views import show_game, set_score, set_score_normal, set_score_hard, get_score_normal, get_score_hard
urlpatterns = [
    path('', show_game, name='recall_it'),
    path('api/score/', set_score, name='set_score'),
    path('api/score/set/normal/', set_score_normal, name='set_score'),
    path('api/score/set/hard/', set_score_hard, name='set_score'),
    path('api/score/get/normal/', get_score_normal, name='get_score_normal'),
    path('api/score/get/hard/', get_score_hard, name='get_score_hard'),
   
]
