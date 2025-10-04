from django.urls import path
from .views import (
    UserRegistrationView,
    UserLoginView,
    MovieListCreateView,
    MovieDetailView,
    MovieRatingListCreateView,
    UserRatingsView,
    IMDBSearchView,
)

urlpatterns = [
    # Auth endpoints
    path('auth/register/', UserRegistrationView.as_view(), name='register'),
    path('auth/login/', UserLoginView.as_view(), name='login'),
    
    # Movie endpoints
    path('movies/', MovieListCreateView.as_view(), name='movie-list'),
    path('movies/<int:pk>/', MovieDetailView.as_view(), name='movie-detail'),
    path('movies/search-imdb/', IMDBSearchView.as_view(), name='imdb-search'),
    
    # Rating endpoints
    path('movies/<int:movie_id>/ratings/', MovieRatingListCreateView.as_view(), name='movie-ratings'),
    path('users/<int:user_id>/ratings/', UserRatingsView.as_view(), name='user-ratings'),
]
