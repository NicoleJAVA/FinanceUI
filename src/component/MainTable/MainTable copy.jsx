// import React, { useState, useEffect } from 'react';
// import { usePagination } from './usePagination';

// export const MainTable = ({ columns, data, localePrefix, settings, onDeleteRow }) => {
//     const [sort, setSort] = useState({ key: settings?.paging?.sortKey, order: 'asc' });
//     const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
//     const [selectedDeleteRow, setSelectedDeleteRow] = useState(null);
//     const [expandedRows, setExpandedRows] = useState([]);

//     const toggleRow = (uuid) => {
//         setExpandedRows((prev) => {
//             const updated = prev.includes(uuid)
//                 ? prev.filter((id) => id !== uuid)
//                 : [...prev, uuid];
//             console.log('Updated expandedRows:', updated);
//             return updated;
//         });
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
//     } = usePagination(data, settings?.paging?.itemsPerPageOptions, settings?.paging?.initialItemsPerPage, settings?.paging?.initialPage, sort);

//     const sortBy = (key) => {
//         if (sort.key === key) {
//             setSort(prev => ({ ...prev, order: prev.order === 'asc' ? 'desc' : 'asc' }));
//         } else {
//             setSort({ key, order: 'asc' });
//         }
//     };

//     const getClass = (column) => {
//         const classes = [];
//         const align = column.align || settings?.custom?.align || 'center';
//         classes.push(getAlignClass(align));

//         if (column.fixedWidth) {
//             classes.push('fixed-width-cell');
//         }

//         if (column.isStatus) {
//             classes.push('status-cell');
//         }

//         return classes;
//     };

//     const getAlignClass = (align) => {
//         switch (align) {
//             case 'center':
//                 return 'align-center-cell';
//             case 'left':
//                 return 'align-left-cell';
//             case 'right':
//                 return 'align-left-right';
//             case 'top':
//                 return 'vertical-align-top-cell';
//             case 'bottom':
//                 return 'vertical-align-bottom-cell';
//             default:
//                 return '';
//         }
//     };

//     const getCellStyle = (column) => {
//         return column?.fixedWidth ? { '--fixed-width': `${column.fixedWidth}px` } : {};
//     };

//     const getThClass = (column) => {
//         const classes = [];
//         if (column.isStatus) classes.push('status-th');
//         const verticalAlignTh = settings?.custom?.verticalAlignTh;
//         if (verticalAlignTh) classes.push(getAlignClass(verticalAlignTh));
//         if (column.fixedWidth) classes.push('fixed-width-cell');
//         return classes;
//     };

//     const openDeleteModal = (row) => {
//         setSelectedDeleteRow(row);
//         setIsShowDeleteModal(true);
//     };

//     const onConfirmDeleteRow = () => {
//         onDeleteRow(selectedDeleteRow);
//         setIsShowDeleteModal(false);
//     };

//     return (
//         <>
//             <table className="table summary-table" style={settings.tableStyle}>
//                 <thead>
//                     <tr>
//                         {columns.map((column) => (
//                             <th
//                                 key={column.key}
//                                 className={`main-table-th ${getThClass(column).join(' ')}`}
//                                 onClick={() => sortBy(column.key)}
//                                 style={getCellStyle(column)}
//                             >
//                                 <div className={`th-box ${getClass(column).join(' ')}`}>
//                                     {localePrefix && `${localePrefix}.${column.key}`}
//                                     <div
//                                         style={{ opacity: sort.key === column.key ? 1 : 0 }}
//                                         className="sort-arrow"
//                                     >
//                                         {sort.order === 'asc' ? '▴' : '▾'}
//                                     </div>
//                                 </div>
//                             </th>
//                         ))}
//                     </tr>
//                 </thead>

//                 <tbody>
//                     {paginatedData && paginatedData.length > 0 ? (
//                         paginatedData.map((row) => (
//                             <React.Fragment key={row.uuid}>
//                                 <tr className="table-body-tr" onClick={() => toggleRow(row.uuid)}>
//                                     {columns.map((column) => (
//                                         <td key={column.key} className="main-table-td" style={getCellStyle(column)}>
//                                             <div className={getClass(column).join(' ')}>
//                                                 {column.isStatus ? (
//                                                     <div className="status-cell">
//                                                         <span>{row[column.key]}</span>
//                                                     </div>
//                                                 ) : column.isDelete ? (
//                                                     <div className="delete-cell" onClick={() => openDeleteModal(row)}>
//                                                         <div className="table-delete-bg"></div>
//                                                         <img
//                                                             className="table-delete-icon"
//                                                             src="/assets/img/delete-icon.svg"
//                                                             alt="delete-icon"
//                                                         />
//                                                     </div>
//                                                 ) : (
//                                                     <div>{row[column.key]}</div>
//                                                 )}
//                                             </div>
//                                         </td>
//                                     ))}
//                                 </tr>
//                                 {expandedRows.includes(row.uuid) && row.detail && (
//                                     <tr className="detail-row">
//                                         <td colSpan={columns.length}>
//                                             <div className="detail-content">{row.detail}</div>
//                                         </td>
//                                     </tr>
//                                 )}
//                             </React.Fragment>
//                         ))
//                     ) : (
//                         <tr>
//                             <td colSpan="10">No data available</td>
//                         </tr>
//                     )}
//                 </tbody>

//                 {settings?.paging?.showFooter && (
//                     <tfoot className="table-tfoot">
//                         <tr>
//                             <td colSpan="10" className="table-tfoot-td">
//                                 <div className="table-tfoot-container">
//                                     <div className="tfoot-left-container">
//                                         <span
//                                             className="prev-link"
//                                             onClick={() => changePage(currentPage - 1)}
//                                         >
//                                             <span className="page-arrow">|</span>
//                                             Page
//                                         </span>
//                                         <input
//                                             className="form-control page-input"
//                                             type="number"
//                                             value={currentPage}
//                                             onChange={(e) => goToPage(Number(e.target.value))}
//                                         />
//                                         <span
//                                             className="next-link"
//                                             onClick={() => changePage(currentPage + 1)}
//                                         >
//                                             of {totalPages}
//                                             <span className="page-arrow">&gt; &gt;|</span>
//                                         </span>
//                                         <div className="items-per-page-container">
//                                             <select
//                                                 id="items-per-page-select"
//                                                 value={itemsPerPage}
//                                                 className="form-select items-per-page-select"
//                                                 onChange={(e) => resetToFirstPage(Number(e.target.value))}
//                                             >
//                                                 {itemsPerPageOptions.map((option) => (
//                                                     <option key={option} value={option}>
//                                                         {option}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         </div>
//                                     </div>
//                                     <div className="tfoot-right-container">{rangeText}</div>
//                                 </div>
//                             </td>
//                         </tr>
//                     </tfoot>
//                 )}
//             </table>

//             {settings?.paging?.showPageRange && (
//                 <div className="page-number-group">
//                     <div className="total-range">
//                         {sortedData.length} records in {totalPages} pages
//                     </div>
//                     <div>
//                         {displayedPages.map((page) => (
//                             <span
//                                 key={page}
//                                 className={page === '...' ? 'page-trailing' : 'page-number'}
//                                 onClick={() => goToPage(page)}
//                             >
//                                 {page}
//                             </span>
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }