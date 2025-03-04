import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await fetch('http://127.0.0.1:5000/api/users');
    return response.json();
});

const userSlice = createSlice({
    name: 'users',
    initialState: { users: [], status: 'idle' },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state) => { state.status = 'failed'; });
    },
});

export default userSlice.reducer;
