from django.contrib import admin
from .models import Normal, Hard

# Register your models here.
@admin.register(Normal)
class NormalAdmin(admin.ModelAdmin):
  list_display = ('user', 'score')

@admin.register(Hard)
class HardAdmin(admin.ModelAdmin):
  list_display = ('user', 'score')