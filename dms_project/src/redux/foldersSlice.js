import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchFolders = createAsyncThunk('folders/fetchFolders', async () => {
    const response = await fetch('http://127.0.0.1:5000/api/folders');
    return response.json();
});

const foldersSlice = createSlice({
    name: 'folders',
    initialState: { folders: [], status: 'idle' },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFolders.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchFolders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.folders = action.payload;
            })
            .addCase(fetchFolders.rejected, (state) => { state.status = 'failed'; });
    },
});

export default foldersSlice.reducer;
