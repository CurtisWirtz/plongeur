from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import CustomUserManager
import secrets
from django.utils import timezone
from datetime import timedelta

# Users first register by entering an email, then must verfiy via OTP email link.
class UnverifiedUser(models.Model):
    # Calling a function generates a new token for every call. Unless the server had restarted, secrets.token_hex() would use the same OTP 
    def generate_OTP():
        return secrets.token_hex(3)

    # Email is required, so it cannot be blank or null (null could allow multiple accounts to have null since in the DB null != null)
    email = models.EmailField(unique=True, blank=False, null=False)
    OTP = models.CharField(max_length=6, default=generate_OTP)
    created_at = models.DateTimeField(auto_now_add=True)

    # email will be reserved for 24 hours, then expires
    @property
    def is_expired(self):
        """Returns True if the record is older than 24 hours"""
        return timezone.now() > (self.created_at + timedelta(days=1))

    class Meta:
        verbose_name = "Unverified User"
        verbose_name_plural = "Unverified Users"

    def __str__(self):
        return self.email

class User(AbstractUser):
    # Overwrite email to be unique and never be stored as null or a blank string
    email = models.EmailField(unique=True, blank=False, null=False) # field auto-includes regex to test against email formatting; forced to contain an '@' and a '.'
    # Overwrite username to be optional
    username = models.CharField(max_length=150, unique=True, blank=True, null=True)

    # Additional user fields
    phone_number = models.CharField(max_length=150, blank=True, null=True)

    # Use email instead of username (which is required for registration - we're basically doing away with username)
    USERNAME_FIELD = "email"
    # Require email for superusers.
    REQUIRED_FIELDS = []

    # The ORM uses our custom manager for User.objects
    objects = CustomUserManager()

    def __str__(self):
        return self.email