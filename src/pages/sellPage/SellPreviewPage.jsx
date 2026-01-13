import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MainTable } from '../../component/MainTable/MainTable';
import previewArrow from '../../img/preview-arrow.svg';

const toInt = (v) => (v === '' || v == null ? 0 : parseInt(v, 10));
const toNum = (v) => (v === '' || v == null ? 0 : Number(v));
const sumBy = (arr, key) => arr.reduce((s, r) => s + toNum(r[key]), 0);

const SellPreviewPage = () => {
    const navigate = useNavigate();

    // 來源資料（依你現有 redux 結構取得）
    const transactionDraft = useSelector((s) => s.transactions.transactionDraft);
    const aTableData = useSelector((s) => s.transactions.aTableData);

    // 讓整個 component 共用同一份 A 表的賣出主檔（只取第一筆）
    const sellRecord = Array.isArray(aTableData) && aTableData.length > 0 ? aTableData[0] : null;

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [success, setSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);

    // ===== A 表欄位（只做預覽表格顯示用）=====
    const aTableColumns = [
        { key: 'transaction_date', name: '交易日期', selector: (row) => row.transaction_date },
        { key: 'stock_code', name: '股票代號', selector: (row) => row.stock_code },
        { key: 'product_name', name: '商品名稱', selector: (row) => row.product_name },
        { key: 'unit_price', name: '成交單價', selector: (row) => row.unit_price },
        { key: 'transaction_quantity', name: '成交股數', selector: (row) => row.transaction_quantity },
        { key: 'transaction_value', name: '成交價金', selector: (row) => row.transaction_value },
        { key: 'estimated_fee', name: '手續費', selector: (row) => row.estimated_fee },
        { key: 'estimated_tax', name: '交易稅', selector: (row) => row.estimated_tax },
        { key: 'net_amount', name: '淨收付金額', selector: (row) => row.net_amount },
    ];

    // ===== B after（預覽用欄位）=====
    const bAfterColumns = [
        { key: 'uuid', name: 'UUID', selector: (r) => r.uuid },
        { key: 'remaining_quantity', name: '剩餘股數', selector: (r) => r.remaining_quantity },
        { key: 'amortized_cost', name: '攤提成本', selector: (r) => r.amortized_cost },
        { key: 'amortized_income', name: '攤提收入', selector: (r) => r.amortized_income },
        { key: 'profit_loss', name: '損益試算', selector: (r) => r.profit_loss },
        { key: 'profit_loss_2', name: '損益試算之二', selector: (r) => r.profit_loss_2 },
    ];

    // ===== B before（預覽用欄位）=====
    const bBeforeColumns = [
        { key: 'uuid', name: 'UUID', selector: (r) => r.uuid },
        { key: 'transaction_quantity_before', name: '沖前股數', selector: (r) => r.transaction_quantity_before },
        { key: 'unit_price_before', name: '來源單價', selector: (r) => r.unit_price_before },
        { key: 'net_amount_before', name: '來源淨額', selector: (r) => r.net_amount_before },
        { key: 'writeOffQuantity', name: '本次沖銷股數', selector: (r) => r.writeOffQuantity },
    ];

    // ===== 由前端草稿組 B after / B before 預覽列 =====
    const bAfterRows = useMemo(() => {
        const rows = Array.isArray(transactionDraft)
            ? transactionDraft
                .filter((r) => toInt(r.writeOffQuantity) > 0)
                .map((r) => ({
                    uuid: r.uuid,
                    remaining_quantity: toInt(r.remaining_quantity),
                    amortized_cost: toNum(r.amortized_cost),
                    amortized_income: toNum(r.amortized_income),
                    profit_loss: toNum(r.profit_loss),
                    profit_loss_2:
                        r.profit_loss_2 != null ? toNum(r.profit_loss_2) : toNum(r.amortized_cost) + toNum(r.amortized_income),
                }))
            : [];
        return rows;
    }, [transactionDraft]);

    const bBeforeRows = useMemo(() => {
        const rows = Array.isArray(transactionDraft)
            ? transactionDraft
                .filter((r) => toInt(r.writeOffQuantity) > 0)
                .map((r) => ({
                    uuid: r.uuid,
                    transaction_quantity_before: toInt(r.available_quantity),
                    unit_price_before: toNum(r.unit_price),
                    net_amount_before: toNum(r.net_amount),
                    writeOffQuantity: toInt(r.writeOffQuantity),
                }))
            : [];
        return rows;
    }, [transactionDraft]);

    // ===== A 預覽匯總（右上角）=====
    const aPreviewRow = useMemo(() => {
        if (!sellRecord || bAfterRows.length === 0) return null;
        const pl2Sum = sumBy(bAfterRows, 'profit_loss_2');
        // 確保 A 的 stock_code 有值；若 A 沒有就吃 B 的第一筆（保底）
        const stockCode =
            sellRecord.stock_code ||
            (Array.isArray(transactionDraft) && transactionDraft.find((r) => toInt(r.writeOffQuantity) > 0)?.stock_code) ||
            (Array.isArray(transactionDraft) && transactionDraft[0]?.stock_code) ||
            '';

        return {
            transaction_date: sellRecord.transaction_date,
            stock_code: stockCode,
            product_name: sellRecord.product_name,
            unit_price: sellRecord.unit_price,
            transaction_quantity: sellRecord.transaction_quantity,
            transaction_value: sellRecord.transaction_value,
            estimated_fee: sellRecord.estimated_fee,
            estimated_tax: sellRecord.estimated_tax,
            net_amount: sellRecord.net_amount,
            profit_loss: pl2Sum,
        };
    }, [sellRecord, bAfterRows, transactionDraft]);

    // ===== 送出 offset（把 B 的 before/after 一併送給後端）=====
    const handleSubmitOffset = async (confirmed = false) => {
        // 需要沖銷的列（含 before/after 欄位）
        const edited = Array.isArray(transactionDraft)
            ? transactionDraft
                .filter((r) => toInt(r.writeOffQuantity) > 0)
                .map((r) => {
                    const pl2 =
                        r.profit_loss_2 != null
                            ? toNum(r.profit_loss_2)
                            : toNum(r.amortized_cost) + toNum(r.amortized_income);
                    return {
                        uuid: r.uuid,
                        writeOffQuantity: toInt(r.writeOffQuantity),

                        // B_before → transaction_history.*_before
                        transaction_quantity_before: toInt(r.transaction_quantity),
                        unit_price_before: toNum(r.unit_price),
                        net_amount_before: toNum(r.net_amount),

                        // B_after → transaction_history.*
                        remaining_quantity: toInt(r.remaining_quantity),
                        amortized_cost: toNum(r.amortized_cost),
                        amortized_income: toNum(r.amortized_income),
                        profit_loss: toNum(r.profit_loss),
                        profit_loss_2: pl2,

                        // 方便後端備查（可有可無）
                        stock_code:
                            (Array.isArray(aTableData) && aTableData[0]?.stock_code) ||
                            r.stock_code ||
                            '',
                    };
                })
            : [];

        if (!sellRecord || edited.length === 0) {
            window.alert('資料不足：請確認 A 表與 B 表（有輸入沖銷股數）。');
            return;
        }

        if (!confirmed) {
            setShowConfirm(true);
            return;
        }
        const totals = {
            total_amortized_cost: sumBy(edited, 'amortized_cost'),
            total_amortized_income: sumBy(edited, 'amortized_income'),
            total_profit_loss: sumBy(edited, 'profit_loss'),
            total_profit_loss_2: sumBy(edited, 'profit_loss_2'),
        };

        // 給 SellHistory 詳細頁用的快照（純顯示，不影響後端計算）
        const bAfterForSnapshot = edited.map(
            ({ uuid, remaining_quantity, amortized_cost, amortized_income, profit_loss, profit_loss_2 }) => ({
                uuid,
                remaining_quantity,
                amortized_cost,
                amortized_income,
                profit_loss,
                profit_loss_2,
            })
        );
        const bBeforeForSnapshot = edited.map(
            ({ uuid, transaction_quantity_before, unit_price_before, net_amount_before, writeOffQuantity }) => ({
                uuid,
                transaction_quantity_before,
                unit_price: unit_price_before,
                net_amount: net_amount_before,
                writeOffQuantity,
            })
        );

        // A 的 stock_code 保底
        const stock_code_safe =
            sellRecord.stock_code ||
            (Array.isArray(transactionDraft) && transactionDraft.find((r) => toInt(r.writeOffQuantity) > 0)?.stock_code) ||
            (Array.isArray(transactionDraft) && transactionDraft[0]?.stock_code) ||
            '';

        const payload = {
            aTable: {
                ...sellRecord,
                stock_code: stock_code_safe,
                profit_loss: totals.total_profit_loss_2, // A 的損益與 B（之二）合計一致
                b_after: bAfterForSnapshot,
                b_before: bBeforeForSnapshot,
                b_totals: totals,
            },
            inventory: edited, // 關鍵：把每列 B 的 before/after 一併送給後端
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
            if (!res.ok) throw new Error(await res.text());

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
            {success ? (
                <div style={{ textAlign: 'center', marginTop: 40 }}>
                    <svg
                        className="checkmark"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 52 52"
                        width="96"
                        height="96"
                        aria-hidden="true"
                    >
                        <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                        <path className="checkmark__check" fill="none" d="M14 27l7 7 16-16" />
                    </svg>
                    <div style={{ color: '#4caf50', fontSize: 18, marginTop: 12 }}>{successMsg}</div>
                    <button onClick={() => navigate('/history/transactions')} style={{ marginTop: 16 }}>
                        前往交易歷史
                    </button>
                </div>
            ) : (
                <>
                    <div className='card-table-wrapper mb-5'>
                        {aPreviewRow && (
                            <>
                                <div className='theme-subtitle mt-24 mb-36'>即將寫入 SellHistory 主檔的預覽（表格 A ，匯總）</div>
                                <div className="card-table-header-divider"></div>
                                <MainTable id="sellhistory-preview-table" data={[aPreviewRow]} columns={[...aTableColumns, { key: 'profit_loss', name: '損益', selector: (r) => r.profit_loss }]} localePrefix="sell" settings={{}} />
                            </>
                        )}
                    </div>

                    {/* @begin: ver. 2 */}
                    {/* <div className='card-table-wrapper mb-5'>
                        <div className='theme-subtitle mt-24 mb-36'>即將寫入 SellHistory 明細檔的預覽（表格 B 的 after）</div>
                        <div className="card-table-header-divider"></div>
                        <MainTable id="preview-table" data={bAfterRows} columns={bAfterColumns} localePrefix="sell_detail" settings={{}} />


                        <div className="preview-arrow-container">
                            <img className="preview-arrow" src={previewArrow} alt="previewArrow" />
                        </div>


                        <div className='theme-subtitle mt-24 mb-36'>表格 B 的沖前快照（表格 B 的 before）</div>
                        <div className="card-table-header-divider"></div>
                        <MainTable id="sellhistory-preview-b-before" data={bBeforeRows} columns={bBeforeColumns} localePrefix="sell_detail" settings={{}} />
                    </div> */}
                    {/* @end: ver. 2 */}

                    {/* @begin: ver. 1 */}
                    <div className='card-table-wrapper mb-5'>
                        <div className='theme-subtitle mt-24 mb-36'>即將寫入 SellDetailHistory 明細檔的沖後結果（表格 B 的 after）</div>
                        <div className="card-table-header-divider"></div>
                        <MainTable id="preview-table" data={bAfterRows} columns={bAfterColumns} localePrefix="sell_detail" settings={{}} />
                    </div>

                    <div className="preview-arrow-container">
                        <img className="preview-arrow" src={previewArrow} alt="previewArrow" />
                    </div>

                    <div className='card-table-wrapper mb-5'>
                        <div className='theme-subtitle mt-24 mb-36'>即將寫入 SellDetailHistory 明細檔的沖前快照（表格 B 的 before）</div>
                        <div className="card-table-header-divider"></div>
                        <MainTable id="sellhistory-preview-b-before" data={bBeforeRows} columns={bBeforeColumns} localePrefix="sell_detail" settings={{}} />
                    </div>

                    {/* @end: ver. 1 */}


                    <div className='d-flex' style={{ marginTop: 20, marginBottom: 60 }}>
                        <button className='btn btn-danger' onClick={() => navigate(-1)} style={{ marginRight: 8 }}>
                            取消
                        </button>
                        <button className='btn btn-primary' onClick={() => handleSubmitOffset()} disabled={submitting}>
                            {submitting ? '送出中…' : '正式送出沖銷'}
                        </button>
                        {submitError && <span style={{ color: 'red', marginLeft: 8 }}>{submitError}</span>}
                    </div>

                    <div className="theme-divider"></div>
                </>
            )}

            {/* Bootstrap Modal：確認送出 */}
            {showConfirm && (
                <>
                    <div className="modal fade show" tabIndex="-1" role="dialog" aria-modal="true" style={{ display: 'block' }}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">送出確認</h5>
                                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowConfirm(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <p>確定要送出本次沖銷嗎？</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowConfirm(false)}>取消</button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => { setShowConfirm(false); handleSubmitOffset(true); }}
                                    >
                                        確定送出
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>

                </>
            )}
        </div>
    );
};



export default SellPreviewPage;
