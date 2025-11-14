import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  addFavorite, 
  removeFavorite, 
  checkFavorite, 
  setRating, 
  getRating 
} from '../services/api';
import AddToListModal from './AddToListModal';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [showListModal, setShowListModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const imageUrl = movie.poster_path
    ? `${import.meta.env.VITE_TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=Sin+Imagen';

  useEffect(() => {
    if (isAuthenticated) {
      loadMovieData();
    }
  }, [isAuthenticated, movie.id]);

  const loadMovieData = async () => {
    try {
      const [favoriteRes, ratingRes] = await Promise.all([
        checkFavorite(movie.id),
        getRating(movie.id)
      ]);
      setIsFavorite(favoriteRes.data.isFavorite);
      setUserRating(ratingRes.data.rating || 0);
    } catch (error) {
      console.error('Error cargando datos de película:', error);
    }
  };

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar favoritos');
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await removeFavorite(movie.id);
        setIsFavorite(false);
      } else {
        await addFavorite({
          movie_id: movie.id,
          movie_title: movie.title || movie.name,
          poster_path: movie.poster_path
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error con favorito:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (rating, e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para calificar');
      return;
    }

    try {
      await setRating(movie.id, rating);
      setUserRating(rating);
    } catch (error) {
      console.error('Error calificando:', error);
    }
  };

  const handleAddToList = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para crear listas');
      return;
    }
    setShowListModal(true);
  };

  return (
    <>
      <div 
        className="movie-card"
        onClick={() => navigate(`/movie/${movie.id}`)}
      >
        <div className="movie-poster">
          <img src={imageUrl} alt={movie.title || movie.name} />
          <div className="movie-overlay">
            <button 
              className={`favorite-btn ${isFavorite ? 'active' : ''}`}
              onClick={handleFavoriteToggle}
              disabled={loading}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
            <button 
              className="list-btn"
              onClick={handleAddToList}
            >
              ➕ Lista
            </button>
          </div>
        </div>
        <div className="movie-info">
          <h3>{movie.title || movie.name}</h3>
          <p className="movie-rating">⭐ {movie.vote_average?.toFixed(1) || 'N/A'}</p>
          
          {isAuthenticated && (
            <div className="user-rating">
              <span>Tu calificación: </span>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= (hoveredStar || userRating) ? 'filled' : ''}`}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={(e) => handleRating(star, e)}
                  >
                    ⭐
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showListModal && (
        <AddToListModal
          movie={movie}
          onClose={() => setShowListModal(false)}
        />
      )}
    </>
  );
};

export default MovieCard;