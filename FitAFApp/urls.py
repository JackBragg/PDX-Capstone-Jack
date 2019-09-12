from django.urls import path
from . import views

app_name = 'App' # for namespacing
urlpatterns = [
    path('', views.add_meal, name='add_meal'),
]