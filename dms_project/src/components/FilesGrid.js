import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { ArrowBack, Add, MoreVert } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Edit, GetApp, Delete, Visibility } from '@mui/icons-material';

const FilesGrid = () => {
    const { folderId } = useParams();
    const navigate = useNavigate();
    const folders = useSelector(state => state.folders.folders);
    const folder = folders.find(f => f.id === parseInt(folderId));

    const [files, setFiles] = useState(folder?.files || []);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
    const searchQuery = useSelector((state) => state.search.query);
    const filteredFiles = files.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (!folder) return <p>Folder not found.</p>;


    const handleMenuClick = (event, file) => {
        setMenuAnchor(event.currentTarget);
        setSelectedFile(file);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setSelectedFile(null);
    };

    const handleRename = () => {
        const newName = prompt('Enter new file name:', selectedFile.name);
        if (newName) {
            setFiles(files.map(file =>
                file.id === selectedFile.id ? { ...file, name: newName } : file
            ));
        }
        handleMenuClose();
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(selectedFile.file);
        link.download = selectedFile.name;
        link.click();
        handleMenuClose();
    };

    const handleDelete = () => {
        setFiles(files.filter(file => file.id !== selectedFile.id));
        handleMenuClose();
    };

    const handleView = () => {
        const fileURL = URL.createObjectURL(selectedFile.file);
        window.open(fileURL, '_blank');
        handleMenuClose();
    };
    const handleDeleteSelectedFiles = () => {
        setFiles(files.filter(file => !selectedFiles.includes(file.id)));
        setSelectedFiles([]); // Clear selection after deletion
        handleActionMenuClose();
    };

    const handleSelectionChange = (selection) => {
        setSelectedFiles(selection);
    };

    const handleActionMenuClick = (event) => {
        setActionMenuAnchor(event.currentTarget);
    };

    const handleActionMenuClose = () => {
        setActionMenuAnchor(null);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formatFileSize = (bytes) => {
            if (bytes < 1024) return `${bytes} B`;
            if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
            if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
            return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
        };

        const formatDate = (timestamp) => new Date(timestamp).toISOString().split('T')[0];

        const newFile = {
            id: files.length + 1,
            name: file.name,
            type: file.type || 'Unknown',
            size: formatFileSize(file.size),
            uploaded_at: formatDate(new Date()),
            last_modified: formatDate(file.lastModified),
            file, // Store actual file object
        };

        setFiles([...files, newFile]);
    };


    const columns = [
        // { field: 'id', headerName: 'ID', width: 100 },
        { field: 'name', headerName: 'File Name', width: 250 },
        { field: 'type', headerName: 'Type', width: 150 },
        { field: 'size', headerName: 'Size', width: 150 },
        { field: 'uploaded_at', headerName: 'Uploaded At', width: 200 },
        { field: 'last_modified', headerName: 'Last Modified', width: 200 },
        {
            field: 'actions',
            headerName: '',
            width: 50,
            sortable: false,
            renderCell: (params) => (
                <IconButton onClick={(event) => handleMenuClick(event, params.row)}>
                    <MoreVert />
                </IconButton>
            ),
        },
    ];

    return (
        <Paper style={{ width: '97%', padding: 20, margin: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                <Button startIcon={<ArrowBack />} onClick={() => navigate('/folders')} style={{ marginRight: 10 }}>

                </Button>
                <h2 style={{ margin: 0 }}>{folder.name}</h2>
            </div>

            {/* Actions and New File buttons in the same line */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#14CAA5",
                        color: "white",
                    }}
                    onClick={handleActionMenuClick}
                    disabled={selectedFiles.length === 0}
                >
                    Actions
                </Button>

                <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileUpload} />

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => document.getElementById('fileInput').click()}
                >
                    New File
                </Button>
            </div>


            <DataGrid
                rows={searchQuery ? filteredFiles : files}
                columns={columns}
                pageSize={5}
                checkboxSelection
                disableRowSelectionOnClick
                rowsPerPageOptions={[5, 10, 20]}
                onRowSelectionModelChange={(newSelection) => handleSelectionChange(newSelection)}
            />

            <Menu anchorEl={actionMenuAnchor} open={Boolean(actionMenuAnchor)} onClose={handleActionMenuClose}>
                <MenuItem onClick={handleDeleteSelectedFiles}>Delete</MenuItem>
                <MenuItem onClick={() => console.log('Download')}>Download</MenuItem>
            </Menu>

            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
                <MenuItem onClick={handleRename}>
                    <Edit fontSize="small" style={{ marginRight: 8 }} />
                    Rename
                </MenuItem>
                <MenuItem onClick={handleDownload}>
                    <GetApp fontSize="small" style={{ marginRight: 8 }} />
                    Download
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                    <Delete fontSize="small" style={{ marginRight: 8 }} />
                    Delete
                </MenuItem>
                <MenuItem onClick={handleView}>
                    <Visibility fontSize="small" style={{ marginRight: 8 }} />
                    View
                </MenuItem>
            </Menu>
        </Paper>
    );
};

export default FilesGrid;