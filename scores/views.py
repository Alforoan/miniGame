from django.shortcuts import render
from django.contrib.auth.models import User
from .models import Score, Game

def score_list(request):
    games = Game.objects.all()
    users = User.objects.all()
    scores = Score.objects.select_related('user', 'game').all()

    user_scores = {user.username: {'Total': 0} for user in users}
    
    game_high_scores = {game.name: {'score': 0, 'user': None} for game in games}
    
    for score in scores:
        user_scores[score.user.username]['Total'] += score.score
        
        if score.game.name not in user_scores[score.user.username]:
            user_scores[score.user.username][score.game.name] = score.score
        else:
            user_scores[score.user.username][score.game.name] += score.score

        if score.score > game_high_scores[score.game.name]['score']:
            game_high_scores[score.game.name]['score'] = score.score
            game_high_scores[score.game.name]['user'] = score.user.username

    highest_total_score = 0
    highest_total_user = None
    for user, scores in user_scores.items():
        if scores['Total'] > highest_total_score:
            highest_total_score = scores['Total']
            highest_total_user = user

    game_high_scores['Total'] = {'score': highest_total_score, 'user': highest_total_user}

    print('game_high_scores', game_high_scores)

    return render(request, 'scores/score_list.html', {
        'user_scores': user_scores,
        'game_high_scores': game_high_scores,
        'games': games
    })
