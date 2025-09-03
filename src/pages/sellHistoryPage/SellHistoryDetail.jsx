import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainTable } from '../../component/MainTable/MainTable';

// 單筆 SellHistory（含 snapshot_json）
const SELL_HISTORY_ONE_API = (sellUuid) =>
    `/sellHistory/one?data_uuid=${sellUuid}`;

// （可選）依 sell_record_uuid 取 TransactionHistory 明細
const TRANS_HISTORY_BY_SELL_API = (sellUuid) =>
    `/transactionHistory/by-sell?sell_record_uuid=${sellUuid}`;

export const SellHistoryDetail = () => {
    // 路由：/sell-history/:id
    const { id: sellUuid } = useParams();
    const navigate = useNavigate();

    const [sellEntry, setSellEntry] = useState(null);   // SellHistory 主檔
    const [snapshot, setSnapshot] = useState(null);     // snapshot_json
    const [thRows, setThRows] = useState([]);           // 可選：TransactionHistory 明細

    // 取 SellHistory（含 snapshot_json）
    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                if (!sellUuid) return;
                const res = await fetch(SELL_HISTORY_ONE_API(sellUuid));
                const data = await res.json();
                if (!alive) return;

                const sh = data?.sell_history_entry || data;
                setSellEntry(sh);

                let snap = null;
                const rawSnap = sh?.snapshot_json || data?.snapshot_json;
                if (rawSnap) {
                    try { snap = JSON.parse(rawSnap); } catch { snap = null; }
                }
                setSnapshot(snap);
            } catch (e) {
                console.error('[SellHistory one] error:', e);
                setSellEntry(null);
                setSnapshot(null);
            }
        })();
        return () => { alive = false; };
    }, [sellUuid]);

    // （可選）取該筆的所有 TransactionHistory（B after 明細，若你需要一起顯示）
    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                if (!sellUuid) return;
                const res = await fetch(TRANS_HISTORY_BY_SELL_API(sellUuid));
                const data = await res.json();
                if (!alive) return;
                // 後端回陣列才塞；不是必要就保留空陣列即可
                setThRows(Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : []));
            } catch {
                setThRows([]);
            }
        })();
        return () => { alive = false; };
    }, [sellUuid]);

    // A 區塊欄位
    const aColumns = [
        { key: 'transaction_date', name: '交易日期', selector: r => r.transaction_date },
        { key: 'stock_code', name: '股票代號', selector: r => r.stock_code },
        { key: 'product_name', name: '商品名稱', selector: r => r.product_name },
        { key: 'unit_price', name: '成交單價', selector: r => r.unit_price },
        { key: 'transaction_quantity', name: '成交股數', selector: r => r.transaction_quantity },
        { key: 'transaction_value', name: '成交價金', selector: r => r.transaction_value },
        { key: 'estimated_fee', name: '手續費', selector: r => r.estimated_fee || r.fee },
        { key: 'estimated_tax', name: '交易稅', selector: r => r.estimated_tax || r.tax },
        { key: 'net_amount', name: '淨收付金額', selector: r => r.net_amount },
        { key: 'profit_loss', name: '損益', selector: r => r.profit_loss },
    ];

    // B after 欄位（snapshot 的明細 or 你也可用 thRows 顯示）
    const bAfterColumns = [
        { key: 'uuid', name: 'UUID', selector: r => r.inventory_uuid || r.uuid },
        { key: 'remaining_quantity', name: '剩餘股數', selector: r => r.remaining_quantity },
        { key: 'amortized_cost', name: '攤提成本', selector: r => r.amortized_cost },
        { key: 'amortized_income', name: '攤提收入', selector: r => r.amortized_income },
        { key: 'profit_loss', name: '損益試算', selector: r => r.profit_loss },
        { key: 'profit_loss_2', name: '損益試算之二', selector: r => r.profit_loss_2 },
    ];

    // B before 欄位
    const bBeforeColumns = [
        { key: 'uuid', name: 'UUID', selector: r => r.inventory_uuid || r.uuid },
        { key: 'transaction_quantity_before', name: '沖前股數', selector: r => r.transaction_quantity_before },
        { key: 'unit_price', name: '來源單價', selector: r => r.unit_price },
        { key: 'net_amount', name: '來源淨額', selector: r => r.net_amount },
        { key: 'writeOffQuantity', name: '本次沖銷股數', selector: r => r.writeOffQuantity },
    ];

    // A 資料：優先 snapshot.A，否則用 sellEntry 主檔
    const aData = useMemo(() => {
        if (snapshot?.A) {
            const A = snapshot.A;
            return [{
                transaction_date: A.transaction_date || sellEntry?.transaction_date,
                stock_code: A.stock_code || sellEntry?.stock_code,
                product_name: A.product_name || sellEntry?.product_name,
                unit_price: A.unit_price ?? sellEntry?.unit_price,
                transaction_quantity: A.transaction_quantity ?? sellEntry?.quantity,
                transaction_value: A.transaction_value ?? sellEntry?.transaction_value,
                estimated_fee: A.estimated_fee ?? sellEntry?.fee,
                estimated_tax: A.estimated_tax ?? sellEntry?.tax,
                net_amount: A.net_amount ?? sellEntry?.net_amount,
                profit_loss: sellEntry?.profit_loss,
            }];
        }
        if (sellEntry) {
            return [{
                transaction_date: sellEntry.transaction_date,
                stock_code: sellEntry.stock_code,
                product_name: sellEntry.product_name,
                unit_price: sellEntry.unit_price,
                transaction_quantity: sellEntry.quantity,
                transaction_value: sellEntry.transaction_value,
                estimated_fee: sellEntry.fee,
                estimated_tax: sellEntry.tax,
                net_amount: sellEntry.net_amount,
                profit_loss: sellEntry.profit_loss,
            }];
        }
        return [];
    }, [snapshot, sellEntry]);

    // B after / B before：從 snapshot 還原
    const bAfterData = useMemo(() => {
        const arr = snapshot?.B_after || snapshot?.b_items || [];
        return Array.isArray(arr) ? arr : [];
    }, [snapshot]);

    const bBeforeData = useMemo(() => {
        const arr = snapshot?.B_before || [];
        return Array.isArray(arr) ? arr : [];
    }, [snapshot]);

    return (
        <div className="page-container">
            <h3 style={{ margin: '24px 0' }}>交易歷史詳情</h3>

            {/* 上：A */}
            <h4>Table A（賣出單快照）</h4>
            <MainTable
                id="history-detail-A"
                data={aData}
                columns={aColumns}
                localePrefix="transaction"
                settings={{}}
            />

            {/* 中：B after（優先用 snapshot；你也可改成 thRows 顯示後端明細） */}
            <h4 style={{ marginTop: 28 }}>B（沖後結果）</h4>
            <MainTable
                id="history-detail-B-after"
                data={bAfterData}
                columns={bAfterColumns}
                localePrefix="transaction"
                settings={{}}
            />

            {/* 下：B before */}
            <h4 style={{ marginTop: 28 }}>B（沖前快照）</h4>
            <MainTable
                id="history-detail-B-before"
                data={bBeforeData}
                columns={bBeforeColumns}
                localePrefix="transaction"
                settings={{}}
            />

            <div style={{ marginTop: 20 }}>
                <button onClick={() => navigate(-1)}>返回</button>
            </div>
        </div>
    );
};
