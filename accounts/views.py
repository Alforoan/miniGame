from django.shortcuts import render, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect
from .forms import LoginForm, SignupForm, ChangePasswordForm
from django.contrib.auth.models import User
from scores.models import Score
from django.contrib.auth.decorators import login_required
from user_messages.models import Message
from django.http import JsonResponse

# Create your views here.
def login_view(request):
  form = LoginForm()
  if request.user.is_authenticated:
    return redirect("recall_it")
  if request.method == "POST":
      username = request.POST.get('username')
      password = request.POST.get('password')
      user = authenticate(request, username=username, password=password)
      if user is not None:
          login(request, user)
          return redirect("recall_it")
      else:
          error_message = "Invalid username or password. Please try again."
          return render(request, "accounts/login.html", {"form": form, "error_message": error_message})
  return render(request, "accounts/login.html", {"form": form})

def logout_view(request):
  logout(request)
  return redirect("login")

def signup_view(request):
  form = SignupForm()
  if request.user.is_authenticated:
    return redirect("recall_it")
  if request.method == "POST":
    username = request.POST.get('username')
    password = request.POST.get('password')
    password_confirmation = request.POST.get('password_confirmation')
    if username and password and password_confirmation:
      if password != password_confirmation:
        error_message = "Passwords do not match. Please try again."
        return render(request, 'accounts/signup.html', {'form': form, 'error_message': error_message})
      else:
        try:
          user = User.objects.create_user(username, password=password)
          login(request, user)
          return redirect('recall_it')  
        except Exception as e:
          return render(request, 'accounts/signup.html', {'form': form, 'error': str(e)})
    else:
      return render(request, 'accounts/signup.html', {'form': form, 'error': 'Please fill out all fields'})
  return render(request, 'accounts/signup.html', {'form': form})
@login_required
def account_view(request):

  games = Score.objects.filter(user=request.user)

  word_scramble_score = 0
  recall_it_score = 0
  type_mania_score = 0

  for score in games:
    if score.game.name == 'Recall It':
      recall_it_score = score.score
    elif score.game.name == 'Word Scramble':
      word_scramble_score = score.score
    elif score.game.name == 'Type Mania':
      type_mania_score = score.score
       
  total = word_scramble_score + recall_it_score + type_mania_score
  
  if total < 1000:
    rank = 'Noob'
  elif total >= 1000 and total < 2000:
    rank = 'Apprentice'
  elif total >= 2000 and total < 3000:
    rank = 'Challenger'
  elif total >= 3000 and total < 4000:
    rank = 'Journeyman'
  elif total >= 4000 and total < 5000:
    rank = 'Warrior'
  elif total >= 5000 and total < 6000:
    rank = 'Elite'
  elif total >= 6000 and total < 7000:
    rank = 'Master'
  else:
    rank = 'Legend'

  context = {
    'recall_it': recall_it_score,
    'type_mania': type_mania_score,
    'word_scramble': word_scramble_score,
    'total': total,
    'rank': rank
  }
  return render(request, 'accounts/account.html', context)
@login_required
def change_password_view(request):
    error = ''
    context = {}
    
    if request.method == 'POST':
      
      form = ChangePasswordForm(request.POST)
      print('form', form)
      if form.is_valid():
        user = request.user
        old_password = form.cleaned_data['old_password']
        if not user.check_password(old_password):
            error = 'Incorrect password. Please type the correct password.'
        else:
          new_password = form.cleaned_data['new_password']
          confirm_password = form.cleaned_data['confirm_password']
          if new_password != confirm_password:
            error = 'Passwords do not match. Please try again.'
            return render(request, 'accounts/change_password.html', {'form': form, 'error': error})
          else:
            user.set_password(new_password)
            user.save()

            user = authenticate(username=user.username, password=new_password)
            login(request, user)

            return redirect('account')  
    else:
      form = ChangePasswordForm()

    context['form'] = form
    context['error'] = error
    return render(request, 'accounts/change_password.html', context)

def user_account_view(request, username):
    other_user = get_object_or_404(User, username=username)
    recall_it_scores = Score.objects.get(user=other_user, game__name='Recall It')
    recall_it_scores = recall_it_scores.score
    type_mania_scores = Score.objects.get(user=other_user, game__name='Type Mania').score
    word_scramble_scores = Score.objects.get(user=other_user, game__name='Word Scramble').score
    
    total = word_scramble_scores + recall_it_scores + type_mania_scores
  
    if total < 1000:
      rank = 'Noob'
    elif total >= 1000 and total < 2000:
      rank = 'Apprentice'
    elif total >= 2000 and total < 3000:
      rank = 'Challenger'
    elif total >= 3000 and total < 4000:
      rank = 'Journeyman'
    elif total >= 4000 and total < 5000:
      rank = 'Warrior'
    elif total >= 5000 and total < 6000:
      rank = 'Elite'
    elif total >= 6000 and total < 7000:
      rank = 'Master'
    else:
      rank = 'Legend'

    context = {
        'other_user': other_user,
        'recall_it_score': recall_it_scores,
        'type_mania_score': type_mania_scores,
        'rank': rank,
        'word_scramble_score': word_scramble_scores,
    }
    return render(request, 'accounts/users.html', context)
