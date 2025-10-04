from rest_framework import generics, status, permissions, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from .models import Movie, Rating
from .serializers import (
    UserRegistrationSerializer,
    UserSerializer,
    MovieSerializer,
    MovieDetailSerializer,
    RatingSerializer
)


class UserRegistrationView(generics.CreateAPIView):
    """
    User registration endpoint
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class UserLoginView(APIView):
    """
    User login endpoint
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'error': 'Please provide both username and password'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)

        if not user:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })


class MovieListCreateView(generics.ListCreateAPIView):
    """
    List all movies or create a new movie
    """
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'genre', 'director']
    ordering_fields = ['created_at', 'release_year', 'title']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class MovieDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a movie
    """
    queryset = Movie.objects.all()
    serializer_class = MovieDetailSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_update(self, serializer):
        # Only the creator can update
        if serializer.instance.created_by != self.request.user:
            raise permissions.PermissionDenied("You can only update your own movies")
        serializer.save()

    def perform_destroy(self, instance):
        # Only the creator can delete
        if instance.created_by != self.request.user:
            raise permissions.PermissionDenied("You can only delete your own movies")
        instance.delete()


class MovieRatingListCreateView(APIView):
    """
    List all ratings for a movie or create/update a rating
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, movie_id):
        movie = get_object_or_404(Movie, pk=movie_id)
        ratings = Rating.objects.filter(movie=movie)
        serializer = RatingSerializer(ratings, many=True)
        return Response(serializer.data)

    def post(self, request, movie_id):
        movie = get_object_or_404(Movie, pk=movie_id)

        # Check if user already rated this movie
        rating, created = Rating.objects.get_or_create(
            movie=movie,
            user=request.user,
            defaults={
                'score': request.data.get('score'),
                'comment': request.data.get('comment', '')
            }
        )

        if not created:
            # Update existing rating
            serializer = RatingSerializer(rating, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Validate and return new rating
            serializer = RatingSerializer(rating)
            return Response(serializer.data, status=status.HTTP_201_CREATED)


class UserRatingsView(generics.ListAPIView):
    """
    List all ratings by a specific user
    """
    serializer_class = RatingSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Rating.objects.filter(user_id=user_id)

