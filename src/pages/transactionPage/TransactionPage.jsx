import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactions, batchWriteOff } from '../../redux/transaction/slice';
import { Table, Button } from 'react-bootstrap';
import './TransactionPage.scss';
import { useDate } from '../../context/DateContext';
import moment from 'moment';
// import DataTable, { createTheme } from 'react-data-table-component'; todo dele

import { MainTable } from '../../component/MainTable/MainTable';
import DefaultExpandRow from '../../component/MainTable/DefaultExpandRow';
// 手續費折扣率
const FEE_DISCOUNT = 0.003;

export const TransactionPage = () => {
  const dispatch = useDispatch();


  // (1). transactionSource: 交易資料的來源，是從 API 得到
  // (2). transactionDraftRef: 正在編輯中的草稿，是 user 在動態更新
  const transactionSource = useSelector((state) => state.transactions.data);
  const [transactionDraft, setTransactionDraft] = useState([]);
  const transactionDraftRef = useRef([]);

  console.log('transactionSource---', transactionSource);
  // const status = useSelector((state) => state.transactions.status); // todo delete this variable
  const hasFetchedData = useRef(false);
  const error = useSelector((state) => state.transactions.error);
  const $date = useDate();

  // 狀態管理用於模態視窗
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const [highlightedCells, setHighlightedCells] = useState({});
  const [transactionValue, setTransactionValue] = useState(0);
  const [fee, setFee] = useState(0);
  const [tax, setTax] = useState(0);
  const [netAmount, setNetAmount] = useState(0);
  const [remainingQuantity, setRemainingQuantity] = useState(0);
  const [profitLoss, setProfitLoss] = useState(0);

  const [totals, setTotals] = useState({
    amortizedCostSum: 0,
    amortizedIncomeSum: 0,
    amortizedIncomeDiff: 0,
  });

  const [aTableData, setATableData] = useState([
    {
      data_uuid: '',
      transaction_date: '',
      stock_code: '',
      product_name: '',
      unit_price: 0,
      quantity: 0,
      transaction_price: 0,
      fee: 0,
      tax: 0,
      net_amount: 0,
      remaining_quantity: 0,
      profit_loss: 0,
      inventory_uuids: [],
    },
  ]);

  const triggerHighlight = (uuid, columnKey, isIncrease) => {
    setHighlightedCells(prev => ({
      ...prev,
      [`${uuid}-${columnKey}`]: isIncrease ? "flash-blue" : "flash-orange",
    }));

    setTimeout(() => {
      setHighlightedCells(prev => ({
        ...prev,
        [`${uuid}-${columnKey}`]: "",
      }));
    }, 3000);
  };

  // // 管理 A 表格的狀態
  // const [aTableData, setATableData] = useState([
  //   { date: '', code: '', name: '', unit_price: 0, quantity: 0, fee: 0, tax: 0, net_amount: 0 },
  // ]);



  const handleUpdatedData = (newData) => {
    setTransactionDraft(newData);
  };

  const bTableCustomStyles = {
    // headRow: {
    //   style: {
    //     color: '#AFBECC',
    //     backgroundColor: '#27303B'
    //   },
    // },
    headCells: {
      style: {
        fontSize: '14px',
      },
    },
    cells: {
      style: {
        fontSize: '14px',
      },
    },
    rows: {
      hoverStyle: {
        backgroundColor: '#2F3947',
      },
    },
    // striped: {
    //   default: 'red'
    // },
  }

  // todo dele
  // createTheme('customTheme', {
  //   text: {
  //     primary: '#AFBECC',
  //     secondary: '#AFBECC',
  //   },
  //   background: {
  //     default: 'white',// '#22282E', // todo stday
  //   },
  //   context: {
  //     background: '#27303B',
  //     text: '#AFBECC',
  //   },
  //   divider: {
  //     default: '#37435A',
  //   },

  // }, 'dark');

  const handleInputChangeA = (field, value) => {
    setATableData(prevData => {
      const updatedData = [...prevData];
      updatedData[0][field] = value; // 更新指定的欄位
      return updatedData;
    });
  };

  // 用於管理 B 表格的狀態


  // const columnsB = [ todo dele
  //   { name: 'UUID', selector: row => row.uuid, sortable: true },
  //   { name: '成交日期', selector: row => $date(row.date), sortable: true },
  //   { name: '股票代碼', selector: row => row.stock_code, sortable: true },
  //   { name: '買賣別', selector: row => row.transaction_type, sortable: true },
  //   { name: '成交單價', selector: row => row.transaction_price, sortable: true },
  //   { name: '成交股數', selector: row => row.transaction_quantity, sortable: true },
  //   { name: '成交價金', selector: row => row.transaction_price, sortable: true },
  //   { name: '手續費', selector: row => row.estimated_fee, sortable: true },
  //   { name: '交易稅', selector: row => row.estimated_tax, sortable: true },
  //   { name: '淨收付金額', selector: row => row.net_amount, sortable: true },
  //   {
  //     name: '沖銷股數', cell: (row) => (
  //       <input
  //         type="number"
  //         value={row.writeOffQuantity}
  //         onChange={(e) => handleInputChange(row.uuid, 'writeOffQuantity', parseInt(e.target.value))}
  //       />
  //     ), sortable: true
  //   },
  //   { name: '剩餘股數', selector: row => row.remaining_quantity, sortable: true },
  //   { name: '攤提成本', selector: row => row.amortized_cost, sortable: true },
  //   { name: '攤提收入', selector: row => row.amortized_income, sortable: true },
  //   { name: '損益試算', selector: row => row.profit_loss, sortable: true },
  //   { name: '損益試算之二', selector: row => row.profit_loss_2, sortable: true },
  // ];





  const transactionColumns = [
    { key: 'uuid', sortable: true },
    { key: 'date', sortable: true },
    { key: 'stock_code', sortable: true },
    { key: 'transaction_type', sortable: true },
    { key: 'unit_price', sortable: true },
    { key: 'transaction_quantity', sortable: true },
    { key: 'transaction_value', sortable: true },
    { key: 'estimated_fee', sortable: true },
    { key: 'estimated_tax', sortable: true },
    { key: 'net_amount', sortable: true },
    { key: 'writeOffQuantity', sortable: true, isInput: true, inputType: 'positive-int' },
    { key: 'remaining_quantity', sortable: true },
    { key: 'amortized_cost', sortable: true },
    { key: 'amortized_income', sortable: true },
    { key: 'profit_loss', sortable: true },
    { key: 'profit_loss_2', sortable: true }
  ];


  useEffect(() => {
    if (!hasFetchedData.current) {
      console.log("Fetching transactionSource...");
      dispatch(getTransactions({ stockCode: "2330" }));
      hasFetchedData.current = true;
    }
  }, [dispatch]);


  useEffect(() => {
    if (transactionSource?.length > 0) {
      transactionDraftRef.current = transactionSource.map(transaction => ({
        ...transaction,
        remaining_quantity: 0,
        amortized_cost: 0,
        amortized_income: 0,
        profit_loss: 0,
        writeOffQuantity: transaction.writeOffQuantity || 0
      }));
      setTransactionDraft(transactionDraftRef.current);
      // setTransactionDraft(transactionSource.map(transaction => ({
      //   ...transaction,
      //   remaining_quantity: 0,
      //   amortized_cost: 0,
      //   amortized_income: 0,
      //   profit_loss: 0,
      //   writeOffQuantity: transaction.writeOffQuantity || 0 // 合併沖銷股數
      // })));
      console.log('TYPE TYPE ', typeof transactionSource[0].writeOffQuantity)

    }
  }, [transactionSource]);

  // todo dele
  // useEffect(() => {
  //   if (!transactionDraft) return;

  //   const amortizedCostSum = transactionDraft.reduce((sum, item) => sum + item.amortized_cost, 0);
  //   const amortizedIncomeSum = transactionDraft.reduce((sum, item) => sum + item.amortized_income, 0);
  //   const amortizedIncomeDiff = amortizedIncomeSum - (aTableData ? aTableData.net_amount : 0);

  //   setTotals({
  //     amortizedCostSum,
  //     amortizedIncomeSum,
  //     amortizedIncomeDiff,
  //   });
  // }, [transactionDraft, aTableData]);

  console.log("transactionDraft", transactionDraft);

  const [cTableData, setCTableData] = useState([]);



  // todo @begin @1 this is what causes re-reder! // todo dele
  // useEffect(() => {
  //   if (aTableData && aTableData[0]) {
  //     setTransactionDraft(prevData => {
  //       return prevData.map(transaction => {
  //         const newQuantity = transaction.writeOffQuantity; // 使用目前的沖銷股數
  //         const remainingQuantity = transaction.transaction_quantity - newQuantity; // 剩餘股數
  //         const amortizedCost = Math.round(transaction.net_amount * (newQuantity / transaction.transaction_quantity)); // 攤提成本
  //         const amortizedIncome = Math.round(aTableData[0].net_amount * (newQuantity / aTableData[0].quantity)); // 攤提收入
  //         const profitLoss = Math.round(
  //           newQuantity * (aTableData[0].unit_price - transaction.transaction_price) -
  //           ((aTableData[0].fee + aTableData[0].tax) * (newQuantity / aTableData[0].quantity))
  //         ); // 損益試算

  //         return {
  //           ...transaction,
  //           remaining_quantity: remainingQuantity,
  //           amortized_cost: amortizedCost,
  //           amortized_income: amortizedIncome,
  //           profit_loss: profitLoss
  //         };
  //       });
  //     });

  //     setTransactionValue(aTableData[0].unit_price * aTableData[0].quantity);
  //     const fee = Math.round(transactionValue * 0.01425 * FEE_DISCOUNT);
  //     const tax = Math.round(transactionValue * 0.01); // 假設 1% 的交易稅
  //     const netAmount = transactionValue - fee - tax;


  //     const remainingQuantity = aTableData[0].quantity - transactionDraftRef.current.reduce((sum, item) => sum + item.writeOffQuantity, 0);
  //     const profitLoss = transactionDraftRef.current.reduce((sum, item) => sum + item.profit_loss, 0);

  //     // 更新狀態

  //     setFee(fee);
  //     setTax(tax);
  //     setNetAmount(netAmount);
  //     setRemainingQuantity(remainingQuantity);
  //     setProfitLoss(profitLoss);
  //   }
  // }, [aTableData, transactionValue]);



  const handleInputChange = (uuid, columnKey, value) => {
    setTransactionDraft(prevData => {
      return prevData.map(transaction => {
        if (transaction.uuid === uuid) {
          const newValue = parseFloat(value) || 0;
          const oldValue = transaction[columnKey];

          // 計算哪些欄位會受影響
          let affectedColumns = [];

          if (columnKey === "writeOffQuantity") {
            affectedColumns = ["remaining_quantity", "amortized_cost", "amortized_income", "profit_loss"];
          } else if (columnKey === "quantity") {
            affectedColumns = ["remaining_quantity", "profit_loss"];
          } else if (columnKey === "unit_price") {
            affectedColumns = ["transaction_price", "net_amount", "profit_loss"];
          }

          // 設定變色
          const updatedHighlights = { ...highlightedCells };
          affectedColumns.forEach(affectedKey => {
            updatedHighlights[`${uuid}-${affectedKey}`] = newValue > oldValue ? "flash-blue" : "flash-orange";
          });

          setHighlightedCells(updatedHighlights);

          // 3 秒後清除變色
          setTimeout(() => {
            setHighlightedCells(prev => {
              const newHighlights = { ...prev };
              affectedColumns.forEach(affectedKey => {
                delete newHighlights[`${uuid}-${affectedKey}`];
              });
              return newHighlights;
            });
          }, 3000);

          return { ...transaction, [columnKey]: newValue };
        }
        return transaction;
      });
    });
  };



  const handleBatchWriteOff = () => {
    console.log("clicked");
    // const editedInventory = transactionDraft.filter(item => parseFloat((item.writeOffQuantity) || 0) > 0);
    const editedInventory = transactionDraft.filter(
      item => {
        console.log("item.writeOffQuantity", item.writeOffQuantity);
        return parseFloat((item.writeOffQuantity) || 0) > 0;
      });
    console.log("原始", transactionDraft);
    console.log("編輯", editedInventory);

    dispatch(batchWriteOff({ stockCode: '2330', inventory: editedInventory, transactionDate: moment().format('YYYY-MM-DD HH:mm:ss'), sellRecord: aTableData[0] }));
  };


  const tableSettings = {

    tableStyle: {

    },
    paging: {
      showFooter: true,
    },
    expandColumnName: "detailData",
    expandColumns: [

      { key: "color" },
      { key: "season" },
      { key: "fruit" },
      { key: "flower" },


    ],
    autoGenColumns: true,

  }


  return (
    <div>
      <div className="table-card-wrapper">
        <Table hover id="table-A">
          <thead>
            <tr>
              <th>成交日期</th>
              <th>商品代碼</th>
              <th>商品名稱</th>
              <th>成交單價</th>
              <th>成交股數</th>
              <th>成交價金</th>
              <th>手續費</th>
              <th>交易稅</th>
              <th>淨收付金額</th>
              <th>沖銷剩餘股數</th>
              <th>損益試算</th>
            </tr>
          </thead>
          <tbody>
            {aTableData && aTableData.length > 0 && (
              <tr>
                <td><input type="date" defaultValue={aTableData.transaction_date} /></td>
                <td><input type="text" defaultValue={aTableData.stock_code} /></td>
                <td><input type="text" defaultValue={aTableData.product_name} /></td>
                <td> <input
                  type="number"
                  placeholder="成交單價"
                  onChange={(e) => handleInputChangeA('unit_price', parseFloat(e.target.value))}
                /></td>
                <td><input
                  type="number"
                  onChange={(e) => handleInputChangeA('quantity', parseInt(e.target.value, 10))}
                /></td>
                <td>{transactionValue}</td>
                <td><input
                  type="number"
                  onChange={(e) => handleInputChangeA('fee', parseFloat(e.target.value))}
                />
                </td>
                <td><input
                  type="number"
                  onChange={(e) => handleInputChangeA('tax', parseFloat(e.target.value))}
                />
                </td>
                <td>{netAmount}</td>
                <td>{remainingQuantity}</td>
                <td>{profitLoss}</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>


      <MainTable id="table-B" data={transactionDraft} settings={tableSettings} columns={transactionColumns} localePrefix={'transaction'}
        expandUI={DefaultExpandRow}
        onInputChange={handleInputChange}
        highlightedCells={highlightedCells}
      />
      {/* <div > todo dele
        <DataTable
          columns={columnsB}
          data={transactionDraft}
          pagination
          highlightOnHover
          pointerOnHover
          customStyles={bTableCustomStyles}
          theme="customTheme"
        />
        <div className="totals theme-table-footer">
          <p>攤提總成本: {totals.amortizedCostSum}</p>
          <p>攤提總收入: {totals.amortizedIncomeSum}</p>
          <p>攤提總收入誤差: {totals.amortizedIncomeDiff}</p>
        </div>
        
      </div> */}

      {/* todo dele <div className="table-card-wrapper">
        <Table hover id="transaction-table">
          <thead>
            <tr>
              <th>UUID</th>
              <th>交易日期</th>
              <th>商品代碼</th>
              <th>商品名稱</th>
              <th>價格</th>
              <th>數量</th>
              <th>總價</th>
              <th>備註</th>
            </tr>
          </thead>
          <tbody>
            {cTableData.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.uuid}</td>
                <td>{transaction.transaction_date}</td>
                <td>{transaction.symbol}</td>
                <td>{transaction.product_name}</td>
                <td>{transaction.unit_price}</td>
                <td>{transaction.quantity}</td>
                <td>{transaction.total_price}</td>
                <td>{transaction.remarks}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div> */}
      <button onClick={handleBatchWriteOff} className="btn btn-primary">存檔</button>
    </div >
  );
};
