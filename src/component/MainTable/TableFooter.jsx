import React from 'react';
import './TableFooter.scss';

export const TableFooter = ({
    currentPage,
    totalPages,
    itemsPerPage,
    itemsPerPageOptions,
    rangeText,
    displayedPages,
    changePage,
    goToPage,
    resetToFirstPage,
}) => {
    return (
        <div className='theme-text'>
            <div className="table-tfoot-td">
                <div className="table-tfoot-container">
                    <div className="tfoot-left-container">
                        <span className="prev-link" onClick={() => changePage(currentPage - 1)}>
                            <span className="page-arrow">|</span>
                            Page
                        </span>
                        <input
                            className="page-input"
                            type="number"
                            value={currentPage}
                            onChange={(e) => goToPage(Number(e.target.value))}
                        />
                        <span className="next-link" onClick={() => changePage(currentPage + 1)}>
                            of {totalPages}
                            <span className="page-arrow">&gt;&gt;|</span>
                        </span>
                        <span>每頁筆數：</span>
                        <div className="items-per-page-container">
                            <select
                                id="items-per-page-select"
                                value={itemsPerPage}
                                className="form-select items-per-page-select"
                                onChange={(e) => resetToFirstPage(Number(e.target.value))}
                            >
                                {itemsPerPageOptions.map((option) => (
                                    <option className='items-per-page-option' key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="tfoot-right-container">{rangeText}</div>
                </div>
            </div>
            {/* 
            <div colSpan="10" className="page-number-group">

                <div>
                    {displayedPages.map((page) => (
                        <span
                            key={page}
                            className={page === '...' ? 'page-trailing' : 'page-number'}
                            onClick={() => goToPage(page)}
                        >
                            {page}
                        </span>
                    ))}
                </div>
            </div> */}
        </div>
    );
};
