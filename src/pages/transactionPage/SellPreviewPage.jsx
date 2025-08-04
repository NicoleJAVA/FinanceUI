import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MainTable } from '../../component/MainTable/MainTable';

const SellPreviewPage = () => {
    const previewData = useSelector(state => state.transactions.previewResult);
    const transactionDraft = useSelector(state => state.transactions.transactionDraft);
    const aTableData = useSelector(state => state.transactions.aTableData);
    const navigate = useNavigate();

    const [validPreviewData, setValidPreviewData] = useState([]);

    useEffect(() => {
        if (Array.isArray(previewData) && previewData.length > 0) {
            setValidPreviewData(previewData);
        }
    }, [previewData]);

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
