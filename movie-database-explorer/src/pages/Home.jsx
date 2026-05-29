// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { fetchPopularMovies } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // Kaçıncı sayfada olduğumuzu tutan yepyeni state

  useEffect(() => {
    const getMovies = async () => {
      // API'ye mevcut sayfa numarasını gönderiyoruz
      const popularMovies = await fetchPopularMovies(page);
      
      // Eğer 1. sayfadaysak filmleri baştan yükle, değilse eskilerin üzerine ekle (Spread operator)
      if (page === 1) {
        setMovies(popularMovies);
      } else {
        setMovies((prevMovies) => [...prevMovies, ...popularMovies]);
      }
      
      setLoading(false);
    };

    getMovies();
  }, [page]); // Bu useEffect artık "page" değeri her değiştiğinde tekrar çalışacak!

  // Butona tıklandığında sayfa numarasını 1 artırır
  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // Sadece ilk yüklemede tam ekran "Loading" göster, sonraki sayfalarda gösterme
  if (loading && page === 1) {
    return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading movies...</h2>;
  }

  return (
    <section>
      <h2>Popular Movies</h2>
      
      <div className="movie-container">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Daha Fazla Yükle Butonu */}
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
          onMouseOver={(e) => e.target.style.backgroundColor = '#b20710'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'var(--primary-color)'}
        >
          Load More Movies
        </button>
      </div>
    </section>
  );
}