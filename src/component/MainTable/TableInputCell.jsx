import React from "react";

const TableInputCell = ({ columns, column, updatedData, setUpdatedData, uuid, columnKey, value }) => {
    const handleInputChange = (e) => {
        const updatedDataCopy = [...updatedData];
        const rowIndex = updatedDataCopy.findIndex((row) => row.uuid === uuid);

        if (rowIndex !== -1) {
            updatedDataCopy[rowIndex] = {
                ...updatedDataCopy[rowIndex],
                [columnKey]: e.target.value,
                [`${columnKey}_updated`]: true,
            };

            setUpdatedData(updatedDataCopy);

            // 計算依賴欄位
            calculateDependentColumns(columns, updatedDataCopy[rowIndex], updatedDataCopy, setUpdatedData);

            // 檢查該欄位是否有 affect 屬性，並處理 affected columns
            if (column.affect) {
                column.affect.forEach((affectedColumnKey) => {
                    triggerFlashAnimation(uuid, affectedColumnKey);
                    calculateDependentColumns(columns, updatedDataCopy[rowIndex], updatedDataCopy, setUpdatedData);
                });
            }
        }
    };

    const calculateDependentColumns = (columns, row, updatedData, setUpdatedData) => {
        columns.forEach((column) => {
            // 檢查該列是否有 dep 依賴欄位
            if (column.dep && column.dep.length > 0) {
                const dependentValues = column.dep.map((depKey) => {
                    return parseFloat(row[depKey]) || 0;
                });

                if (column.depType === "multiply" && dependentValues.length === 2) {
                    row[column.key] = dependentValues[0] * dependentValues[1];
                }

                if (column.depType === "add" && dependentValues.length === 2) {
                    row[column.key] = dependentValues[0] + dependentValues[1];
                }
            }
        });

        setUpdatedData([...updatedData]); // 更新資料
    };

    const triggerFlashAnimation = (rowUuid, columnKey) => {
        const row = document.querySelector(`[data-uuid="${rowUuid}"]`);
        if (row) {
            const cell = row.querySelector(`[data-column="${columnKey}"]`);
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

    return (
        <input
            type="text"
            value={value || ""}
            onChange={handleInputChange}
        />
    );
};

export default TableInputCell;
