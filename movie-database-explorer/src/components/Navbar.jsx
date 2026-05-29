// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useDebounce from '../hooks/useDebounce'; // Yazdığımız Hook'u içeri aktarıyoruz

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  // Kullanıcı yazmayı bıraktıktan 500 milisaniye (yarım saniye) sonra bu değer güncellenir
  const debouncedSearchTerm = useDebounce(searchTerm, 500); 
  const navigate = useNavigate();

  // Debounce edilmiş değer her değiştiğinde otomatik yönlendirme yapar
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      navigate(`/search/${debouncedSearchTerm}`);
    }
  }, [debouncedSearchTerm, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Enter'a basıldığında da anında arama yapması için yedek güvenlik (prevent default)
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <h1>
          <Link to="/">Movie Explorer</Link>
        </h1>
        <Link to="/watchlist" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>My Watchlist</Link>
      </div>

      <form className="search-container" onSubmit={handleSearch}>
        <input 
          type="text" 
          placeholder="Search a movie..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    </nav>
  );
}