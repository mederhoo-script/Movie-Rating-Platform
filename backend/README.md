# Movie Rating Platform - Backend

Django REST Framework API for the Movie Rating Platform.

## Features

- User registration and JWT authentication
- Movie CRUD operations (Create, Read, Update, Delete)
- Movie ratings with one rating per user per movie
- Update existing ratings
- Search and filter movies
- Pagination support
- Swagger/OpenAPI documentation

## Tech Stack

- Django 5.2.7
- Django REST Framework 3.16.1
- djangorestframework-simplejwt 5.5.1 (JWT authentication)
- drf-yasg 1.21.11 (Swagger/OpenAPI docs)
- SQLite (default) / PostgreSQL (optional)

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- pip

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create a superuser (optional, for admin access):
```bash
python manage.py createsuperuser
```

6. Start the development server:
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/`

## API Documentation

Once the server is running, you can access:
- Swagger UI: `http://localhost:8000/swagger/`
- ReDoc: `http://localhost:8000/redoc/`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register a new user
- `POST /api/auth/login/` - Login and get JWT tokens

### Movies
- `GET /api/movies/` - List all movies (with pagination, search, filtering)
- `POST /api/movies/` - Create a new movie (authenticated)
- `GET /api/movies/{id}/` - Get movie details
- `PUT /api/movies/{id}/` - Update a movie (authenticated, owner only)
- `DELETE /api/movies/{id}/` - Delete a movie (authenticated, owner only)

### Ratings
- `GET /api/movies/{id}/ratings/` - List all ratings for a movie
- `POST /api/movies/{id}/ratings/` - Create or update a rating (authenticated)
- `GET /api/users/{id}/ratings/` - List all ratings by a user

## Sample Credentials

For testing purposes, you can create users through the registration endpoint or use the Django admin interface.

Example registration:
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "securepass123",
  "password2": "securepass123"
}
```

## Running Tests

Run all tests:
```bash
python manage.py test
```

Run tests with verbose output:
```bash
python manage.py test --verbosity=2
```

## Database Configuration

### SQLite (Default)

The project uses SQLite by default. The database file will be created as `db.sqlite3` in the backend directory.

### PostgreSQL (Optional)

To use PostgreSQL:

1. Install psycopg2:
```bash
pip install psycopg2-binary
```

2. Update `movie_platform/settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'movie_rating_db',
        'USER': 'your_db_user',
        'PASSWORD': 'your_db_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

3. Run migrations:
```bash
python manage.py migrate
```

## Design Decisions

### Database Schema

**Movie Model:**
- title, description, release_year, genre, director
- Foreign key to User (created_by)
- Computed properties: average_rating, ratings_count

**Rating Model:**
- Foreign keys to Movie and User
- score (1-5 integer)
- comment (optional text)
- Unique constraint on (movie, user) to ensure one rating per user per movie

### Authentication

- JWT-based authentication using djangorestframework-simplejwt
- Access tokens expire after 1 hour
- Refresh tokens expire after 1 day
- Passwords are hashed using Django's default password hasher (PBKDF2)

### Permissions

- Anyone can view movies and ratings
- Only authenticated users can:
  - Create movies
  - Submit/update ratings
- Only movie creators can:
  - Update their movies
  - Delete their movies

### Rating Logic

The rating endpoint (`POST /api/movies/{id}/ratings/`) uses get_or_create to handle both creating new ratings and updating existing ones. If a user has already rated a movie, their rating is updated; otherwise, a new rating is created.

## Scalability Considerations

1. **Database Indexing:** Add indexes on frequently queried fields (title, genre, created_at)
2. **Caching:** Implement Redis caching for movie lists and details
3. **Pagination:** Built-in pagination limits response sizes
4. **Search Optimization:** Use PostgreSQL full-text search or Elasticsearch for advanced search
5. **Read Replicas:** Use database read replicas for read-heavy operations
6. **API Rate Limiting:** Implement rate limiting using DRF throttling
7. **Asynchronous Tasks:** Use Celery for background tasks (email notifications, etc.)
8. **CDN:** Serve static files and media through a CDN

## Security Notes

- Change the SECRET_KEY in production
- Set DEBUG=False in production
- Configure ALLOWED_HOSTS properly
- Use HTTPS in production
- Consider using environment variables for sensitive settings
- Implement proper CORS configuration for production
