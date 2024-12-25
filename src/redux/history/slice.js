import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

export const getAllHistory = createAsyncThunk(
  'history/getHistory',
  async (stockCode) => {
    const response = await axios.get('/history/all', {
        params: { stockCode: stockCode }
      });
    return response.data;
  }
);

export const historySlice = createSlice({
  name: 'history',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllHistory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        console.log("rtk", state.data); // todo 
      })
      .addCase(getAllHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

