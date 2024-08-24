import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

export const getTransactions = createAsyncThunk(
  'transactions/getTransactions',
  async (stockCode) => {
    const response = await axios.get('/transactions', {
        params: { stockCode: stockCode }
      });
    return response.data;
  }
);

export const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTransactions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        console.log("rtk", state.data); // todo 
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

