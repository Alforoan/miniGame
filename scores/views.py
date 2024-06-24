from django.shortcuts import render
from django.contrib.auth.models import User
from .models import Score, Game
from django.contrib.auth.decorators import login_required
from collections import defaultdict

@login_required
def score_list(request):
    games = Game.objects.all()
    users = User.objects.all()
    scores = Score.objects.select_related('user', 'game').all()

    user_totals = defaultdict(int)
    for score in scores:
        user_totals[score.user.username] += score.score

    total = [{'user': user, 'score': points} for user, points in user_totals.items()]

    total = sorted(total, key=lambda x: x['score'], reverse=True)

    user_scores = {user.username: {'Total': 0} for user in users}
    game_high_scores = {game.name: [] for game in games}

    for score in scores:
        user_scores[score.user.username]['Total'] += score.score
        
        if score.game.name not in user_scores[score.user.username]:
            user_scores[score.user.username][score.game.name] = score.score
        else:
            user_scores[score.user.username][score.game.name] += score.score

        game_high_scores[score.game.name].append({
            'id': score.id,  
            'score': score.score,
            'user': score.user.username
        })

    for game in game_high_scores:
        game_high_scores[game] = sorted(game_high_scores[game], key=lambda x: x['score'], reverse=True)[:5]


    highest_total_score = 0
    highest_total_user = None
    for user, scores in user_scores.items():
        if scores['Total'] > highest_total_score:
            highest_total_score = scores['Total']
            highest_total_user = user

    game_high_scores['Total'] = [{'score': highest_total_score, 'user': highest_total_user}]

    # recall_it = []
    # for game in game_high_scores.get('Recall It', []):
    #   recall_it.append({'score': game['score'], 'user': game['user']})
    # type_mania = []
    # for game in game_high_scores.get('Type Mania', []):
    #   type_mania.append({'score': game['score'], 'user': game['user']})
    # word_scramble = []
    # for game in game_high_scores.get('Word Scramble', []):
    #   word_scramble.append({'score': game['score'], 'user': game['user']})
    recall_it = [{'id': game['id'], 'score': game['score'], 'user': game['user']} for game in game_high_scores.get('Recall It', [])]
    type_mania = [{'score': game['score'], 'user': game['user']} for game in game_high_scores.get('Type Mania', [])]
    word_scramble = [{'score': game['score'], 'user': game['user']} for game in game_high_scores.get('Word Scramble', [])]
    print('recall it INFORMATION ', recall_it)
    
    return render(request, 'scores/score_list.html', {
        'user_scores': user_scores,
        'recall_it': recall_it,
        'type_mania': type_mania,
        'word_scramble': word_scramble,
        'game_high_scores': game_high_scores,
        'total': total,
        'games': games
    })
