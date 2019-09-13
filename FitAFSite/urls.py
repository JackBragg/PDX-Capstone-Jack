from django.urls import path, include
from . import views
from FitAFApp import views as appviews

app_name = 'site' # for namespacing
urlpatterns = [
    path('', views.index, name='index'),
]