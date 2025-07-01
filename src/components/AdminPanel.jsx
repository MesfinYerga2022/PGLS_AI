import React, { useState } from "react";
import { useData } from "../context/DataContext";
import {
  Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Paper, Chip, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { Delete } from "@mui/icons-material";

// Ensure lower case for matching super admin
const ADMIN_EMAIL = "mesfin.yerga@arcadis.com";

export default function AdminPanel() {
  const { users, approveUser, makeAdmin, removeUser, user } = useData();
  const [removeDialog, setRemoveDialog] = useState({ open: false, email: "" });

  // Only admins can see the panel
  if (!user?.isAdmin) {
    return (
      <Typography variant="h6" color="error" sx={{ mt: 4, textAlign: "center" }}>
        Admin access required.
      </Typography>
    );
  }

  // Handler for remove confirmation
  const handleRemove = (email) => setRemoveDialog({ open: true, email });
  const confirmRemove = () => {
    removeUser(removeDialog.email);
    setRemoveDialog({ open: false, email: "" });
  };

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 880, margin: "40px auto", p: 3 }}>
      <Typography variant="h5" fontWeight={800} color="#fa8000" sx={{ mb: 3 }}>
        Admin: User Management
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Approved</TableCell>
            <TableCell>Admin</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">No users registered.</TableCell>
            </TableRow>
          ) : (
            users.map(u => (
              <TableRow key={u.email} hover>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  {u.isApproved
                    ? <Chip label="Approved" color="success" size="small" />
                    : <Chip label="Pending" color="warning" size="small" />}
                </TableCell>
                <TableCell>
                  {u.isAdmin
                    ? <Chip label="Admin" color="primary" size="small" />
                    : <Chip label="User" color="default" size="small" />}
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    {!u.isApproved && (
                      <Button
                        onClick={() => approveUser(u.email)}
                        variant="contained"
                        color="success"
                        size="small"
                      >Approve</Button>
                    )}
                    {!u.isAdmin && (
                      <Button
                        onClick={() => makeAdmin(u.email)}
                        variant="contained"
                        color="warning"
                        size="small"
                      >Make Admin</Button>
                    )}
                    {/* Super admin cannot be removed */}
                    {u.email.toLowerCase() !== ADMIN_EMAIL && (
                      <Button
                        onClick={() => handleRemove(u.email)}
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<Delete />}
                      >Remove</Button>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Remove confirmation dialog */}
      <Dialog open={removeDialog.open} onClose={() => setRemoveDialog({ open: false, email: "" })}>
        <DialogTitle>Confirm Removal</DialogTitle>
        <DialogContent>
          Are you sure you want to remove <b>{removeDialog.email}</b>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveDialog({ open: false, email: "" })}>Cancel</Button>
          <Button color="error" onClick={confirmRemove}>Remove</Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}
