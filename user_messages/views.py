from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Message
from .forms import MessageForm
from django.contrib.auth.models import User
from django.core.paginator import Paginator

@login_required
def send_message(request, username):
    recipient = get_object_or_404(User, username=username)
    if request.method == 'POST':
        form = MessageForm(request.POST)
        if form.is_valid():
            message = form.save(commit=False)
            message.sender = request.user
            message.recipient = recipient
            message.save()
            return redirect('users', username=recipient.username)
    else:
        form = MessageForm()
    return render(request, 'user_messages/send_message.html', {'form': form, 'recipient': recipient})

@login_required
def inbox(request):
    messages = Message.objects.filter(recipient=request.user).order_by('-timestamp')
    paginator = Paginator(messages, 7)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    context = {
        'page_obj': page_obj,
    }
    return render(request, 'user_messages/inbox.html', context)

@login_required
def view_message(request, pk):
    message = get_object_or_404(Message, pk=pk, recipient=request.user)
    message.is_read = True
    message.save()
    return render(request, 'user_messages/view_message.html', {'message': message})
