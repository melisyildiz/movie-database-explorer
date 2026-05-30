import { useState, useEffect } from 'react';
import { fetchGenres, fetchMoviesByGenre } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

export default function Genres() {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Dinamik Arka Plan State'leri
  const [bgImage, setBgImage] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // Sayfa ilk açıldığında kategorileri yükle ve ilkini seç
  useEffect(() => {
    const getGenres = async () => {
      const genresData = await fetchGenres();
      setGenres(genresData);
      if (genresData.length > 0) {
        setSelectedGenre(genresData[0].id);
      }
    };
    getGenres();
  }, []);

  // Seçili kategori veya sayfa numarası değiştiğinde filmleri getir
  useEffect(() => {
    if (!selectedGenre) return;

    const getMovies = async () => {
      setLoading(true);
      const fetchedMovies = await fetchMoviesByGenre(selectedGenre, page);
      
      if (page === 1) {
        setMovies(fetchedMovies);
      } else {
        setMovies((prevMovies) => [...prevMovies, ...fetchedMovies]);
      }
      setLoading(false);
    };

    getMovies();
  }, [selectedGenre, page]);

  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId);
    setPage(1);
    setMovies([]);
  };

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

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

      <h2>Movie Categories</h2>
      
      {/* Kategori Seçim Butonları */}
      <div className="genre-container" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', padding: '10px 0', marginBottom: '2rem' }}>
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => handleGenreClick(genre.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              backgroundColor: selectedGenre === genre.id ? 'var(--primary-color)' : '#333',
              color: 'white',
              border: 'none',
              whiteSpace: 'nowrap',
              fontWeight: 'bold',
              transition: 'background-color 0.2s'
            }}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {/* Seçili Kategori Başlığı */}
      <h2>{genres.find((g) => g.id === selectedGenre)?.name} Movies</h2>

      {loading && page === 1 ? (
        <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading movies...</h2>
      ) : (
        <>
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

          {movies.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '2rem' }}>
              <button
                onClick={loadMore}
                style={{
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  padding: '1rem 2.5rem',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#b20710')}
                onMouseOut={(e) => (e.target.style.backgroundColor = 'var(--primary-color)')}
              >
                Load More Movies
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}