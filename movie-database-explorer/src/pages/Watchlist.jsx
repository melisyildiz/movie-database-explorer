import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  
  const [editingMovie, setEditingMovie] = useState(null); 
  const [tempNote, setTempNote] = useState(''); 

  // Dinamik Arka Plan State'leri
  const [bgImage, setBgImage] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const savedMovies = JSON.parse(localStorage.getItem('watchlist')) || [];
    setWatchlist(savedMovies);
  }, []);

  const removeFromWatchlist = (id) => {
    const updatedList = watchlist.filter((movie) => movie.id !== id);
    setWatchlist(updatedList);
    localStorage.setItem('watchlist', JSON.stringify(updatedList));
  };

  const updateRating = (id, newRating) => {
    const updatedList = watchlist.map((movie) => {
      if (movie.id === id) {
        return { ...movie, userRating: newRating };
      }
      return movie;
    });
    setWatchlist(updatedList);
    localStorage.setItem('watchlist', JSON.stringify(updatedList));
  };

  const saveNote = () => {
    if (!editingMovie) return;

    const updatedList = watchlist.map((movie) => {
      if (movie.id === editingMovie.id) {
        return { ...movie, userNote: tempNote };
      }
      return movie;
    });

    setWatchlist(updatedList);
    localStorage.setItem('watchlist', JSON.stringify(updatedList));
    setEditingMovie(null); 
    setTempNote(''); 
  };

  const openNoteModal = (movie) => {
    setEditingMovie(movie);
    setTempNote(movie.userNote || ''); 
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

      <h2>My Watchlist & Notes</h2>
      {watchlist.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2rem', color: '#aaa' }}>
          Your watchlist is empty. Go back and add some movies!
        </p>
      ) : (
        <div className="movie-container" style={{ alignItems: 'flex-start' }}>
          {watchlist.map((movie) => (
            <div 
              key={movie.id} 
              onMouseEnter={() => handleMouseEnter(movie)}
              onMouseLeave={handleMouseLeave}
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              
              <MovieCard 
                movie={movie} 
                onRemove={removeFromWatchlist}
              />

              <div style={{ 
                backgroundColor: '#222', 
                padding: '15px', 
                borderRadius: '8px', 
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                
                {/* Puanlama */}
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#aaa', display: 'block', marginBottom: '5px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    My Rating {movie.userRating && <span style={{color: 'white'}}>({movie.userRating}/10)</span>}
                  </label>
                  
                  <div style={{ display: 'flex', gap: '2px', fontSize: '1.3rem', userSelect: 'none', flexWrap: 'wrap' }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                      <span
                        key={star}
                        onClick={() => updateRating(movie.id, star)}
                        style={{
                          cursor: 'pointer',
                          color: movie.userRating >= star ? 'white' : '#777', 
                          transition: 'transform 0.1s ease-in-out'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.2)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                      >
                        {movie.userRating >= star ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Not Kısmı */}
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#aaa', display: 'block', marginBottom: '5px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    My Notes
                  </label>
                  
                  {movie.userNote && (
                    <div 
                      style={{
                        backgroundColor: '#111',
                        padding: '12px',
                        borderRadius: '4px',
                        border: '1px solid #333',
                        fontSize: '0.9rem',
                        color: 'white',
                        wordBreak: 'break-word',
                        marginBottom: '8px',
                        lineHeight: '1.4'
                      }}
                    >
                      {movie.userNote}
                    </div>
                  )}

                  <button
                    onClick={() => openNoteModal(movie)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      backgroundColor: 'transparent',
                      color: 'white',
                      border: '1px solid white',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      transition: 'all 0.2s',
                      marginTop: movie.userNote ? '0' : '4px' 
                    }}
                    onMouseOver={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.color = 'black'; }}
                    onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = 'white'; }}
                  >
                    {movie.userNote ? '✍ Edit Note' : '➕ Add Note'}
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {editingMovie && (
        <div 
          onClick={saveNote} 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{
              backgroundColor: '#222',
              padding: '30px',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '600px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem' }}>
                Notes for <span style={{ color: 'var(--primary-color)' }}>{editingMovie.title}</span>
              </h3>
              <button 
                onClick={saveNote}
                style={{ background: 'transparent', color: '#aaa', border: 'none', fontSize: '1.3rem', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✕
              </button>
            </div>

            <textarea
              value={tempNote}
              onChange={(e) => setTempNote(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault(); 
                  saveNote();
                }
              }}
              placeholder="Write your comprehensive thoughts, review, or memories about this movie here... (Press Enter to save, Shift+Enter for new line)"
              style={{
                width: '100%',
                height: '220px', 
                boxSizing: 'border-box',
                padding: '15px',
                borderRadius: '4px',
                backgroundColor: '#111',
                color: 'white',
                border: '1px solid #444',
                resize: 'none',
                fontFamily: 'inherit',
                fontSize: '1rem',
                lineHeight: '1.5'
              }}
              autoFocus 
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={saveNote}
                style={{
                  padding: '10px 25px',
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#b20710'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'var(--primary-color)'}
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}