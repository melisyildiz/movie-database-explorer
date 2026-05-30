import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSearchMovies } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

export default function SearchResults() {
  const { query } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dinamik Arka Plan State'leri
  const [bgImage, setBgImage] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const getSearchResults = async () => {
      setLoading(true);
      const results = await fetchSearchMovies(query);
      setMovies(results);
      setLoading(false);
    };

    getSearchResults();
  }, [query]); 

  // Hover Fonksiyonları
  const handleMouseEnter = (movie) => {
    const imagePath = movie.backdrop_path || movie.poster_path;
    if (imagePath) {
      setBgImage(`https://image.tmdb.org/t/p/w500${imagePath}`);
      setIsHovered(true); 
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false); 
  };

  if (loading) {
    return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Searching for "{query}"...</h2>;
  }

  return (
    <section style={{ position: 'relative' }}>
      
      {/* --- AMBİYANS (RENK) ARKA PLANI --- */}
      <div 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          backgroundImage: bgImage ? `url(${bgImage})` : 'none', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          filter: 'blur(90px)', 
          opacity: isHovered ? 0.85 : 0, 
          transition: 'opacity 0.6s ease-in-out', 
          zIndex: -2, 
          pointerEvents: 'none' 
        }} 
      />
      <div 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          background: 'linear-gradient(to bottom, transparent 0%, var(--secondary-color) 90%)', 
          opacity: isHovered ? 1 : 0, 
          transition: 'opacity 0.6s ease-in-out', 
          zIndex: -1, 
          pointerEvents: 'none' 
        }} 
      />

      <h2>Search Results for: <span style={{ color: 'var(--primary-color)' }}>{query}</span></h2>
      
      {movies.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '1.2rem' }}>
          No movies found matching your criteria. Try another search!
        </p>
      ) : (
        <div className="movie-container">
          {movies.map((movie) => (
            <div 
              key={movie.id}
              onMouseEnter={() => handleMouseEnter(movie)}
              onMouseLeave={handleMouseLeave}
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}