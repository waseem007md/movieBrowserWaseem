import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  TextField,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Slider,
  Button,
  Pagination,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MovieCard from '../components/MovieCard';
import MovieDetails from '../components/MovieDetails';
import { fetchTrendingMovies, searchMovies, fetchFilteredMovies, fetchMovieDetails } from '../services/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getFavoriteMovies } from '../utils/localStorage';
import { Favorite } from '@mui/icons-material';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
  original_language: string;
  genres?: { id: number; name: string }[];
}

interface MovieListItem {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

const YEARS = Array.from({ length: 24 }, (_, i) => 2024 - i);
const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Hindi', 'Japanese', 'Korean'];
const GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
  'Drama', 'Family', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller'
];

const Home: React.FC = () => {
  const [movies, setMovies] = useState<MovieListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [ratingRange, setRatingRange] = useState<number[]>([0, 10]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const navigate = useNavigate();

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMovieClick = (movie: MovieListItem) => {
    navigate(`/movie/${movie.id}`);
  };

  const handlePageChange = async (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    setLoading(true);
    try {
      let response;
      if (searchQuery) {
        response = await searchMovies(searchQuery, value);
      } else if (isFiltered) {
        response = await fetchFilteredMovies({
          genre: selectedGenre,
          language: selectedLanguage,
          year: selectedYear,
          minRating: ratingRange[0],
          maxRating: ratingRange[1],
          page: value
        });
      } else {
        response = await fetchTrendingMovies(value);
      }
      const filteredMovies = response.data.results.filter(
        (movie: any) => movie.poster_path && movie.backdrop_path
      );
      setMovies(filteredMovies);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Error changing page:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = async () => {
    setLoading(true);
    setPage(1);
    try {
      const response = await fetchFilteredMovies({
        genre: selectedGenre,
        language: selectedLanguage,
        year: selectedYear,
        minRating: ratingRange[0],
        maxRating: ratingRange[1],
        page: 1
      });
      const filteredMovies = response.data.results.filter(
        (movie: any) => movie.poster_path && movie.backdrop_path
      );
      setMovies(filteredMovies);
      setTotalPages(response.data.total_pages);
      setIsFiltered(true);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const handleResetFilters = async () => {
    setSelectedGenre('');
    setSelectedLanguage('');
    setSelectedYear('');
    setRatingRange([0, 10]);
    setIsFiltered(false);
    setShowFavorites(false);
    setPage(1);
    
    setLoading(true);
    try {
      const response = await fetchTrendingMovies(1);
      const filteredMovies = response.data.results.filter(
        (movie: any) => movie.poster_path && movie.backdrop_path
      );
      setMovies(filteredMovies);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Error resetting movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowFavorites = () => {
    setShowFavorites(true);
    setMovies(getFavoriteMovies());
    setTotalPages(1);
    setIsFiltered(true);
  };

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const response = await fetchTrendingMovies(1);
        const filteredMovies = response.data.results.filter(
          (movie: any) => movie.poster_path && movie.backdrop_path
        );
        setMovies(filteredMovies);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (searchQuery) {
        setLoading(true);
        setPage(1);
        try {
          const response = await searchMovies(searchQuery, 1);
          const filteredMovies = response.data.results.filter(
            (movie: any) => movie.poster_path && movie.backdrop_path
          );
          setMovies(filteredMovies);
          setTotalPages(response.data.total_pages);
          setIsFiltered(false);
        } catch (error) {
          console.error('Error searching movies:', error);
        } finally {
          setLoading(false);
        }
      } else if (!isFiltered) {
        const response = await fetchTrendingMovies(1);
        const filteredMovies = response.data.results.filter(
          (movie: any) => movie.poster_path && movie.backdrop_path
        );
        setMovies(filteredMovies);
        setTotalPages(response.data.total_pages);
      }
    }, 500);

    return () => clearTimeout(searchTimer);
  }, [searchQuery, isFiltered]);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      pt: 4,
      pb: 8
    }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 6, position: 'relative' }}>
          {showFavorites && (
            <IconButton
              onClick={handleResetFilters}
              sx={{
                position: 'absolute',
                left: { xs: '16px', sm: '32px' },
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'primary.main',
                color: '#000',
                '&:hover': {
                  bgcolor: 'primary.light',
                },
                width: '48px',
                height: '48px',
                zIndex: 2,
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              textAlign: 'center',
              mb: 4,
              background: 'linear-gradient(45deg, #FFD700 30%, #FFA500 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              textShadow: '4px 4px 8px rgba(0,0,0,0.3)',
              fontFamily: "'Trajan Pro', 'Times New Roman', serif",
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '150px',
                height: '4px',
                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                borderRadius: '2px',
              }
            }}
          >
            {showFavorites ? 'My Favorite Movies' : 'Waseem Movie Browser'}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            alignItems: 'center',
            maxWidth: '800px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1,
          }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search for movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={showFavorites}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                },
              }}
            />
            <IconButton 
              onClick={handleFilterClick}
              disabled={showFavorites}
              sx={{ 
                bgcolor: 'primary.main',
                color: '#000',
                width: '56px',
                height: '56px',
                '&:hover': { 
                  bgcolor: 'primary.light',
                  transform: 'rotate(180deg)',
                  transition: 'transform 0.3s ease-in-out',
                }
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 4 }}>
          <Button
            variant={showFavorites ? "contained" : "outlined"}
            onClick={handleShowFavorites}
            startIcon={<Favorite />}
            sx={{
              borderRadius: '20px',
              px: 3,
              py: 1,
              '&.MuiButton-contained': {
                background: 'linear-gradient(45deg, #ff1744 30%, #ff4081 90%)',
              },
            }}
          >
            My Favorites
          </Button>
        </Box>

        <MovieDetails 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            sx: {
              width: 300,
              p: 3,
              background: 'linear-gradient(145deg, #242438, #2a2a40)',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Genre</InputLabel>
              <Select
                value={selectedGenre}
                label="Genre"
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <MenuItem value="">All Genres</MenuItem>
                {GENRES.map((genre) => (
                  <MenuItem key={genre} value={genre}>{genre}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                value={selectedLanguage}
                label="Language"
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                <MenuItem value="">All Languages</MenuItem>
                {LANGUAGES.map((language) => (
                  <MenuItem key={language} value={language}>{language}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <MenuItem value="">All Years</MenuItem>
                {YEARS.map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ px: 1 }}>
              <Typography gutterBottom sx={{ color: 'text.secondary', mb: 2 }}>
                Rating Range
              </Typography>
              <Slider
                value={ratingRange}
                onChange={(_, newValue) => setRatingRange(newValue as number[])}
                valueLabelDisplay="auto"
                min={0}
                max={10}
                step={0.5}
                sx={{
                  '& .MuiSlider-thumb': {
                    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                  },
                  '& .MuiSlider-track': {
                    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                  },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button 
                variant="outlined" 
                onClick={handleResetFilters}
                fullWidth
                sx={{
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.light',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  },
                }}
              >
                Reset
              </Button>
              <Button 
                variant="contained" 
                onClick={handleApplyFilters}
                fullWidth
              >
                Apply Filters
              </Button>
            </Box>
          </Box>
        </Menu>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} thickness={4} sx={{ color: 'primary.main' }} />
          </Box>
        ) : (
          <>
            <Grid container spacing={4}>
              {movies.map((movie) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                  <MovieCard 
                    movie={movie} 
                    onClick={() => handleMovieClick(movie)}
                  />
                </Grid>
              ))}
            </Grid>

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 6,
              mb: 4,
              '& .MuiPagination-ul': {
                gap: 1,
              }
            }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton 
                showLastButton
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontSize: '1.1rem',
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 4,
                pt: 3,
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
              }}
            >
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.9rem',
                  fontStyle: 'italic',
                  background: 'linear-gradient(45deg, #FFD700 30%, #FFA500 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Powered by Waseem
              </Typography>

              {/* WASEEM Logo */}
              <Box
                sx={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '200px',
                  height: '60px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <Typography
                  className="logo-text"
                  sx={{
                    fontSize: '2rem',
                    fontFamily: "'Times New Roman', serif",
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '-4px',
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: '#FFFFFF',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-4px',
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: '#FFFFFF',
                    }
                  }}
                >
                  WASEEM
                </Typography>
              </Box>

              <Typography
                component="a"
                href="mailto:waseem007md@gmail.com"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: 'primary.main',
                    background: 'linear-gradient(45deg, #FFD700 30%, #FFA500 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  },
                }}
              >
                waseem007md@gmail.com
              </Typography>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Home; 