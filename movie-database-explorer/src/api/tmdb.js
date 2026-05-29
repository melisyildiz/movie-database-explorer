const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';



export const fetchPopularMovies = async (page = 1) => {
  try {
   
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
    
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Fetch error:", error);
    return []; 
  }
};




export const fetchMovieDetails = async (id) => {
  try {
   
    const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch detail error:", error);
    return null;
  }
};


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