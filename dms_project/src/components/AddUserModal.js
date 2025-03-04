import React, { useState, useRef } from 'react';
import { Modal, TextField, Box, MenuItem, Select, InputLabel, FormControl, Button } from '@mui/material';
import Papa from 'papaparse';

const AddUserModal = ({ open, handleClose, handleChange, handleAddUser, newUser, handleImport }) => {
    const [csvFile, setCsvFile] = useState(null);
    const fileInputRef = useRef(null);  // Create a ref for the file input

    const handleFileChange = (event) => {
        setCsvFile(event.target.files[0]);
    };

    const handleCSVImport = () => {
        if (!csvFile) return;

        Papa.parse(csvFile, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
                handleImport(result.data);
            }
        });
    };

    // Function to reset file input when modal is closed
    const handleModalClose = () => {
        setCsvFile(null); // Clear the selected file state
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset the file input field
        }
        handleClose(); // Call the original handleClose function
    };

    return (
        <Modal open={open} onClose={handleModalClose}>
            <Box
                sx={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: 400, bgcolor: 'background.paper', p: 4, boxShadow: 24, borderRadius: 2
                }}>

                {/* Header with "Add New User" and "Import" button */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <h2>Add New User</h2>
                    <Button variant="outlined" component="label">
                        Import
                        <input type="file" hidden accept=".csv" ref={fileInputRef} onChange={handleFileChange} />
                    </Button>
                </Box>

                {/* File Upload and Import Button */}
                {csvFile && (
                    <Box mt={2}>
                        <p>Selected File: {csvFile.name}</p>
                        <Button variant="contained" color="primary" onClick={handleCSVImport}>Upload CSV</Button>
                    </Box>
                )}

                {/* Manual User Entry Fields */}
                <TextField fullWidth label="Name" name="name" onChange={handleChange} margin="normal" />
                <TextField fullWidth label="Email" name="email" onChange={handleChange} margin="normal" />

                {/* Role Dropdown */}
                <FormControl fullWidth margin="normal">
                    <InputLabel>Role</InputLabel>
                    <Select name="role" value={newUser.role} onChange={handleChange}>
                        <MenuItem value="Editor">Editor</MenuItem>
                        <MenuItem value="Viewer">Viewer</MenuItem>
                    </Select>
                </FormControl>

                <Box mt={2} display="flex" justifyContent="space-between">
                    <Button variant="contained" onClick={handleModalClose}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handleAddUser}>Add</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddUserModal;
