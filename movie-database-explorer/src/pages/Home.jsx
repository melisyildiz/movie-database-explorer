import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import { fetchPopularMovies } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [heroMovie, setHeroMovie] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [bgImage, setBgImage] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const getMovies = async () => {
      setLoading(true);
      const popularMovies = await fetchPopularMovies(page);
      
      if (page === 1) {
        setMovies(popularMovies);
        if (popularMovies.length > 0) {
          setHeroMovie(popularMovies[0]);
        }
      } else {
        setMovies((prevMovies) => [...prevMovies, ...popularMovies]);
      }
      
      setLoading(false);
    };

    getMovies();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 100 && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

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

  if (loading && page === 1) {
    return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading movies...</h2>;
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
          /* Işık şiddetini (opacity) 0.45'ten 0.85'e çıkardık. Renkler çok daha canlı ve parlak olacak. */
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

      {/* --- Dinamik Hero Banner --- */}
      {heroMovie && (
        <div 
          className="hero-banner"
          onMouseEnter={() => handleMouseEnter(heroMovie)}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'relative',
            height: '480px',
            backgroundImage: `url(https://image.tmdb.org/t/p/original${heroMovie.backdrop_path})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'flex-end',
            marginBottom: '3rem',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          }}
        >
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to top, var(--secondary-color) 0%, rgba(20,20,20,0.4) 60%, rgba(20,20,20,0) 100%)',
              zIndex: 1
            }}
          />

          <div 
            style={{
              position: 'relative',
              zIndex: 2,
              padding: '40px',
              maxWidth: '750px',
              color: 'white'
            }}
          >
            <span style={{ 
              backgroundColor: 'var(--primary-color)', 
              padding: '5px 12px', 
              borderRadius: '4px', 
              fontSize: '0.8rem', 
              fontWeight: 'bold',
              display: 'inline-block',
              marginBottom: '12px',
              letterSpacing: '1px'
            }}>
              TODAY'S FEATURED MOVIE
            </span>
            <h1 style={{ fontSize: '3rem', margin: '0 0 15px 0', textShadow: '2px 2px 8px rgba(0,0,0,0.9)', fontWeight: 'bold', lineHeight: '1.1' }}>
              {heroMovie.title}
            </h1>
            <p style={{ 
              fontSize: '1.05rem', 
              marginBottom: '25px', 
              textShadow: '1px 1px 4px rgba(0,0,0,0.9)', 
              lineHeight: '1.5', 
              color: '#ddd',
              display: '-webkit-box',
              WebkitLineClamp: 3, 
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {heroMovie.overview}
            </p>
            <Link 
              to={`/movie/${heroMovie.id}`}
              style={{
                display: 'inline-block',
                backgroundColor: 'white',
                color: 'black',
                padding: '0.8rem 2rem',
                borderRadius: '4px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
              }}
              onMouseOver={(e) => { e.target.style.backgroundColor = 'var(--primary-color)'; e.target.style.color = 'white'; }}
              onMouseOut={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.color = 'black'; }}
            >
              ▶ View Details
            </Link>
          </div>
        </div>
      )}

      <h2>Popular Movies</h2>
      
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

      {loading && page > 1 && (
        <h3 style={{ textAlign: 'center', margin: '20px 0', color: 'var(--primary-color)' }}>
          Loading more movies...
        </h3>
      )}
    </section>
  );
}