from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, JsonResponse
from FitAFApp.models import Meal
import json

def suggestion(request, total_calories_today):
    if request.user.is_authenticated:
        # sets user goal used for upperbound
        # goal = int(request.user.daily_calorie)
        goal = 2000
        c_so_far = total_calories_today
        remaining = goal - c_so_far
        # TODO set up time to infer how many meals are left for the day?
        # TODO maybe add in avg eating times? or find a way to find avg feeding times.
        # TODO link feeding times to incorporate intermittent fasting
        



    return HttpResponse('User not authenticated', status=401)