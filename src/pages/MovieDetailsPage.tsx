import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Rating,
  Chip,
  CircularProgress,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchMovieDetails } from '../services/api';
import { getImageUrl } from '../services/api';

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  runtime: number;
  genres: { id: number; name: string }[];
  spoken_languages: { english_name: string }[];
  production_companies: { name: string; logo_path: string | null }[];
  credits?: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
  };
}

const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        const response = await fetchMovieDetails(Number(id));
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress size={60} thickness={4} sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  if (!movie) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5">Movie not found</Typography>
        <Button onClick={() => navigate('/')} startIcon={<ArrowBackIcon />}>
          Back to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    }}>
      {/* Backdrop Image */}
      <Box sx={{
        position: 'relative',
        height: '500px',
        width: '100%',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(26,26,46,0.5) 0%, #1a1a2e 100%)',
          zIndex: 1,
        },
      }}>
        <Box
          component="img"
          src={getImageUrl(movie.backdrop_path || movie.poster_path, 'original')}
          alt={movie.title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>

      {/* Back Button */}
      <IconButton
        onClick={() => navigate('/')}
        sx={{
          position: 'fixed',
          top: 20,
          left: 20,
          bgcolor: 'primary.main',
          color: '#000',
          zIndex: 2,
          '&:hover': {
            bgcolor: 'primary.light',
          },
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Movie Details */}
      <Container maxWidth="xl" sx={{ mt: -20, position: 'relative', zIndex: 2 }}>
        <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
          {/* Poster */}
          <Box
            component="img"
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            sx={{
              width: 300,
              height: 450,
              borderRadius: 2,
              boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
            }}
          />

          {/* Info */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" sx={{ 
              fontWeight: 'bold',
              color: 'white',
              mb: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}>
              {movie.title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Rating
                value={movie.vote_average / 2}
                precision={0.5}
                readOnly
                sx={{
                  '& .MuiRating-icon': {
                    color: 'primary.main',
                  },
                }}
              />
              <Typography sx={{ color: 'text.secondary' }}>
                ({movie.vote_average.toFixed(1)}/10)
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
              {movie.genres.map((genre) => (
                <Chip
                  key={genre.id}
                  label={genre.name}
                  sx={{
                    bgcolor: 'primary.main',
                    color: '#000',
                    fontWeight: 'bold',
                  }}
                />
              ))}
            </Box>

            <Typography variant="body1" sx={{ color: 'text.primary', mb: 3 }}>
              {movie.overview}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="body1" sx={{ color: 'text.primary' }}>
                <strong>Release Date:</strong> {new Date(movie.release_date).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.primary' }}>
                <strong>Runtime:</strong> {movie.runtime} minutes
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.primary' }}>
                <strong>Languages:</strong> {movie.spoken_languages.map(lang => lang.english_name).join(', ')}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Cast Section */}
        {movie.credits?.cast && movie.credits.cast.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h4" sx={{ color: 'white', mb: 3 }}>
              Cast
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 3, 
              overflowX: 'auto',
              pb: 2,
              '&::-webkit-scrollbar': {
                height: 8,
              },
              '&::-webkit-scrollbar-track': {
                bgcolor: 'background.paper',
                borderRadius: 4,
              },
              '&::-webkit-scrollbar-thumb': {
                bgcolor: 'primary.main',
                borderRadius: 4,
              },
            }}>
              {movie.credits.cast.slice(0, 10).map((actor) => (
                actor.profile_path && (
                  <Box
                    key={actor.id}
                    sx={{
                      minWidth: 150,
                      textAlign: 'center',
                    }}
                  >
                    <Box
                      component="img"
                      src={getImageUrl(actor.profile_path, 'w185')}
                      alt={actor.name}
                      sx={{
                        width: 150,
                        height: 225,
                        borderRadius: 2,
                        mb: 1,
                      }}
                    />
                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {actor.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {actor.character}
                    </Typography>
                  </Box>
                )
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default MovieDetailsPage; 