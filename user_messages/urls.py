from django.urls import path
from .views import send_message, view_message, inbox

urlpatterns = [
    path('send/<str:username>/', send_message, name='send_message'),
    path('inbox/', inbox, name='inbox'),
    path('message/<int:pk>/', view_message, name='view_message'),
]
