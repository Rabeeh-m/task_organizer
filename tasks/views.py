from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from django.utils.crypto import get_random_string
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from .models import User, Task
from .serializers import TaskSerializer, UserSerializer
import datetime
import re

# Custom pagination class for tasks
class TaskPagination(PageNumberPagination):
    page_size = 3


# Rendering the registration page
def register_page(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    return render(request, 'register.html')

# Handling user registration and sending OTP
def register(request):
    if request.method == 'POST':
        username = request.POST['username'].strip()
        email = request.POST['email'].strip()
        password = request.POST['password']
        confirm_password = request.POST['confirm_password']
        
        # Backend validation
        if len(username) < 3:
            messages.error(request, 'Username must be at least 3 characters long')
            return redirect('register_page')
        
        email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        if not re.match(email_regex, email):
            messages.error(request, 'Please enter a valid email address')
            return redirect('register_page')
        
        if len(password) < 6:
            messages.error(request, 'Password must be at least 6 characters long')
            return redirect('register_page')
        
        if password != confirm_password:
            messages.error(request, 'Passwords do not match')
            return redirect('register_page')
        
        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already exists')
            return redirect('register_page')
        
        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists')
            return redirect('register_page')
        
        user = User.objects.create_user(username=username, email=email, password=password, is_verified=False)
        otp = get_random_string(length=6, allowed_chars='1234567890')
        request.session['otp'] = otp
        request.session['user_id'] = user.id
        
        send_mail(
            'Your OTP for Task Organizer',
            f'Your OTP is {otp}',
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )
        return redirect('otp_verify')
    return redirect('register_page')

# Rendering the OTP login page
def otp_login_page(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    return render(request, 'otp_login.html')

# Handling OTP login email submission
def otp_login(request):
    if request.method == 'POST':
        email = request.POST['email']
        try:
            user = User.objects.get(email=email)
            if not user.is_verified:
                messages.error(request, 'Account is not verified. Please verify your account.')
                return redirect('otp_login_page')
            otp = get_random_string(length=6, allowed_chars='1234567890')
            request.session['otp'] = otp
            request.session['user_id'] = user.id
            request.session['otp_type'] = 'login'
            
            send_mail(
                'Your OTP for Task Organizer Login',
                f'Your OTP is {otp}',
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )
            return redirect('otp_verify')
        except User.DoesNotExist:
            messages.error(request, 'User with this email does not exist.')
            return redirect('otp_login_page')
    return redirect('otp_login_page')

# Rendering the OTP verification page
def otp_verify_page(request):
    return render(request, 'otp_verify.html')

# Verifying OTP and activating user
def verify_otp(request):
    if request.method == 'POST':
        otp = request.POST['otp']
        if otp == request.session.get('otp'):
            user_id = request.session.get('user_id')
            user = User.objects.get(id=user_id)
            user.is_verified = True
            user.save()
            login(request, user)
            messages.success(request, 'Registration successful!')
            del request.session['otp']
            del request.session['user_id']
            return redirect('dashboard')
        else:
            messages.error(request, 'Invalid OTP')
            return redirect('otp_verify')
    return redirect('otp_verify')

# Rendering the login page
def login_page(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    return render(request, 'login.html')

# Handling user login
def login_user(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        try:
            user = User.objects.get(email=email)
            user = authenticate(request, username=user.username, password=password)
            if user is not None and user.is_verified:
                login(request, user)
                return redirect('dashboard')
            else:
                messages.error(request, 'Invalid credentials or unverified account')
                return redirect('login_page')
        except User.DoesNotExist:
            messages.error(request, 'User with this email does not exist')
            return redirect('login_page')
    return redirect('login_page')

# Handling user logout
def logout_user(request):
    logout(request)
    return redirect('login_page')

# Rendering the dashboard with task list and calendar
def dashboard(request):
    if not request.user.is_authenticated:
        return redirect('login_page')
    return render(request, 'dashboard.html')

# Rendering the task creation/edit form
def task_form(request):
    if not request.user.is_authenticated:
        return redirect('login_page')
    return render(request, 'task_form.html')

# API viewset for task CRUD operations
class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = TaskPagination

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)