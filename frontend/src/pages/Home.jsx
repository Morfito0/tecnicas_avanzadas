import React, { useState, useEffect } from 'react';
import { getTrending, getPopular, getTVRecommended } from '../services/api';
import MovieCard from '../components/MovieCard';

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const [trendingRes, popularRes, tvRes] = await Promise.all([
        getTrending(),
        getPopular(),
        getTVRecommended()
      ]);

      setTrending(trendingRes.data.results.slice(0, 10));
      setPopular(popularRes.data.results.slice(0, 10));
      setTvShows(tvRes.data.results.slice(0, 10));
    } catch (error) {
      console.error('Error cargando películas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando películas...</div>;
  }

  return (
    <div className="home-page">
      <section className="movie-section">
        <h2>🔥 En Tendencia</h2>
        <div className="movies-grid">
          {trending.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      <section className="movie-section">
        <h2>⭐ Populares</h2>
        <div className="movies-grid">
          {popular.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      <section className="movie-section">
        <h2>📺 Series Recomendadas</h2>
        <div className="movies-grid">
          {tvShows.map((show) => (
            <MovieCard key={show.id} movie={show} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;