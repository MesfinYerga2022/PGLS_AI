// src/components/InviteUserForm.jsx
import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { Box, TextField, Button, Typography } from "@mui/material";

export default function InviteUserForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const { sendInvite } = useData();

  const handleInvite = async () => {
    if (!email || !name) return setMsg("Name and email required");
    const result = await sendInvite({ email, name });
    setMsg(result ? "Invite sent!" : "Failed to send invite.");
    setEmail(""); setName("");
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>Invite New User</Typography>
      <TextField
        label="Name" size="small" sx={{ mr: 1 }}
        value={name} onChange={e => setName(e.target.value)}
      />
      <TextField
        label="Email" size="small" sx={{ mr: 1 }}
        value={email} onChange={e => setEmail(e.target.value)}
      />
      <Button variant="contained" onClick={handleInvite}>Send Invite</Button>
      {msg && <Typography color="secondary" sx={{ ml: 2 }}>{msg}</Typography>}
    </Box>
  );
}
