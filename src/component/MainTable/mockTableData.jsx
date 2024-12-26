export const generateData = () => {
    const data = [];
    for (let i = 1; i <= 100; i++) {
        data.push({
            uuid: `${i}`,
            name: `Row ${i}`,
            detail: `Detail for Row ${i}`,
            tel: `${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`,
            address: `${Math.floor(Math.random() * 1000)} ${['Maple', 'Oak', 'Pine', 'Elm', 'Cedar'][Math.floor(Math.random() * 5)]} St, City ${Math.floor(Math.random() * 100)}`,
            email: `user${i}@example.com`
        });
    }
    return data;
};