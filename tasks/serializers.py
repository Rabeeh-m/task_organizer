
from rest_framework import serializers
from .models import Task, User
from django.utils import timezone

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'due_date', 'completed', 'created_at', 'updated_at']

    def validate_title(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError('Title must be at least 3 characters long')
        return value

    def validate_due_date(self, value):
        if value < timezone.now():
            raise serializers.ValidationError('Due date cannot be in the past')
        return value

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']