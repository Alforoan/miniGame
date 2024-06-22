from django.shortcuts import render, get_object_or_404
from scores.models import Score, Game
from rest_framework import status
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view
from rest_framework.response import Response
import logging
# Create your views here.
def show_game(request):
  return render(request, 'word_scramble/word_scramble.html')


logger = logging.getLogger(__name__)
@api_view(['POST'])
@login_required
def set_score(request):
  print('logger thing',logger.debug('logging post set score'))   
  user = request.user
  game = get_object_or_404(Game, name="Word Scramble")
  score_value = request.data.get('score')
  try:
      score = Score.objects.get(user=user, game=game)
      print('score', score)
      score.score = score_value
      score.save()
      score_data = {
          'user': user.username,
          'game': game.name,
          'score': score.score 
      }
      print('SCORE DATA IS HERE', score_data)
      return Response(score_data)
  except Score.DoesNotExist:
      score = Score.objects.create(user=user, game=game)
      score.score = score_value
      score.save()
      score_data = {
          'user': user.username,
          'game': game.name,
          'score': score.score
      }
      return Response(score_data)
  
@api_view(['GET'])
@login_required
def get_score(request):
    user = request.user
    try:
      game = get_object_or_404(Game, name="Word Scramble")
      print('Game', game)
      score = Score.objects.get(user=user, game=game)
      score_data = {
          'user': user.username,
          'game': game.name,
          'score': score.score 
      }
    except Score.DoesNotExist:
       score_data = {
            'user': user.username,
            'game': game.name,
            'score': 0
        }
    return Response(score_data, status=status.HTTP_200_OK)