import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { MainTable } from '../../component/MainTable/MainTable';

// 單筆 SellHistory（主檔）
const SELL_HISTORY_ONE_API = (sellUuid) =>
    `/sellHistory/one?data_uuid=${encodeURIComponent(sellUuid)}`;

// 依 sell_record_uuid 取所有 TransactionHistory（明細）
const TRANS_HISTORY_BY_SELL_API = (sellUuid) =>
    `/transactionHistory/by-sell?sell_record_uuid=${encodeURIComponent(sellUuid)}`;

export const SellHistoryDetail = () => {
    const navigate = useNavigate();

    // 路由：/sell-history/:id，或相容舊的 ?sell=
    const { id: idFromParams } = useParams();
    const [sp] = useSearchParams();
    const sellUuid = idFromParams || sp.get('sell') || '';

    const [sellEntry, setSellEntry] = useState(null); // SellHistory 主檔（A）
    const [thRows, setThRows] = useState([]);         // 明細（B）

    // 取 SellHistory（主檔）
    useEffect(() => {
        let alive = true;
        (async () => {
            if (!sellUuid) return;
            const res = await fetch(SELL_HISTORY_ONE_API(sellUuid));
            const data = await res.json();
            if (!alive) return;
            // 後端可能回 { sell_history_entry: {...} } 或直接 {...}
            setSellEntry(data?.sell_history_entry || data || null);
        })().catch(() => setSellEntry(null));
        return () => { alive = false; };
    }, [sellUuid]);

    //（明細）
    useEffect(() => {
        let alive = true;
        (async () => {
            if (!sellUuid) return;
            const res = await fetch(TRANS_HISTORY_BY_SELL_API(sellUuid));
            const data = await res.json();
            console.log('HISTORY', data);
            if (!alive) return;
            // 後端可能回陣列或 { items: [...] }
            setThRows(Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : []));
        })().catch(() => setThRows([]));
        return () => { alive = false; };
    }, [sellUuid]);

    const aColumns = [
        { key: 'transaction_date', name: '交易日期' },
        { key: 'created_at', name: '建立時間' },
        { key: 'stock_code', name: '股票代號' },
        { key: 'product_name', name: '商品名稱' },
        { key: 'unit_price', name: '成交單價' },
        { key: 'transaction_quantity', name: '成交股數' },
        { key: 'transaction_value', name: '成交價金' },
        { key: 'fee', name: '手續費' },
        { key: 'tax', name: '交易稅' },
        { key: 'net_amount', name: '淨收付金額' },
        { key: 'profit_loss', name: '損益' },
        { key: 'remarks', name: '備註' },
    ];

    const bAfterColumns = [
        { key: 'uuid', name: 'UUID' },
        { key: 'remaining_quantity', name: '剩餘股數' },
        { key: 'amortized_cost', name: '攤提成本' },
        { key: 'amortized_income', name: '攤提收入' },
        { key: 'profit_loss', name: '損益試算' },
        { key: 'profit_loss_2', name: '損益試算之二' },
        { key: 'remarks', name: '來源備註' },
    ];

    const bBeforeColumns = [
        { key: 'uuid', name: 'UUID' },
        { key: 'transaction_quantity_before', name: '沖前股數' },
        { key: 'unit_price_before', name: '來源單價' },
        { key: 'net_amount_before', name: '來源淨額' },
        { key: 'write_off_quantity', name: '本次沖銷股數' },
    ];

    // ====== 資料組裝（完全不使用 snapshot） ======

    // A（主檔）
    const aData = sellEntry ? [{
        uuid: sellEntry.data_uuid || sellEntry.uuid,
        ...sellEntry
    }] : [];

    // B before / B after
    const bData = Array.isArray(thRows)
        ? thRows.map(r => ({
            uuid: r.uuid || r.inventory_uuid,
            ...r
        }))
        : [];


    return (
        <div className="page-container">
            <div className='theme-title' style={{ margin: '24px 0' }}>交易歷史詳情</div>


            <div className='card-table-wrapper mb-5'>
                <div className='theme-subtitle mt-24 mb-36' >Table A（賣出單主檔）</div>
                <div className="card-table-header-divider"></div>

                <MainTable
                    id="history-detail-A"
                    data={aData}
                    columns={aColumns}
                    localePrefix="transaction"
                    settings={{}}
                />
            </div>

            <div className='card-table-wrapper mb-5'>
                <div className='theme-subtitle mt-24 mb-36'>B（沖後結果）</div>
                <div className="card-table-header-divider"></div>
                <MainTable
                    id="history-detail-B-after"
                    data={bData}
                    columns={bAfterColumns}
                    localePrefix="transaction"
                    settings={{}}
                />
            </div>


            <div className='card-table-wrapper mb-5'>
                <div className='theme-subtitle mt-24 mb-36' >B（沖前快照）</div>
                <div className="card-table-header-divider"></div>

                <MainTable
                    id="history-detail-B-before"
                    data={bData}
                    columns={bBeforeColumns}
                    localePrefix="sell_detail"
                    settings={{}}
                />
            </div>

            <div style={{ marginTop: 20, marginBottom: 60 }}>
                <button className='btn btn-primary' onClick={() => navigate(-1)}>返回</button>
            </div>

            <div className="theme-divider"></div>

        </div>
    );
};

