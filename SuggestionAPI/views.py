from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, JsonResponse
from FitAFApp.models import Meal
from random import choice
import json

app_id = '&app_id=c465ab58'
app_key = '&app_key=5ebc16bf02f991a51be1eecbc2ecfdaf'
gtg = False
foods = [
    'apple',
    'carrot',
    'pasta',
    'avacado',
]

def suggestion(request, total_calories_today):
    if request.user.is_authenticated:
        # sets user goal used for upperbound
        # goal = int(request.user.daily_calorie)
        api = 'https://api.edamam.com/search?q='
        goal = 2000
        c_so_far = total_calories_today
        remaining_cal = goal - c_so_far
        if remaining_cal > 0:
            remaining_cal = '&calories=' + str(goal - c_so_far)
            gtg = True
        else:
            gtg = False
        # TODO set up time to infer how many meals are left for the day?
        # TODO maybe add in avg eating times? or find a way to find avg feeding times.
        # TODO link feeding times to incorporate intermittent fasting
        while gtg:
            search_param = choice(foods)
            r = requests.get(api + search_param + app_id + app_key + remaining_cal)
            if r.status_code == 200:
                r_data = r.json().data.results
                r_data[0]

    return HttpResponse('User not authenticated', status=401)

# exampl: "https://api.edamam.com/search?q=chicken&app_id=${YOUR_APP_ID}&app_key=${YOUR_APP_KEY}&from=0&to=3&calories=591-722&health=alcohol-free"
# >>> r = requests.get('https://api.github.com/user', auth=('user', 'pass'))
# >>> r.status_code
# 200
# >>> r.headers['content-type']
# 'application/json; charset=utf8'
# >>> r.encoding
# 'utf-8'
# >>> r.text
# u'{"type":"User"...'
# >>> r.json()