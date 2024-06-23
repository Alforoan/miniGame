from django.shortcuts import render, get_object_or_404
from scores.models import Score, Game
from rest_framework import status
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.
def show_game(request):
  return render(request, 'type_mania/type_mania.html')

@api_view(['POST'])
@login_required
def set_score(request):
  user = request.user
  game = get_object_or_404(Game, name="Type Mania")
  score_value = request.data.get('score')
  try:
      score = Score.objects.get(user=user, game=game)
      score.score = score_value
      score.save()
      score_data = {
          'user': user.username,
          'game': game.name,
          'score': score.score 
      }
      print('SCORE DATA', score_data)
      return Response(score_data)
  except Score.DoesNotExist:
      return Response({'error': 'Score not found'}, status=status.HTTP_404_NOT_FOUND)
@api_view(['GET'])
@login_required
def get_score(request):
    user = request.user
    print('USER HERE',user)
    try:
      game = get_object_or_404(Game, name="Type Mania")
      score = Score.objects.get(user=user, game=game)
      score_data = {
          'user': user.username,
          'score': score.score 
      }
    except Score.DoesNotExist:
       score_data = {
            'user': user.username,
            'score': 0
        }
    return Response(score_data, status=status.HTTP_200_OK)