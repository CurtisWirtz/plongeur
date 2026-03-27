from django.urls import path
from . import views

urlpatterns = [
    path('user/', views.get_session_user, name='get_user'),
    # path('register/', views.register, name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    # path('logout/', views.logout, name='logout'),
]