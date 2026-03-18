from .base import *
import os

# See https://docs.djangoproject.com/en/6.0/howto/deployment/checklist/

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY")

DEBUG = os.environ.get("DJANGO_DEBUG", "False").lower() in ("1", "true", "yes") # DEBUG is always False in production

ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS").split(",")

# Database
# https://docs.djangoproject.com/en/6.0/ref/settings/#databases

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


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/6.0/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

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
CORS_ALLOWED_ORIGINS = os.environ.get('DJANGO_CORS_ALLOWED_ORIGINS').split(',')

# CSRF
# Allows Django to accept cookies + CSRF tokens
CSRF_TRUSTED_ORIGINS = os.environ.get('DJANGO_CSRF_TRUSTED_ORIGINS').split(',')
# This allows React to read the CSRF cookie so it can put it in the X-CSRFToken header
CSRF_COOKIE_HTTPONLY = False
# Ensure that the browser actually sends the cookie back to the API port
CSRF_COOKIE_SAMESITE = 'Lax'
# HTTPS only
CSRF_COOKIE_SECURE = True

# Sessions
# Ensure that the browser actually sends the cookie back to the API port
SESSION_COOKIE_SAMESITE = 'Lax'
# Blocks JavaScript - never touches session ID
SESSION_COOKIE_HTTPONLY = True
# HTTPS only
SESSION_COOKIE_SECURE = True