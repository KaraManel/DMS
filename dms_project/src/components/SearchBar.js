import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery } from '../redux/searchSlice';
import { TextField, Paper, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';

const SearchBar = () => {
    const dispatch = useDispatch();
    const searchQuery = useSelector((state) => state.search.query);

    const handleSearchChange = (event) => {
        dispatch(setSearchQuery(event.target.value));
    };

    return (
        <Paper
            elevation={1}
            style={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: 30,
                padding: '5px 15px',
                width: '100%',
                maxWidth: 400,
                marginBottom: 20
            }}
        >
            <TextField
                variant="standard"
                placeholder="Type to search..."
                fullWidth
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search style={{ color: '#888' }} />
                        </InputAdornment>
                    ),
                }}
                style={{ marginLeft: 10 }}
            />
        </Paper>
    );
};

export default SearchBar;
