from typing import Any, Dict

from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    pass


class UserProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="profile", primary_key=True
    )
    introduction = models.TextField(default="")

    def to_dict(self) -> Dict[str, Any]:
        return {
            "user": self.user.pk,
            "introduction": str(self.introduction),
        }


class UserStatistics(models.Model):
    lastActiveDays = models.IntegerField(default=0)
    # user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="statistics")

    def __str__(self):
        return str(self.lastActiveDays)
