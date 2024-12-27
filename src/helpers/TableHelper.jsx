export const generateColumns = (data) => {
    if (!data || data.length === 0) {
        return [];
    }

    const firstRow = data[0]; // 假設所有物件的欄位結構相同
    console.log('Object.keys(firstRow).map(key => ({ key }))', Object.keys(firstRow).map(key => ({ key }))); // todo dele
    return Object.keys(firstRow).map(key => ({ key }));
}