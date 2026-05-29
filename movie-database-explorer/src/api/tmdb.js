const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// src/api/tmdb.js (Sadece bu fonksiyonu güncelle)

export const fetchPopularMovies = async (page = 1) => {
  try {
    // URL'nin sonundaki page=1 kısmını dinamik ${page} değişkeni ile değiştirdik
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
    
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Fetch error:", error);
    return []; 
  }
};
// src/api/tmdb.js (Mevcut kodların en altına ekle)

// src/api/tmdb.js (Sadece fetchMovieDetails fonksiyonunu güncelle)

export const fetchMovieDetails = async (id) => {
  try {
    // URL'nin sonuna "&append_to_response=credits" ekledik!
    const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch detail error:", error);
    return null;
  }
};
// src/api/tmdb.js (En alta ekle)

export const fetchSearchMovies = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${query}&page=1`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Search fetch error:", error);
    return [];
  }
};