from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect
from .forms import LoginForm, SignupForm
from django.contrib.auth.models import User

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
  return redirect("recall_it")

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