import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserFavorites, getUserRatings, getUserLists, getUserStats } from '../services/api';

const MyAccount = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('favorites');
  const [favorites, setFavorites] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [lists, setLists] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadData();
  }, [isAuthenticated, navigate]);

  const loadData = async () => {
    try {
      const [favRes, ratingsRes, listsRes, statsRes] = await Promise.all([
        getUserFavorites(),
        getUserRatings(),
        getUserLists(),
        getUserStats()
      ]);

      setFavorites(favRes.data.favorites);
      setRatings(ratingsRes.data.ratings);
      setLists(listsRes.data.lists);
      setStats(statsRes.data.stats);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando tu cuenta...</div>;
  }

  const imageBaseUrl = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

  return (
    <div className="my-account-page">
      <div className="account-header">
        <h1>👤 Mi Cuenta</h1>
        <div className="user-info">
          <h2>{user?.nombre}</h2>
          <p>{user?.email}</p>
        </div>

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">{stats.favorites}</span>
              <span className="stat-label">Favoritos</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.ratings}</span>
              <span className="stat-label">Calificaciones</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.lists}</span>
              <span className="stat-label">Listas</span>
            </div>
          </div>
        )}
      </div>

      <div className="tabs">
        <button 
          className={activeTab === 'favorites' ? 'active' : ''}
          onClick={() => setActiveTab('favorites')}
        >
          ❤️ Favoritos
        </button>
        <button 
          className={activeTab === 'ratings' ? 'active' : ''}
          onClick={() => setActiveTab('ratings')}
        >
          ⭐ Calificaciones
        </button>
        <button 
          className={activeTab === 'lists' ? 'active' : ''}
          onClick={() => setActiveTab('lists')}
        >
          📋 Mis Listas
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'favorites' && (
          <div className="favorites-grid">
            {favorites.length === 0 ? (
              <p className="empty-state">No tienes favoritos aún</p>
            ) : (
              favorites.map((fav) => (
                <div 
                  key={fav.id} 
                  className="movie-card-small"
                  onClick={() => navigate(`/movie/${fav.movie_id}`)}
                >
                  <img 
                    src={fav.poster_path ? `${imageBaseUrl}${fav.poster_path}` : 'https://via.placeholder.com/200x300'}
                    alt={fav.movie_title}
                  />
                  <h4>{fav.movie_title}</h4>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'ratings' && (
          <div className="ratings-list">
            {ratings.length === 0 ? (
              <p className="empty-state">No has calificado ninguna película</p>
            ) : (
              ratings.map((rating) => (
                <div key={rating.id} className="rating-item">
                  <span className="movie-id">ID: {rating.movie_id}</span>
                  <div className="stars">
                    {'⭐'.repeat(rating.rating)}
                  </div>
                  <span className="rating-date">
                    {new Date(rating.updated_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'lists' && (
          <div className="lists-container">
            {lists.length === 0 ? (
              <p className="empty-state">No tienes listas creadas</p>
            ) : (
              lists.map((list) => (
                <div key={list.id} className="list-card">
                  <h3>{list.name}</h3>
                  {list.description && <p>{list.description}</p>}
                  <span className="item-count">{list.items.length} películas</span>
                  
                  <div className="list-movies">
                    {list.items.slice(0, 4).map((item) => (
                      <img
                        key={item.id}
                        src={item.poster_path ? `${imageBaseUrl}${item.poster_path}` : 'https://via.placeholder.com/100x150'}
                        alt={item.movie_title}
                        onClick={() => navigate(`/movie/${item.movie_id}`)}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAccount;