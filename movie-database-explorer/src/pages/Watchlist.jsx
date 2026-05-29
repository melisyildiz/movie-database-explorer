// src/pages/Watchlist.jsx
import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const savedMovies = JSON.parse(localStorage.getItem('watchlist')) || [];
    setWatchlist(savedMovies);
  }, []);

  // YENİ EKLENEN KISIM: Film silme fonksiyonu
  const removeFromWatchlist = (id) => {
    // Tıklanan ID dışındaki tüm filmleri filtreleyip yeni bir liste yapıyoruz
    const updatedList = watchlist.filter((movie) => movie.id !== id);
    
    // Hem ekrandaki state'i hem de tarayıcı hafızasını (localStorage) güncelliyoruz
    setWatchlist(updatedList);
    localStorage.setItem('watchlist', JSON.stringify(updatedList));
  };

  return (
    <section>
      <h2>My Watchlist</h2>
      {watchlist.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2rem', color: '#aaa' }}>
          Your watchlist is empty. Go back and add some movies!
        </p>
      ) : (
        <div className="movie-container">
          {watchlist.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onRemove={removeFromWatchlist} // Fonksiyonu karta prop olarak gönderiyoruz
            />
          ))}
        </div>
      )}
    </section>
  );
}