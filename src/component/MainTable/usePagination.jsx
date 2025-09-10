import { useState, useEffect } from 'react';

export function usePagination(data, itemsPerPageOptions = [20, 30, 40, 50, 60, 70, 100, 150, 200, 300, 500, 600, 1000, 1500, 2000], initialItemsPerPage = 500, initialPage = 1, sort) {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
    const [totalPages, setTotalPages] = useState(1);
    const [sortedData, setSortedData] = useState([]);

    console.log('usePagi', itemsPerPageOptions, initialItemsPerPage, initialPage)
    useEffect(() => {
        if (data && data.length > 0) {
            setTotalPages(Math.ceil(data.length / itemsPerPage));
        } else {
            setTotalPages(1);
        }
    }, [data, itemsPerPage]);

    useEffect(() => {
        if (!data || data.length === 0) {
            console.log('aaa');
            setSortedData([]);
            return;
        }

        const sorted = [...data].sort((a, b) => {
            if (sort.order === 'asc') {
                return a[sort.key] > b[sort.key] ? 1 : -1;
            } else {
                return a[sort.key] < b[sort.key] ? 1 : -1;
            }
        });
        console.log('sorted', sorted);

        setSortedData(sorted);
    }, [data, sort.key, sort.order]);

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const changePage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const resetToFirstPage = (itemsPerPage) => {
        setItemsPerPage(itemsPerPage);
        setCurrentPage(1);
    };

    const rangeText = `Showing ${Math.min(currentPage * itemsPerPage - itemsPerPage + 1, data?.length)} to ${Math.min(
        currentPage * itemsPerPage,
        data?.length
    )} of ${data?.length} entries`;

    const displayedPages = [];
    for (let i = 1; i <= totalPages; i++) {
        displayedPages.push(i);
    }

    const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return {
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
    };
}


// import { useState, useEffect } from 'react';

// export function usePagination(data, itemsPerPageOptions = [5, 10, 20], initialItemsPerPage = 5, initialPage = 1, sort) {
//     const [currentPage, setCurrentPage] = useState(initialPage);
//     const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
//     const [totalPages, setTotalPages] = useState(1);
//     const [sortedData, setSortedData] = useState([]);

//     useEffect(() => {
//         if (data && data.length > 0) {
//             setTotalPages(Math.ceil(data.length / itemsPerPage));
//         } else {
//             setTotalPages(1);
//         }
//     }, [data, itemsPerPage]);

//     useEffect(() => {
//         if (!data || data.length === 0) {
//             setSortedData([]);
//             return;
//         }

//         const sorted = [...data].sort((a, b) => {
//             if (sort.order === 'asc') {
//                 return a[sort.key] > b[sort.key] ? 1 : -1;
//             } else {
//                 return a[sort.key] < b[sort.key] ? 1 : -1;
//             }
//         });

//         setSortedData(sorted);
//     }, [data, sort.key, sort.order]);

//     const goToPage = (page) => {
//         if (page < 1 || page > totalPages) return;
//         setCurrentPage(page);
//     };

//     const changePage = (page) => {
//         if (page < 1 || page > totalPages) return;
//         setCurrentPage(page);
//     };

//     const resetToFirstPage = (itemsPerPage) => {
//         setItemsPerPage(itemsPerPage);
//         setCurrentPage(1);
//     };

//     const rangeText = `Showing ${Math.min(currentPage * itemsPerPage - itemsPerPage + 1, data.length)} to ${Math.min(
//         currentPage * itemsPerPage,
//         data.length
//     )} of ${data.length} entries`;

//     const displayedPages = [];
//     for (let i = 1; i <= totalPages; i++) {
//         displayedPages.push(i);
//     }

//     const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//     return {
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
//     };
// }
