interface FavoriteMovie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

const FAVORITES_KEY = 'favorite_movies';

export const getFavoriteMovies = (): FavoriteMovie[] => {
  const favorites = localStorage.getItem(FAVORITES_KEY);
  return favorites ? JSON.parse(favorites) : [];
};

export const addFavoriteMovie = (movie: FavoriteMovie): void => {
  const favorites = getFavoriteMovies();
  if (!favorites.some(fav => fav.id === movie.id)) {
    favorites.push(movie);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
};

export const removeFavoriteMovie = (movieId: number): void => {
  const favorites = getFavoriteMovies();
  const updatedFavorites = favorites.filter(movie => movie.id !== movieId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
};

export const isMovieFavorite = (movieId: number): boolean => {
  const favorites = getFavoriteMovies();
  return favorites.some(movie => movie.id === movieId);
}; 