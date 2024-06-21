from django.contrib import admin
from .models import Game, Score

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Score)
class ScoreAdmin(admin.ModelAdmin):
    list_display = ('user', 'game', 'score', 'date')
    list_filter = ('game', 'date')
    search_fields = ('user__username', 'game__name')
