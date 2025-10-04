import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movieService, imdbService } from '../services/api';
import './MovieList.css';

const MovieList = () => {
  const [dbMovies, setDbMovies] = useState([]);
  const [imdbMovies, setImdbMovies] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);
  const [imdbLoading, setImdbLoading] = useState(true);
  const [dbError, setDbError] = useState('');
  const [imdbError, setImdbError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Helper to generate random query for IMDB
  const getRandomQuery = () => {
    const randomWords = ['action', 'love', 'war', 'adventure', 'comedy', 'drama', 'hero', 'legend', 'dark', 'the'];
    const randomLetters = 'abcdefghijklmnopqrstuvwxyz';
    
    // 50% chance to use a word, 50% chance to use a single letter
    if (Math.random() > 0.5) {
      return randomWords[Math.floor(Math.random() * randomWords.length)];
    } else {
      return randomLetters[Math.floor(Math.random() * randomLetters.length)];
    }
  };

  const fetchMovies = async (searchQuery = '', pageNum = 1) => {
    // Fetch from local DB
    const fetchFromDB = async () => {
      try {
        setDbLoading(true);
        const params = {
          page: pageNum,
        };
        
        if (searchQuery) {
          params.search = searchQuery;
        }

        const response = await movieService.getMovies(params);
        setDbMovies(response.data.results);
        
        // Calculate total pages
        const total = response.data.count;
        const perPage = 10; // Default page size from backend
        setTotalPages(Math.ceil(total / perPage));
        
        setDbError('');
      } catch (err) {
        setDbError('Failed to load movies from database');
        console.error('DB fetch error:', err);
        setDbMovies([]);
      } finally {
        setDbLoading(false);
      }
    };

    // Fetch from IMDB API
    const fetchFromIMDB = async () => {
      try {
        setImdbLoading(true);
        // Use search query if provided, otherwise use random query
        const query = searchQuery || getRandomQuery();
        const response = await imdbService.searchMovies(query);
        
        if (response.data && response.data.description) {
          setImdbMovies(response.data.description);
        } else {
          setImdbMovies([]);
        }
        
        setImdbError('');
      } catch (err) {
        setImdbError('Failed to load movies from IMDB');
        console.error('IMDB fetch error:', err);
        setImdbMovies([]);
      } finally {
        setImdbLoading(false);
      }
    };

    // Fetch from both sources simultaneously
    await Promise.all([fetchFromDB(), fetchFromIMDB()]);
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

  const renderMovieCard = (movie, isIMDBMovie = false) => {
    return (
      <div key={movie.id || movie['#IMDB_ID'] || movie.imdbID} className={`movie-card ${isIMDBMovie ? 'imdb-movie' : ''}`}>
        {isIMDBMovie && (
          <div className="movie-source-badge">
            <span className="badge-imdb">IMDB</span>
          </div>
        )}
        <h3>{movie.title || movie['#TITLE'] || movie.Title}</h3>
        <p className="movie-year">{movie.release_year || movie['#YEAR'] || movie.Year}</p>
        <p className="movie-genre">{movie.genre || movie['#GENRES'] || movie.Genre}</p>
        {movie.director && <p className="movie-director">Director: {movie.director}</p>}
        {movie.Director && <p className="movie-director">Director: {movie.Director}</p>}
        {movie['#ACTORS'] && <p className="movie-director">Actors: {movie['#ACTORS']}</p>}
        <p className="movie-description">
          {movie.description ? (
            movie.description.length > 150
              ? `${movie.description.substring(0, 150)}...`
              : movie.description
          ) : movie.Plot ? (
            movie.Plot.length > 150
              ? `${movie.Plot.substring(0, 150)}...`
              : movie.Plot
          ) : 'No description available'}
        </p>
        {!isIMDBMovie && (
          <>
            <div className="movie-rating">
              <span className="rating-score">
                ⭐ {movie.average_rating ? movie.average_rating.toFixed(1) : 'N/A'}
              </span>
              <span className="rating-count">
                ({movie.ratings_count} {movie.ratings_count === 1 ? 'rating' : 'ratings'})
              </span>
            </div>
            <Link to={`/movies/${movie.id}`} className="btn btn-link">View Details</Link>
          </>
        )}
        {isIMDBMovie && (movie['#IMDB_IV'] || movie.imdbRating) && (
          <div className="movie-rating">
            <span className="rating-score">
              ⭐ {movie['#IMDB_IV'] || movie.imdbRating} (IMDB)
            </span>
          </div>
        )}
      </div>
    );
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

      {/* Database Results Section */}
      <div className="results-section">
        <h2 className="section-title">Results from our database</h2>
        {dbLoading && <div className="loading">Loading movies from database...</div>}
        {dbError && <div className="error-message">{dbError}</div>}
        
        <div className="movie-grid">
          {dbMovies.map((movie) => renderMovieCard(movie, false))}
        </div>

        {!dbLoading && dbMovies.length === 0 && !dbError && (
          <div className="no-movies">
            No movies found in our database. {searchTerm && 'Try a different search term or '}
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

      {/* IMDB Results Section */}
      <div className="results-section imdb-section">
        <h2 className="section-title">Results from IMDB</h2>
        {imdbLoading && <div className="loading">Loading movies from IMDB...</div>}
        {imdbError && <div className="error-message">{imdbError}</div>}
        
        <div className="movie-grid">
          {imdbMovies.map((movie) => renderMovieCard(movie, true))}
        </div>

        {!imdbLoading && imdbMovies.length === 0 && !imdbError && (
          <div className="no-movies">
            No movies found from IMDB.
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieList;
