import React, { useState } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";

const EditUserModal = ({ open, handleClose, user, handleSave }) => {
    const [editedUser, setEditedUser] = useState(user);

    const handleChange = (e) => {
        setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
    };

    const handleSaveClick = () => {
        handleSave(editedUser);
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" mb={2}>Edit User</Typography>
                <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={editedUser.name}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={editedUser.email}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Role"
                    name="role"
                    value={editedUser.role}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Status"
                    name="status"
                    value={editedUser.status}
                    onChange={handleChange}
                    margin="normal"
                />
                <Box display="flex" justifyContent="space-between" mt={3}>
                    <Button variant="contained" color="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSaveClick}>
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditUserModal;
