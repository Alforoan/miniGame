from django.urls import path
from .views import show_game

urlpatterns = [
    path('', show_game, name='recall_it')
]
