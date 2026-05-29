// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { fetchPopularMovies } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); 

  useEffect(() => {
    const getMovies = async () => {
   
      const popularMovies = await fetchPopularMovies(page);
      
     
      if (page === 1) {
        setMovies(popularMovies);
      } else {
        setMovies((prevMovies) => [...prevMovies, ...popularMovies]);
      }
      
      setLoading(false);
    };

    getMovies();
  }, [page]); 


  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };


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

      {}
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