from django.conf import settings
from django.db import models
from django.utils import timezone


class Meal(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL,blank=True, null=True, on_delete=models.CASCADE)
    title = models.CharField(max_length=200, blank=True, null=True)
    carb = models.IntegerField(blank=True, null=True)
    fat = models.IntegerField(blank=True, null=True)
    protein = models.IntegerField(blank=True, null=True)
    calorie = models.IntegerField(blank=True, null=True)
    created_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title