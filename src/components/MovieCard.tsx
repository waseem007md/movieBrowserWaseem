import React, { useState, useEffect } from 'react';
import { Card, CardMedia, Typography, Box, Rating, IconButton } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { getImageUrl } from '../services/api';
import { addFavoriteMovie, removeFavoriteMovie, isMovieFavorite } from '../utils/localStorage';

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
  };
  onClick?: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(isMovieFavorite(movie.id));
  }, [movie.id]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    if (isFavorite) {
      removeFavoriteMovie(movie.id);
    } else {
      addFavoriteMovie(movie);
    }
    setIsFavorite(!isFavorite);
  };

  return (
    <Card 
      onClick={onClick}
      sx={{ 
        position: 'relative',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 70%, rgba(0,0,0,0.8) 100%)',
          zIndex: 1,
          opacity: 0,
          transition: 'opacity 0.3s ease-in-out',
        },
        '&:hover': {
          '&::before': {
            opacity: 1,
          },
          '& .movie-info': {
            transform: 'translateY(0)',
            opacity: 1,
          },
          '& .favorite-button': {
            opacity: 1,
          }
        },
      }}
    >
      <IconButton
        className="favorite-button"
        onClick={handleFavoriteClick}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 2,
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          opacity: isFavorite ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out, background-color 0.3s ease-in-out',
          '&:hover': {
            bgcolor: 'rgba(0, 0, 0, 0.7)',
          },
        }}
      >
        {isFavorite ? (
          <Favorite sx={{ color: '#ff1744' }} />
        ) : (
          <FavoriteBorder sx={{ color: 'white' }} />
        )}
      </IconButton>

      <CardMedia
        component="img"
        image={getImageUrl(movie.poster_path)}
        alt={movie.title}
        sx={{ 
          height: 400,
          objectFit: 'cover',
        }}
      />
      <Box
        className="movie-info"
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          p: 2,
          transform: 'translateY(20px)',
          opacity: 0,
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            color: 'white',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            mb: 1,
          }}
        >
          {movie.title}
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255,255,255,0.8)',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            {new Date(movie.release_date).getFullYear()}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating
              value={movie.vote_average / 2}
              precision={0.5}
              readOnly
              size="small"
              sx={{
                '& .MuiRating-icon': {
                  color: 'primary.main',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                },
              }}
            />
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              ({movie.vote_average.toFixed(1)})
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default MovieCard; 