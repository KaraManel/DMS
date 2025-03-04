import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../redux/userSlice';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, Button, Box, Menu, MenuItem, IconButton } from '@mui/material';
import { MoreVert, Add, ArrowDropDown } from '@mui/icons-material'; // Import icons
import AddUserModal from '../components/AddUserModal';
import EditUserModal from "../components/EditUserModal";

const UserTable = () => {
    const dispatch = useDispatch();
    const { users, status } = useSelector((state) => state.users);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false); // State for edit modal
    const [newUser, setNewUser] = useState({ name: '', email: '', role: '', status: 'Active' });
    const [editUser, setEditUser] = useState(null);
    const [userList, setUserList] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]); // Store selected user IDs
    const [rowMenu, setRowMenu] = useState({ anchorEl: null, rowId: null });// Track menu per row


    // const searchQuery = useSelector((state) => state.search.query);
    // const filteredUsers = users.filter((user) =>
    //     Object.values(user).some((value) =>
    //         String(value).toLowerCase().includes(searchQuery.toLowerCase())
    //     )
    // );

    const searchQuery = useSelector((state) => state.search.query);



    const filteredUsers = userList.filter((user) =>
        Object.values(user).some((value) =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
    useEffect(() => {
        if (status === 'idle') dispatch(fetchUsers());
    }, [status, dispatch]);

    useEffect(() => {
        setUserList(users);
    }, [users]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const handleAddUser = () => {
        const newUserData = { id: userList.length + 1, ...newUser };
        setUserList([...userList, newUserData]);
        handleClose();
    };
    const handleImport = (importedUsers) => {
        console.log("Imported Users:", importedUsers); // Debugging log

        const validUsers = importedUsers.map(user => ({
            id: parseInt(user.ID, 10), // Convert ID to a number
            name: user.Name,
            email: user.Email,
            role: user.Role,
            status: user.Status
        }));

        // Assign unique IDs to new users based on the existing userList length
        const usersWithIds = validUsers.map((user, index) => ({
            id: userList.length + index + 1, // Ensure unique ID
            ...user
        }));

        // Update user list with new users
        setUserList([...userList, ...usersWithIds]);

        handleClose(); // Close modal after import
    };


    // Handle selection of users
    const handleSelectionChange = (selection) => {
        setSelectedUsers(selection);
    };

    // Actions dropdown menu handlers
    const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleDelete = () => {
        setUserList(userList.filter(user => !selectedUsers.includes(user.id)));
        setSelectedUsers([]); // Clear selection after deletion
        handleMenuClose();
    };
    const handleDeleteUser = (userId) => {
        setUserList(userList.filter(user => user.id !== userId));
        handleRowMenuClose(); // Close menu after deleting
    };
    const handleEditUser = (userId) => {
        const userToEdit = userList.find(user => user.id === userId);
        if (userToEdit) {
            setEditUser(userToEdit);
            setEditOpen(true);
        }
        handleRowMenuClose();
    };

    const handleSaveEditUser = (updatedUser) => {
        setUserList(userList.map(user => (user.id === updatedUser.id ? updatedUser : user)));
        setEditOpen(false);
    };
    const handleDownload = () => {
        if (selectedUsers.length === 0) return;

        const selectedData = userList.filter(user => selectedUsers.includes(user.id));

        // Convert selected users to CSV format
        const csvContent = [
            ['ID', 'Name', 'Email', 'Role', 'Status'], // Header row
            ...selectedData.map(user => [user.id, user.name, user.email, user.role, user.status])
        ]
            .map(row => row.join(',')) // Convert array to CSV line
            .join('\n');

        // Create a downloadable CSV file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        handleMenuClose();
    };

    // Handle row-specific menu
    const handleRowMenuOpen = (event, rowId) => {
        setRowMenu({ anchorEl: event.currentTarget, rowId });
    };

    const handleRowMenuClose = () => {
        setRowMenu({ anchorEl: null, rowId: null });
    };

    const columns = [
        // { field: 'id', headerName: 'ID', width: 100 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'role', headerName: 'Role', width: 150 },
        { field: 'status', headerName: 'Status', width: 150 },
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
                            event.stopPropagation(); // Prevent row selection
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
                            handleEditUser(params.row.id);
                        }}>Edit</MenuItem>
                        <MenuItem onClick={(event) => {
                            event.stopPropagation();
                            handleDeleteUser(params.row.id);
                        }}>Delete</MenuItem>
                    </Menu>
                </>
            ),
        }


    ];

    return (
        <Paper style={{ width: '97%', padding: 20 }}>
            {/* Top bar with Actions button (left) and New User button (right) */}
            <Box display="flex" justifyContent="space-between" mb={2}>
                {/* Actions Dropdown (Left) */}
                <Box>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#14CAA5",
                            color: "white",
                        }}
                        onClick={handleMenuClick}
                        disabled={selectedUsers.length === 0}
                        endIcon={<ArrowDropDown />} // Dropdown icon
                    >
                        Actions
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleDownload}>Download</MenuItem>
                        <MenuItem onClick={handleDelete}>Delete</MenuItem>
                    </Menu>
                </Box>

                {/* New User Button (Right) */}
                <Button variant="contained" color="primary" onClick={handleOpen} startIcon={<Add />}>
                    New User
                </Button>
            </Box>

            {/* Data Grid */}
            <DataGrid
                rows={searchQuery ? filteredUsers : userList}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                checkboxSelection
                // disableRowSelectionOnClick
                onRowSelectionModelChange={handleSelectionChange} // Track selected users
                selectionModel={selectedUsers} // Keep selected state
            />

            {/* Modal Component */}
            <AddUserModal
                open={open}
                handleClose={handleClose}
                handleChange={handleChange}
                handleAddUser={handleAddUser}
                handleImport={handleImport}
                newUser={newUser}
            />
            {editUser && (
                <EditUserModal
                    open={editOpen}
                    handleClose={() => setEditOpen(false)}
                    user={editUser}
                    handleSave={handleSaveEditUser}
                />
            )}
        </Paper>
    );
};

export default UserTable;
