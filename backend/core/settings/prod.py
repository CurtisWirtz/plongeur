from .base import *
import os

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY")

DEBUG = os.environ.get("DJANGO_DEBUG", "False").lower() in ("1", "true", "yes") # DEBUG is always False in production

ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS").split(",")

# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.{}'.format(
            os.getenv('DATABASE_ENGINE')
        ),
        'NAME': os.getenv('DATABASE_NAME'),
        'USER': os.getenv('DATABASE_USERNAME'),
        'PASSWORD': os.getenv('DATABASE_PASSWORD'),
        'HOST': os.getenv('DATABASE_HOST'),
        'PORT': os.getenv('DATABASE_PORT'),
    }
}

# Allows request that include HttpOnly cookies, Authorization: Bearer, credentials "include" in fetch
CORS_ALLOW_CREDENTIALS = True
# Allows Django to accept cookies + CSRF tokens
CSRF_TRUSTED_ORIGINS = os.environ.get('DJANGO_CSRF_TRUSTED_ORIGINS').split(',')
# Allows JavaScript in the browser make requests to the Django API from another domain/port
CORS_ALLOWED_ORIGINS = os.environ.get('DJANGO_CORS_ALLOWED_ORIGINS').split(',')

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / 'media'