import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Grid,
  Paper,
  useTheme,
  alpha,
  Tooltip
} from "@mui/material";
import {
  CloudUpload,
  BarChart,
  Analytics,
  AutoAwesome,
  Security,
  Speed,
  TrendingUp,
  Microsoft
} from "@mui/icons-material";
import { useData } from "../context/DataContext";

const features = [
  {
    icon: <CloudUpload />,
    title: "Smart Data Upload",
    description: "Upload Excel and CSV files with instant preview and validation",
    action: "upload"
  },
  {
    icon: <BarChart />,
    title: "Interactive Visualizations", 
    description: "Create professional charts with drag-and-drop simplicity",
    action: "charts"
  },
  {
    icon: <Analytics />,
    title: "AI-Powered EDA",
    description: "Automated exploratory data analysis with intelligent insights",
    action: "eda"
  },
  {
    icon: <AutoAwesome />,
    title: "Natural Language Queries",
    description: "Ask questions about your data in plain English",
    action: "eda"
  }
];

export default function WelcomePanel({ pending, onNavigate }) {
  const { user, login } = useData();
  const theme = useTheme();

  const handleUploadClick = () => {
    if (onNavigate) {
      onNavigate('upload');
    }
  };

  const handleFeatureClick = (action) => {
    if (onNavigate && user && user.isApproved) {
      onNavigate(action);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', py: 4 }}>
      {/* Hero Section */}
      <Card
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
          mb: 4,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <CardContent sx={{ p: 6, textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Background Pattern */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.05,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fa8000' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='2'/%3E%3Ccircle cx='27' cy='7' r='2'/%3E%3Ccircle cx='47' cy='7' r='2'/%3E%3Ccircle cx='7' cy='27' r='2'/%3E%3Ccircle cx='27' cy='27' r='2'/%3E%3Ccircle cx='47' cy='27' r='2'/%3E%3Ccircle cx='7' cy='47' r='2'/%3E%3Ccircle cx='27' cy='47' r='2'/%3E%3Ccircle cx='47' cy='47' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          
          <Box
            component="img"
            src="/arcadis_logo.png"
            alt="Arcadis Logo"
            sx={{
              height: 60,
              mb: 3,
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))',
            }}
          />
          
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Arcadis AI Platform
          </Typography>
          
          <Typography
            variant="h6"
            color="text.secondary"
            gutterBottom
            sx={{ mb: 4, maxWidth: 600, mx: 'auto', fontWeight: 400 }}
          >
            Transform your data into actionable insights with cutting-edge AI technology
          </Typography>

          {/* Status Messages */}
          {pending ? (
            <Box sx={{ mb: 3 }}>
              <Chip
                icon={<Security />}
                label="Account Pending Approval"
                color="warning"
                size="large"
                sx={{ mb: 2, fontSize: '1rem', py: 2, px: 1 }}
              />
              <Typography color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
                Your account is currently under review. You will receive access once an administrator approves your request.
              </Typography>
            </Box>
          ) : !user ? (
            <Box sx={{ mb: 3 }}>
              <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
                Sign in with your Microsoft account to access advanced data analytics and AI-powered insights.
              </Typography>
              <Button
                onClick={login}
                variant="contained"
                size="large"
                startIcon={<Microsoft />}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                  boxShadow: `0 8px 25px ${alpha(theme.palette.secondary.main, 0.3)}`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 12px 35px ${alpha(theme.palette.secondary.main, 0.4)}`,
                  },
                }}
              >
                Sign in with Microsoft
              </Button>
            </Box>
          ) : (
            <Box sx={{ mb: 3 }}>
              <Chip
                icon={<TrendingUp />}
                label={`Welcome back, ${user.name}!`}
                color="success"
                size="large"
                sx={{ mb: 2, fontSize: '1rem', py: 2, px: 1 }}
              />
              <Typography color="text.secondary">
                Ready to explore your data? Choose an option from the sidebar to get started.
              </Typography>
            </Box>
          )}

          {/* Key Metrics */}
          <Stack direction="row" spacing={4} justifyContent="center" sx={{ mt: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={800} color="primary.main">
                10x
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Faster Analysis
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={800} color="secondary.main">
                AI
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Powered Insights
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={800} color="success.main">
                24/7
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Tooltip 
              title={
                !(user && user.isApproved) 
                  ? "Please sign in and get approved to access this feature" 
                  : `Click to go to ${feature.title}`
              }
              arrow
            >
              <Paper
                onClick={() => handleFeatureClick(feature.action)}
                sx={{
                  p: 3,
                  height: '100%',
                  textAlign: 'center',
                  border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                  transition: 'all 0.3s ease',
                  cursor: (user && user.isApproved) ? 'pointer' : 'default',
                  opacity: (user && user.isApproved) ? 1 : 0.7,
                  '&:hover': {
                    transform: (user && user.isApproved) ? 'translateY(-4px)' : 'none',
                    boxShadow: (user && user.isApproved) 
                      ? `0 8px 25px ${alpha(theme.palette.secondary.main, 0.15)}`
                      : 'inherit',
                    borderColor: (user && user.isApproved) 
                      ? alpha(theme.palette.secondary.main, 0.3)
                      : 'inherit',
                  },
                }}
              >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)} 30%, ${alpha(theme.palette.secondary.main, 0.1)} 90%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: theme.palette.secondary.main,
                }}
              >
                {React.cloneElement(feature.icon, { fontSize: 'large' })}
              </Box>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                {feature.title}
              </Typography>                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Tooltip>
          </Grid>
        ))}
      </Grid>

      {/* Getting Started */}
      {user && !pending && (
        <Card sx={{ mt: 4, background: alpha(theme.palette.info.main, 0.05) }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Speed sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Ready to Get Started?
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
              Upload your first dataset and discover powerful insights with our AI-driven analytics platform.
            </Typography>
            <Button
              variant="contained"
              color="info"
              size="large"
              onClick={handleUploadClick}
              sx={{ fontWeight: 600 }}
            >
              Upload Your First Dataset
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
