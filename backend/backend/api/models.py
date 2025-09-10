from django.db import models

class User(models.Model):

    ROLE_CHOICES = [
        ('citizen', 'Citizen'),
        ('district_leader', 'District Leader'),
    ]

    user_id = models.AutoField(primary_key=True)
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True,null=True)
    phone = models.CharField(max_length=15, unique=True,null=True)
    password = models.CharField(max_length=256)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    aadhar_number = models.CharField(max_length=12, unique=True, blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name