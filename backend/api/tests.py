from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import Movie, Rating


class UserAuthenticationTestCase(APITestCase):
    """Test user registration and login"""

    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/auth/register/'
        self.login_url = '/api/auth/login/'

    def test_user_registration(self):
        """Test user can register with valid credentials"""
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'password2': 'testpass123'
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('user', response.data)
        self.assertIn('tokens', response.data)
        self.assertEqual(response.data['user']['username'], 'testuser')

    def test_user_registration_password_mismatch(self):
        """Test registration fails with mismatched passwords"""
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'password2': 'differentpass'
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login(self):
        """Test user can login with valid credentials"""
        # First create a user
        user = User.objects.create_user(username='testuser', password='testpass123')

        # Try to login
        data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('tokens', response.data)
        self.assertIn('user', response.data)

    def test_user_login_invalid_credentials(self):
        """Test login fails with invalid credentials"""
        data = {
            'username': 'testuser',
            'password': 'wrongpassword'
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class MovieTestCase(APITestCase):
    """Test movie CRUD operations"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.movies_url = '/api/movies/'

    def test_create_movie_authenticated(self):
        """Test authenticated user can create a movie"""
        self.client.force_authenticate(user=self.user)
        data = {
            'title': 'Test Movie',
            'description': 'A test movie description',
            'release_year': 2023,
            'genre': 'Action',
            'director': 'Test Director'
        }
        response = self.client.post(self.movies_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'Test Movie')

    def test_create_movie_unauthenticated(self):
        """Test unauthenticated user cannot create a movie"""
        data = {
            'title': 'Test Movie',
            'description': 'A test movie description',
            'release_year': 2023,
            'genre': 'Action',
            'director': 'Test Director'
        }
        response = self.client.post(self.movies_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_movies(self):
        """Test anyone can list movies"""
        Movie.objects.create(
            title='Test Movie',
            description='Description',
            release_year=2023,
            genre='Action',
            director='Director',
            created_by=self.user
        )
        response = self.client.get(self.movies_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_get_movie_detail(self):
        """Test anyone can view movie details"""
        movie = Movie.objects.create(
            title='Test Movie',
            description='Description',
            release_year=2023,
            genre='Action',
            director='Director',
            created_by=self.user
        )
        response = self.client.get(f'/api/movies/{movie.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Movie')


class RatingTestCase(APITestCase):
    """Test rating operations"""

    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='user1', password='pass123')
        self.user2 = User.objects.create_user(username='user2', password='pass123')
        self.movie = Movie.objects.create(
            title='Test Movie',
            description='Description',
            release_year=2023,
            genre='Action',
            director='Director',
            created_by=self.user1
        )
        self.rating_url = f'/api/movies/{self.movie.id}/ratings/'

    def test_create_rating_authenticated(self):
        """Test authenticated user can rate a movie"""
        self.client.force_authenticate(user=self.user1)
        data = {
            'score': 5,
            'comment': 'Great movie!'
        }
        response = self.client.post(self.rating_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['score'], 5)

    def test_create_rating_unauthenticated(self):
        """Test unauthenticated user cannot rate a movie"""
        data = {
            'score': 5,
            'comment': 'Great movie!'
        }
        response = self.client.post(self.rating_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_rating(self):
        """Test user can update their own rating"""
        self.client.force_authenticate(user=self.user1)

        # Create initial rating
        data = {
            'score': 3,
            'comment': 'OK movie'
        }
        response = self.client.post(self.rating_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Update rating
        data = {
            'score': 5,
            'comment': 'Actually great!'
        }
        response = self.client.post(self.rating_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['score'], 5)

    def test_one_rating_per_user_per_movie(self):
        """Test user can only have one rating per movie"""
        self.client.force_authenticate(user=self.user1)

        # Create rating
        Rating.objects.create(movie=self.movie, user=self.user1, score=3)

        # Try to create another rating - should update instead
        data = {
            'score': 5,
            'comment': 'Updated rating'
        }
        response = self.client.post(self.rating_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify only one rating exists
        ratings_count = Rating.objects.filter(movie=self.movie, user=self.user1).count()
        self.assertEqual(ratings_count, 1)

    def test_list_movie_ratings(self):
        """Test anyone can list movie ratings"""
        Rating.objects.create(movie=self.movie, user=self.user1, score=5)
        Rating.objects.create(movie=self.movie, user=self.user2, score=4)

        response = self.client.get(self.rating_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_list_user_ratings(self):
        """Test anyone can list a user's ratings"""
        Rating.objects.create(movie=self.movie, user=self.user1, score=5)

        response = self.client.get(f'/api/users/{self.user1.id}/ratings/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check if response is paginated
        if 'results' in response.data:
            self.assertEqual(len(response.data['results']), 1)
        else:
            self.assertEqual(len(response.data), 1)

