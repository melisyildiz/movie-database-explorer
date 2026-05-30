// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useDebounce from '../hooks/useDebounce'; 

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500); 
  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      navigate(`/search/${debouncedSearchTerm}`);
    }
  }, [debouncedSearchTerm, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
  
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
        {/* Kategoriler linki buraya eklendi */}
        <Link to="/genres" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Categories</Link>
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