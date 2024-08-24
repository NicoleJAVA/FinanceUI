import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactions } from '../../redux/transaction/slice';
import { Table, Button, Modal } from 'react-bootstrap';
import './TransactionPage.scss';
import { useDate } from '../../context/DateContext';

// 手續費折扣率
const FEE_DISCOUNT = 0.003;

export const TransactionPage = () => {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions.data);
  const status = useSelector((state) => state.transactions.status);
  const error = useSelector((state) => state.transactions.error);
  const $date = useDate();


  // 狀態管理用於模態視窗
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  // 管理 A 表格的狀態
  const [aTableData, setATableData] = useState(null);

  // 管理 B 表格的狀態
  const [bTableData, setBTableData] = useState([]);

  // 管理 C 表格的狀態
  const [cTableData, setCTableData] = useState([]);

  // 計算相關值
  const calculateValues = () => {
    if (aTableData) {
      const transactionValue = aTableData.unit_price * aTableData.quantity;
      const fee = Math.round(transactionValue * 0.01425 * FEE_DISCOUNT);
      const tax = Math.round(transactionValue * 0.01); // 假設 1% 的交易稅
      const netAmount = transactionValue - fee - tax;

      const remainingQuantity = aTableData.quantity - bTableData.reduce((sum, item) => sum + item.writeOffQuantity, 0);
      const profitLoss = bTableData.reduce((sum, item) => sum + item.profitLoss, 0);

      return { transactionValue, fee, tax, netAmount, remainingQuantity, profitLoss };
    }
    return {};
  };

  useEffect(() => {
    if (status === 'idle') {
      dispatch(getTransactions({ stockCode: "2330" }));
    }
  }, [status, dispatch]);

  // useEffect(() => {
  //   if (transactions.length > 0) {
  //     // 假設第一筆交易數據為 A 表格數據
  //     setATableData(transactions[0]);

  //     // 從後端獲取 B 表格數據
  //     fetch('/api/inventory')
  //       .then(response => response.json())
  //       .then(data => setBTableData(data));

  //     // 從後端獲取 C 表格數據
  //     fetch('/api/transactions')
  //       .then(response => response.json())
  //       .then(data => setCTableData(data));
  //   }
  // }, [transactions]);

  if (status === 'loading') {
    return <div>載入中...</div>;
  }

  if (status === 'failed') {
    return <div>發生錯誤: {error}</div>;
  }

  const handleRowClick = (data) => {
    setModalData(data);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  // const handleTestButtonClick = () => {
  //   if (process.env.NODE_ENV === 'development') {
  //     // 清空 C 表格
  //     fetch('/api/clear-c-table', { method: 'POST' })
  //       .then(() => {
  //         // 還原庫存到初始資料
  //         fetch('/api/reset-inventory', { method: 'POST' })
  //           .then(() => {
  //             // 重新載入資料
  //             dispatch(getTransactions());
  //           });
  //       });
  //   }
  // };

  const { transactionValue, fee, tax, netAmount, remainingQuantity, profitLoss } = calculateValues();

  return (
    <div>
      <h1>A 表格</h1>
      <div className="table-card-wrapper">
        <Table hover>
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
            {aTableData && (
              <tr>
                <td><input type="date" defaultValue={aTableData.transaction_date} /></td>
                <td><input type="text" defaultValue={aTableData.symbol} /></td>
                <td><input type="text" defaultValue={aTableData.product_name} /></td>
                <td><input type="number" defaultValue={aTableData.unit_price} /></td>
                <td><input type="number" defaultValue={aTableData.quantity} /></td>
                <td>{transactionValue}</td>
                <td><input type="number" value={fee} readOnly /></td>
                <td><input type="number" value={tax} readOnly /></td>
                <td>{netAmount}</td>
                <td>{remainingQuantity}</td>
                <td>{profitLoss}</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <h1>B 表格</h1>
      <div className="table-card-wrapper">
        <Table hover>
          <thead>
            <tr>
              <th>成交日期</th>
              <th>股票代碼</th>
              <th>買賣別</th>
              <th>成交單價</th>
              <th>成交股數</th>
              <th>成交價金</th>
              <th>手續費</th>
              <th>交易稅</th>
              {/* <th>融資自備款</th>
              <th>融資金額</th>
              <th>融券保證金</th>
              <th>融券擔保品</th>
              <th>融券手續費</th>
              <th>融券標借費</th>
              <th>利息</th>
              <th>利息代收稅款</th> */}
              <th>淨收付金額</th>
              <th>沖銷股數</th>
              <th>剩餘股數</th>
              <th>攤提成本</th>
              <th>攤提收入</th>
              <th>損益試算</th>
              <th>損益試算之二</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index} onClick={() => handleRowClick(transaction)}>
                <td>{$date(transaction.date)}</td>
                <td>{transaction.stock_code}</td>
                <td>{transaction.transaction_type}</td>
                <td>{transaction.transaction_price}</td>
                <td>{transaction.transaction_quantity}</td>
                <td>{transaction.transaction_price}</td>
                <td>{transaction.estimated_fee}</td>
                <td>{transaction.estimated_tax}</td>
                {/* <td>{transaction.financing_self}</td>
                <td>{transaction.financing_amount}</td>
                <td>{transaction.margin}</td>
                <td>{transaction.margin_item}</td>
                <td>{transaction.margin_fee}</td>
                <td>{transaction.margin_borrow_fee}</td>
                <td>{transaction.interest}</td>
                <td>{transaction.interest_tax}</td> */}
                <td>{transaction.net_amount}</td>
                <td><input type="number" defaultValue={transaction.writeOffQuantity} /></td>
                <td>{transaction.remaining_quantity}</td>
                <td>{transaction.amortized_cost}</td>
                <td>{transaction.amortized_income}</td>
                <td>{transaction.profit_loss}</td>
                <td>{transaction.profit_loss_2}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="18">
                <div className="totals">
                  <p>攤提總成本: {bTableData.reduce((sum, item) => sum + item.amortized_cost, 0)}</p>
                  <p>攤提總收入: {bTableData.reduce((sum, item) => sum + item.amortized_income, 0)}</p>
                  <p>攤提總收入誤差: {bTableData.reduce((sum, item) => sum + item.amortized_income, 0) - (aTableData ? aTableData.net_amount : 0)}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>

      <h1>C 表格</h1>
      <div className="table-card-wrapper">
        <Table hover>
          <thead>
            <tr>
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
      </div>

      {/* <Button onClick={handleTestButtonClick}>測試按鈕</Button> */}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>詳細資料</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalData && (
            <div>
              <p><strong>交易日期:</strong> {modalData.transaction_date}</p>
              <p><strong>股票代碼:</strong> {modalData.symbol}</p>
              <p><strong>商品名稱:</strong> {modalData.product_name}</p>
              <p><strong>成交單價:</strong> {modalData.unit_price}</p>
              <p><strong>成交股數:</strong> {modalData.quantity}</p>
              <p><strong>損益試算:</strong> {modalData.profit_loss}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            關閉
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};