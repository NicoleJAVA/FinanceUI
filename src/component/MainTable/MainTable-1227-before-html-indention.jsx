// import React, { useState, useEffect } from "react";
// import { usePagination } from "./usePagination";
// import { TableFooter } from "./TableFooter";
// import { handleInputChange } from "./ComputeTable"; // 引入 tableLogic
// import "./MainTable.scss";
// import "./ComputeTable.scss";
// import { useTranslation } from 'react-i18next';

// export const MainTable = ({ columns, data, localePrefix, settings, onDeleteRow }) => {
//     const [sort, setSort] = useState({ key: settings?.paging?.sortKey, order: "asc" });
//     const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
//     const [selectedDeleteRow, setSelectedDeleteRow] = useState(null);
//     const [expandedRows, setExpandedRows] = useState([]);
//     const [updatedData, setUpdatedData] = useState(data); // 用來儲存更新過的資料
//     const { t } = useTranslation();

//     const toggleRow = (uuid) => {
//         setExpandedRows((prev) => prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid]);
//     };

//     const {
//         sortedData,
//         currentPage,
//         itemsPerPage,
//         totalPages,
//         paginatedData,
//         rangeText,
//         displayedPages,
//         changePage,
//         resetToFirstPage,
//         itemsPerPageOptions,
//         goToPage,
//     } = usePagination(updatedData, settings?.paging?.itemsPerPageOptions, settings?.paging?.initialItemsPerPage, settings?.paging?.initialPage, sort);

//     const sortBy = (key) => {
//         setSort((prev) => ({
//             key,
//             order: prev.key === key && prev.order === "asc" ? "desc" : "asc",
//         }));
//     };

//     const getTdClass = (row, column) => {
//         return 'main-table-td' + (row[`${column.key}_updated`] ? ' updated' : '');
//     }

//     return (
//         <>
//             <table className="summary-table" style={settings.tableStyle}>
//                 <thead>
//                     <tr>
//                         {columns.map((column) => (
//                             <th
//                                 key={column.key}
//                                 className="main-table-th"
//                                 onClick={() => sortBy(column.key)}
//                             >   {t(`${localePrefix}.${column.key}`)}
//                                 <div>{sort.key === column.key ? (sort.order === "asc" ? "▴" : "▾") : null}</div>
//                             </th>
//                         ))}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {paginatedData && paginatedData.length > 0 ? (
//                         paginatedData.map((row) => (
//                             <React.Fragment key={row.uuid}>
//                                 <tr onClick={() => toggleRow(row.uuid)} data-uuid={row.uuid}>
//                                     {columns.map((column) => (
//                                         <td key={column.key} className={getTdClass(row, column)} data-column={column.key}>
//                                             {column.isInput ? (
//                                                 <input
//                                                     type="text"
//                                                     value={row[column.key] || ""}
//                                                     onChange={(e) => handleInputChange(columns, updatedData, setUpdatedData, row.uuid, column.key, e.target.value)}
//                                                 />
//                                             ) : (
//                                                 row[column.key]
//                                             )}
//                                         </td>
//                                     ))}
//                                 </tr>
//                                 {expandedRows.includes(row.uuid) && row.detail && (
//                                     <tr>
//                                         <td colSpan={columns.length}>
//                                             <div>{row.detail}</div>
//                                         </td>
//                                     </tr>
//                                 )}
//                             </React.Fragment>
//                         ))
//                     ) : (
//                         <tr>
//                             <td colSpan={columns.length}>No data available</td>
//                         </tr>
//                     )}
//                 </tbody>
//                 {settings?.paging?.showFooter && (
//                     <TableFooter
//                         currentPage={currentPage}
//                         totalPages={totalPages}
//                         itemsPerPage={itemsPerPage}
//                         itemsPerPageOptions={itemsPerPageOptions}
//                         rangeText={rangeText}
//                         displayedPages={displayedPages}
//                         changePage={changePage}
//                         goToPage={goToPage}
//                         resetToFirstPage={resetToFirstPage}
//                     />
//                 )}
//             </table>
//         </>
//     );
// };

