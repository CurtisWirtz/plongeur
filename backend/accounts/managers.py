from django.contrib.auth.base_user import BaseUserManager

# With Django ORM, User.objects is the manager
# The default manager with AbstractUser has this function: create_user(username, email=None, password=None, **extra_fields)
# Since we're requiring email instead of a username, we need to address 'username' being a positional argument in that function

# without this, user creation and createsuperuser would fail, due to the expectation of a username

class CustomUserManager(BaseUserManager):
    # Overwrite the user creation functions to expect an email, but not a username
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email must be set")
        email = email.strip().lower() # Force everything to lowercase - technically against RFC 5321 email standards, but 99% of email platforms use this - anything left of @ is NOT case sensitive
        # email = self.normalize_email(email) # Would turn Test@TEST.Com --> Test@test.com - adheres to RFC 5321, but anything left of the @ is case-sensitive. So Test@test.com would be different than test@test.com
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        
        # We don't need to pass 'username', email is taken in its' place in requirements
        return self.create_user(email, password, **extra_fields)