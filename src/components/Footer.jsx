import React from "react";
import {
  Box,
  Typography,
  Stack,
  Link,
  Divider,
  useTheme,
  alpha
} from "@mui/material";
import {
  Copyright,
  Business,
  Code,
  Security
} from "@mui/icons-material";

export default function Footer() {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 3,
        px: 4,
        backgroundColor: alpha(theme.palette.primary.main, 0.02),
        borderTop: `1px solid ${theme.palette.grey[200]}`,
        backdropFilter: 'blur(10px)',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ maxWidth: 1200, margin: '0 auto' }}
      >
        {/* Left Section - Copyright */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Copyright sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            {currentYear} Arcadis Group. All rights reserved.
          </Typography>
        </Stack>

        {/* Center Section - Platform Info */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Business sx={{ fontSize: 16, color: theme.palette.secondary.main }} />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            Enterprise AI Data Platform
          </Typography>
        </Stack>

        {/* Right Section - Developer Info */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Code sx={{ fontSize: 16, color: theme.palette.info.main }} />
          <Typography variant="body2" color="text.secondary">
            Designed & Developed by{' '}
            <Link
              href="mailto:mesfin.yerga@arcadis.com"
              sx={{
                color: theme.palette.secondary.main,
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Mesfin Yerga
            </Link>
          </Typography>
        </Stack>
      </Stack>

      <Divider sx={{ my: 2, opacity: 0.3 }} />

      {/* Bottom Section - Security & Privacy */}
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <Security sx={{ fontSize: 14, color: theme.palette.success.main }} />
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textAlign: 'center' }}
        >
          Secure • Private • Compliant with Enterprise Standards
        </Typography>
      </Stack>
    </Box>
  );
}
