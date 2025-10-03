import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { movieService, ratingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ratingForm, setRatingForm] = useState({
    score: 5,
    comment: '',
  });
  const [submittingRating, setSubmittingRating] = useState(false);
  const [userRating, setUserRating] = useState(null);

  useEffect(() => {
    fetchMovieDetail();
  }, [id]);

  const fetchMovieDetail = async () => {
    try {
      setLoading(true);
      const response = await movieService.getMovie(id);
      setMovie(response.data);
      
      // Find user's existing rating if logged in
      if (user && response.data.ratings) {
        const existingRating = response.data.ratings.find(
          (rating) => rating.user.id === user.id
        );
        if (existingRating) {
          setUserRating(existingRating);
          setRatingForm({
            score: existingRating.score,
            comment: existingRating.comment || '',
          });
        }
      }
      
      setError('');
    } catch (err) {
      setError('Failed to load movie details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (e) => {
    setRatingForm({
      ...ratingForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setSubmittingRating(true);
      await ratingService.createOrUpdateRating(id, ratingForm);
      
      // Refresh movie details to show updated rating
      await fetchMovieDetail();
      
      alert(userRating ? 'Rating updated successfully!' : 'Rating submitted successfully!');
    } catch (err) {
      alert('Failed to submit rating. Please try again.');
      console.error(err);
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) return <div className="loading">Loading movie details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!movie) return <div className="error-message">Movie not found</div>;

  return (
    <div className="movie-detail-container">
      <button onClick={() => navigate(-1)} className="btn btn-secondary back-btn">
        ← Back
      </button>

      <div className="movie-detail">
        <h1>{movie.title}</h1>
        
        <div className="movie-meta">
          <span className="meta-item">
            <strong>Release Year:</strong> {movie.release_year}
          </span>
          <span className="meta-item">
            <strong>Genre:</strong> {movie.genre}
          </span>
          <span className="meta-item">
            <strong>Director:</strong> {movie.director}
          </span>
        </div>

        <div className="movie-rating-summary">
          <span className="rating-score">
            ⭐ {movie.average_rating ? movie.average_rating.toFixed(1) : 'N/A'}
          </span>
          <span className="rating-count">
            ({movie.ratings_count} {movie.ratings_count === 1 ? 'rating' : 'ratings'})
          </span>
        </div>

        <div className="movie-description">
          <h2>Description</h2>
          <p>{movie.description}</p>
        </div>

        <div className="movie-info">
          <p>
            <strong>Added by:</strong> {movie.created_by.username}
          </p>
        </div>
      </div>

      {isAuthenticated && (
        <div className="rating-form-section">
          <h2>{userRating ? 'Update Your Rating' : 'Rate This Movie'}</h2>
          <form onSubmit={handleRatingSubmit} className="rating-form">
            <div className="form-group">
              <label htmlFor="score">Score (1-5)</label>
              <select
                id="score"
                name="score"
                value={ratingForm.score}
                onChange={handleRatingChange}
                required
              >
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Good</option>
                <option value="4">4 - Very Good</option>
                <option value="5">5 - Excellent</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="comment">Comment (optional)</label>
              <textarea
                id="comment"
                name="comment"
                value={ratingForm.comment}
                onChange={handleRatingChange}
                rows="4"
                placeholder="Share your thoughts about this movie..."
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submittingRating}>
              {submittingRating ? 'Submitting...' : (userRating ? 'Update Rating' : 'Submit Rating')}
            </button>
          </form>
        </div>
      )}

      {!isAuthenticated && (
        <div className="auth-prompt">
          Please <a href="/login">login</a> to rate this movie.
        </div>
      )}

      <div className="ratings-section">
        <h2>User Ratings</h2>
        {movie.ratings && movie.ratings.length > 0 ? (
          <div className="ratings-list">
            {movie.ratings.map((rating) => (
              <div key={rating.id} className="rating-item">
                <div className="rating-header">
                  <span className="rating-user">{rating.username}</span>
                  <span className="rating-score">⭐ {rating.score}</span>
                </div>
                {rating.comment && <p className="rating-comment">{rating.comment}</p>}
                <span className="rating-date">
                  {new Date(rating.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-ratings">No ratings yet. Be the first to rate this movie!</p>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
