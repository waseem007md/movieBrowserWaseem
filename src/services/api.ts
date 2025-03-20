import axios from 'axios';

const API_KEY = 'aa0ea747f249eb769913dfe37182b527';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const getImageUrl = (path: string, size: string = 'w500') => {
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const fetchTrendingMovies = (page: number = 1) => {
  return api.get('/trending/movie/week', {
    params: { page }
  });
};

export const fetchPopularMovies = (page: number = 1) => {
  return api.get('/movie/popular', {
    params: { page }
  });
};

export const fetchMovieDetails = (movieId: number) => {
  return api.get(`/movie/${movieId}`, {
    params: {
      append_to_response: 'credits,videos'
    }
  });
};

export const searchMovies = (query: string, page: number = 1) => {
  return api.get('/search/movie', {
    params: {
      query,
      page
    },
  });
};

interface FilterParams {
  genre?: string;
  year?: string;
  language?: string;
  minRating?: number;
  maxRating?: number;
  page?: number;
}

export const fetchFilteredMovies = async (filters: FilterParams) => {
  const params: any = {
    include_adult: false,
    sort_by: 'popularity.desc',
    page: filters.page || 1
  };

  // Add year filter
  if (filters.year) {
    params.primary_release_year = filters.year;
  }

  // Add language filter
  if (filters.language) {
    params.with_original_language = getLanguageCode(filters.language);
  }

  // Add genre filter
  if (filters.genre) {
    const genreId = getGenreId(filters.genre);
    if (genreId) {
      params.with_genres = genreId;
    }
  }

  // Add rating filter
  if (filters.minRating !== undefined) {
    params['vote_average.gte'] = filters.minRating;
  }
  if (filters.maxRating !== undefined) {
    params['vote_average.lte'] = filters.maxRating;
  }

  return api.get('/discover/movie', { params });
};

// Genre mapping as per TMDB API
const GENRE_MAP: { [key: string]: number } = {
  'Action': 28,
  'Adventure': 12,
  'Animation': 16,
  'Comedy': 35,
  'Crime': 80,
  'Documentary': 99,
  'Drama': 18,
  'Family': 10751,
  'Fantasy': 14,
  'Horror': 27,
  'Mystery': 9648,
  'Romance': 10749,
  'Sci-Fi': 878,
  'Thriller': 53
};

// Language mapping as per TMDB API
const LANGUAGE_MAP: { [key: string]: string } = {
  'English': 'en',
  'Spanish': 'es',
  'French': 'fr',
  'German': 'de',
  'Hindi': 'hi',
  'Japanese': 'ja',
  'Korean': 'ko'
};

const getGenreId = (genre: string): number | undefined => {
  return GENRE_MAP[genre];
};

const getLanguageCode = (language: string): string | undefined => {
  return LANGUAGE_MAP[language];
}; 