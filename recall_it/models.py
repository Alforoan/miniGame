from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Normal(models.Model):
  score = models.IntegerField(default=0)
  user = models.ForeignKey(User, on_delete=models.CASCADE)

  def __str__(self):
    return str(self.score)
  
class Hard(models.Model):
  score = models.IntegerField(default=0)
  user = models.ForeignKey(User, on_delete=models.CASCADE)

  def __str__(self):
    return str(self.score)