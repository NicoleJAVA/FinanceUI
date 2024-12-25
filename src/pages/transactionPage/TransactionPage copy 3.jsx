// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { getTransactions, batchWriteOff } from '../../redux/transaction/slice';
// import { Table, Button } from 'react-bootstrap';
// import './TransactionPage.scss';
// import { useDate } from '../../context/DateContext';
// import moment from 'moment';
// import DataTable from 'datatables.net-dt';

// // 手續費折扣率
// const FEE_DISCOUNT = 0.003;

// export const TransactionPage = () => {
//   const dispatch = useDispatch();
//   const transactions = useSelector((state) => state.transactions.data);
//   const status = useSelector((state) => state.transactions.status);
//   const error = useSelector((state) => state.transactions.error);
//   const $date = useDate();

//   // 狀態管理用於模態視窗
//   const [showModal, setShowModal] = useState(false);
//   const [modalData, setModalData] = useState(null);

//   // // 管理 A 表格的狀態
//   // const [aTableData, setATableData] = useState([
//   //   { date: '', code: '', name: '', unit_price: 0, quantity: 0, fee: 0, tax: 0, net_amount: 0 },
//   // ]);
//   const [aTableData, setATableData] = useState([
//     {
//       data_uuid: '',
//       transaction_date: '',
//       stock_code: '',
//       product_name: '',
//       unit_price: 0,
//       quantity: 0,
//       transaction_value: 0,
//       fee: 0,
//       tax: 0,
//       net_amount: 0,
//       remaining_quantity: 0,
//       profit_loss: 0,
//       inventory_uuids: [],
//     },
//   ]);

//   const [transactionValue, setTransactionValue] = useState(0);
//   const [fee, setFee] = useState(0);
//   const [tax, setTax] = useState(0);
//   const [netAmount, setNetAmount] = useState(0);
//   const [remainingQuantity, setRemainingQuantity] = useState(0);
//   const [profitLoss, setProfitLoss] = useState(0);

//   const handleInputChangeA = (field, value) => {
//     setATableData(prevData => {
//       const updatedData = [...prevData];
//       updatedData[0][field] = value; // 更新指定的欄位
//       return updatedData;
//     });
//   };

//   // 用於管理 B 表格的狀態
//   const [transactionData, setTransactionData] = useState(transactions);

//   useEffect(() => {
//     if (transactions.length > 0) {
//       setTransactionData(transactions.map(transaction => ({
//         ...transaction,
//         remaining_quantity: 0,
//         amortized_cost: 0,
//         amortized_income: 0,
//         profit_loss: 0,
//         writeOffQuantity: transaction.writeOffQuantity || 0 // 合併沖銷股數
//       })));
//       console.log('TYPE TYPE ', typeof transactions[0].writeOffQuantity)

//     }
//   }, [transactions]);

//   console.log("transactionData", transactionData);

//   // 管理 C 表格的狀態
//   const [cTableData, setCTableData] = useState([]);

//   let table = new DataTable('#transaction-table', {
//     "pageLength": 10,
//     "lengthMenu": [10, 20, 30, 40, 50],
//   });


//   // 計算相關值
//   useEffect(() => {
//     if (aTableData && aTableData[0]) {
//       setTransactionData(prevData => {
//         return prevData.map(transaction => {
//           const newQuantity = transaction.writeOffQuantity; // 使用目前的沖銷股數
//           const remainingQuantity = transaction.transaction_quantity - newQuantity; // 剩餘股數
//           const amortizedCost = Math.round(transaction.net_amount * (newQuantity / transaction.transaction_quantity)); // 攤提成本
//           const amortizedIncome = Math.round(aTableData[0].net_amount * (newQuantity / aTableData[0].quantity)); // 攤提收入
//           const profitLoss = Math.round(
//             newQuantity * (aTableData[0].unit_price - transaction.transaction_price) -
//             ((aTableData[0].fee + aTableData[0].tax) * (newQuantity / aTableData[0].quantity))
//           ); // 損益試算

//           return {
//             ...transaction,
//             remaining_quantity: remainingQuantity,
//             amortized_cost: amortizedCost,
//             amortized_income: amortizedIncome,
//             profit_loss: profitLoss
//           };
//         });
//       });

//       const transactionValue = aTableData[0].unit_price * aTableData[0].quantity;
//       const fee = Math.round(transactionValue * 0.01425 * FEE_DISCOUNT);
//       const tax = Math.round(transactionValue * 0.01); // 假設 1% 的交易稅
//       const netAmount = transactionValue - fee - tax;

//       const remainingQuantity = aTableData[0].quantity - transactionData.reduce((sum, item) => sum + item.writeOffQuantity, 0);
//       const profitLoss = transactionData.reduce((sum, item) => sum + item.profit_loss, 0);

//       // 更新狀態
//       setTransactionValue(transactionValue);
//       setFee(fee);
//       setTax(tax);
//       setNetAmount(netAmount);
//       setRemainingQuantity(remainingQuantity);
//       setProfitLoss(profitLoss);
//     }
//   }, [aTableData, transactions]);

//   useEffect(() => {
//     if (status === 'idle') {
//       dispatch(getTransactions({ stockCode: "2330" }));
//     }
//   }, [status, dispatch]);

//   const handleInputChange = (transactionUuid, field, value) => {
//     console.log("input changed, ", transactionUuid);
//     // const  = parseFloat(value) || 0; // 確保是數字
//     setTransactionData(prevData => {
//       return prevData.map(transaction => {
//         if (transaction.uuid === transactionUuid) {
//           // console.log("input id", transaction.id, value, typeof value);
//           return {
//             ...transaction,
//             [field]: value // 更新指定的欄位
//           };
//         }
//         return transaction;
//       });
//     });
//   };

//   if (status === 'loading') {
//     return <div>載入中...</div>;
//   }

//   if (status === 'failed') {
//     return <div>發生錯誤: {error}</div>;
//   }
//   const handleBatchWriteOff = () => {
//     console.log("clicked");
//     // const editedInventory = transactionData.filter(item => parseFloat((item.writeOffQuantity) || 0) > 0);
//     const editedInventory = transactionData.filter(
//       item => {
//         console.log("item.writeOffQuantity", item.writeOffQuantity);
//         return parseFloat((item.writeOffQuantity) || 0) > 0;
//       });
//     console.log("原始", transactionData);
//     console.log("編輯", editedInventory);

//     dispatch(batchWriteOff({ stockCode: '2330', inventory: editedInventory, transactionDate: moment().format('YYYY-MM-DD HH:mm:ss'), sellRecord: aTableData[0] }));
//   };

//   return (
//     <div>
//       <h1>A 表格</h1>
//       <div className="table-card-wrapper">
//         <Table hover>
//           <thead>
//             <tr>
//               <th>成交日期</th>
//               <th>商品代碼</th>
//               <th>商品名稱</th>
//               <th>成交單價</th>
//               <th>成交股數</th>
//               <th>成交價金</th>
//               <th>手續費</th>
//               <th>交易稅</th>
//               <th>淨收付金額</th>
//               <th>沖銷剩餘股數</th>
//               <th>損益試算</th>
//             </tr>
//           </thead>
//           <tbody>
//             {aTableData && (
//               <tr>
//                 <td><input type="date" defaultValue={aTableData.transaction_date} /></td>
//                 <td><input type="text" defaultValue={aTableData.stock_code} /></td>
//                 <td><input type="text" defaultValue={aTableData.product_name} /></td>
//                 <td> <input
//                   type="number"
//                   placeholder="成交單價"
//                   onChange={(e) => handleInputChangeA('unit_price', parseFloat(e.target.value))}
//                 /></td>
//                 <td><input
//                   type="number"
//                   onChange={(e) => handleInputChangeA('quantity', parseInt(e.target.value, 10))}
//                 /></td>
//                 <td>{transactionValue}</td>
//                 <td><input
//                   type="number"
//                   onChange={(e) => handleInputChangeA('fee', parseFloat(e.target.value))}
//                 />
//                 </td>
//                 <td><input
//                   type="number"
//                   onChange={(e) => handleInputChangeA('tax', parseFloat(e.target.value))}
//                 />
//                 </td>
//                 <td>{netAmount}</td>
//                 <td>{remainingQuantity}</td>
//                 <td>{profitLoss}</td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       </div>

//       <h1>B 表格</h1>
//       <div className="table-card-wrapper">
//         <Table hover>
//           <thead>
//             <tr>
//               <th>成交日期</th>
//               <th>股票代碼</th>
//               <th>買賣別</th>
//               <th>成交單價</th>
//               <th>成交股數</th>
//               <th>成交價金</th>
//               <th>手續費</th>
//               <th>交易稅</th>
//               <th>淨收付金額</th>
//               <th>沖銷股數</th>
//               <th>剩餘股數</th>
//               <th>攤提成本</th>
//               <th>攤提收入</th>
//               <th>損益試算</th>
//               <th>損益試算之二</th>
//             </tr>
//           </thead>
//           <tbody>
//             {transactionData && transactionData.map((transaction, index) => (
//               <tr key={index}>
//                 <td>{$date(transaction.date)}</td>
//                 <td>{transaction.stock_code}</td>
//                 <td>{transaction.transaction_type}</td>
//                 <td>{transaction.transaction_price}</td>
//                 <td>{transaction.transaction_quantity}</td>
//                 <td>{transaction.transaction_price}</td>
//                 <td>{transaction.estimated_fee}</td>
//                 <td>{transaction.estimated_tax}</td>
//                 <td>{transaction.net_amount}</td>
//                 <td>
//                   <input
//                     type="number"
//                     value={transaction.writeOffQuantities}
//                     onChange={(e) => handleInputChange(transaction.uuid, 'writeOffQuantity', parseInt(e.target.value))}
//                   />
//                 </td>
//                 <td>{transaction.remaining_quantity}</td>
//                 <td>{transaction.amortized_cost}</td>
//                 <td>{transaction.amortized_income}</td>
//                 <td>{transaction.profit_loss}</td>
//                 <td>{transaction.profit_loss_2}</td>
//               </tr>
//             ))}
//             <tr>
//               <td colSpan="18">
//                 <div className="totals">
//                   <p>攤提總成本: {transactionData.reduce((sum, item) => sum + item.amortized_cost, 0)}</p>
//                   <p>攤提總收入: {transactionData.reduce((sum, item) => sum + item.amortized_income, 0)}</p>
//                   <p>攤提總收入誤差: {transactionData.reduce((sum, item) => sum + item.amortized_income, 0) - (aTableData ? aTableData.net_amount : 0)}</p>
//                 </div>
//               </td>
//             </tr>
//             <button onClick={handleBatchWriteOff} className="btn btn-primary">存檔</button>
//           </tbody>
//         </Table>
//       </div>

//       <h1>C 表格</h1>
//       <div className="table-card-wrapper">
//         <Table hover id="transaction-table">
//           <thead>
//             <tr>
//               <th>交易日期</th>
//               <th>商品代碼</th>
//               <th>商品名稱</th>
//               <th>價格</th>
//               <th>數量</th>
//               <th>總價</th>
//               <th>備註</th>
//             </tr>
//           </thead>
//           <tbody>
//             {cTableData.map((transaction, index) => (
//               <tr key={index}>
//                 <td>{transaction.transaction_date}</td>
//                 <td>{transaction.symbol}</td>
//                 <td>{transaction.product_name}</td>
//                 <td>{transaction.unit_price}</td>
//                 <td>{transaction.quantity}</td>
//                 <td>{transaction.total_price}</td>
//                 <td>{transaction.remarks}</td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>
//     </div >
//   );
// };
