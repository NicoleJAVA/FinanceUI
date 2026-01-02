import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {

  addBuyTransaction,
  updateBuyField,
  clearBuyHighlight,
  setBuyDraft,
} from '../../redux/buy/slice';
import { Table, Button, Modal } from 'react-bootstrap';
import './BuyPage.scss';
import { useDate } from '../../context/DateContext';

export const BuyPage = () => {
  const dispatch = useDispatch();
  const $date = useDate();

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  // const transactionSource = useSelector(state => state.buy.transactionSource); todo dele
  const transactionDraft = useSelector(state => state.buy.transactionDraft);
  const highlightedCells = useSelector(state => state.buy.highlightedCells);
  const aTableData = useSelector(state => state.buy.aTableData);

  const handleInputChangeA = (field, value) => {
    dispatch(updateBuyField({ field, value }));
  };

  const handleBuySubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        stock_code: aTableData[0].stock_code,
        transaction_type: 'Buy',
        date: aTableData[0].transaction_date,
        unit_price: aTableData[0].unit_price,
        transaction_quantity: aTableData[0].transaction_quantity,
        transaction_value: aTableData[0].unit_price * aTableData[0].transaction_quantity,
        estimated_fee: aTableData[0].fee,
        estimated_tax: aTableData[0].tax,
        net_amount: aTableData[0].net_amount,
        remarks: aTableData[0].remarks,
      };

      const result = await dispatch(addBuyTransaction(payload)).unwrap();
      setModalData(result.data);
      setShowModal(true);
    } catch (err) {
      setModalData({ error: err.message || '未知錯誤' });
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => { todo dele
  //   dispatch(getBuyTransactions({ stockCode: '2330', page: 1, limit: 10 }));
  // }, [dispatch]);

  // useEffect(() => {
  //   if (transactionSource?.length > 0) {
  //     dispatch(setBuyDraft(transactionSource.map(tx => ({
  //       ...tx
  //     }))));
  //   }
  // }, [transactionSource, dispatch]); todo dele

  useEffect(() => {
    if (Object.keys(highlightedCells).length > 0) {
      const timer = setTimeout(() => {
        dispatch(clearBuyHighlight());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedCells, dispatch]);

  return (
    <div className='page-container'>
      {loading && (
        <div className="fullscreen-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">載入中...</span>
          </div>
        </div>
      )}

      <div className="table-card-wrapper">
        <Table id="table-A">
          <thead>
            <tr>
              <th>成交日期</th>
              <th>商品代碼</th>
              <th>商品名稱</th>
              <th>成交單價</th>
              <th>成交股數</th>
              <th>手續費</th>
              <th>交易稅</th>
              <th>淨收付金額</th>
              <th>備註</th>
            </tr>
          </thead>
          <tbody>
            {aTableData && aTableData.length > 0 && (
              <tr>
                <td><input className='table-A-input' type="date" value={aTableData[0].transaction_date} onChange={(e) => handleInputChangeA('transaction_date', e.target.value)} /></td>
                <td><input className='table-A-input' type="text" value={aTableData[0].stock_code} onChange={(e) => handleInputChangeA('stock_code', e.target.value)} /></td>
                <td><input className='table-A-input' type="text" value={aTableData[0].product_name} onChange={(e) => handleInputChangeA('product_name', e.target.value)} /></td>
                <td><input className='table-A-input' type="number" value={aTableData[0].unit_price} onChange={(e) => handleInputChangeA('unit_price', parseFloat(e.target.value))} /></td>
                <td><input className='table-A-input' type="number" value={aTableData[0].transaction_quantity} onChange={(e) => handleInputChangeA('transaction_quantity', parseInt(e.target.value))} /></td>
                <td><input className='table-A-input' type="number" value={aTableData[0].fee} onChange={(e) => handleInputChangeA('fee', parseFloat(e.target.value))} /></td>
                <td><input className='table-A-input' type="number" value={aTableData[0].tax} onChange={(e) => handleInputChangeA('tax', parseFloat(e.target.value))} /></td>
                <td><input className='table-A-input' type="number" value={aTableData[0].net_amount} onChange={(e) => handleInputChangeA('net_amount', parseFloat(e.target.value))} /></td>
                <td><input className='table-A-input' type="text" value={aTableData[0].remarks} onChange={(e) => handleInputChangeA('remarks', e.target.value)} /></td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Button className="btn btn-success" onClick={handleBuySubmit}>存檔</Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>買進結果</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalData ? (
            <Table striped bordered size="sm">
              <tbody>
                {Object.entries(modalData).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            '尚無資料'
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            關閉
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
