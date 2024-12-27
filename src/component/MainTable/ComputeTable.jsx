// * * * * * * * * * * * * * * * * * * * * * * * *
// *                                             *
// *                                             *
// *                                             *
// *                                             *
// *                                             *
// *                                             *
// *                                             *
// *      此檔案並沒有實際用到，但需要備份提供參考                           
// *      此檔邏輯改成實現在 TableInputCell.jsx 裏                       
// *                                             *
// *                                             *
// *                                             *
// *                                             *
// *                                             *
// *                                             *
// *                                             *
// *                                             *
// *                                             *
// *                                             *
// *                                             *
// * * * * * * * * * * * * * * * * * * * * * * * *



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
