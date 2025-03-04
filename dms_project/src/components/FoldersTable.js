import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFolders } from '../redux/foldersSlice';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, Button, Box, Menu, MenuItem, IconButton } from '@mui/material';
import { MoreVert, Add, ArrowDropDown } from '@mui/icons-material';
import AddFolderModal from '../components/AddFolderModal';
import EditFolderModal from "../components/EditFolderModal";
import { useNavigate } from 'react-router-dom';

const FoldersTable = () => {
    const dispatch = useDispatch();
    const { folders, status } = useSelector((state) => state.folders);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [newFolder, setNewFolder] = useState({ name: '', owner_name: '', created_at: new Date().toISOString() });
    const [editFolder, setEditFolder] = useState(null);
    const [folderList, setFolderList] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedFolders, setSelectedFolders] = useState([]);
    const [rowMenu, setRowMenu] = useState({ anchorEl: null, rowId: null });




    useEffect(() => {
        if (status === 'idle') dispatch(fetchFolders());
    }, [status, dispatch]);

    useEffect(() => {
        setFolderList(folders);
    }, [folders]);
    const navigate = useNavigate();

    const searchQuery = useSelector((state) => state.search.query);
    const filteredFolders = folderList.filter(folder =>
        folder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        folder.owner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        folder.created_at.toLowerCase().includes(searchQuery.toLowerCase())
    );



    const handleRowClick = (params) => {
        navigate(`/folder/${params.row.id}`);
    };
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        setNewFolder({ ...newFolder, [e.target.name]: e.target.value });
    };

    const handleAddFolder = () => {
        const currentDate = new Date();

        // Format the date as YYYY-MM-DD
        const formattedDate = currentDate.toISOString().split('T')[0]; // '2024-02-05' format

        const newFolderData = {
            id: folderList.length + 1,
            created_at: formattedDate, // Set created_at to the current date in 'YYYY-MM-DD' format
            ...newFolder
        };

        setFolderList([...folderList, newFolderData]);
        handleClose();
    };



    const handleSelectionChange = (selection) => {
        setSelectedFolders(selection);
    };

    const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleDelete = () => {
        setFolderList(folderList.filter(folder => !selectedFolders.includes(folder.id)));
        setSelectedFolders([]);
        handleMenuClose();
    };

    const handleDeleteFolder = (folderId) => {
        setFolderList(folderList.filter(folder => folder.id !== folderId));
        handleRowMenuClose();
    };

    const handleEditFolder = (folderId) => {
        const folderToEdit = folderList.find(folder => folder.id === folderId);
        if (folderToEdit) {
            setEditFolder(folderToEdit);
            setEditOpen(true);
        }
        handleRowMenuClose();
    };

    const handleSaveEditFolder = (updatedFolder) => {
        setFolderList(folderList.map(folder => (folder.id === updatedFolder.id ? updatedFolder : folder)));
        setEditOpen(false);
    };

    const handleDownload = () => {
        if (selectedFolders.length === 0) return;
        const selectedData = folderList.filter(folder => selectedFolders.includes(folder.id));
        const csvContent = [
            ['ID', 'Name', 'Owner', 'Created At'],
            ...selectedData.map(folder => [folder.id, folder.name, folder.owner_name, folder.created_at])
        ]
            .map(row => row.join(','))
            .join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'folders.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        handleMenuClose();
    };

    const handleRowMenuOpen = (event, rowId) => {
        setRowMenu({ anchorEl: event.currentTarget, rowId });
    };

    const handleRowMenuClose = () => {
        setRowMenu({ anchorEl: null, rowId: null });
    };

    const columns = [
        // { field: 'id', headerName: 'ID', width: 100 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'owner_name', headerName: 'Owner', width: 150 }, // Added owner_id column
        { field: 'created_at', headerName: 'Created At', width: 200 },
        {
            field: 'actions',
            headerName: '',
            width: 50,
            sortable: false,
            renderCell: (params) => (
                <>
                    <IconButton
                        aria-label="more"
                        aria-controls={`menu-${params.row.id}`}
                        aria-haspopup="true"
                        onClick={(event) => {
                            event.stopPropagation();
                            handleRowMenuOpen(event, params.row.id);
                        }}
                    >
                        <MoreVert />
                    </IconButton>
                    <Menu
                        id={`menu-${params.row.id}`}
                        anchorEl={rowMenu.anchorEl}
                        open={rowMenu.rowId === params.row.id}
                        onClose={handleRowMenuClose}
                    >
                        <MenuItem onClick={(event) => {
                            event.stopPropagation();
                            handleEditFolder(params.row.id);
                        }}>Rename</MenuItem>
                        <MenuItem onClick={(event) => {
                            event.stopPropagation();
                            handleDeleteFolder(params.row.id);
                        }}>Delete</MenuItem>
                    </Menu>
                </>
            ),
        }
    ];

    return (
        <Paper style={{ width: '97%', padding: 20 }}>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Box>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#14CAA5",
                            color: "white",
                        }}
                        onClick={handleMenuClick}
                        disabled={selectedFolders.length === 0}
                        endIcon={<ArrowDropDown />}
                    >
                        Actions
                    </Button>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem onClick={handleDownload}>Download</MenuItem>
                        <MenuItem onClick={handleDelete}>Delete</MenuItem>
                    </Menu>
                </Box>
                <Button variant="contained" color="primary" onClick={handleOpen} startIcon={<Add />}>
                    New Folder
                </Button>
            </Box>
            <DataGrid
                rows={searchQuery ? filteredFolders : folderList}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={handleSelectionChange}
                selectionModel={selectedFolders}
                onRowClick={handleRowClick}
            />
            <AddFolderModal open={open} handleClose={handleClose} handleChange={handleChange} handleAddFolder={handleAddFolder} newFolder={newFolder} />
            {editFolder && <EditFolderModal open={editOpen} handleClose={() => setEditOpen(false)} folder={editFolder} handleSave={handleSaveEditFolder} />}
        </Paper>
    );
};

export default FoldersTable;
