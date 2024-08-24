// import React, { useState } from 'react';
// import { Table, Button, Modal } from 'react-bootstrap';
// import "./TransactionPage.scss";

// const data = [
//   {
//     productName: '商品1',
//     category: '類別A',
//     averagePrice: 100,
//     shares: 50,
//     amount: 5000,
//     investmentCost: 4500,
//     income: 5500,
//     profitLoss: 1000,
//     profitRate: 22.22,
//   },
//   {
//     productName: '商品2',
//     category: '類別B',
//     averagePrice: 200,
//     shares: 30,
//     amount: 6000,
//     investmentCost: 5000,
//     income: 7000,
//     profitLoss: 2000,
//     profitRate: 40,
//   },

// ];

// const calculateSubtotal = (data) => {
//   const initialValue = {
//     investmentCost: 0,
//     income: 0,
//     profitLoss: 0,
//     profitRate: 0,
//   };
//   return data.reduce((acc, item) => {
//     acc.investmentCost += item.investmentCost;
//     acc.income += item.income;
//     acc.profitLoss += item.profitLoss;
//     acc.profitRate += item.profitRate;
//     return acc;
//   }, initialValue);
// };

// export const TransactionPage = () => {
//   const [show, setShow] = useState(false);
//   const [modalContent, setModalContent] = useState({});

//   const handleClose = () => setShow(false);
//   const handleShow = (content) => {
//     setModalContent(content);
//     setShow(true);
//   };

//   const subtotal = calculateSubtotal(data);

//   return (
//     <>
//       <div className="table-card-wrapper">
//         <Table hover>
//           <thead>
//             <tr>
//               <th>商品名稱</th>
//               <th>類別</th>
//               <th>成交均價</th>
//               <th>股數</th>
//               <th>價金</th>
//               <th>投資成本</th>
//               <th>收入</th>
//               <th>損益</th>
//               <th>獲利率</th>
//               <th>明細</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((item, index) => (
//               <tr key={index}>
//                 <td>{item.productName}</td>
//                 <td>{item.category}</td>
//                 <td>{item.averagePrice}</td>
//                 <td>{item.shares}</td>
//                 <td>{item.amount}</td>
//                 <td>{item.investmentCost}</td>
//                 <td>{item.income}</td>
//                 <td>{item.profitLoss}</td>
//                 <td>{item.profitRate}%</td>
//                 <td>
//                   <Button variant="primary" onClick={() => handleShow(item)}>
//                     查看明細
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//             <tr>
//               <td>小計</td>
//               <td colSpan="4"></td>
//               <td>{subtotal.investmentCost}</td>
//               <td>{subtotal.income}</td>
//               <td>{subtotal.profitLoss}</td>
//               <td>{(subtotal.profitRate / data.length).toFixed(2)}%</td>
//               <td></td>
//             </tr>
//           </tbody>
//         </Table>
//       </div>
//       <Modal show={show} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>明細</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>商品名稱: {modalContent.productName}</p>
//           <p>類別: {modalContent.category}</p>
//           <p>成交均價: {modalContent.averagePrice}</p>
//           <p>股數: {modalContent.shares}</p>
//           <p>價金: {modalContent.amount}</p>
//           <p>投資成本: {modalContent.investmentCost}</p>
//           <p>收入: {modalContent.income}</p>
//           <p>損益: {modalContent.profitLoss}</p>
//           <p>獲利率: {modalContent.profitRate}%</p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             關閉
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>


//   );
// };

