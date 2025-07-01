import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import arcadisLogo from "../assets/arcadis_logo.png";

export default function Header() {
  return (
    <AppBar position="static" color="inherit" elevation={0} sx={{ bgcolor: "#fff" }}>
      <Toolbar sx={{ justifyContent: "center", py: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <img src={arcadisLogo} alt="Arcadis Logo" style={{ height: 38, marginRight: 10 }} />
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ color: "#fa8000", letterSpacing: 2, fontSize: "2rem" }}
          >
            PGLS AI Platform
          </Typography>
        </Box>
        <Box sx={{ position: "absolute", right: 32 }}>
          <Typography variant="subtitle1" sx={{ color: "#666", fontWeight: 500 }}>
            Welcome, Arcadis User
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
