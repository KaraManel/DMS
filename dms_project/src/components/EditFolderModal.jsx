import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";

const EditFolderModal = ({ open, handleClose, folder, handleSave }) => {
    const [editedFolder, setEditedFolder] = useState(folder);

    useEffect(() => {
        setEditedFolder(folder);
    }, [folder]);

    const handleChange = (e) => {
        setEditedFolder({ ...editedFolder, [e.target.name]: e.target.value });
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>Edit Folder</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Folder Name"
                    name="name"
                    type="text"
                    fullWidth
                    value={editedFolder?.name || ""}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">Cancel</Button>
                <Button onClick={() => handleSave(editedFolder)} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditFolderModal;
