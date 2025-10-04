# Movie Rating Platform

A full-stack web application for rating and reviewing movies. Users can browse movies, submit ratings, and add new movies to the platform.

## 🎬 Features

### Backend (Django REST API)
- User registration and JWT-based authentication
- Complete CRUD operations for movies
- One rating per user per movie (with update capability)
- RESTful API with proper HTTP status codes
- Comprehensive input validation
- Swagger/OpenAPI documentation
- SQLite database (with PostgreSQL support)
- Complete test suite
- **IMDB API integration** for external movie search

### Frontend (React SPA)
- User registration and login
- Browse movies with search, filter, and pagination
- View detailed movie information with ratings
- Submit and update ratings
- Add new movies (authenticated users only)
- Responsive design
- Secure JWT token management
- Component testing
- **Dark/Light/System theme switcher** with localStorage persistence
- **Combined search**: Searches local database first, falls back to IMDB API if no results
- Accessible focus states and high contrast design

## 📁 Project Structure

```
Movie-Rating-Platform/
├── backend/              # Django REST Framework API
│   ├── api/             # Main API app
│   ├── movie_platform/  # Django project settings
│   ├── manage.py
│   ├── requirements.txt
│   └── README.md
├── frontend/            # React SPA
│   ├── public/
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── context/    # State management
│   │   ├── pages/      # Page components
│   │   └── services/   # API layer
│   ├── package.json
│   └── README.md
└── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites

- **Backend:** Python 3.8+, pip
- **Frontend:** Node.js 14+, npm

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. (Optional) Set up environment variables for IMDB search:
```bash
export OMDB_API_KEY="your_omdb_api_key_here"  # Get free key from http://www.omdbapi.com/
```

5. Run migrations:
```bash
python manage.py migrate
```

6. (Optional) Create a superuser for admin access:
```bash
python manage.py createsuperuser
```

7. Start the development server:
```bash
python manage.py runserver
```

Backend will be available at `http://localhost:8000/`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm start
```

Frontend will be available at `http://localhost:3000/`

## 🧪 Running Tests

### Backend Tests
```bash
cd backend
python manage.py test
```

Run with verbose output:
```bash
python manage.py test --verbosity=2
```

### Frontend Tests
```bash
cd frontend
npm test
```

Run in CI mode:
```bash
CI=true npm test
```

## 📚 API Documentation

Once the backend server is running, you can access:

- **Swagger UI:** http://localhost:8000/swagger/
- **ReDoc:** http://localhost:8000/redoc/

### Key Endpoints

#### Authentication
- `POST /api/auth/register/` - Register a new user
- `POST /api/auth/login/` - Login and receive JWT tokens

#### Movies
- `GET /api/movies/` - List all movies (with search/pagination)
- `POST /api/movies/` - Create a new movie (authenticated)
- `GET /api/movies/{id}/` - Get movie details
- `PUT /api/movies/{id}/` - Update a movie (owner only)
- `DELETE /api/movies/{id}/` - Delete a movie (owner only)

#### Ratings
- `GET /api/movies/{id}/ratings/` - List all ratings for a movie
- `POST /api/movies/{id}/ratings/` - Create or update a rating (authenticated)
- `GET /api/users/{id}/ratings/` - List all ratings by a user

## 🎭 Demo Instructions

### 1. Register a New User

**Via Frontend:**
1. Open http://localhost:3000/
2. Click "Register" in the navigation
3. Fill in username, email, and password
4. Click "Register" button

**Via API:**
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "demouser",
    "email": "demo@example.com",
    "password": "SecurePass123",
    "password2": "SecurePass123"
  }'
```

### 2. Login

**Via Frontend:**
1. Click "Login" in navigation
2. Enter your username and password
3. Click "Login" button

**Via API:**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "demouser",
    "password": "SecurePass123"
  }'
```

Save the access token from the response.

### 3. Add a Movie

**Via Frontend:**
1. After logging in, click "Add Movie"
2. Fill in movie details:
   - Title: "The Shawshank Redemption"
   - Description: "Two imprisoned men bond over a number of years..."
   - Release Year: 1994
   - Genre: "Drama"
   - Director: "Frank Darabont"
3. Click "Create Movie"

**Via API:**
```bash
curl -X POST http://localhost:8000/api/movies/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "The Shawshank Redemption",
    "description": "Two imprisoned men bond over a number of years...",
    "release_year": 1994,
    "genre": "Drama",
    "director": "Frank Darabont"
  }'
```

### 4. Browse Movies

**Via Frontend:**
1. The home page shows all movies
2. Use the search bar to filter by title, genre, or director
3. Click "View Details" on any movie to see more information

**Via API:**
```bash
# List all movies
curl http://localhost:8000/api/movies/

# Search movies
curl "http://localhost:8000/api/movies/?search=shawshank"

# Get movie details
curl http://localhost:8000/api/movies/1/
```

### 5. Rate a Movie

**Via Frontend:**
1. Click on a movie to view its details
2. Scroll down to the rating form
3. Select a score (1-5) and optionally add a comment
4. Click "Submit Rating"
5. To update, simply submit a new rating for the same movie

**Via API:**
```bash
curl -X POST http://localhost:8000/api/movies/1/ratings/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "score": 5,
    "comment": "Excellent movie! A masterpiece."
  }'
```

### Sample Test Credentials

For quick testing, you can create users with these credentials:

| Username | Password | Email |
|----------|----------|-------|
| testuser1 | TestPass123 | test1@example.com |
| testuser2 | TestPass123 | test2@example.com |

## 🏗️ Design Decisions

### Technology Stack

#### Backend: Django REST Framework
**Why Django?**
- Robust ORM for database interactions
- Built-in admin interface for data management
- Excellent security features (CSRF, XSS protection)
- Large ecosystem and community support
- Fast development with "batteries included" approach

**Why Django REST Framework?**
- Powerful serialization
- Built-in authentication/permissions
- Browsable API for development
- Excellent documentation
- Easy integration with swagger/OpenAPI

#### Frontend: React
**Why React?**
- Component-based architecture
- Large ecosystem and community
- Excellent performance with Virtual DOM
- Strong tooling (Create React App, React DevTools)
- Industry standard for SPAs

**Why React Router?**
- Standard routing solution for React
- Declarative routing
- Dynamic route matching
- Easy nested routes

**Why Axios?**
- Promise-based HTTP client
- Interceptors for request/response handling
- Automatic JSON transformation
- Better error handling than fetch

### Database Schema

#### User Model (Django built-in)
- username (unique)
- email
- password (hashed)

#### Movie Model
```python
- id (primary key)
- title
- description
- release_year
- genre
- director
- created_by (foreign key to User)
- created_at
- updated_at
```

**Design Rationale:**
- Simple, normalized structure
- created_by tracks movie ownership
- Timestamps for audit trail
- Generic genre field (could be extended to M2M relationship for multiple genres)

#### Rating Model
```python
- id (primary key)
- movie (foreign key to Movie)
- user (foreign key to User)
- score (1-5 integer)
- comment (optional text)
- created_at
- updated_at
- unique constraint on (movie, user)
```

**Design Rationale:**
- Unique constraint ensures one rating per user per movie
- Score validation (1-5) at model level
- Optional comment for detailed feedback
- Timestamps track creation and updates
- Cascading deletes maintain referential integrity

### Authentication & Security

#### JWT (JSON Web Tokens)
**Implementation:**
- Access tokens (1 hour lifetime)
- Refresh tokens (1 day lifetime)
- Tokens stored in localStorage (frontend)
- Bearer token authentication

**Why JWT?**
- Stateless authentication
- Scalable across multiple servers
- Self-contained (includes user info)
- Industry standard

**Security Considerations:**
- Passwords hashed with PBKDF2 (Django default)
- CORS configured for development
- Input validation on all endpoints
- Protected routes require authentication
- Authorization checks (users can only update/delete their own content)

**Production Recommendations:**
- Use httpOnly cookies instead of localStorage
- Implement token refresh mechanism
- Add rate limiting
- Use HTTPS only
- Set proper CORS origins
- Implement CSRF protection for cookie-based auth

### State Management

#### Context API
**Why Context API?**
- Built into React (no additional dependencies)
- Sufficient for authentication state
- Easy to understand and maintain
- Avoids prop drilling
- Perfect for small to medium apps

**Implementation:**
- AuthContext manages user state and auth methods
- Provides: user, login, logout, register, isAuthenticated
- Persists auth state to localStorage
- Checks auth state on app mount

**When to consider Redux/Zustand:**
- More complex state needs
- Many interconnected state updates
- Time-travel debugging required
- Team prefers Redux patterns

### API Design

#### RESTful Principles
- Resource-based URLs (`/api/movies/`, `/api/movies/{id}/`)
- HTTP methods for operations (GET, POST, PUT, DELETE)
- Proper status codes (200, 201, 400, 401, 404, etc.)
- JSON request/response format
- Pagination for list endpoints

#### Rating Update Logic
The rating endpoint uses `get_or_create` to handle both creation and updates:
```python
rating, created = Rating.objects.get_or_create(
    movie=movie,
    user=request.user,
    defaults={'score': score, 'comment': comment}
)
if not created:
    # Update existing rating
```

This provides a better user experience than requiring separate endpoints.

## 📈 Scalability Considerations

### Backend Scalability

1. **Database Optimization**
   - Add indexes on frequently queried fields (title, genre, created_at)
   - Use select_related/prefetch_related to reduce queries
   - Consider read replicas for read-heavy workloads
   - Migrate to PostgreSQL for better performance and features

2. **Caching**
   - Implement Redis for caching movie lists and details
   - Cache computed properties (average_rating, ratings_count)
   - Use Django cache framework with Redis backend
   - Set appropriate cache expiration times

3. **API Performance**
   - Implement pagination (already done)
   - Add filtering and sorting options
   - Consider GraphQL for flexible queries
   - Use API throttling to prevent abuse

4. **Search Optimization**
   - Implement PostgreSQL full-text search
   - Or use Elasticsearch for advanced search
   - Add search result caching
   - Consider search result ranking

5. **Horizontal Scaling**
   - Stateless JWT auth enables easy horizontal scaling
   - Use load balancer (nginx, AWS ELB)
   - Deploy multiple backend instances
   - Share cache layer (Redis) across instances

6. **Background Tasks**
   - Use Celery for async tasks
   - Email notifications
   - Rating aggregation calculations
   - Data exports

### Frontend Scalability

1. **Code Splitting**
   - Use React.lazy() for route-based splitting
   - Reduce initial bundle size
   - Faster first page load

2. **Performance Optimization**
   - Implement React.memo for expensive components
   - Use useMemo/useCallback to prevent unnecessary re-renders
   - Optimize images (lazy loading, WebP format)
   - Implement virtual scrolling for long lists

3. **State Management**
   - Consider React Query or SWR for data fetching
   - Automatic caching and revalidation
   - Optimistic updates for better UX
   - Background refetching

4. **CDN & Asset Optimization**
   - Deploy static assets to CDN
   - Enable compression (gzip/brotli)
   - Implement service workers for offline support
   - Use Next.js for SSR/SSG if SEO is important

5. **Monitoring & Analytics**
   - Add error tracking (Sentry)
   - Performance monitoring (Lighthouse)
   - User analytics (Google Analytics)
   - A/B testing framework

### Infrastructure

1. **Containerization**
   - Docker for consistent environments
   - Docker Compose for local development
   - Kubernetes for orchestration

2. **CI/CD**
   - Automated testing on PR
   - Automated deployment
   - Blue-green deployments
   - Rollback capability

3. **Database**
   - Regular backups
   - Point-in-time recovery
   - Connection pooling (PgBouncer)
   - Database monitoring

4. **Security**
   - Regular dependency updates
   - Security scanning (Snyk, Dependabot)
   - Web Application Firewall (WAF)
   - DDoS protection

## 🔧 Production Deployment

### Backend Deployment

1. **Environment Variables**
   ```bash
   SECRET_KEY=your-secret-key
   DEBUG=False
   ALLOWED_HOSTS=your-domain.com
   DATABASE_URL=postgres://...
   ```

2. **Static Files**
   ```bash
   python manage.py collectstatic
   ```

3. **Use Production Server**
   - Gunicorn or uWSGI
   - Behind nginx reverse proxy
   - Serve static files with nginx

4. **Database**
   - Use PostgreSQL in production
   - Set up regular backups
   - Configure connection pooling

### Frontend Deployment

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Deploy Options**
   - Netlify (easiest)
   - Vercel
   - AWS S3 + CloudFront
   - nginx static hosting

3. **Environment Variables**
   - Update REACT_APP_API_URL to production API
   - Remove console.log statements
   - Enable production optimizations

## 🎨 New Features Guide

### Theme Switcher

The application now includes a comprehensive theme system with Dark, Light, and System modes.

**Features:**
- **Dark Mode** is set as the default theme
- Theme selector accessible from the navigation bar (top-right)
- Three theme options:
  - 🌙 **Dark**: Dark theme with high contrast
  - ☀️ **Light**: Traditional light theme
  - 💻 **System**: Automatically syncs with your operating system's theme preference
- Theme preference is persisted in localStorage and survives page refreshes
- Smooth transitions between themes
- All components and pages are theme-aware
- Accessible focus states with high contrast

**How to Use:**
1. Click the theme toggle button in the navigation bar
2. Select your preferred theme from the dropdown
3. Your choice is automatically saved

**For Developers:**
- Theme is managed via React Context (`ThemeContext`)
- CSS variables are used for all colors, enabling easy theme switching
- Add new themed components by using CSS variables:
  ```css
  .my-component {
    background-color: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
  }
  ```

### Combined Search (DB + IMDB)

The movie search now intelligently searches both your local database and IMDB.

**How It Works:**
1. **Primary Search**: When you search for a movie, the system first queries your local database
2. **Fallback to IMDB**: If no local results are found, it automatically searches IMDB's database
3. **Visual Indicators**: IMDB results are clearly marked with a gold "IMDB" badge
4. **Distinctive Styling**: IMDB movies have a gold border to distinguish them from local movies

**Features:**
- Seamless search experience across two data sources
- Results include movie poster, title, year, genre, director, and description
- IMDB movies show their IMDB rating
- No need to manually switch between databases

**Setting Up IMDB Search:**

To enable IMDB search, you need an OMDb API key:

1. Visit [http://www.omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx)
2. Sign up for a free API key (free tier allows 1,000 requests per day)
3. Set the environment variable:
   ```bash
   # Linux/Mac
   export OMDB_API_KEY="your_api_key_here"
   
   # Windows
   set OMDB_API_KEY=your_api_key_here
   ```
4. Restart your Django server

**Note:** Without an API key, the search will still work but will only search your local database.

**API Endpoint:**
```bash
GET /api/movies/search-imdb/?query=inception
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run the test suite
6. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Authors

- Built as a demonstration of full-stack development capabilities

## 🙏 Acknowledgments

- Django REST Framework documentation
- React documentation
- Create React App team
- Open source community
