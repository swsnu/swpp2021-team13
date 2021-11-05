from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    pass


class UserStatistics(models.Model):
    lastActiveDays = models.IntegerField(default=0)
    #user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="statistics")

    def __str__(self):
        return str(self.lastActiveDays)
