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
            print('data', data)
            meal = Meal()
            meal.owner = request.user
            meal.created_date = timezone.now()
            # print('*'*60, request.created_date, '*'*60)
            # repeated below, could be own func
            meal.title = data['title']
            meal.url = data['url']
            meal.image = data['image']
            meal.calories = data['calories']
            meal.cooktime = data['cooktime']
            meal.servings = data['servings']
            meal.fat = data['fat']
            meal.carb = data['carb']
            meal.pro = data['pro']
            meal.meal_time = data['meal_time']
            # end repeat
            meal.save()
            return HttpResponse(status=201)        

        if request.method == 'GET':
            # filter by meals by user
            today = timezone.now().replace(hour=0, minute=0, second=0)
            meals = Meal.objects.filter(owner=request.user, created_date__gte=(today)).order_by('-created_date')
            meal_list = []
            for meal in meals:
                meal_dict = {
                    'pk': meal.pk,
                    'owner': meal.owner.username,
                    'created_date': meal.created_date,
                    # repeated above, could be own func
                    'title': meal.title,
                    'url': meal.url,
                    'image': meal.image,
                    'calories': meal.calories,
                    'cooktime': meal.cooktime,
                    'servings': meal.servings,
                    'fat': meal.fat,
                    'carb': meal.carb,
                    'pro': meal.pro,
                    'meal_time' : meal.meal_time
                    # end repeat
                }
                meal_list.append(meal_dict)
            return JsonResponse(meal_list, safe=False)

    # give client not authorized error if user is not logged in
    return HttpResponse('User not authenticated', status=401)

def meal_d(request, pk):
    if request.user.is_authenticated:
        meal = get_object_or_404(Meal, pk=pk)
        if request.method == 'DELETE':
            meal.delete()
            return HttpResponse(status=204)
    else:
        return HttpResponse(status=404)

def user(request):
    if request.user.is_authenticated:
        if request.method == 'POST':
            # change field data
            data = json.loads(request.body)
            # set owner as request.user
            USER = request.user
            USER.gender = data['gender']
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
            "gender" : request.user.gender
        }
        return JsonResponse(user_dict)

def getkeys(request):
    return JsonResponse(secret.KEYS)
