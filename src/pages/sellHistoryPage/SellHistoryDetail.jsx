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
    const [thRows, setThRows] = useState([]);         // TransactionHistory 明細（B）

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

    // 取 TransactionHistory（明細）
    useEffect(() => {
        let alive = true;
        (async () => {
            if (!sellUuid) return;
            const res = await fetch(TRANS_HISTORY_BY_SELL_API(sellUuid));
            const data = await res.json();
            if (!alive) return;
            // 後端可能回陣列或 { items: [...] }
            setThRows(Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : []));
        })().catch(() => setThRows([]));
        return () => { alive = false; };
    }, [sellUuid]);

    // ====== 欄位 ======
    const aColumns = [
        { key: 'transaction_date', name: '交易日期', selector: r => r.transaction_date },
        { key: 'stock_code', name: '股票代號', selector: r => r.stock_code },
        { key: 'product_name', name: '商品名稱', selector: r => r.product_name },
        { key: 'unit_price', name: '成交單價', selector: r => r.unit_price },
        { key: 'transaction_quantity', name: '成交股數', selector: r => r.transaction_quantity },
        { key: 'transaction_value', name: '成交價金', selector: r => r.transaction_value },
        { key: 'fee', name: '手續費', selector: r => r.fee },
        { key: 'tax', name: '交易稅', selector: r => r.tax },
        { key: 'net_amount', name: '淨收付金額', selector: r => r.net_amount },
        { key: 'profit_loss', name: '損益', selector: r => r.profit_loss },
        { key: 'remarks', name: '備註', selector: r => r.remarks },
    ];

    const bAfterColumns = [
        { key: 'uuid', name: 'UUID', selector: r => r.uuid },
        { key: 'remaining_quantity', name: '剩餘股數', selector: r => r.remaining_quantity },
        { key: 'amortized_cost', name: '攤提成本', selector: r => r.amortized_cost },
        { key: 'amortized_income', name: '攤提收入', selector: r => r.amortized_income },
        { key: 'profit_loss', name: '損益試算', selector: r => r.profit_loss },
        { key: 'profit_loss_2', name: '損益試算之二', selector: r => r.profit_loss_2 },
        { key: 'remarks', name: '來源備註', selector: r => r.remarks }
    ];

    const bBeforeColumns = [
        { key: 'uuid', name: 'UUID', selector: r => r.uuid },
        { key: 'transaction_quantity_before', name: '沖前股數', selector: r => r.transaction_quantity_before },
        { key: 'unit_price_before', name: '來源單價', selector: r => r.unit_price_before },
        { key: 'net_amount_before', name: '來源淨額', selector: r => r.net_amount_before },
        { key: 'write_off_quantity', name: '本次沖銷股數', selector: r => r.write_off_quantity },
    ];

    // ====== 資料組裝（完全不使用 snapshot） ======

    // A（主檔）
    const aData = useMemo(() => {
        if (!sellEntry) return [];
        return [{
            transaction_date: sellEntry.transaction_date,
            stock_code: sellEntry.stock_code,
            product_name: sellEntry.product_name,
            unit_price: sellEntry.unit_price,
            transaction_quantity: sellEntry.quantity,
            transaction_value: sellEntry.transaction_value,
            fee: sellEntry.fee,
            tax: sellEntry.tax,
            net_amount: sellEntry.net_amount,
            profit_loss: sellEntry.profit_loss,
            remarks: sellEntry.remarks,
        }];
    }, [sellEntry]);

    // B after（由 TransactionHistory 明細映射）
    const bAfterData = useMemo(() => {
        if (!Array.isArray(thRows)) return [];
        return thRows.map(r => ({
            uuid: r.inventory_uuid || r.uuid,
            remaining_quantity: r.remaining_quantity,
            amortized_cost: r.amortized_cost,
            amortized_income: r.amortized_income,
            profit_loss: r.profit_loss,
            profit_loss_2: r.profit_loss_2,
        }));
    }, [thRows]);

    // B before（由 TransactionHistory 明細映射）
    const bBeforeData = useMemo(() => {
        if (!Array.isArray(thRows)) return [];
        return thRows.map(r => ({
            uuid: r.inventory_uuid || r.uuid,
            transaction_quantity_before: r.quantity_before,
            unit_price_before: r.unit_price_before,
            net_amount_before: r.net_amount_before,
            write_off_quantity: r.write_off_quantity,
            remarks: r.remarks,
        }));
    }, [thRows]);

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
                    data={bAfterData}
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
                    data={bBeforeData}
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

