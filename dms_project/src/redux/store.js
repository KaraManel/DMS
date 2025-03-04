import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import folderReducer from './foldersSlice';
import searchReducer from './searchSlice';
import authReducer from './authSlice'; // Import authSlice

export const store = configureStore({
    reducer: {
        auth: authReducer, // Add authentication reducer
        users: userReducer,
        folders: folderReducer,
        search: searchReducer,
    },
});
