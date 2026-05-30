import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMovieDetails, fetchSimilarMovies } from '../api/tmdb'; // fetchSimilarMovies eklendi
import MovieCard from '../components/MovieCard'; // Benzer filmleri göstermek için eklendi

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]); // Benzer filmler state'i
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    // Kullanıcı yeni bir filme tıkladığında sayfayı otomatik en üste kaydır
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const getDetailsAndSimilar = async () => {
      setLoading(true);
      
      // 1. Film Detaylarını Çek
      const details = await fetchMovieDetails(id);
      setMovie(details);

      if (details) {
        const currentWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        const isAdded = currentWatchlist.some((item) => item.id === details.id);
        setInWatchlist(isAdded);
      }

      // 2. Benzer Filmleri Çek
      const similar = await fetchSimilarMovies(id);
      setSimilarMovies(similar);

      setLoading(false);
    };

    getDetailsAndSimilar();
  }, [id]);

  const toggleWatchlist = () => {
    const currentWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    if (inWatchlist) {
      const updatedList = currentWatchlist.filter((item) => item.id !== movie.id);
      localStorage.setItem('watchlist', JSON.stringify(updatedList));
      setInWatchlist(false);
    } else {
      const updatedList = [...currentWatchlist, movie];
      localStorage.setItem('watchlist', JSON.stringify(updatedList));
      setInWatchlist(true);
    }
  };

  if (loading) {
    return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading details...</h2>;
  }

  if (!movie) {
    return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Movie not found!</h2>;
  }

  const director = movie.credits?.crew?.find(member => member.job === 'Director');
  const trailer = movie.videos?.results?.find(vid => vid.type === 'Trailer' && vid.site === 'YouTube');
  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  return (
    <section>
      {/* --- ANA DETAY KISMI --- */}
      <div className="details-container">
        <div className="details-poster">
          <img src={imageUrl} alt={movie.title} />
        </div>
        <div className="details-info">
          <h2>{movie.title} <span className="release-year">({movie.release_date?.substring(0, 4)})</span></h2>
          {movie.tagline && <p className="tagline"><em>"{movie.tagline}"</em></p>}
          
          <div className="rating-genres">
            <span className="rating-badge">Rating: {movie.vote_average?.toFixed(1)} / 10</span>
            <span className="genres">
              {movie.genres?.map(genre => genre.name).join(', ')}
            </span>
          </div>

          <div className="extra-info">
            <p><strong>Director:</strong> {director ? director.name : 'Unknown'}</p>
            <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
            <p><strong>Status:</strong> {movie.status}</p>
            {movie.budget > 0 && <p><strong>Budget:</strong> ${movie.budget.toLocaleString()}</p>}
            {movie.revenue > 0 && <p><strong>Revenue:</strong> ${movie.revenue.toLocaleString()}</p>}
          </div>

          <h3>Overview</h3>
          <p className="overview-text">{movie.overview}</p>
          
          <h3>Top Cast</h3>
          <div className="cast-container">
            {movie.credits?.cast?.slice(0, 10).map((actor) => (
              <div key={actor.id} className="cast-card">
                <img 
                  src={actor.profile_path 
                    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` 
                    : 'https://via.placeholder.com/200x300?text=No+Photo'
                  } 
                  alt={actor.name} 
                  loading="lazy"
                />
                <p className="actor-name">{actor.name}</p>
                <p className="character-name">{actor.character}</p>
              </div>
            ))}
          </div>
          
          <div className="action-buttons">
            <button 
              onClick={toggleWatchlist} 
              className={`watchlist-btn ${inWatchlist ? 'remove-mode' : ''}`}
            >
              {inWatchlist ? '- Remove from Watchlist' : '+ Add to Watchlist'}
            </button>

            {trailer && (
              <button onClick={() => setShowTrailer(true)} className="trailer-btn">
                ▶ Watch Trailer
              </button>
            )}
          </div>

          <Link to="/" className="back-btn">← Back to Popular Movies</Link>
        </div>
      </div>

      {/* --- BENZER FİLMLER KISMI --- */}
      {similarMovies && similarMovies.length > 0 && (
        <div style={{ marginTop: '4rem', borderTop: '1px solid #333', paddingTop: '2rem' }}>
          <h2>Similar Movies You Might Like</h2>
          <div className="movie-container">
            {/* Sadece ilk 10 benzer filmi gösteriyoruz */}
            {similarMovies.slice(0, 10).map((similarMovie) => (
              <MovieCard key={similarMovie.id} movie={similarMovie} />
            ))}
          </div>
        </div>
      )}

      {/* --- FRAGMAN MODALI --- */}
      {showTrailer && (
        <div className="modal-overlay" onClick={() => setShowTrailer(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowTrailer(false)}>X</button>
            <div className="video-responsive">
              <iframe 
                width="853" 
                height="480" 
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`} 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}