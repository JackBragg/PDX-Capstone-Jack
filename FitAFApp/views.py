from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, JsonResponse
from .models import Meal
import json

def meal(request):
    '''
    api endpoint for meal
    '''
    # check if user is logged in
    #if request.user.is_authenticated:
        # create a new meal from request.body
    if True:
        if request.method == 'POST':
            # deserialize json string
            data = json.loads(request.body)
            # set owner as request.user
            meal = Meal(title=data['title'], calorie=data['calories'])
            meal.save()
            return HttpResponse(status=201)        

        # filter by meals by user
        meals = Meal.objects.all().order_by('-created_date')
        #meals = Meal.objects.filter(owner=request.user).order_by('-created_date')
        meal_list = []
        for meal in meals:
            meal_dict = {
                'pk': meal.pk,
                'title': meal.title,
                'calorie': meal.calorie,
                #'owner': meal.owner.username,
                'created_date': meal.created_date,
            }
            meal_list.append(meal_dict)
        return JsonResponse(meal_list, safe=False)


    # give client not authorized error if user is not logged in
    return HttpResponse('User not authenticated', status=401)

def meald(request, pk):
    meal = get_object_or_404(Meal, pk=pk)
    if request.method == 'DELETE':
            meal.delete()
            return HttpResponse(status=204)

    meal_dict = {
        'pk': meal.pk,
        'text': meal.text,
        'completed': meal.completed,
        'created_date': meal.created_date,
        'completed_date': meal.completed_date
    } 
    return JsonResponse(meal_dict)
