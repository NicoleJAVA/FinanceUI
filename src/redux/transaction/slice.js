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
    setAStockCode: (state, action) => {
      state.aTableData[0].stock_code = action.payload;
    },
    // 更新 A 表格欄位 (並影響 B 表格)
    updateATableField: (state, action) => {
      const { field, value } = action.payload;
      if (field === '__bulkReplace__' && Array.isArray(value)) {
        state.aTableData = value;
        chainingCalc(state);       // ← 這行一定要加，初次載入就跑四步驟
        return;
      }

      const oldValue = state.aTableData[0][field];
      state.aTableData[0][field] = value;
      state.highlightedCells[`A-${field}`] = value > oldValue ? "flash-blue" : "flash-orange";

      // 更新 A 表格的損益試算（累加 B 表格的「損益試算之二」）
      state.aTableData[0].profit_loss = state.transactionDraft.reduce((sum, item) => sum + item.profit_loss_2, 0);

      // 呼叫統一計算
      chainingCalc(state);
    },

    // 更新 B 表格欄位 (並影響 A 表格)
    updateTransactionField: (state, action) => {
      const { uuid, field, value } = action.payload;
      const transaction = state.transactionDraft.find(t => t.uuid === uuid);
      if (!transaction) return;

      transaction[field] = value;

      // 呼叫統一計算
      chainingCalc(state);
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
          profit_loss: calculateProfitLoss(transaction, state),
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

// const calculateProfitLoss = (transaction, state) => {
//   return Math.round(
//     transaction.writeOffQuantity * (state.aTableData[0].unit_price - transaction.unit_price) -
//     ((state.aTableData[0].fee + state.aTableData[0].tax) * (transaction.transaction_quantity / state.aTableData[0].transaction_quantity))
//   );


// };

// ── 工具：安全數字/比例（空字串、undefined、NaN 都當 0） ──
const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const safeRatio = (num, den) => {
  const a = toNum(num), b = toNum(den);
  return b === 0 ? 0 : a / b;
};


// ── 四步驟（順序固定）：對齊 Excel 紅字公式 ──
const chainingCalc = (state) => {
  if (!state.aTableData || !state.aTableData[0]) return;
  const A = state.aTableData[0];

  const A_F = toNum(A.transaction_quantity); // A.F5 成交股數
  const A_E = toNum(A.unit_price);           // A.E5 成交單價
  const A_H = toNum(A.fee);                  // A.H5 手續費
  const A_I = toNum(A.tax);                  // A.I5 交易稅

  // (2) 先算 A（Excel：F5*E5, G5-H5-I5, F5-sum(S11:S..))
  A.transaction_price = A_E * A_F;                         // G5 = F5*E5
  A.net_amount = A.transaction_price - A_H - A_I;   // R5 = G5-H5-I5
  const sumB_S = state.transactionDraft.reduce((s, t) => s + toNum(t.writeOffQuantity), 0);
  A.remaining_quantity = A_F - sumB_S;                      // T5 = F5 - sum(S11:S..)

  // (1)(3)(4) 逐筆算 B
  state.transactionDraft.forEach(B => {
    const B_F = toNum(B.transaction_quantity);   // F11
    const B_E = toNum(B.unit_price);             // E11
    const B_R = toNum(B.net_amount);             // R11（淨收付金額，表內已有）
    const B_S = toNum(B.writeOffQuantity);       // S11

    // 剩餘股數（Excel：F11 - S11）
    B.remaining_quantity = B_F - B_S;

    // (1) 攤提成本（Excel：round(R11*(S11/F11),0)）
    B.amortized_cost = Math.round(B_R * safeRatio(B_S, B_F));

    // (3) 攤提收入（Excel：round($R$5*(S11/$F$5),0)）
    B.amortized_income = Math.round(A.net_amount * safeRatio(B_S, A_F));

    // 損益試算（Excel：round(S11*($E$5-E11) - (sum($H$5:$I$5)*(F11/$F$5)), 0)）
    B.profit_loss = Math.round(
      B_S * (A_E - B_E) - ((A_H + A_I) * safeRatio(B_F, A_F))
    );

    // (4) 損益試算二（Excel：V11 + U11）
    B.profit_loss_2 = toNum(B.amortized_cost) + toNum(B.amortized_income);
  });

  // A.損益試算（Excel：sum( X11:X.. ) → 我們等同 Σ(損益試算之二)）
  A.profit_loss = state.transactionDraft.reduce((s, t) => s + toNum(t.profit_loss_2), 0);
};

// ── 取代：損益試算（維持與上面一致的公式 & 防呆） ──
const calculateProfitLoss = (transaction, state) => {
  const A = state.aTableData[0] || {};
  const S = Number(transaction.writeOffQuantity) || 0;  // 沖銷股數
  const A_E = Number(A.unit_price) || 0;               // A 單價
  const B_E = Number(transaction.unit_price) || 0;     // B 單價
  const fees = (Number(A.fee) || 0) + (Number(A.tax) || 0);
  const B_F = Number(transaction.transaction_quantity) || 0; // B 成交股數
  const A_F = Number(A.transaction_quantity) || 0;           // A 成交股數

  return Math.round(
    S * (A_E - B_E) - (fees * (B_F / (A_F || 1)))   // 這裡改成 B_F / A_F
  );
};

export const { setTransactionDraft,
  updateTransactionField,
  clearHighlight,
  updateATableField, setAStockCode } = transactionSlice.actions;
export default transactionSlice.reducer;