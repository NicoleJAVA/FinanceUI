import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainTable } from '../../component/MainTable/MainTable';
import moment from 'moment'

const HISTORY_LIST_API = '/sellHistory/all'; // ← 依你後端實際路徑調整

export const SellHistoryPage = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(HISTORY_LIST_API);
        const data = await res.json();
        if (!alive) return;
        // 後端若直接回傳 TransactionHistory 的陣列：
        // [{transaction_uuid, inventory_uuid, write_off_quantity, stock_code, transaction_date, sell_record_uuid}, ...]
        // const t1 = new Date(r.transaction_date).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
        // const t2 = new Date(r.created_at).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
        setRows(Array.isArray(data) ? data : (data?.items || []));
        const list = Array.isArray(data) ? data : (data?.items || [])

        setRows(list.map(r => ({
          ...r,
          transaction_date: new Date(r.transaction_date).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
          created_at: new Date(r.created_at).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
        })))
      } catch (e) {
        console.error('[TransactionHistory list] fetch error:', e);
        setRows([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const columns = useMemo(() => ([
    // { key: 'transaction_date', name: '交易日期', selector: r => r.transaction_date },
    { key: 'transaction_date', name: '交易日期', selector: r => new Date(r.transaction_date).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }) },
    { key: 'created_at', name: '建立時間', selector: r => new Date(r.created_at).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }) },
    { key: 'stock_code', name: '股票代號', selector: r => r.stock_code },
    // { key: 'inventory_uuid', name: '來源UUID', selector: r => r.inventory_uuid },
    // { key: 'write_off_quantity', name: '沖銷股數', selector: r => r.write_off_quantity },
    // { key: 'transaction_uuid', name: '歷史UUID', selector: r => r.transaction_uuid },
    // { key: 'sell_record_uuid', name: 'Sell UUID', selector: r => r.sell_record_uuid },
  ]), []);


  const tableSettings = {

    tableStyle: {

    },
    paging: {
      showFooter: true,
    },
    // expandColumnName: "detailData",
    // expandColumns: [

    //   { key: "color" },
    //   { key: "season" },
    //   { key: "fruit" },
    //   { key: "flower" },


    // ],
    // autoGenColumns: true,

  }
  const handleRowClick = (row) => {
    if (!row) return;

    navigate(`/sell-history/${row.data_uuid}`);
  };

  // const handleRowClick = (row) => {
  //   if (!row) return;
  //   // navigate(`/history/transaction/${row.transaction_uuid}?sell=${row.sell_record_uuid}`);
  //   navigate(`/sell-history/${row.transaction_uuid}?sell=${row.data_uuid}`);
  //   console.log('row.sell_record_uuid', row); // todo dele
  //   // navigate(`/sell-history/id=${row.data_uuid}`);

  // };

  return (
    <div className="page-container">
      <div className='theme-title' style={{ margin: '24px 0' }}>沖銷交易歷史</div>

      <MainTable
        id="transaction-history-list"
        data={rows}
        columns={columns}
        onRowClick={handleRowClick}
        localePrefix="history_page"
        settings={tableSettings}
        loading={loading}
      />
    </div>
  );
};
