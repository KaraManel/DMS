import React from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";

const AddFolderModal = ({ open, handleClose, handleChange, handleAddFolder, newFolder }) => {
    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>Add New Folder</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Folder Name"
                    name="name"
                    type="text"
                    fullWidth
                    value={newFolder.name}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">Cancel</Button>
                <Button onClick={handleAddFolder} color="primary">Add Folder</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddFolderModal;
