from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import Movie, Rating


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class RatingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Rating
        fields = ('id', 'movie', 'user', 'username', 'score', 'comment', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'username', 'created_at', 'updated_at')

    def validate_score(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Score must be between 1 and 5")
        return value


class MovieSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    average_rating = serializers.ReadOnlyField()
    ratings_count = serializers.ReadOnlyField()

    class Meta:
        model = Movie
        fields = ('id', 'title', 'description', 'release_year', 'genre', 'director',
                  'created_by', 'average_rating', 'ratings_count', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_by', 'created_at', 'updated_at')


class MovieDetailSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    average_rating = serializers.ReadOnlyField()
    ratings_count = serializers.ReadOnlyField()
    ratings = RatingSerializer(many=True, read_only=True)

    class Meta:
        model = Movie
        fields = ('id', 'title', 'description', 'release_year', 'genre', 'director',
                  'created_by', 'average_rating', 'ratings_count', 'ratings', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_by', 'created_at', 'updated_at')
