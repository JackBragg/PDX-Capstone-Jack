from django.shortcuts import render
from django.http import HttpResponse

def add_meal(request):
    context = {}
    # return render(request, '<app name>/index.html', context)
    return HttpResponse(status=204)