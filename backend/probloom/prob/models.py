from django.db import models

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=120, default='')
    email = models.CharField(max_length=120, default='')
    password = models.CharField(max_length=120, default='')
    logged_in = models.BooleanField(default=False)

    def __str__(self):
        return self.username

class UserStatistics(models.Model):
    lastActiveDays = models.IntegerField(default=0)

    def __str__(self):
        return str(self.lastActiveDays)
