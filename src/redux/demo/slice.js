import {
  createSlice,
  createAsyncThunk
} from "@reduxjs/toolkit";

import axios from "axios";

const initialState = {
  debugMode: true,
  data: [],
  status: 'idle',
  error: null,
};

export const fetchData = createAsyncThunk('demo/fetchData', async () => {
  const response = await axios.get('http://127.0.0.1:3001/users/list');
  return response.data;
});

export const demoSlice = createSlice({
  name: "demo",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});
