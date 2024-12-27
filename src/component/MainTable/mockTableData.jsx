export const generateData = () => {
    const data = [];

    // 定義可能的顏色、季節、水果和花卉選項
    const colors = ['Red', 'Green', 'Blue', 'Yellow', 'Purple', 'Orange'];
    const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
    const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Grape'];
    const flowers = ['Rose', 'Tulip', 'Lily', 'Daisy', 'Sunflower'];

    for (let i = 1; i <= 100; i++) {
        // 隨機產生 detailData 長度，範圍為 5 到 10
        const detailDataLength = Math.floor(Math.random() * 6) + 5;

        // 隨機產生 detailData 陣列
        const detailData = [];
        for (let j = 0; j < detailDataLength; j++) {
            detailData.push({
                uuid: `${i}-${j + 1}`, // 每筆 detailData 的唯一識別碼
                color: colors[Math.floor(Math.random() * colors.length)],
                season: seasons[Math.floor(Math.random() * seasons.length)],
                fruit: fruits[Math.floor(Math.random() * fruits.length)],
                flower: flowers[Math.floor(Math.random() * flowers.length)]
            });
        }

        // 每筆資料添加 detailData
        data.push({
            uuid: `${i}`,
            name: `Row ${i}`,
            detail: `Detail for Row ${i}`,
            tel: `${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`,
            address: `${Math.floor(Math.random() * 1000)} ${['Maple', 'Oak', 'Pine', 'Elm', 'Cedar'][Math.floor(Math.random() * 5)]} St, City ${Math.floor(Math.random() * 100)}`,
            email: `user${i}@example.com`,
            detailData: detailData
        });
    }

    return data;
};


// export const generateData = () => { // todo dele
//     const data = [];
//     for (let i = 1; i <= 100; i++) {
//         data.push({
//             uuid: `${i}`,
//             name: `Row ${i}`,
//             detail: `Detail for Row ${i}`,
//             tel: `${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`,
//             address: `${Math.floor(Math.random() * 1000)} ${['Maple', 'Oak', 'Pine', 'Elm', 'Cedar'][Math.floor(Math.random() * 5)]} St, City ${Math.floor(Math.random() * 100)}`,
//             email: `user${i}@example.com`
//         });
//     }
//     return data;
// };

// export const generateData = () => {
//     const data = [];

//     // 定義可能的顏色、季節、水果和花卉選項
//     const colors = ['Red', 'Green', 'Blue', 'Yellow', 'Purple', 'Orange'];
//     const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
//     const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Grape'];
//     const flowers = ['Rose', 'Tulip', 'Lily', 'Daisy', 'Sunflower'];

//     for (let i = 1; i <= 100; i++) {
//         // 隨機產生 detailData 長度，範圍為 5 到 10
//         const detailDataLength = Math.floor(Math.random() * 6) + 5;

//         // 隨機產生 detailData 陣列
//         const detailData = [];
//         for (let j = 0; j < detailDataLength; j++) {
//             detailData.push({
//                 color: colors[Math.floor(Math.random() * colors.length)],
//                 season: seasons[Math.floor(Math.random() * seasons.length)],
//                 fruit: fruits[Math.floor(Math.random() * fruits.length)],
//                 flower: flowers[Math.floor(Math.random() * flowers.length)]
//             });
//         }

//         // 每筆資料添加 detailData
//         data.push({
//             uuid: `${i}`,
//             name: `Row ${i}`,
//             detail: `Detail for Row ${i}`,
//             tel: `${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`,
//             address: `${Math.floor(Math.random() * 1000)} ${['Maple', 'Oak', 'Pine', 'Elm', 'Cedar'][Math.floor(Math.random() * 5)]} St, City ${Math.floor(Math.random() * 100)}`,
//             email: `user${i}@example.com`,
//             detailData: detailData
//         });
//     }

//     return data;
// };
