from django.shortcuts import render

# Create your views here.
def show_game(request):
  return render(request, 'type_mania/type_mania.html')