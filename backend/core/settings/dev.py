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


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/6.0/howto/static-files/

# Specifically... without these, the Django Admin area's CSS will be broken
STATIC_URL = '/static/'
STATICFILES_DIRS = []
STATIC_ROOT = None

# User uploaded static files
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / 'media'


# Security settings for decoupled session based auth:
# Flow: Django sends a cookie to the browser. React looks at that cookie, copies the value, and sends it back in the X-CSRFToken header.

# Keep the CSRF logic and Session logic independent
CSRF_USE_SESSIONS = False

# CORS
# Allows the browser to send/receive cookies (we need Session ID)
CORS_ALLOW_CREDENTIALS = True
# Allows JavaScript in the browser make requests to the Django API from another domain/port
CORS_ALLOWED_ORIGINS = os.environ.get('DJANGO_CORS_ALLOWED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173').split(',')

# CSRF
# Allows Django to accept cookies + CSRF tokens
CSRF_TRUSTED_ORIGINS = os.environ.get('DJANGO_CSRF_TRUSTED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173').split(',')
# This allows React to read the CSRF cookie so it can put it in the X-CSRFToken header
CSRF_COOKIE_HTTPONLY = False
# Ensure that the browser actually sends the cookie back to the API port
CSRF_COOKIE_SAMESITE = 'Lax'
# HTTPS only? True in production
CSRF_COOKIE_SECURE = not DEBUG

# Sessions
# Ensure that the browser actually sends the cookie back to the API port
SESSION_COOKIE_SAMESITE = 'Lax'
# Blocks JavaScript - never touches session ID
SESSION_COOKIE_HTTPONLY = True
# HTTPS only? True in production
SESSION_COOKIE_SECURE = not DEBUG