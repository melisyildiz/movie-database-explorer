// src/pages/SearchResults.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSearchMovies } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

export default function SearchResults() {
  const { query } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSearchResults = async () => {
      setLoading(true);
      const results = await fetchSearchMovies(query);
      setMovies(results);
      setLoading(false);
    };

    getSearchResults();
  }, [query]); 

  if (loading) {
    return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Searching for "{query}"...</h2>;
  }

  return (
    <section>
      <h2>Search Results for: <span style={{ color: 'var(--primary-color)' }}>{query}</span></h2>
      
      {movies.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '1.2rem' }}>
          No movies found matching your criteria. Try another search!
        </p>
      ) : (
        <div className="movie-container">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
}