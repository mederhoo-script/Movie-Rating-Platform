import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movieService } from '../services/api';
import './MovieList.css';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMovies = async (searchQuery = '', pageNum = 1) => {
    try {
      setLoading(true);
      const params = {
        page: pageNum,
      };
      
      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await movieService.getMovies(params);
      setMovies(response.data.results);
      
      // Calculate total pages
      const total = response.data.count;
      const perPage = 10; // Default page size from backend
      setTotalPages(Math.ceil(total / perPage));
      
      setError('');
    } catch (err) {
      setError('Failed to load movies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(searchTerm, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchMovies(searchTerm, 1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <div className="movie-list-container">
      <div className="movie-list-header">
        <h1>Movies</h1>
        <Link to="/movies/add" className="btn btn-primary">Add Movie</Link>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search movies by title, genre, director..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="btn btn-secondary">Search</button>
      </form>

      {loading && <div className="loading">Loading movies...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="movie-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <h3>{movie.title}</h3>
            <p className="movie-year">{movie.release_year}</p>
            <p className="movie-genre">{movie.genre}</p>
            <p className="movie-director">Director: {movie.director}</p>
            <p className="movie-description">
              {movie.description.length > 150
                ? `${movie.description.substring(0, 150)}...`
                : movie.description}
            </p>
            <div className="movie-rating">
              <span className="rating-score">
                ⭐ {movie.average_rating ? movie.average_rating.toFixed(1) : 'N/A'}
              </span>
              <span className="rating-count">
                ({movie.ratings_count} {movie.ratings_count === 1 ? 'rating' : 'ratings'})
              </span>
            </div>
            <Link to={`/movies/${movie.id}`} className="btn btn-link">View Details</Link>
          </div>
        ))}
      </div>

      {!loading && movies.length === 0 && (
        <div className="no-movies">
          No movies found. {searchTerm && 'Try a different search term or '}
          <Link to="/movies/add">add a new movie</Link>.
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="btn btn-secondary"
          >
            Previous
          </button>
          <span className="page-info">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="btn btn-secondary"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieList;
