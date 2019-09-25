# api/meal/
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, JsonResponse
from .models import Meal
from users.models import CustomUser
from django.utils import timezone
from datetime import datetime, timedelta
import json, csv
from FitAF import secret


def meal(request):
    '''
    api endpoint for meal
    '''
    # check if user is logged in
    if request.user.is_authenticated:
        # create a new meal from request.body
        if request.method == 'POST':
            # deserialize json string
            data = json.loads(request.body)
            # set owner as request.user
            meal = Meal(owner=request.user, title = data['title'], calorie = data['calories'])
            meal.save()
            return HttpResponse(status=201)        

        # filter by meals by user
        today = timezone.now().replace(hour=0, minute=0, second=0)
        meals = Meal.objects.filter(owner=request.user, created_date__gte=(today)).order_by('-created_date')
        meal_list = []
        for meal in meals:
            meal_dict = {
                'pk': meal.pk,
                'title': meal.title,
                'calorie': meal.calorie,
                'owner': meal.owner.username,
                'created_date': meal.created_date,
            }
            meal_list.append(meal_dict)
        return JsonResponse(meal_list, safe=False)

    # give client not authorized error if user is not logged in
    return HttpResponse('User not authenticated', status=401)

def meald(request, pk):
    if request.user.is_authenticated:
        meal = get_object_or_404(Meal, pk=pk)
        if request.method == 'DELETE':
            meal.delete()
            return HttpResponse(status=204)

        meal_dict = {
            'pk': meal.pk,
            'owner': meal.owner,
            'text': meal.text,
            'completed': meal.completed,
            'created_date': meal.created_date,
            'completed_date': meal.completed_date
        } 
        return JsonResponse(meal_dict)
    else:
        return HttpResponse(status=404)

def user(request):
    if request.user.is_authenticated:
        if request.method == 'POST':
            # change field data
            data = json.loads(request.body)
            # set owner as request.user
            USER = request.user
            USER.weight = data['weight']
            USER.height = data['height']
            USER.age = data['age']
            USER.activity = data['activity']
            USER.carb_goal = data['carb_goal']
            USER.fat_goal = data['fat_goal']
            USER.protein_goal = data['protein_goal']
            USER.daily_calorie = data['daily_calorie'] 
            USER.save()
            return HttpResponse(status=201)  
        
        # grab user field data
        user_dict = {
            "username" : request.user.username,
            "weight" : request.user.weight,
            "height" : request.user.height,
            "age" : request.user.age,
            "activity" : request.user.activity,
            "carb_goal" : request.user.carb_goal,
            "fat_goal" : request.user.fat_goal,
            "protein_goal" : request.user.protein_goal,
            "daily_calorie" : request.user.daily_calorie,
        }
        return JsonResponse(user_dict)

def getkeys(request):
    return JsonResponse(secret.KEYS)
