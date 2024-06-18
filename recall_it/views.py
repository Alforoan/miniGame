from django.shortcuts import render

# Create your views here.
def show_game(request):
  return render(request, 'recall_it/recall_it.html')