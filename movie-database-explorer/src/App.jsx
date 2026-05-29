// src/App.jsx
import Watchlist from './pages/Watchlist';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import SearchResults from './pages/SearchResults'; // Yeni sayfamızı import ettik
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header>
          <Navbar />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/search/:query" element={<SearchResults />} /> {/* Yeni Rota */}
            <Route path="/watchlist" element={<Watchlist />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;