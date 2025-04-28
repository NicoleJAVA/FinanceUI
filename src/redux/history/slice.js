import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

export const getAllSellHistory = createAsyncThunk(
  'history/getAllSellHistory',
  async (stockCode) => {
    const response = await axios.get('/sellHistory/all', {
      params: { stockCode: stockCode }
    });
    console.log("step 1 - response", response); // todo dele
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
      .addCase(getAllSellHistory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllSellHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        console.log("step 2 - state.data", state.data); // todo dele
      })
      .addCase(getAllSellHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

