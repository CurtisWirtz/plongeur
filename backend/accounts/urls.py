from django.urls import path
from . import views

urlpatterns = [
    path('user/', views.get_session_user, name='get_user'),
    path('honeypot/', views.get_honeypot, name="honeypot" ),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.logout_user, name='logout'),
    path('register/reserve-email/', views.ReserveEmailAPIView.as_view()),
]