import React, { useEffect, useState } from 'react';
import "./HistoryPage.scss";
import { useSelector, useAppDispatch } from "../../redux/hooks";
import DataTable, { createTheme } from 'react-data-table-component';
import { useDate } from '../../context/DateContext';
import { getAllHistory } from '../../redux/history/slice';

export const HistoryPage = () => {

  const dispatch = useAppDispatch();
  const history = useSelector((state) => state.history.data);
  const status = useSelector((state) => state.history.status);

  const [historyData, setHistoryData] = useState(history);
  const $date = useDate();


  const customStyles = {
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

  };

  createTheme('customTheme', {
    text: {
      primary: '#AFBECC',
      secondary: '#AFBECC',
    },
    background: {
      default: '#22282E',
    },
    context: {
      background: '#27303B',
      text: '#AFBECC',
    },
    divider: {
      default: '#37435A',
    },

  }, 'dark');

  const columns = [




    { name: '成交日期', selector: row => row.uuid, sortable: true },
    { name: '股票代碼', selector: row => row.transaction_uuid, sortable: true },
    { name: '買賣別', selector: row => row.inventory_uuid, sortable: true },
    { name: '成交單價', selector: row => row.write_off_quantity, sortable: true },
    { name: '成交股數', selector: row => row.stock_code, sortable: true },
    { name: '成交價金', selector: row => row.transaction_date, sortable: true },
    { name: '手續費', selector: row => row.sell_record_uuid, sortable: true },
    { name: '存貨價金', selector: row => row.inventory_price, sortable: true },
    { name: '沖銷價金', selector: row => row.sell_price, sortable: true },
  ];

  useEffect(() => {
    if (status === 'idle') {
      dispatch(getAllHistory());
    }
  }, [status, dispatch]);

  return (
    <div className="demo-root-container">
      <div className="demo-title">History page</div>
      <DataTable
        columns={columns}
        data={history}
        pagination
        highlightOnHover
        pointerOnHover
        customStyles={customStyles}
        theme="customTheme"
      />
    </div>
  );
};
