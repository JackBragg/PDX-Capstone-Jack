from django.conf import settings
from django.db import models
from django.utils import timezone


class Meal(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL,blank=True, null=True, on_delete=models.CASCADE)
    created_date = models.DateTimeField(default=timezone.now)
    
    title = models.CharField(max_length=200, blank=True, null=True)
    url = models.TextField(blank=True, null=True)
    image = models.TextField(blank=True, null=True)
    calories = models.IntegerField(blank=True, null=True)
    cooktime = models.IntegerField(blank=True, null=True)
    servings = models.IntegerField(blank=True, null=True)
    fat = models.IntegerField(blank=True, null=True)
    carb = models.IntegerField(blank=True, null=True)
    pro = models.IntegerField(blank=True, null=True)
    meal_time = models.TextField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.title