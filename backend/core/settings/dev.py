from .base import *
import os

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/6.0/howto/deployment/checklist/

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY")

DEBUG = os.environ.get("DJANGO_DEBUG", "1") == "1" # returning any string will return true, so you must check if the string value matches "1", which equates to True

ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS","localhost").split(",")

# Database
# https://docs.djangoproject.com/en/6.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.{}'.format(
#             os.getenv('DATABASE_ENGINE')
#         ),
#         'NAME': os.getenv('DATABASE_NAME'),
#         'USER': os.getenv('DATABASE_USERNAME'),
#         'PASSWORD': os.getenv('DATABASE_PASSWORD'),
#         'HOST': os.getenv('DATABASE_HOST'),
#         'PORT': os.getenv('DATABASE_PORT'),
#     }
# }

# Allows request that include HttpOnly cookies, Authorization: Bearer, credentials "include" in fetch
CORS_ALLOW_CREDENTIALS = True
# Allows Django to accept cookies + CSRF tokens
CSRF_TRUSTED_ORIGINS = os.environ.get('DJANGO_CSRF_TRUSTED_ORIGINS', 'http://localhost:5173').split(',')
# Allows JavaScript in the browser make requests to the Django API from another domain/port
CORS_ALLOWED_ORIGINS = os.environ.get('DJANGO_CORS_ALLOWED_ORIGINS', 'http://localhost:5173').split(',')

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

# Without these, the Django Admin area will have broken CSS
STATIC_URL = '/static/'
STATICFILES_DIRS = []
STATIC_ROOT = None

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / 'media'


# # Allow these addresses (Frontend) to talk to this Backend 
# CORS_ALLOWED_ORIGINS = ['*']

# # CRITICAL: Allow the browser to send cookies (we use sessions auth -> requires Session ID)
# CORS_ALLOWED_CREDENTIALS = True