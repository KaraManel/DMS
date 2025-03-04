import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Folder } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 250, // Increased width
                flexShrink: 0,
                '& .MuiDrawer-paper': { width: 250 } // Ensuring Paper inside Drawer has same width
            }}
        >
            <List>
                <ListItem button onClick={() => navigate('/folders')}>
                    <ListItemIcon><Folder /></ListItemIcon>
                    <ListItemText primary="Folders" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;
