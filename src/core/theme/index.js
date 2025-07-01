// src/theme.js
import { createTheme } from '@mui/material/styles';

export function getTheme(mode = 'light') {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#1c4587', // Arcadis deep blue
        light: '#4a90e2',
        dark: '#0f2c47',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#fa8000', // Arcadis signature orange
        light: '#ffa733',
        dark: '#cc6600',
        contrastText: '#ffffff',
      },
      background: {
        default: mode === 'light' ? '#f8fafb' : '#0f1419',
        paper: mode === 'light' ? '#ffffff' : '#1a1f2e',
      },
      text: {
        primary: mode === 'light' ? '#1a202c' : '#e2e8f0',
        secondary: mode === 'light' ? '#4a5568' : '#a0aec0',
      },
      grey: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      },
      success: {
        main: '#10b981',
        light: '#34d399',
        dark: '#059669',
      },
      warning: {
        main: '#f59e0b',
        light: '#fbbf24',
        dark: '#d97706',
      },
      error: {
        main: '#ef4444',
        light: '#f87171',
        dark: '#dc2626',
      },
      info: {
        main: '#3b82f6',
        light: '#60a5fa',
        dark: '#2563eb',
      },
    },
    typography: {
      fontFamily: "'Inter', 'Roboto', 'Segoe UI', sans-serif",
      h1: { 
        fontWeight: 800,
        fontSize: '2.5rem',
        lineHeight: 1.2,
        letterSpacing: '-0.025em',
      },
      h2: { 
        fontWeight: 700,
        fontSize: '2rem',
        lineHeight: 1.25,
        letterSpacing: '-0.025em',
      },
      h3: { 
        fontWeight: 700,
        fontSize: '1.75rem',
        lineHeight: 1.3,
      },
      h4: { 
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.35,
      },
      h5: { 
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.4,
      },
      h6: { 
        fontWeight: 600,
        fontSize: '1.125rem',
        lineHeight: 1.45,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
      },
      caption: {
        fontSize: '0.75rem',
        lineHeight: 1.5,
        color: '#6b7280',
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      'none',
      '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      ...Array(19).fill('0 25px 50px -12px rgba(0, 0, 0, 0.25)'),
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*': {
            scrollbarWidth: 'thin',
            scrollbarColor: '#d1d5db #f9fafb',
          },
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '*::-webkit-scrollbar-track': {
            background: '#f9fafb',
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#d1d5db',
            borderRadius: '4px',
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#9ca3af',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.875rem',
            padding: '10px 20px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              transform: 'translateY(-1px)',
              transition: 'all 0.2s ease-in-out',
            },
          },
          contained: {
            '&:hover': {
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
            },
          },
          outlined: {
            borderWidth: '2px',
            '&:hover': {
              borderWidth: '2px',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid #f3f4f6',
            '&:hover': {
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              transition: 'box-shadow 0.2s ease-in-out',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: '1px solid #f3f4f6',
          },
          elevation1: {
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#fa8000',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#fa8000',
                borderWidth: '2px',
              },
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#fa8000',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#fa8000',
              borderWidth: '2px',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: '1px solid',
          },
          standardSuccess: {
            backgroundColor: '#f0fdf4',
            borderColor: '#bbf7d0',
            color: '#166534',
          },
          standardError: {
            backgroundColor: '#fef2f2',
            borderColor: '#fecaca',
            color: '#dc2626',
          },
          standardWarning: {
            backgroundColor: '#fffbeb',
            borderColor: '#fed7aa',
            color: '#d97706',
          },
          standardInfo: {
            backgroundColor: '#eff6ff',
            borderColor: '#bfdbfe',
            color: '#2563eb',
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: '2px 8px',
            '&.Mui-selected': {
              backgroundColor: 'rgba(250, 128, 0, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(250, 128, 0, 0.15)',
              },
            },
            '&:hover': {
              backgroundColor: 'rgba(250, 128, 0, 0.05)',
            },
          },
        },
      },
    },
  });
}
