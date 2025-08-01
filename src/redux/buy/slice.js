import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

export const getBuyTransactions = createAsyncThunk(
    'buy/getBuyTransactions',
    async ({ stockCode, page, limit }) => {
        const response = await axios.get('/inventory', {
            params: { stockCode, page, limit },
        });
        return response.data.data;
    }
);

export const addBuyTransaction = createAsyncThunk(
    'buy/addBuyTransaction',
    async (payload) => {
        const response = await axios.post('/buy', payload);
        return response.data;
    }
);

const initialState = {
    transactionSource: [],
    transactionDraft: [],
    highlightedCells: {},
    aTableData: [
        {
            transaction_date: '',
            stock_code: '',
            product_name: '',
            unit_price: 0,
            transaction_quantity: 0,
            transaction_value: 0,
            estimated_fee: 0,
            estimated_tax: 0,
            net_amount: 0,
            remarks: '',
        }
    ]
};

export const buySlice = createSlice({
    name: 'buy',
    initialState,
    reducers: {
        updateBuyField: (state, action) => {
            const { field, value } = action.payload;
            state.aTableData[0][field] = value;
        },
        setBuyDraft: (state, action) => {
            state.transactionDraft = action.payload;
        },
        clearBuyHighlight: (state) => {
            state.highlightedCells = {};
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getBuyTransactions.fulfilled, (state, action) => {
            state.transactionSource = action.payload;
        });
    },
});

export const {
    updateBuyField,
    setBuyDraft,
    clearBuyHighlight,
} = buySlice.actions;

export default buySlice.reducer;
