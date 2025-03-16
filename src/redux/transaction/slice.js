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
    transactionSource: null, 
    transactionDraft: [], 
    highlightedCells: {},
    error: null,
  },

  reducers: {
     // 初始化交易草稿
     setTransactionDraft: (state, action) => {
      state.transactionDraft = action.payload;
    },
    clearHighlight: (state) => {
      state.highlightedCells = {}; // 3 秒後清除所有 highlight
    },
    updateTransactionField: (state, action) => {
      const { uuid, field, value } = action.payload;
      const transaction = state.transactionDraft.find(t => t.uuid === uuid);
      if (!transaction) return;
    
      const oldValue = transaction[field];
      transaction[field] = value;
    
      const affectedColumns = [];
      if (field === "writeOffQuantity") {
        transaction.remaining_quantity = transaction.transaction_quantity - value;
        transaction.amortized_cost = Math.round(transaction.net_amount * (value / transaction.transaction_quantity));
        transaction.amortized_income = Math.round(state.transactionDraft[0]?.net_amount * (value / state.transactionDraft[0]?.quantity));
        transaction.profit_loss = Math.round(
          value * (state.transactionDraft[0]?.unit_price - transaction.transaction_price) -
          ((state.transactionDraft[0]?.fee + state.transactionDraft[0]?.tax) * (value / state.transactionDraft[0]?.quantity))
        );
        affectedColumns.push("remaining_quantity", "amortized_cost", "amortized_income", "profit_loss");
      } else if (field === "quantity") {
        affectedColumns.push("remaining_quantity", "profit_loss");
      } else if (field === "unit_price") {
        affectedColumns.push("transaction_price", "net_amount", "profit_loss");
      }
    
      affectedColumns.forEach(affectedKey => {
        state.highlightedCells[`${uuid}-${affectedKey}`] = value > oldValue ? "flash-blue" : "flash-orange";
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTransactions.pending, (state) => { state.status = 'loading'; })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.transactionSource = action.payload; //  存入原始交易數據
        // 初始化 `transactionDraft`（可編輯的）
        state.transactionDraft = action.payload.map(transaction => ({
          ...transaction,
          remaining_quantity: 0,
          amortized_cost: 0,
          amortized_income: 0,
          profit_loss: 0,
          writeOffQuantity: transaction.writeOffQuantity || 0
        }));
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setTransactionDraft, updateTransactionField, clearHighlight } = transactionSlice.actions;
export default transactionSlice.reducer;