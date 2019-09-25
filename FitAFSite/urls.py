from django.urls import path, include
from . import views
from FitAFApp import views as appviews

app_name = 'site' # for namespacing
urlpatterns = [
    path('', views.index, name='index'),
    path('api/meal/', appviews.meal, name='api/meal/'),
    path('api/meal/<int:pk>/', appviews.meald, name='meald'),
    path('api/user/', appviews.user, name='modUser'),
    path('api/keys/', appviews.getkeys, name='keys'),
]