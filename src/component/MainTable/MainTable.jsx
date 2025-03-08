import React, { useState, useEffect } from "react";
import { usePagination } from "./usePagination";
import { TableFooter } from "./TableFooter";
import { handleInputChange } from "./ComputeTable";
import "./MainTable.scss";
import "./ComputeTable.scss";
import { useTranslation } from 'react-i18next';
import TableInputCell from "./TableInputCell";
import { ExpandableRow } from "./ExpandableRow";
import { generateColumns } from "../../helpers/TableHelper";

export const MainTable = ({ id, columns = [], data, localePrefix, settings,
    expandUI: ExpandUI, onInputChange, highlightedCells }) => {
    const [sort, setSort] = useState({ key: settings?.paging?.sortKey, order: "asc" });
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
    const [selectedDeleteRow, setSelectedDeleteRow] = useState(null);
    const [expandedRows, setExpandedRows] = useState([]);
    const { t } = useTranslation();

    console.log('TABLE DATA', data);

    const handleUpdate = (uuid, columnKey, value) => {
        onInputChange(uuid, columnKey, value);
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
    } = usePagination(data, settings?.paging?.itemsPerPageOptions, settings?.paging?.initialItemsPerPage, settings?.paging?.initialPage, sort);

    console.log('pagi', paginatedData);

    const sortBy = (key) => {
        setSort((prev) => ({
            key,
            order: prev.key === key && prev.order === "asc" ? "desc" : "asc",
        }));
    };

    const getTdClass = (row, column) => {
        return `main-table-td ${row[`${column.key}_updated`] ? 'updated' : ''} ${highlightedCells[`${row.uuid}-${column.key}`] || ''}`;
        // return 'main-table-td' + (row[`${column.key}_updated`] ? ' updated' : '');
    };

    const renderRows = () => {
        return paginatedData.map((row) => (
            <React.Fragment key={row.uuid}>
                <tr onClick={() => toggleRow(row.uuid)} data-uuid={row.uuid}>
                    {columns.map((column) => (
                        <td key={`${column.key}-${row.uuid}`} className={getTdClass(row, column)} data-column={column.key}>
                            {column.key === settings?.expandColumnName ? (
                                <button>Expand</button>
                            ) : column.isInput ? (
                                <input
                                    type={column.inputType === 'string' ? 'text' : 'number'}
                                    min={column.inputType === 'positive-int' ? '1' : undefined}
                                    step={column.inputType === 'positive-int' || column.inputType === 'integer' ? '1' : 'any'}
                                    pattern={
                                        column.inputType === 'positive-int' ? "^[1-9]\\d*$" :
                                            column.inputType === 'integer' ? "^-?\\d+$" :
                                                column.inputType === 'float' ? "^-?\\d*(\\.\\d*)?$" : undefined
                                    }
                                    title={
                                        column.inputType === 'positive-int' ? "請輸入正整數" :
                                            column.inputType === 'integer' ? "請輸入整數 (含正、負、0)" :
                                                column.inputType === 'float' ? "請輸入數字 (可含負號、小數)" : undefined
                                    }
                                    value={row[column.key] || ""}
                                    onChange={(e) => {
                                        const inputEl = e.target;
                                        if (!inputEl.checkValidity()) {
                                            inputEl.reportValidity();
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
            <table className="summary-table" id={id}>
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

