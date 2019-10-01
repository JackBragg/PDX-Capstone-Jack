from django.urls import path, include
from . import views
from FitAFApp import views as appviews

app_name = 'site' # for namespacing
urlpatterns = [
    path('', views.index, name='index'),
    path('api/meal/<slug:date_in>/', appviews.meal, name='api/get_meal/'),
    path('api/meald/<int:pk>/', appviews.meal_d, name='meald'),
    path('api/user/', appviews.user, name='modUser'),
    path('api/keys/', appviews.getkeys, name='keys'),
]