import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MainTable } from '../../component/MainTable/MainTable';

const SellPreviewPage = () => {
    const previewData = useSelector(state => state.transactions.previewResult); // 保留，不使用
    const transactionDraft = useSelector(state => state.transactions.transactionDraft);
    const aTableData = useSelector(state => state.transactions.aTableData);
    const navigate = useNavigate();

    // 送出與成功動畫狀態
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [success, setSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    // A 表欄位（沿用你原本）
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

    // B after 欄位（與編輯畫面一致的關鍵欄位）
    const bAfterColumns = [
        { key: 'uuid', name: 'UUID', selector: r => r.uuid, sortable: true },
        { key: 'remaining_quantity', name: '剩餘股數', selector: r => r.remaining_quantity },
        { key: 'amortized_cost', name: '攤提成本', selector: r => r.amortized_cost },
        { key: 'amortized_income', name: '攤提收入', selector: r => r.amortized_income },
        { key: 'profit_loss', name: '損益試算', selector: r => r.profit_loss },
        { key: 'profit_loss_2', name: '損益試算之二', selector: r => r.profit_loss_2 },
    ];

    // B before 欄位（沖前快照）
    const bBeforeColumns = [
        { key: 'uuid', name: 'UUID', selector: r => r.uuid },
        { key: 'transaction_quantity_before', name: '沖前股數', selector: r => r.transaction_quantity_before },
        { key: 'unit_price', name: '來源單價', selector: r => r.unit_price },
        { key: 'net_amount', name: '來源淨額', selector: r => r.net_amount },
        { key: 'writeOffQuantity', name: '本次沖銷股數', selector: r => r.writeOffQuantity },
    ];

    // B after：用前端 chainingCalc 的最新結果（= 編輯畫面）
    const bAfterRows = useMemo(() => {
        const rows = Array.isArray(transactionDraft)
            ? transactionDraft
                .filter(r => (r.writeOffQuantity || 0) > 0)
                .map(r => {
                    const pl2 = r.profit_loss_2 != null
                        ? r.profit_loss_2
                        : ((r.amortized_cost || 0) + (r.amortized_income || 0)); // fallback
                    return {
                        uuid: r.uuid,
                        remaining_quantity: r.remaining_quantity,
                        amortized_cost: r.amortized_cost,
                        amortized_income: r.amortized_income,
                        profit_loss: r.profit_loss,
                        profit_loss_2: pl2,
                    };
                })
            : [];
        return rows;
    }, [transactionDraft]);

    // B before：編輯區原始列快照
    const bBeforeRows = useMemo(() => {
        const rows = Array.isArray(transactionDraft)
            ? transactionDraft
                .filter(r => (r.writeOffQuantity || 0) > 0)
                .map(r => ({
                    uuid: r.uuid,
                    transaction_quantity_before: r.transaction_quantity,
                    unit_price: r.unit_price,
                    net_amount: r.net_amount,
                    writeOffQuantity: r.writeOffQuantity,
                }))
            : [];
        return rows;
    }, [transactionDraft]);

    // A 預覽列：A 的損益 = B after「損益試算之二」加總
    const aPreviewRow = useMemo(() => {
        const sellRecord = Array.isArray(aTableData) && aTableData.length > 0 ? aTableData[0] : null;
        if (!sellRecord || bAfterRows.length === 0) return null;

        const pl2Sum = bAfterRows.reduce((acc, r) => acc + (r.profit_loss_2 || 0), 0);

        return {
            data_uuid: sellRecord.data_uuid,
            transaction_date: sellRecord.transaction_date,
            stock_code: sellRecord.stock_code,
            product_name: sellRecord.product_name,
            unit_price: sellRecord.unit_price,
            quantity: sellRecord.transaction_quantity,
            transaction_value: sellRecord.transaction_value,
            fee: sellRecord.estimated_fee,
            tax: sellRecord.estimated_tax,
            net_amount: sellRecord.net_amount,
            remaining_quantity: sellRecord.remaining_quantity,
            profit_loss: pl2Sum,
            transaction_history_uuids: "",
        };
    }, [aTableData, bAfterRows]);

    // 送出：呼叫現有 batch write-off API，不動你的後端架構
    const handleSubmitOffset = async () => {
        const sellRecord = Array.isArray(aTableData) && aTableData.length > 0 ? aTableData[0] : null;
        const edited = Array.isArray(transactionDraft)
            ? transactionDraft.filter(r => (r.writeOffQuantity || 0) > 0)
            : [];

        if (!sellRecord || edited.length === 0) {
            window.alert('資料不足：請確認 A 表與 B 表（有輸入沖銷股數）。');
            return;
        }

        if (!window.confirm('確定要送出本次沖銷嗎？')) return;


        // 先算出 pl2 總和（A 的損益 = B after 的「損益試算之二」加總）
        const pl2Sum = bAfterRows.reduce((acc, r) => acc + (r.profit_loss_2 || 0), 0);

        // 可選：加總幾個常用合計，方便歷史頁顯示
        const bTotals = {
            total_amortized_cost: bAfterRows.reduce((a, r) => a + (r.amortized_cost || 0), 0),
            total_amortized_income: bAfterRows.reduce((a, r) => a + (r.amortized_income || 0), 0),
            total_profit_loss: bAfterRows.reduce((a, r) => a + (r.profit_loss || 0), 0),
            total_profit_loss_2: pl2Sum,
        };

        const payload = {
            aTable: {
                ...sellRecord,
                // A 的損益用前端與 Excel 一致的算法
                profit_loss: pl2Sum,

                // 把 B after / B before / totals 裝進去（後端 log_sell_history 會寫到 snapshot_json）
                b_after: bAfterRows,
                b_before: bBeforeRows,
                b_totals: bTotals,
            },
            inventory: edited.map(r => ({
                uuid: r.uuid,
                writeOffQuantity: r.writeOffQuantity,
            })),
        };

        try {
            setSubmitting(true);
            setSubmitError('');
            setSuccess(false);
            const res = await fetch('/transactions/offset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const t = await res.text();
                throw new Error(t || `HTTP ${res.status}`);
            }
            // 成功：顯示打勾動畫與提示
            setSuccess(true);
            setSuccessMsg('沖銷成功！可以前往交易歷史查看。');
        } catch (err) {
            setSubmitError(String(err?.message || err));
            window.alert(`提交失敗：${String(err?.message || err)}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="page-container">
            {/* ✅ 成功動畫樣式（就地加入，不動其他檔案） */}
            <style>{`
        .checkmark { width: 80px; height: 80px; border-radius: 50%; display: block; stroke-width: 4; stroke: #4caf50; stroke-miterlimit: 10; margin: 10px auto; box-shadow: inset 0 0 0 #4caf50; animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both; }
        .checkmark__circle { stroke-dasharray: 166; stroke-dashoffset: 166; stroke-width: 4; stroke-miterlimit: 10; stroke: #4caf50; fill: none; animation: stroke .6s cubic-bezier(.65,.05,.36,1) forwards; }
        .checkmark__check { transform-origin: 50% 50%; stroke-dasharray: 48; stroke-dashoffset: 48; animation: stroke .3s cubic-bezier(.65,.05,.36,1) .8s forwards; }
        @keyframes stroke { 100% { stroke-dashoffset: 0; } }
        @keyframes scale { 0%,100% { transform: none; } 50% { transform: scale3d(1.1,1.1,1); } }
        @keyframes fill { 100% { box-shadow: inset 0 0 0 80px #4caf50; } }
      `}</style>

            {!success &&
                <div>
                    {/* 上：A 表（原始交易 / 匯總） */}
                    <h3 style={{ marginTop: 40 }}>Table A 原始交易</h3>
                    <MainTable
                        id="atable-section"
                        data={aTableData}
                        columns={aTableColumns}
                        localePrefix="transaction"
                        settings={{}}
                    />

                    {/* 中：B after（攤提後結果；用 chainingCalc） */}
                    <h3>攤提預覽結果（B after）</h3>
                    <MainTable
                        id="preview-table"
                        data={bAfterRows}
                        columns={bAfterColumns}
                        localePrefix="transaction"
                        settings={{}}
                    />

                    {/* 額外一列：SellHistory A 的預覽（不落庫），讓你對照總損益 */}
                    {aPreviewRow && (
                        <>
                            <h3 style={{ marginTop: 40 }}>SellHistory 預覽（A 匯總，不落庫）</h3>
                            <MainTable
                                id="sellhistory-preview-table"
                                data={[aPreviewRow]}
                                columns={[
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
                                    { key: 'profit_loss', name: '損益（=B after 損益試算之二加總）', selector: row => row.profit_loss },
                                    { key: 'transaction_history_uuids', name: '歷史UUIDs', selector: row => row.transaction_history_uuids },
                                ]}
                                localePrefix="transaction"
                                settings={{}}
                            />
                        </>
                    )}

                    {/* 下：B before（沖前快照） */}
                    <h3 style={{ marginTop: 40 }}>B 沖前快照（before）</h3>
                    <MainTable
                        id="sellhistory-preview-b-before"
                        data={bBeforeRows}
                        columns={bBeforeColumns}
                        localePrefix="transaction"
                        settings={{}}
                    />

                    {/* 動作列：返回、正式送出 */}
                    <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
                        <button onClick={() => navigate(-1)}>返回編輯</button>
                        <button
                            onClick={handleSubmitOffset}
                            disabled={submitting}
                            style={{ opacity: submitting ? 0.6 : 1 }}
                        >
                            {submitting ? '送出中…' : '正式送出沖銷'}
                        </button>
                        {submitError && (
                            <span style={{ color: 'red', marginLeft: 8 }}>
                                {submitError}
                            </span>
                        )}
                    </div>

                </div>
            }
            {/* 成功動畫 + 提示 */}
            {success && (
                <div style={{ textAlign: 'center', marginTop: 30 }}>
                    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" aria-hidden="true">
                        <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                        <path className="checkmark__check" fill="none" d="M14 27l7 7 16-16" />
                    </svg>
                    <div style={{ color: '#4caf50', fontSize: 18, marginTop: 12 }}>
                        {successMsg || '沖銷成功！可以前往交易歷史查看。'}
                    </div>
                    {/* <button onClick={() => navigate('/sell-history/')} style={{ marginTop: 16 }}>
                        前往交易歷史
                    </button> */}
                </div>
            )}
        </div>
    );
};

export default SellPreviewPage;
