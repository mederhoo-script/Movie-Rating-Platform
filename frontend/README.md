# Movie Rating Platform - Frontend

React SPA (Single Page Application) for the Movie Rating Platform.

## Features

- User registration and login
- Browse movies with search and pagination
- View movie details with ratings
- Submit and update ratings (authenticated users)
- Add new movies (authenticated users)
- Responsive design

## Tech Stack

- React 18
- React Router DOM v6 (for navigation)
- Axios (for API calls)
- Context API (for state management)
- React Testing Library (for component testing)

## Setup Instructions

### Prerequisites

- Node.js 14 or higher
- npm or yarn

### Installation

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

4. Update the `.env` file with your backend API URL (default is `http://localhost:8000/api`)

5. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000/`

## Available Scripts

### `npm start`

Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run eject`

**Note: this is a one-way operation. Once you eject, you can't go back!**

## Project Structure

```
frontend/
├── public/           # Static files
├── src/
│   ├── components/   # Reusable components
│   │   └── Navbar.js
│   ├── context/      # React Context for state management
│   │   └── AuthContext.js
│   ├── pages/        # Page components
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── MovieList.js
│   │   ├── MovieDetail.js
│   │   └── AddMovie.js
│   ├── services/     # API service layer
│   │   └── api.js
│   ├── App.js        # Main app component
│   ├── App.css       # Global styles
│   └── index.js      # Entry point
└── package.json
```

## Design Decisions

### State Management

The application uses React Context API for state management, specifically for authentication state. This approach was chosen because:

1. **Simplicity**: Context API is built into React, no additional dependencies needed
2. **Sufficient for this scale**: The app has relatively simple state management needs
3. **Easy to understand**: Straightforward implementation for authentication flow
4. **No over-engineering**: Avoids complexity of Redux for a small-to-medium app

For larger applications with more complex state, consider migrating to Redux or Zustand.

### JWT Storage

JWT tokens are stored in **localStorage** for this implementation:

**Pros:**
- Simple to implement
- Tokens persist across browser sessions
- Easy to access from any component

**Cons:**
- Vulnerable to XSS attacks
- Not as secure as httpOnly cookies

**Alternative (More Secure):**
For production applications, consider using httpOnly cookies:
1. Backend sets JWT in httpOnly cookie
2. Browser automatically sends cookie with requests
3. JavaScript cannot access the cookie (prevents XSS)
4. Requires backend configuration for cookie handling

To implement httpOnly cookies:
- Backend: Set cookies in response headers
- Frontend: Use `credentials: 'include'` in axios config
- Remove localStorage token storage

### Authentication Flow

1. User registers/logs in → receives JWT tokens
2. Access token stored in localStorage
3. Axios interceptor adds token to all API requests
4. AuthContext provides authentication state globally
5. Protected routes check authentication before rendering

### Component Architecture

- **Functional Components**: All components use React hooks
- **Custom Hooks**: `useAuth` hook for easy access to auth context
- **Component Composition**: Navbar, pages, and reusable elements
- **Single Responsibility**: Each component has a clear, focused purpose

### API Layer

The `services/api.js` file centralizes all API calls:
- Consistent error handling
- Token injection via interceptors
- Easy to mock for testing
- Clear service boundaries (auth, movies, ratings)

## Testing

The application includes component tests using React Testing Library:

```bash
npm test
```

Current test coverage includes:
- Navbar component rendering
- Authentication state display
- Navigation links

To add more tests, create `.test.js` files next to components.

## Environment Variables

- `REACT_APP_API_URL`: Backend API base URL (default: http://localhost:8000/api)

## Building for Production

1. Update environment variables for production
2. Build the app:
```bash
npm run build
```
3. Deploy the `build` folder to your hosting service (Netlify, Vercel, AWS S3, etc.)

## Common Issues

### CORS Errors
If you encounter CORS errors:
1. Ensure backend CORS settings allow your frontend domain
2. Check that `django-cors-headers` is properly configured in the backend

### API Connection Failed
1. Verify backend is running on the expected URL
2. Check `.env` file has correct `REACT_APP_API_URL`
3. Ensure no firewall blocking the connection

### Authentication Not Persisting
1. Check browser localStorage (DevTools → Application → Local Storage)
2. Verify tokens are being stored correctly
3. Check token expiration times

## Scalability Considerations

For scaling this application:

1. **Code Splitting**: Use React.lazy() for route-based code splitting
2. **Memoization**: Add React.memo, useMemo, useCallback for performance
3. **State Management**: Consider Redux/Zustand for complex state
4. **Caching**: Implement React Query or SWR for API caching
5. **CDN**: Deploy static assets to CDN
6. **Server-Side Rendering**: Consider Next.js for SEO and performance
7. **Progressive Web App**: Add service workers for offline support
8. **Bundle Analysis**: Use webpack-bundle-analyzer to optimize bundle size

## Security Notes

- Never commit `.env` files with real credentials
- In production, use httpOnly cookies for JWT storage
- Implement CSRF protection
- Sanitize user inputs
- Keep dependencies updated
- Use HTTPS in production
- Implement rate limiting on sensitive actions
