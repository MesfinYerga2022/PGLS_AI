import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Chip,
  alpha,
  useTheme
} from "@mui/material";
import {
  Home,
  CloudUpload,
  BarChart,
  Analytics,
  FileDownload,
  AdminPanelSettings,
  TrendingUp
} from "@mui/icons-material";

const menu = [
  { key: "home", label: "Home", icon: <Home /> },
  { key: "upload", label: "Upload Data", icon: <CloudUpload /> },
  { key: "charts", label: "Charts & Visualization", icon: <BarChart /> },
  { key: "eda", label: "EDA & Interpretation", icon: <Analytics /> },
  { key: "export", label: "Export & Reporting", icon: <FileDownload /> }
];

export default function AppSidebar({ selected, setSelected, user }) {
  const theme = useTheme();

  if (!user) {
    return (
      <Drawer
        variant="permanent"
        sx={{
          width: 280,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            position: 'static',
            background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
            borderRight: `1px solid ${theme.palette.grey[200]}`,
          },
        }}
      >
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Please sign in to continue
          </Typography>
        </Box>
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          position: 'static',
          background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
          borderRight: `1px solid ${theme.palette.grey[200]}`,
        },
      }}
    >
      {/* Navigation Header */}
      <Box sx={{ p: 3, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <TrendingUp sx={{ color: theme.palette.secondary.main }} />
          <Typography variant="h6" fontWeight={700} color="text.primary">
            Navigation
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Explore data insights and analytics
        </Typography>
      </Box>

      <Divider sx={{ mx: 2, mb: 1 }} />

      {/* Navigation Menu */}
      <List sx={{ px: 2, flex: 1 }}>
        {menu.map((item) => (
          <ListItem key={item.key} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={selected === item.key}
              onClick={() => setSelected(item.key)}
              sx={{
                borderRadius: 2,
                py: 1.5,
                px: 2,
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.secondary.main, 0.12),
                  color: theme.palette.secondary.main,
                  boxShadow: `0 2px 8px ${alpha(theme.palette.secondary.main, 0.2)}`,
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.secondary.main,
                  },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.secondary.main, 0.16),
                  },
                },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.secondary.main, 0.04),
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.secondary.main,
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: selected === item.key ? theme.palette.secondary.main : theme.palette.text.secondary,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: selected === item.key ? 600 : 500,
                  fontSize: '0.9rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}

        {/* Admin Section */}
        {user?.isAdmin && (
          <>
            <Divider sx={{ my: 2, mx: 1 }} />
            <ListItem disablePadding>
              <ListItemButton
                selected={selected === "admin"}
                onClick={() => setSelected("admin")}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  px: 2,
                  '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    color: theme.palette.primary.main,
                    boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.primary.main,
                    },
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.16),
                    },
                  },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.primary.main,
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: selected === "admin" ? theme.palette.primary.main : theme.palette.text.secondary,
                  }}
                >
                  <AdminPanelSettings />
                </ListItemIcon>
                <ListItemText
                  primary="Admin Panel"
                  primaryTypographyProps={{
                    fontWeight: selected === "admin" ? 600 : 500,
                    fontSize: '0.9rem',
                  }}
                />
                <Chip
                  label="Admin"
                  size="small"
                  color="primary"
                  sx={{
                    height: 20,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                  }}
                />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>

      {/* Footer */}
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.info.main, 0.08),
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
          }}
        >
          <Typography variant="caption" color="info.main" fontWeight={600}>
            💡 Tip
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
            Upload data to unlock AI-powered insights and visualizations
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}
