from django.db import models
from django.contrib.auth.models import User

class Game(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Score(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    date = models.DateTimeField(auto_now_add=True)
    score_achieved = models.DateField(null=True)

    def __str__(self):
        return f"{self.user.username} - {self.game.name} - {self.score}"

