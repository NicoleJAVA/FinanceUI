import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MainTable } from '../../component/MainTable/MainTable';

const SellPreviewPage = () => {
    const previewData = useSelector(state => state.transactions.previewResult); // 保留，不使用
    const transactionDraft = useSelector(state => state.transactions.transactionDraft);
    const aTableData = useSelector(state => state.transactions.aTableData);
    const navigate = useNavigate();

    // A 表欄位（照你原本）
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

    // B after 欄位（和編輯畫面一致的關鍵欄位）
    const bAfterColumns = [
        { key: 'uuid', name: 'UUID', selector: r => r.uuid, sortable: true },
        { key: 'remaining_quantity', name: '剩餘股數', selector: r => r.remaining_quantity },
        { key: 'amortized_cost', name: '攤提成本', selector: r => r.amortized_cost },
        { key: 'amortized_income', name: '攤提收入', selector: r => r.amortized_income },
        { key: 'profit_loss', name: '損益試算', selector: r => r.profit_loss },
        // 預留：若 slice 有提供第二欄位就直接顯示，沒有就用 fallback 算（amortized_cost + amortized_income）
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

    // B after：一律用前端 chainingCalc 的最新結果（和編輯畫面一致）
    const bAfterRows = useMemo(() => {
        const rows = Array.isArray(transactionDraft)
            ? transactionDraft
                .filter(r => (r.writeOffQuantity || 0) > 0)
                .map(r => {
                    // 「損益試算之二」如果 slice 已有欄位（例如 profit_loss_2），就用它；
                    // 若沒有，就以你畫面上的數字規則 fallback：常見是 cost + income（依你上面截圖 899+4=903）
                    const pl2 = r.profit_loss_2 != null
                        ? r.profit_loss_2
                        : ((r.amortized_cost || 0) + (r.amortized_income || 0));
                    return {
                        uuid: r.uuid,
                        remaining_quantity: r.remaining_quantity,
                        amortized_cost: r.amortized_cost,
                        amortized_income: r.amortized_income,
                        profit_loss: r.profit_loss,
                        profit_loss_2: pl2,
                        // 其餘你不想在預覽顯示的欄位不帶，避免版面冗長
                    };
                })
            : [];
        return rows;
    }, [transactionDraft]);

    // B before：用編輯區的原始列快照（和編輯畫面看到的一致）
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

    // A 的預覽列：顯示與編輯畫面相同，且「損益試算」= B after 的「損益試算之二」加總
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
            quantity: sellRecord.transaction_quantity,      // 這個欄位名是給下方 A 預覽 table 用
            transaction_value: sellRecord.transaction_value,
            fee: sellRecord.estimated_fee,
            tax: sellRecord.estimated_tax,
            net_amount: sellRecord.net_amount,
            remaining_quantity: sellRecord.remaining_quantity,
            // 重點：A 的損益 = B after「損益試算之二」加總
            profit_loss: pl2Sum,
            transaction_history_uuids: "", // 預覽不落庫
        };
    }, [aTableData, bAfterRows]);

    return (
        <div className="page-container">

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

            {/* 額外一列：SellHistory A 的預覽（不落庫），和你中段想看的 A 匯總列 */}
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

            {/* 下：B before（沖前快照；讓預覽幾乎等同編輯畫面） */}
            <h3 style={{ marginTop: 40 }}>B 沖前快照（before）</h3>
            <MainTable
                id="sellhistory-preview-b-before"
                data={bBeforeRows}
                columns={bBeforeColumns}
                localePrefix="transaction"
                settings={{}}
            />

            {/* 編輯過的原始列（你原本就有的區塊，保留） */}
            <h3 style={{ marginTop: 40 }}>您有編輯過的交易紀錄</h3>
            <MainTable
                id="edited-table"
                data={Array.isArray(transactionDraft) ? transactionDraft.filter(row => row.writeOffQuantity > 0) : []}
                columns={[
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
                ]}
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
