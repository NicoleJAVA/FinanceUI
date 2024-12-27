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

export const MainTable = ({ columns = [], data, localePrefix, settings, expandUI: ExpandUI }) => {
    const [sort, setSort] = useState({ key: settings?.paging?.sortKey, order: "asc" });
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
    const [selectedDeleteRow, setSelectedDeleteRow] = useState(null);
    const [expandedRows, setExpandedRows] = useState([]);
    const [updatedData, setUpdatedData] = useState(data); // 用來儲存更新過的資料
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

                        <td key={column.key} className={getTdClass(row, column)} data-column={column.key}>
                            {column.key === settings?.expandColumnName ? (
                                // 當 column 名稱等於 expandColumnName 時，渲染按鈕
                                <button >Expand</button>
                            ) : column.isInput ? (
                                // 當 isInput 為 true 時，渲染 TableInputCell
                                <TableInputCell
                                    columns={columns}
                                    row={row}
                                    column={column}
                                    updatedData={updatedData}
                                    setUpdatedData={setUpdatedData}
                                    uuid={row.uuid}
                                    columnKey={column.key}
                                    value={row[column.key]}
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

