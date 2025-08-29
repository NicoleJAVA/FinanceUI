import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MainTable } from '../../component/MainTable/MainTable';


const SellPreviewPage = () => {
    const previewData = useSelector(state => state.transactions.previewResult);
    const transactionDraft = useSelector(state => state.transactions.transactionDraft);
    const aTableData = useSelector(state => state.transactions.aTableData);
    const navigate = useNavigate();

    const aTableColumns = [
        { key: 'transaction_date', name: '交易日期', selector: row => row.transaction_date },
        { key: 'stock_code', name: '股票代號', selector: row => row.stock_code },
        { key: 'product_name', name: '商品名稱', selector: row => row.product_name },
        { key: 'unit_price', name: '成交單價', selector: row => row.unit_price },
        { key: 'transaction_quantity', name: '成交股數', selector: row => row.transaction_quantity },
        { key: 'transaction_value', name: '成交價金', selector: row => row.transaction_value },
        { key: 'estimated_fee', name: '手續費', selector: row => row.estimated_fee },
        { key: 'estimated_tax', name: '交易稅', selector: row => row.estimated_tax },
        { key: 'net_amount', name: '淨收付金額', selector: row => row.net_amount },
    ];

    const [validPreviewData, setValidPreviewData] = useState([]);
    // 新增：預覽 sellHistory 的資料
    const [sellHistoryPreview, setSellHistoryPreview] = useState(null);

    useEffect(() => {
        if (Array.isArray(previewData) && previewData.length > 0) {
            setValidPreviewData(previewData);
        }
    }, [previewData]);

    // 新增：當 A 表/草稿有變化時呼叫後端預覽 sellHistory
    useEffect(() => {
        const sellRecord = Array.isArray(aTableData) && aTableData.length > 0 ? aTableData[0] : null;
        const edited = Array.isArray(transactionDraft) ? transactionDraft.filter(r => r.writeOffQuantity > 0) : [];

        if (!sellRecord || edited.length === 0) {
            setSellHistoryPreview(null);
            return;
        }

        (async () => {
            try {
                const resp = await fetch('/sellHistory/preview-sell-history', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sellRecord,
                        inventory: edited,
                        transactionDate: sellRecord.transaction_date
                    })
                });
                if (resp.ok) {
                    const data = await resp.json();
                    setSellHistoryPreview(data);
                } else {
                    setSellHistoryPreview(null);
                }
            } catch (e) {
                setSellHistoryPreview(null);
            }
        })();
    }, [aTableData, transactionDraft]);

    const previewColumns = [
        { key: 'uuid', name: 'UUID', selector: row => row.uuid, sortable: true },
        { key: 'remaining_quantity', name: '攤提後剩餘股數', selector: row => row.remaining_quantity },
        { key: 'amortized_cost', name: '攤提成本', selector: row => row.amortized_cost },
        { key: 'amortized_income', name: '攤提收入', selector: row => row.amortized_income },
        { key: 'profit_loss', name: '損益試算', selector: row => row.profit_loss },
    ];

    const editedColumns = [
        { key: 'uuid', name: 'UUID', selector: row => row.uuid },
        { key: 'transaction_date', name: '交易日期', selector: row => row.transaction_date },
        { key: 'stock_code', name: '股票代號', selector: row => row.stock_code },
        { key: 'product_name', name: '品名', selector: row => row.product_name },
        { key: 'unit_price', name: '單價', selector: row => row.unit_price },
        { key: 'transaction_quantity', name: '成交股數', selector: row => row.transaction_quantity },
        { key: 'transaction_value', name: '成交金額', selector: row => row.transaction_value },
        { key: 'estimated_fee', name: '手續費', selector: row => row.estimated_fee },
        { key: 'estimated_tax', name: '交易稅', selector: row => row.estimated_tax },
        { key: 'net_amount', name: '淨收付金額', selector: row => row.net_amount },
        { key: 'remarks', name: '備註', selector: row => row.remarks },
        { key: 'writeOffQuantity', name: '沖銷股數', selector: row => row.writeOffQuantity },
    ];

    // sellHistory 預覽欄位（A 匯總，對齊後端）
    const sellHistoryPreviewColumns = [
        { key: 'data_uuid', name: '預覽UUID', selector: row => row.data_uuid },
        { key: 'transaction_date', name: '交易日期', selector: row => row.transaction_date },
        { key: 'stock_code', name: '股票代號', selector: row => row.stock_code },
        { key: 'product_name', name: '品名', selector: row => row.product_name },
        { key: 'unit_price', name: '單價', selector: row => row.unit_price },
        { key: 'quantity', name: '成交股數', selector: row => row.quantity },
        { key: 'transaction_value', name: '成交價金', selector: row => row.transaction_value },
        { key: 'fee', name: '手續費', selector: row => row.fee },
        { key: 'tax', name: '交易稅', selector: row => row.tax },
        { key: 'net_amount', name: '淨收付金額', selector: row => row.net_amount },
        { key: 'remaining_quantity', name: '沖銷後餘額', selector: row => row.remaining_quantity },
        { key: 'profit_loss', name: '損益', selector: row => row.profit_loss },
        { key: 'transaction_history_uuids', name: '歷史UUIDs', selector: row => row.transaction_history_uuids },
    ];

    // 新增：B 明細欄位（與 preview-offset 一致）
    const sellHistoryBPreviewColumns = [
        { key: 'uuid', name: '來源UUID', selector: r => r.uuid },
        { key: 'remaining_quantity', name: '攤提後剩餘股數', selector: r => r.remaining_quantity },
        { key: 'amortized_cost', name: '攤提成本', selector: r => r.amortized_cost },
        { key: 'amortized_income', name: '攤提收入', selector: r => r.amortized_income },
        { key: 'profit_loss', name: '損益', selector: r => r.profit_loss },
    ];

    return (
        <div className="page-container">

            <h3 style={{ marginTop: 40 }}>Table A 原始交易</h3>
            <MainTable
                id="atable-section"
                data={aTableData}
                columns={aTableColumns}
                localePrefix="transaction"
                settings={{}}
            />

            <h3>攤提預覽結果</h3>
            <MainTable
                id="preview-table"
                data={validPreviewData}
                columns={previewColumns}
                localePrefix="transaction"
                settings={{}}
            />

            {/* SellHistory 預覽（A + B） */}
            {sellHistoryPreview && (
                <>
                    <h3 style={{ marginTop: 40 }}>SellHistory 預覽（A 匯總，不落庫）</h3>
                    <MainTable
                        id="sellhistory-preview-a"
                        data={[sellHistoryPreview]}
                        columns={sellHistoryPreviewColumns}
                        localePrefix="transaction"
                        settings={{}}
                    />

                    <h4 style={{ marginTop: 16 }}>SellHistory 預覽（B 明細）</h4>
                    <MainTable
                        id="sellhistory-preview-b"
                        data={sellHistoryPreview.b_items || []}
                        columns={sellHistoryBPreviewColumns}
                        localePrefix="transaction"
                        settings={{}}
                    />

                    {sellHistoryPreview.b_totals && (
                        <div style={{ marginTop: 8 }}>
                            總攤提成本：{sellHistoryPreview.b_totals.total_amortized_cost}，
                            總攤提收入：{sellHistoryPreview.b_totals.total_amortized_income}，
                            總損益：{sellHistoryPreview.b_totals.total_profit_loss}，
                            筆數：{sellHistoryPreview.b_totals.count}
                        </div>
                    )}
                </>
            )}

            <h3 style={{ marginTop: 40 }}>您有編輯過的交易紀錄</h3>
            <MainTable
                id="edited-table"
                data={transactionDraft.filter(row => row.writeOffQuantity > 0)}
                columns={editedColumns}
                localePrefix="transaction"
                settings={{}}
            />

            <div style={{ marginTop: 20 }}>
                <button onClick={() => navigate(-1)}>返回編輯</button>
            </div>
        </div>
    );
};


export default SellPreviewPage;
