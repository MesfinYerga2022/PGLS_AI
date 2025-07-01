import React from "react";
import { useData } from "../context/DataContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Button,
  IconButton,
  Chip,
  Stack,
  useTheme,
  alpha
} from "@mui/material";
import { Logout, AdminPanelSettings } from "@mui/icons-material";

export default function AppHeader() {
  const { user, logout, login } = useData();
  const theme = useTheme();

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        backgroundColor: 'white',
        borderBottom: `1px solid ${theme.palette.grey[200]}`,
        backdropFilter: 'blur(10px)',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 1, px: 3 }}>
        {/* Logo and Brand */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            component="img"
            src="/arcadis_logo.png"
            alt="Arcadis Logo"
            sx={{
              height: 40,
              width: 'auto',
              filter: 'brightness(1.1)',
            }}
          />
          <Box>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 800,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
              }}
            >
              Arcadis AI Platform
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              Data Intelligence & Analytics
            </Typography>
          </Box>
        </Stack>

        {/* User Section */}
        {user ? (
          <Stack direction="row" alignItems="center" spacing={2}>
            {user.isAdmin && (
              <Chip
                icon={<AdminPanelSettings />}
                label="Admin"
                size="small"
                color="primary"
                variant="outlined"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              />
            )}
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar
                src={user.avatar}
                alt={user.name}
                sx={{
                  width: 36,
                  height: 36,
                  border: `2px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                  boxShadow: `0 2px 8px ${alpha(theme.palette.secondary.main, 0.15)}`,
                }}
              />
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    lineHeight: 1.2,
                  }}
                >
                  {user.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    lineHeight: 1,
                  }}
                >
                  {user.email}
                </Typography>
              </Box>
            </Stack>
            <IconButton
              onClick={logout}
              size="small"
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.error.main,
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                },
              }}
              title="Logout"
            >
              <Logout fontSize="small" />
            </IconButton>
          </Stack>
        ) : (
          <Button
            variant="contained"
            onClick={login}
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              fontWeight: 600,
              px: 3,
            }}
          >
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
