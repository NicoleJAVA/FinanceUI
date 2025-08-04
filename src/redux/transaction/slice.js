import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

export const getTransactions = createAsyncThunk(
  'transactions/getTransactions',
  async ({ stockCode, page = 1, limit = 10 }) => {
    const response = await axios.get('/inventory', {
      params: { stockCode, page, limit }
    });
    return response.data;
  }
);


export const batchWriteOff = createAsyncThunk(
  'transactions/batchWriteOff',
  async ({ stockCode, inventory, transactionDate, sellRecord }) => {
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

export const previewWriteOff = createAsyncThunk(
  'transactions/previewWriteOff',
  async ({ stockCode, inventory, transactionDate, sellRecord }) => {
    const response = await axios.post('/transactions/preview-offset', {
      stockCode,
      inventory,
      transactionDate,
      sellRecord,
    });
    return response.data;
  }
);

export const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    transactionSource: null,
    transactionDraft: [],
    highlightedCells: {},
    previewResult: [],
    // aTableData: [{
    //   data_uuid: '',
    //   transaction_date: '',
    //   stock_code: '',
    //   product_name: '',
    //   unit_price: 0,
    //   transaction_quantity: 0,
    //   transaction_price: 0,
    //   fee: 0,
    //   tax: 0,
    //   net_amount: 0,
    //   remaining_quantity: 0,
    //   profit_loss: 0,
    //   inventory_uuids: [],
    // }],
    // todo dele test data
    aTableData: [{
      data_uuid: '',
      transaction_date: '',
      stock_code: '',
      product_name: '',
      unit_price: 0,
      transaction_quantity: 0,
      transaction_price: 0,
      fee: 0,
      tax: 0,
      net_amount: 0,
      remaining_quantity: 0,
      profit_loss: 0,
      inventory_uuids: [],
    }],
    total: 0,
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
    // 更新 A 表格欄位 (並影響 B 表格)
    updateATableField: (state, action) => {
      const { field, value } = action.payload;


      // 想一次把整筆 aTableData 替換成 localStorage 撈回來的版本，
      // 就不能一個欄位一個欄位 dispatch。所以才讓 reducer 支援這種特例：
      if (field === '__bulkReplace__' && Array.isArray(value)) {
        console.log("清空", value); // todo dele
        state.aTableData = value;  // 這邊是整包替換！
        console.log("清空", state.aTableData); // todo dele

        return;
      }


      const oldValue = state.aTableData[0][field];
      state.aTableData[0][field] = value;

      // Highlight 變動的欄位
      state.highlightedCells[`A-${field}`] = value > oldValue ? "flash-blue" : "flash-orange";

      // 更新成交價金
      console.log("state.aTableData[0].transaction_price", state.aTableData[0].transaction_price, state.aTableData[0].unit_price, state.aTableData[0].transaction_quantity);

      state.aTableData[0].transaction_price = state.aTableData[0].unit_price * state.aTableData[0].transaction_quantity;
      // 更新淨收付金額
      state.aTableData[0].net_amount = state.aTableData[0].transaction_price - state.aTableData[0].fee - state.aTableData[0].tax;

      // 更新沖銷剩餘股數
      state.aTableData[0].remaining_quantity = state.aTableData[0].transaction_quantity - state.transactionDraft.reduce((sum, item) => sum + item.writeOffQuantity, 0);

      // 影響 B 表格的數據
      state.transactionDraft.forEach(transaction => {
        const newQuantity = transaction.writeOffQuantity;
        transaction.amortized_income = Math.round(state.aTableData[0].net_amount * (newQuantity / state.aTableData[0].transaction_quantity));
        transaction.profit_loss = Math.round(
          newQuantity * (state.aTableData[0].unit_price - transaction.transaction_price) -
          ((state.aTableData[0].fee + state.aTableData[0].tax) * (newQuantity / state.aTableData[0].transaction_quantity))
        );
        transaction.profit_loss_2 = transaction.amortized_cost + transaction.amortized_income;

        // Highlight 受影響的 B 表格欄位
        state.highlightedCells[`${transaction.uuid}-amortized_income`] = "flash-yellow";
        state.highlightedCells[`${transaction.uuid}-profit_loss`] = "flash-yellow";
        state.highlightedCells[`${transaction.uuid}-profit_loss_2`] = "flash-yellow";
      });

      // 更新 A 表格的損益試算（累加 B 表格的「損益試算之二」）
      state.aTableData[0].profit_loss = state.transactionDraft.reduce((sum, item) => sum + item.profit_loss_2, 0);
    },

    // 更新 B 表格欄位 (並影響 A 表格)
    updateTransactionField: (state, action) => {
      const { uuid, field, value } = action.payload;
      const transaction = state.transactionDraft.find(t => t.uuid === uuid);
      if (!transaction) return;

      const oldValue = transaction[field];
      transaction[field] = value;

      // 影響 B 表格自身欄位
      if (field === "writeOffQuantity" || field === "transaction_price") {
        transaction.remaining_quantity = transaction.transaction_quantity - transaction.writeOffQuantity;
        console.log("transaction.remaining_quantity", transaction.remaining_quantity);
        transaction.amortized_cost = Math.round(transaction.net_amount * (transaction.writeOffQuantity / transaction.transaction_quantity));






        transaction.amortized_income = Math.round(
          state.aTableData[0].net_amount * (transaction.writeOffQuantity / state.aTableData[0].transaction_quantity)
        );
        console.log("=====", state.aTableData[0].net_amount, transaction.writeOffQuantity, state.aTableData[0].transaction_quantity); // todo dele

        // 沖銷股數 * (A 表格成交單價 - 成交單價)     
        //  -      
        //    (    (A 表格交易費 + A 表格手續費)*(成交股數/A 表格成交股數)   )
        transaction.profit_loss = Math.round(
          transaction.writeOffQuantity * (state.aTableData[0].unit_price - transaction.unit_price) -
          ((state.aTableData[0].fee + state.aTableData[0].tax) * (transaction.transaction_quantity / state.aTableData[0].transaction_quantity))
        );

        // transaction.profit_loss = Math.round(
        //   transaction.writeOffQuantity * (state.aTableData[0].unit_price - transaction.transaction_price) );
        console.log("335 850 666", JSON.stringify(transaction), transaction.writeOffQuantity, state.aTableData[0].unit_price, transaction.transaction_price); // todo dele

        transaction.profit_loss_2 = transaction.amortized_cost + transaction.amortized_income;

        // Highlight 自己變動的 B 表格欄位
        state.highlightedCells[`${uuid}-remaining_quantity`] = "flash-blue";
        state.highlightedCells[`${uuid}-amortized_cost`] = "flash-blue";
        state.highlightedCells[`${uuid}-amortized_income`] = "flash-blue";
        state.highlightedCells[`${uuid}-profit_loss`] = "flash-blue";
        state.highlightedCells[`${uuid}-profit_loss_2`] = "flash-blue";
      }


    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(getTransactions.pending, (state) => { state.status = 'loading'; })
      .addCase(getTransactions.fulfilled, (state, action) => {
        const pagination = action.payload.pagination;
        state.total = pagination.total;


        state.status = 'succeeded';

        const data = action.payload.data;

        state.transactionSource = data.map(transaction => ({
          ...transaction,
          estimated_tax: Math.round(transaction.transaction_value * 0.003)
        }));

        state.transactionDraft = data.map(transaction => ({
          ...transaction,
          remaining_quantity: 0,
          amortized_cost: 0,
          amortized_income: 0,
          profit_loss: 0,
          writeOffQuantity: transaction.writeOffQuantity || 0,
        }));
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(previewWriteOff.fulfilled, (state, action) => {
        console.log("action.payload ", action.payload); // todo dele
        state.previewResult = action.payload;
      });
  },
});

export const { setTransactionDraft,
  updateTransactionField,
  clearHighlight,
  updateATableField } = transactionSlice.actions;
export default transactionSlice.reducer;