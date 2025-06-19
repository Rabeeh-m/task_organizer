from django.urls import path
from . import views

urlpatterns = [
    path('', views.login_page, name='login_page'),
    path('register/', views.register_page, name='register_page'),
    path('register/submit/', views.register, name='register'),
    path('otp-verify/', views.otp_verify_page, name='otp_verify'),
    path('otp-verify/submit/', views.verify_otp, name='verify_otp'),
    path('login/', views.login_user, name='login_user'),
    path('logout/', views.logout_user, name='logout_user'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('task-form/', views.task_form, name='task_form'),
]