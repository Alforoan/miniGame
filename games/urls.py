"""
URL configuration for games project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect

def redirect_to_game(request):
  return redirect('recall_it')

urlpatterns = [
    path("admin/", admin.site.urls),
    path('recall_it/', include('recall_it.urls')),
    path('', redirect_to_game),
    path('accounts/', include('accounts.urls')),
    path('scores/', include('scores.urls')),
    path('type_mania/', include('type_mania.urls')),
    path('word_scramble/', include('word_scramble.urls')),
    path('messages/', include('user_messages.urls')),
    path('tz_detect/', include('tz_detect.urls')),
]
