from django.urls import path
from . import views

app_name = 'suggAPI' # for namespacing
urlpatterns = [
    path('', views.suggestion, name='sugg')
]