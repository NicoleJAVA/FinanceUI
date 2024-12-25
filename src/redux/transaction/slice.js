import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

export const getTransactions = createAsyncThunk(
  'transactions/getTransactions',
  async (stockCode) => {
    const response = await axios.get('/inventory', {
        params: { stockCode: stockCode }
      });
    return response.data;
  }
);

export const batchWriteOff = createAsyncThunk(
 'transactions/batchWriteOff',
 async({stockCode, inventory, transactionDate, sellRecord}) => {
    const dataToSend = {
      stockCode,
      inventory,
      transactionDate,
      sellRecord,
    };
    console.log("\n\n TYPE ", typeof inventory[0].writeOffQuantity);
    console.log("\n\n inventory ", inventory);
    console.log("\n\n sellRecord ", sellRecord);
    try {
      const response = await axios.post('/transactions/offset', dataToSend, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Success:', response.data);
      return response.data; // 可以根據需求返回資料
    } catch (error) {
      console.error('Error:', error);
      throw new Error(error.response?.data?.message || 'Network error'); // 更清晰的錯誤信息
    }
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

