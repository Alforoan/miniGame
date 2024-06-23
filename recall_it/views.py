from django.shortcuts import render
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view
from scores.models import Game, Score
from rest_framework.response import Response
from rest_framework import status
from .models import Normal, Hard

# Create your views here.
def show_game(request):
  return render(request, 'recall_it/recall_it.html')
@api_view(['POST'])
@login_required
def set_score(request):
    user = request.user
    game = get_object_or_404(Game, name="Recall It")
    score_value = request.data.get('score')
    print('USER INFO HERE', user, game, score_value)
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
        score = Score.objects.create(user=user, game=game)
        score.score = score_value
        score.save()
        score_data = {
            'user': user.username,
            'game': game.name,
            'score': score.score
        }
        return Response(score_data)
    
@api_view(['POST'])
@login_required
def set_score_normal(request):
    user = request.user
    
    score_value = request.data.get('score')
    if score_value is None:
        return Response({'error': 'Score not provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        score = Normal.objects.get(user=user)
        score.score = score_value
        score.save()
    except Normal.DoesNotExist:
        Normal.objects.create(user=user, score=score_value)
    
    return Response({'message': 'Score set successfully'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@login_required
def set_score_hard(request):
    user = request.user
    
    score_value = request.data.get('score')
    if score_value is None:
        return Response({'error': 'Score not provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        score = Hard.objects.get(user=user)
        score.score = score_value
        score.save()
    except Hard.DoesNotExist:
        Hard.objects.create(user=user, score=score_value)
    
    return Response({'message': 'Score set successfully'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@login_required
def get_score_normal(request):
    user = request.user
    
    try:
        score = Normal.objects.get(user=user)
        if score == None:
            score = {'score': 0}
        score_data = {
            'user': user.username,
            'score': score.score 
        }
        return Response(score_data)
    except Normal.DoesNotExist:
       score_data = {
            'user': user.username,
            'score': 0
        }
    return Response(score_data, status=status.HTTP_200_OK)

@api_view(['GET'])
@login_required
def get_score_hard(request):
    user = request.user
    
    try:
        score = Hard.objects.get(user=user)
        if score == None:
            score = {'score': 0}
        score_data = {
            'user': user.username,
            'score': score.score 
        }
        return Response(score_data)
    except Hard.DoesNotExist:
        score_data = {
            'user': user.username,
            'score': 0
        }
    return Response(score_data, status=status.HTTP_200_OK)  
