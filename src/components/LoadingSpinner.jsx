import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Stack,
  Fade,
  useTheme,
  alpha
} from '@mui/material';

export default function LoadingSpinner({ 
  message = "Loading...", 
  size = 40, 
  showMessage = true,
  overlay = false 
}) {
  const theme = useTheme();

  const content = (
    <Stack alignItems="center" spacing={2}>
      <CircularProgress 
        size={size} 
        sx={{ 
          color: theme.palette.secondary.main,
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          }
        }} 
      />
      {showMessage && (
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {message}
        </Typography>
      )}
    </Stack>
  );

  if (overlay) {
    return (
      <Fade in>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: alpha(theme.palette.background.default, 0.8),
            backdropFilter: 'blur(4px)',
            zIndex: theme.zIndex.modal,
          }}
        >
          {content}
        </Box>
      </Fade>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      {content}
    </Box>
  );
}
