from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, full_name, password=None, **extra_fields):
        if not full_name:
            raise ValueError("The Full Name must be set")
        user = self.model(full_name=full_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, full_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(full_name, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('citizen', 'Citizen'),
        ('district_leader', 'District Leader'),
    ]

    full_name = models.CharField(max_length=100, unique=True)  # login field
    email = models.EmailField(unique=True, null=True, blank=True)
    phone = models.CharField(max_length=15, unique=True, null=True, blank=True)
    aadhar_number = models.CharField(max_length=12, unique=True, null=True, blank=True)

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    is_verified = models.BooleanField(default=False)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'full_name'   # 👈 Login with full_name
    REQUIRED_FIELDS = []           # Email optional

    objects = UserManager()

    def __str__(self):
        return self.full_name
