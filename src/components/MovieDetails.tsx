import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  Collapse,
  Rating,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getImageUrl } from '../services/api';

interface MovieDetailsProps {
  movie: {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
    original_language: string;
    genres?: { id: number; name: string }[];
  } | null;
  onClose: () => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <Collapse in={Boolean(movie)}>
      <Paper
        sx={{
          p: 2,
          mb: 2,
          display: 'flex',
          gap: 2,
          bgcolor: 'background.paper',
          position: 'relative',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box
          component="img"
          src={getImageUrl(movie.poster_path, 'w185')}
          alt={movie.title}
          sx={{
            width: 185,
            height: 278,
            objectFit: 'cover',
            borderRadius: 1,
          }}
        />

        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" gutterBottom>
            {movie.title}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Rating
              value={movie.vote_average / 2}
              precision={0.5}
              readOnly
            />
            <Typography variant="body2" color="text.secondary">
              ({movie.vote_average.toFixed(1)}/10)
            </Typography>
          </Box>

          <Typography variant="body1" gutterBottom>
            Release Date: {new Date(movie.release_date).toLocaleDateString()}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            {movie.genres?.map((genre) => (
              <Chip
                key={genre.id}
                label={genre.name}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>

          <Typography variant="body1" paragraph>
            {movie.overview}
          </Typography>
        </Box>
      </Paper>
    </Collapse>
  );
};

export default MovieDetails; 