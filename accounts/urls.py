from django.urls import path
from .views import signup_view, login_view, logout_view, account_view,change_password_view, user_account_view

urlpatterns = [
    path('signup/', signup_view, name='signup'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('account/', account_view, name='account'),
    path('change_password/', change_password_view, name='change_password'),
    path('users/<str:username>/', user_account_view, name='users')
]
