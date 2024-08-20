import React, { useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import "./InventoryPage.scss";

const data = [
  {
    stockCode: '2330',
    buySell: '買入',
    stockQuantity: 100,
    averagePrice: 600,
    transactionAmount: 60000,
    holdingCost: 59000,
    referencePrice: 610,
    marketValue: 61000,
    estimatedFee: 100,
    estimatedTax: 60,
    referenceProfitLoss: 940,
    profitLossRate: 1.57,
  },
  // 其他數據...
];

const calculateTotal = (data) => {
  return data.reduce((acc, item) => {
    acc.holdingCost += item.holdingCost;
    acc.marketValue += item.marketValue;
    acc.estimatedFee += item.estimatedFee;
    acc.estimatedTax += item.estimatedTax;
    acc.referenceProfitLoss += item.referenceProfitLoss;
    return acc;
  }, {
    holdingCost: 0,
    marketValue: 0,
    estimatedFee: 0,
    estimatedTax: 0,
    referenceProfitLoss: 0,
  });
};

export const InventoryPage = () => {
  const [show, setShow] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const [editTax, setEditTax] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = (content) => {
    setModalContent(content);
    setShow(true);
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditTax(data[index].estimatedTax);
  };

  const handleSaveClick = (index) => {
    const updatedData = [...data];
    updatedData[index].estimatedTax = parseFloat(editTax);
    setEditingIndex(null);
    setEditTax('');
  };

  const handleChange = (e) => {
    setEditTax(e.target.value);
  };

  const total = calculateTotal(data);

  return (
    <>
      <div className="table-card-wrapper mb-5 ">
        <Table hover>
          <thead>
            <tr>
              <th>股票代碼</th>
              <th>買賣別</th>
              <th>庫存股數</th>
              <th>平均單價</th>
              <th>成交價金</th>
              <th>持有成本</th>
              <th>參考價</th>
              <th>市值</th>
              <th>預估手續費</th>
              <th>預估交易賣出稅</th>
              <th>參考損益</th>
              <th>損益率</th>
              <th>明細</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.stockCode}</td>
                <td>{item.buySell}</td>
                <td>{item.stockQuantity}</td>
                <td>{item.averagePrice}</td>
                <td>{item.transactionAmount}</td>
                <td>{item.holdingCost}</td>
                <td>{item.referencePrice}</td>
                <td>{item.marketValue}</td>
                <td>{item.estimatedFee}</td>
                <td>
                  {editingIndex === index ? (
                    <>
                      <Form.Control
                        type="number"
                        value={editTax}
                        onChange={handleChange}
                        style={{ width: '80px', display: 'inline-block' }}
                      />
                      <Button variant="success" className="ms-2" onClick={() => handleSaveClick(index)}>保存</Button>
                    </>
                  ) : (
                    <>
                      <span className="estimated-tax">{item.estimatedTax}</span>
                      <Button variant="secondary" className="ms-2" onClick={() => handleEditClick(index)}>編輯</Button>
                    </>
                  )}
                </td>
                <td>{item.referenceProfitLoss}</td>
                <td>{item.profitLossRate}%</td>
                <td>
                  <Button variant="primary" onClick={() => handleShow(item)}>
                    查看明細
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className="table-card-wrapper">
        <Table hover>
          <tbody>
            <tr>
              <td>持有成本</td>
              <td>{total.holdingCost}</td>
              <td>市值</td>
              <td>{total.marketValue}</td>
              <td>預估手續費</td>
              <td>{total.estimatedFee}</td>
              <td>預估交易賣出稅</td>
              <td>{total.estimatedTax}</td>
            </tr>
            <tr>
              <td>融資自備款</td>
              <td>0</td> {/* 假設值為 0，實際應計算 */}
              <td>融資金額</td>
              <td>0</td> {/* 假設值為 0，實際應計算 */}
              <td>融券保證金</td>
              <td>0</td> {/* 假設值為 0，實際應計算 */}
              <td>融券擔保品</td>
              <td>0</td> {/* 假設值為 0，實際應計算 */}
            </tr>
            <tr>
              <td>利息</td>
              <td>0</td> {/* 假設值為 0，實際應計算 */}
              <td>參考損益</td>
              <td>{total.referenceProfitLoss}</td>
              <td colSpan="6"></td> {/* 填充空白 */}
            </tr>
          </tbody>
        </Table>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>明細</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>股票代碼: {modalContent.stockCode}</p>
          <p>買賣別: {modalContent.buySell}</p>
          <p>庫存股數: {modalContent.stockQuantity}</p>
          <p>平均單價: {modalContent.averagePrice}</p>
          <p>成交價金: {modalContent.transactionAmount}</p>
          <p>持有成本: {modalContent.holdingCost}</p>
          <p>參考價: {modalContent.referencePrice}</p>
          <p>市值: {modalContent.marketValue}</p>
          <p>預估手續費: {modalContent.estimatedFee}</p>
          <p>預估交易賣出稅: {modalContent.estimatedTax}</p>
          <p>參考損益: {modalContent.referenceProfitLoss}</p>
          <p>損益率: {modalContent.profitLossRate}%</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            關閉
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

