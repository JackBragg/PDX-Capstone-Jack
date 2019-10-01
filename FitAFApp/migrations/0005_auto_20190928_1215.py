# Generated by Django 2.2.5 on 2019-09-28 19:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('FitAFApp', '0004_auto_20190913_1945'),
    ]

    operations = [
        migrations.RenameField(
            model_name='meal',
            old_name='calorie',
            new_name='calories',
        ),
        migrations.RenameField(
            model_name='meal',
            old_name='protein',
            new_name='pro',
        ),
        migrations.AddField(
            model_name='meal',
            name='cooktime',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='meal',
            name='image',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='meal',
            name='servings',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='meal',
            name='url',
            field=models.TextField(blank=True, null=True),
        ),
    ]