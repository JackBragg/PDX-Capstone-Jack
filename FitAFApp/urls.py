from django.urls import path
from . import views

app_name = 'app' # for namespacing
urlpatterns = [
    path('api/meal/', views.meal, name='meal'),
]