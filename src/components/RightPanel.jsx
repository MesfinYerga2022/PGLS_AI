import React from "react";
import { Box, Paper, Divider } from "@mui/material";

export default function RightPanel() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 80, // Height of header, adjust if needed
        right: 0,
        width: 360,
        minHeight: "calc(100vh - 110px)",
        px: 3,
        py: 4,
        bgcolor: "#fffbe8",
        boxShadow: "0 4px 32px 0 #fae0aa33",
        borderLeft: "1px solid #faebd7",
        zIndex: 1000,
        display: { xs: "none", md: "block" },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          background: "#fffde7",
          p: 3,
          borderRadius: 3,
          boxShadow: "0 2px 16px 0 #fae0aa33",
        }}
      >
        <Box sx={{ fontWeight: 700, fontSize: 18, mb: 1, color: "#1665a6" }}>Info & Support</Box>
        <Divider sx={{ mb: 1, bgcolor: "#e0e0e0" }} />
        <Box sx={{ color: "#614A00", fontSize: 16 }}>
          <div>- Need help with the data?</div>
          <div>
            - Contact:{" "}
            <a href="mailto:ai-support@arcadis.com" style={{ color: "#fa8000", fontWeight: 600 }}>
              ai-support@arcadis.com
            </a>
          </div>
          <div>- More features coming soon!</div>
        </Box>
      </Paper>
    </Box>
  );
}
