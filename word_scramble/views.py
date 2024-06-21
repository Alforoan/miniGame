from django.shortcuts import render

# Create your views here.
def show_game(request):
  return render(request, 'word_scramble/word_scramble.html')