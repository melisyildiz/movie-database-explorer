import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import SearchResults from './pages/SearchResults';
import Watchlist from './pages/Watchlist';
import Genres from './pages/Genres'; // 1. Yeni sayfayı import ettik
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
            <Route path="/search/:query" element={<SearchResults />} />
            <Route path="/genres" element={<Genres />} /> {/* 2. Yeni rotayı ekledik */}
            <Route path="/watchlist" element={<Watchlist />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;