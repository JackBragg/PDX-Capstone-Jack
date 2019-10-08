from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from django.views import generic
from django.urls import reverse_lazy
from .forms import CustomUserCreationForm

# Create new users.

def home(request) :
    if request.user.is_authenticated:
        return redirect('site:index')
    return render(request, 'home.html')


def User(request) :
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        
        if form.is_valid():
            print('FORM IS VVVVAAAAALLLLIIIIDDDDDD')
            form.save()
            username = form.cleaned_data['username']
            password = form.clean_password2()
            user = authenticate(username=username, password=password)
            login(request, user)
            return redirect('site:index')
    else:
        print('FORM IS NOT VVVAALID')
        form = CustomUserCreationForm()
    return render(request, 'signup.html', {'form':form})

class SignUp(generic.CreateView):
    form_class = CustomUserCreationForm
    success_url = reverse_lazy('login')
    template_name = 'signup.html'