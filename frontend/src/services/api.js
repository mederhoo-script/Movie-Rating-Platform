import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authService = {
  register: (userData) => api.post('/auth/register/', userData),
  login: (credentials) => api.post('/auth/login/', credentials),
};

// Movie endpoints
export const movieService = {
  getMovies: (params) => api.get('/movies/', { params }),
  getMovie: (id) => api.get(`/movies/${id}/`),
  createMovie: (movieData) => api.post('/movies/', movieData),
  updateMovie: (id, movieData) => api.put(`/movies/${id}/`, movieData),
  deleteMovie: (id) => api.delete(`/movies/${id}/`),
};

// Rating endpoints
export const ratingService = {
  getMovieRatings: (movieId) => api.get(`/movies/${movieId}/ratings/`),
  createOrUpdateRating: (movieId, ratingData) => api.post(`/movies/${movieId}/ratings/`, ratingData),
  getUserRatings: (userId) => api.get(`/users/${userId}/ratings/`),
};

export default api;
