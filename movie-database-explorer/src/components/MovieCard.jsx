// src/components/MovieCard.jsx
import { Link } from 'react-router-dom';

// onRemove prop'unu ekledik
export default function MovieCard({ movie, onRemove }) {
  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  return (
    <div className="movie-card">
      <img src={imageUrl} alt={movie.title} loading="lazy" />
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <span className={`rating ${movie.vote_average >= 7 ? 'green' : 'orange'}`}>
          {movie.vote_average?.toFixed(1)}
        </span>
      </div>
      <div className="movie-over">
        <h2>Overview:</h2>
        <p>{movie.overview}</p>
        <Link to={`/movie/${movie.id}`} className="details-btn">View Details</Link>
        
        {/* YENİ EKLENEN KISIM: Sadece Watchlist sayfasındayken görünecek silme butonu */}
        {onRemove && (
          <button onClick={() => onRemove(movie.id)} className="remove-btn">
            Remove from Watchlist
          </button>
        )}
      </div>
    </div>
  );
}