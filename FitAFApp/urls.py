from django.urls import path
from . import views

app_name = 'app' # for namespacing
urlpatterns = [
    # blank because FitAFSite is handling all this. 
    # leaving here for future example for myself and others.
    # path('api/meal/', views.meal, name='meal'),
    # path('api/meal/<int:pk>/', views.meald, name='meald')
]