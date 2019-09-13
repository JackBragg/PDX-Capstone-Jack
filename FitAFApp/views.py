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
        # create a new todo from request.body
    if True:
        if request.method == 'POST':
            # deserialize json string
            data = json.loads(request.body)
            # set owner as request.user
            meal = Meal(title=data['meal_title'], calorie=data['calories'])
            todo.save()
            return HttpResponse(status=201)        

        # filter by todos by user
        todos = Todo.objects.filter(owner=request.user).order_by('completed', '-created_date')
        todo_list = []
        for todo in todos:
            todo_dict = {
                'pk': todo.pk,
                'owner': todo.owner.username,
                'text': todo.text,
                'completed': todo.completed,
                'created_date': todo.created_date,
                'completed_date': todo.completed_date
            }
            todo_list.append(todo_dict)
        return JsonResponse(todo_list, safe=False)
    # give client not authorized error if user is not logged in
    return HttpResponse('User not authenticated', status=401)


