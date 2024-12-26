export const handleInputChange = (columns, updatedData, setUpdatedData, uuid, columnKey, value) => {
    const updatedDataCopy = [...updatedData];
    const rowIndex = updatedDataCopy.findIndex((row) => row.uuid === uuid);

    if (rowIndex !== -1) {
        updatedDataCopy[rowIndex] = {
            ...updatedDataCopy[rowIndex],
            [columnKey]: value,
            [`${columnKey}_updated`]: true,
        };

        // 計算依賴欄位
        calculateDependentColumns(columns, updatedDataCopy[rowIndex], updatedDataCopy, setUpdatedData);

        setUpdatedData(updatedDataCopy);

        // 檢查該欄位是否有 affect 屬性
        const column = columns.find(col => col.key === columnKey);
        if (column && column.affect) {
            console.log('AFFEXT', column.affect); // todo dele
            column.affect.forEach((affectedColumnKey) => {
                console.log('動畫', affectedColumnKey); // todo dele
                triggerFlashAnimation(uuid, affectedColumnKey);
            });
        }

    }
};

const calculateDependentColumns = (columns, row, updatedData, setUpdatedData) => {
    columns.forEach((column) => {
        if (column.dep && column.dep.length > 0) {
            // 根據 depType 判斷如何計算依賴欄位
            const dependentValues = column.dep.map((depKey) => {
                return parseFloat(row[depKey]) || 0;
            });

            if (column.depType === "multiply" && dependentValues.length === 2) {
                // 例如：price * amount
                console.log('乘法',); // todo dele
                row[column.key] = dependentValues[0] * dependentValues[1];
            }

            // 若有更多計算邏輯（加減乘除），可以在這裡添加
            // 比如加法
            if (column.depType === "add" && dependentValues.length === 2) {
                row[column.key] = dependentValues[0] + dependentValues[1];
            }

            // 若需要處理除法等其他類型，可以在這裡進行擴展
        }
    });

    setUpdatedData([...updatedData]); // 更新資料
};


const triggerFlashAnimation = (rowUuid, columnKey) => {
    const row = document.querySelector(`[data-uuid="${rowUuid}"]`);
    console.log('trigger', columnKey); // todo dele
    console.log('ROW', row); // todo dele
    if (row) {
        const cell = row.querySelector(`[data-column="${columnKey}"]`);
        console.log('cELL', cell); // todo dele
        if (cell) {
            // 加入一個動畫類別來變色
            cell.classList.add("flash-border");

            // 1秒後移除動畫效果，恢復原來顏色
            setTimeout(() => {
                cell.classList.remove("flash-border");
            }, 2000);
        }
    }
};

// export const handleInputChange = (columns, updatedData, setUpdatedData, uuid, columnKey, value) => {
//     const updatedDataCopy = [...updatedData];
//     const rowIndex = updatedDataCopy.findIndex((row) => row.uuid === uuid);

//     if (rowIndex !== -1) {
//         updatedDataCopy[rowIndex] = {
//             ...updatedDataCopy[rowIndex],
//             [columnKey]: value,
//             [`${columnKey}_updated`]: true,
//         };
//         setUpdatedData(updatedDataCopy);

//         // 檢查該欄位是否有 affect 屬性
//         const column = columns.find(col => col.key === columnKey);
//         if (column && column.affect) {
//             // 如果有 affect 屬性，對 affected 欄位觸發動畫
//             column.affect.forEach((affectedColumnKey) => {
//                 triggerFlashAnimation(uuid, affectedColumnKey);
//             });
//         }

//         // 呼叫 triggerFlashAnimation，並傳遞 rowUuid 和 columnKey
//         triggerFlashAnimation(uuid, columnKey); // 傳遞參數
//     }
// };




// // ComputeTable.jsx

// export const handleInputChange = (updatedData, setUpdatedData, uuid, columnKey, value) => {
//     const updatedDataCopy = [...updatedData];
//     const rowIndex = updatedDataCopy.findIndex((row) => row.uuid === uuid);

//     if (rowIndex !== -1) {
//         updatedDataCopy[rowIndex] = {
//             ...updatedDataCopy[rowIndex],
//             [columnKey]: value,
//             [`${columnKey}_updated`]: true,
//         };
//         setUpdatedData(updatedDataCopy);

//         // 呼叫 triggerFlashAnimation，並傳遞 rowUuid 和 columnKey
//         triggerFlashAnimation(uuid, columnKey); // 傳遞參數
//     }
// };


// // export const handleInputChange = (updatedData, setUpdatedData, uuid, columnKey, value) => {
// //     const updatedDataCopy = [...updatedData]; // 複製 updatedData 陣列
// //     const rowIndex = updatedDataCopy.findIndex((row) => row.uuid === uuid);

// //     if (rowIndex !== -1) {
// //         updatedDataCopy[rowIndex] = {
// //             ...updatedDataCopy[rowIndex], // 保留其他欄位
// //             [columnKey]: value, // 更新對應的欄位
// //             [`${columnKey}_updated`]: true, // 標記為已更新
// //         };
// //         setUpdatedData(updatedDataCopy); // 更新狀態
// //     }
// // };
// // export const handleInputChange = (e, rowUuid, columnKey, columns, setUpdatedData, updatedData) => {
// //     const updatedRows = [...updatedData];
// //     const rowIndex = updatedRows.findIndex((row) => row.uuid === rowUuid);
// //     updatedRows[rowIndex][columnKey] = e.target.value;
// //     setUpdatedData(updatedRows);

// //     // 處理依賴關係的動畫
// //     columns.forEach((column) => {
// //         if (column.key === columnKey && column.affect) {
// //             column.affect.forEach((affectedColumn) => {
// //                 triggerFlashAnimation(updatedRows[rowIndex].uuid, affectedColumn);
// //             });
// //         }
// //     });
// // };

// const triggerFlashAnimation = (rowId, columnKey) => {
//     const element = document.getElementById(`row-${rowId}-${columnKey}`);
//     if (element) {
//         element.classList.add('flash-background');
//         setTimeout(() => {
//             element.classList.remove('flash-background');
//         }, 1000); // 動畫持續 1 秒
//     }
// };


// // // computeTable.js (tableLogic.js) todo dele
// // export const handleInputChange = (updatedData, setUpdatedData, rowId, fieldKey, value) => {
// //     const newData = updatedData.map((row) => {
// //         if (row.uuid === rowId) {
// //             row[fieldKey] = value;
// //         }
// //         return row;
// //     });
// //     setUpdatedData(newData);
// //     recalculateDependencies(updatedData, setUpdatedData, rowId);
// //     triggerFlashAnimation(rowId, 'total'); // 在數據更新後觸發閃爍框線動畫
// // };

// // export const recalculateDependencies = (updatedData, setUpdatedData, rowId) => {
// //     const newData = updatedData.map((row) => {
// //         if (row.uuid === rowId) {
// //             if (row.price && row.amount) {
// //                 const total = (parseFloat(row.price) * parseFloat(row.amount)).toFixed(2);
// //                 row.total = total;
// //                 row.total_updated = true;
// //             }
// //         }
// //         return row;
// //     });

// //     setUpdatedData(newData);

// //     setTimeout(() => {
// //         const resetData = updatedData.map((row) => {
// //             delete row.total_updated;
// //             return row;
// //         });
// //         setUpdatedData(resetData);
// //     }, 2000);
// // };

// // export const triggerFlashAnimation = (rowId, columnKey) => {
// //     const element = document.getElementById(`row-${rowId}-${columnKey}`);
// //     if (element) {
// //         element.classList.add('flash-background');

// //         setTimeout(() => {
// //             element.classList.remove('flash-background');
// //         }, 1000);
// //     }
// // };
