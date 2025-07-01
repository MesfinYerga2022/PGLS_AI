// src/components/LoginSwitcher.jsx
import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { MenuItem, Select, Box, Typography, Button } from "@mui/material";

export default function LoginSwitcher() {
  const { users, user, setUser } = useData();
  const [selected, setSelected] = useState(user?.email || "");

  const handleChange = (e) => setSelected(e.target.value);

  const handleLogin = () => {
    const found = users.find(u => u.email === selected);
    if (found) setUser(found);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="textSecondary">Login as:</Typography>
      <Select
        size="small"
        value={selected}
        onChange={handleChange}
        sx={{ minWidth: 220, mx: 1 }}
      >
        {users.map(u => (
          <MenuItem key={u.email} value={u.email}>
            {u.name} &lt;{u.email}&gt; {u.isAdmin ? "(Admin)" : ""}
          </MenuItem>
        ))}
      </Select>
      <Button
        variant="contained"
        size="small"
        sx={{ ml: 1 }}
        onClick={handleLogin}
      >
        Switch
      </Button>
    </Box>
  );
}
