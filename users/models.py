from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    weight = models.FloatField(blank=True, null=True)
    height = models.FloatField(blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    activity = models.IntegerField(blank=True, null=True)
    carb_goal = models.FloatField(blank=True, null=True)
    fat_goal = models.FloatField(blank=True, null=True)
    protein_goal = models.FloatField(blank=True, null=True)
    daily_calorie = models.IntegerField(blank=True, null=True)
