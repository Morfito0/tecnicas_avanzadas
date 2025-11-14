import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { searchMovies } from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    try {
      const response = await searchMovies(query);
      setSearchResults(response.data.results.slice(0, 5));
      setShowResults(true);
    } catch (error) {
      console.error('Error en búsqueda:', error);
    }
  };

  const handleResultClick = (movieId) => {
    setSearchQuery('');
    setShowResults(false);
    navigate(`/movie/${movieId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const imageBaseUrl = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          🎬 MovieCatalog
        </Link>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar películas..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowResults(true)}
          />
          
          {showResults && searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((movie) => (
                <div
                  key={movie.id}
                  className="search-result-item"
                  onClick={() => handleResultClick(movie.id)}
                >
                  <img
                    src={movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : 'https://via.placeholder.com/50x75'}
                    alt={movie.title}
                  />
                  <div className="result-info">
                    <h4>{movie.title}</h4>
                    <p>⭐ {movie.vote_average?.toFixed(1)} • {movie.release_date?.split('-')[0]}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="nav-links">
          <Link to="/">Inicio</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/my-account">Mi Cuenta</Link>
              <span className="user-name">{user?.nombre}</span>
              <button onClick={handleLogout} className="logout-btn">
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-link">Iniciar Sesión</Link>
              <Link to="/register" className="register-btn">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;