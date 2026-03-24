from django.contrib import admin
from django.urls import path, include

api_patterns = [
    path('accounts/', include('accounts.urls')),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(api_patterns)), # prefixes all paths with /api
]