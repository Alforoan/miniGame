from django.urls import path
from .views import show_game, get_score, set_score

urlpatterns = [
    path('', show_game, name='word_scramble'),
    path('api/score/set/', set_score, name='set_score'),
    path('api/score/get/', get_score, name='get_score')
]
