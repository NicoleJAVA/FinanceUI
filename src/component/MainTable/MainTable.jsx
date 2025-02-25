import React, { useState, useEffect } from "react";
import { usePagination } from "./usePagination";
import { TableFooter } from "./TableFooter";
import { handleInputChange } from "./ComputeTable"; // 引入 tableLogic
import "./MainTable.scss";
import "./ComputeTable.scss";
import { useTranslation } from 'react-i18next';
import TableInputCell from "./TableInputCell";
import { ExpandableRow } from "./ExpandableRow";
import { generateColumns } from "../../helpers/TableHelper";

export const MainTable = ({ columns = [], data, localePrefix, settings, expandUI: ExpandUI, onDataUpdate }) => {
    const [sort, setSort] = useState({ key: settings?.paging?.sortKey, order: "asc" });
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
    const [selectedDeleteRow, setSelectedDeleteRow] = useState(null);
    const [expandedRows, setExpandedRows] = useState([]);
    const [updatedData, setUpdatedData] = useState(data);
    const { t } = useTranslation();

    console.log('TABLE DATA', data);
    // const [columns, setColumns] = useState(cols);


    // useEffect(() => { todo dele
    //     if ((!cols || cols.length === 0) && settings?.autoGenColumns) {
    //         setColumns(generateColumns(data));
    //         console.log('columns', generateColumns(data)); // todo dele
    //     }
    // }, [cols, data, settings]);

    useEffect(() => {
        setUpdatedData(data); // 當 data 改變時更新 updatedData
    }, [data]);

    function generateColumns(data) {
        if (!data || data.length === 0) {
            return [];
        }

        const firstRow = data[0]; // 假設所有物件的欄位結構相同
        console.log('Object.keys(firstRow).map(key => ({ key }))', Object.keys(firstRow).map(key => ({ key }))); // todo dele
        return Object.keys(firstRow).map(key => ({ key }));
    }

    // const handleUpdate = (uuid, columnKey, value) => {
    //     // setUpdatedData((prevData) =>
    //     //     prevData.map((row) =>
    //     //         row.uuid === uuid
    //     //             ? { ...row, [columnKey]: value, [`${columnKey}_updated`]: true }
    //     //             : row
    //     //     )
    //     // );
    //     setUpdatedData((prevData) => {
    //         const newData = prevData.map((row) => {
    //             console.log("columnKey", columnKey); // todo dele

    //             if (row.uuid === uuid) {
    //                 return {
    //                     ...row,
    //                     [columnKey]: value,
    //                     [`${columnKey}_updated`]: true,
    //                 };
    //             } else {
    //                 return row;
    //             }
    //         });

    //         return newData;
    //     });


    // };

    const handleUpdate = (uuid, columnKey, value) => {
        const newData = updatedData.map((row) => {
            if (row.uuid === uuid) {
                return {
                    ...row,
                    [columnKey]: value,
                    [`${columnKey}_updated`]: true,
                };
            }
            return row;
        });

        setUpdatedData(newData);

        // ★回傳給父元件 TransactionPage 更新 state★
        if (onDataUpdate) {
            onDataUpdate(newData);
        }
    };


    const toggleRow = (uuid) => {
        setExpandedRows((prev) => prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid]);
    };

    const {
        sortedData,
        currentPage,
        itemsPerPage,
        totalPages,
        paginatedData,
        rangeText,
        displayedPages,
        changePage,
        resetToFirstPage,
        itemsPerPageOptions,
        goToPage,
    } = usePagination(updatedData, settings?.paging?.itemsPerPageOptions, settings?.paging?.initialItemsPerPage, settings?.paging?.initialPage, sort);

    console.log('pagi', paginatedData)
    const sortBy = (key) => {
        setSort((prev) => ({
            key,
            order: prev.key === key && prev.order === "asc" ? "desc" : "asc",
        }));
    };

    const getTdClass = (row, column) => {
        return 'main-table-td' + (row[`${column.key}_updated`] ? ' updated' : '');
    }


    //   ----------- BEGIN FUNCTION: renderRows( )  -------

    const renderRows = () => {
        return paginatedData.map((row) => (
            <React.Fragment key={row.uuid}>
                <tr onClick={() => toggleRow(row.uuid)} data-uuid={row.uuid}>
                    {columns.map((column) => (

                        <td key={`${column.key}-${row.uuid}`} className={getTdClass(row, column)} data-column={column.key}>
                            {column.key === settings?.expandColumnName ? (
                                // 當s column 名稱等於 expandColumnName 時，渲染按鈕
                                <button >Expand</button>
                            ) : column.isInput ? (
                                <input
                                    type={column.inputType === 'string' ? 'text' : 'number'}
                                    min={column.inputType === 'positive-int' ? '1' : undefined}
                                    step={column.inputType === 'positive-int' || column.inputType === 'integer' ? '1' : 'any'}
                                    pattern={
                                        column.inputType === 'positive-int'
                                            ? "^[1-9]\\d*$"
                                            : column.inputType === 'integer'
                                                ? "^-?\\d+$"
                                                : column.inputType === 'float'
                                                    ? "^-?\\d*(\\.\\d*)?$"
                                                    : undefined
                                    }
                                    title={
                                        column.inputType === 'positive-int'
                                            ? "請輸入正整數"
                                            : column.inputType === 'integer'
                                                ? "請輸入整數 (含正、負、0)"
                                                : column.inputType === 'float'
                                                    ? "請輸入數字 (可含負號、小數)"
                                                    : undefined
                                    }
                                    value={row[column.key] || ""}
                                    onChange={(e) => {
                                        const inputEl = e.target;

                                        if (!inputEl.checkValidity()) {
                                            inputEl.reportValidity(); // 原生提示訊息
                                            return;
                                        }

                                        let formattedValue = inputEl.value;

                                        if (column.inputType === 'positive-int' || column.inputType === 'integer') {
                                            formattedValue = parseInt(inputEl.value, 10);
                                        } else if (column.inputType === 'float') {
                                            formattedValue = parseFloat(inputEl.value);
                                        }

                                        handleUpdate(row.uuid, column.key, formattedValue, column.inputType);
                                    }}
                                    onKeyDown={(e) => {
                                        if (column.inputType === 'positive-int') {
                                            ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault();
                                        } else if (column.inputType === 'integer') {
                                            ["e", "E", "+", "."].includes(e.key) && e.preventDefault();
                                        } else if (column.inputType === 'float') {
                                            ["e", "E", "+"].includes(e.key) && e.preventDefault();
                                        }
                                    }}
                                />

                            ) : (
                                // 否則渲染該欄位的值
                                row[column.key]
                            )}
                        </td>
                    ))}
                </tr>


                {settings?.expandColumnName &&
                    <ExpandableRow isExpanded={expandedRows.includes(row.uuid)}
                        columns={generateColumns(row[settings?.expandColumnName])}
                        colSpan={columns.length}
                        data={row[settings?.expandColumnName]}
                        localePrefix={'common'}>
                        {row.detail ? (
                            <ExpandUI row={row} />
                        ) : (

                            <div>No details available</div>
                        )}
                    </ExpandableRow>}

            </React.Fragment>
        ));
    };

    //   ----------- END FUNCTION: renderRows( )  -------

    //   ----------- BEGIN: return( )  -------

    return (
        <div>
            <table className="summary-table">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key} className="main-table-th">
                                {t(`${localePrefix}.${column.key}`)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {paginatedData && paginatedData.length > 0 ? renderRows() : (
                        <tr>
                            {/* todo stday locales */}
                            <td colSpan={columns.length}>No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {settings?.paging?.showFooter && (
                <TableFooter
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    itemsPerPageOptions={itemsPerPageOptions}
                    rangeText={rangeText}
                    displayedPages={displayedPages}
                    changePage={changePage}
                    goToPage={goToPage}
                    resetToFirstPage={resetToFirstPage}
                />
            )}
        </div>
    );

    //   ----------- END: return( )  -------

};

