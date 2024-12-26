import React from 'react';

const MainTable = ({ data, setData }) => {

    const toggleDetails = (index) => {
        const newData = [...data];
        newData[index].showDetails = !newData[index].showDetails;
        setData(newData);
    };

    return (
        <table>
            <tbody>
                {data.map((item, index) => (
                    <React.Fragment key={index}>
                        <tr>
                            <td onClick={() => toggleDetails(index)}>
                                {item.name}
                            </td>
                        </tr>
                        {item.showDetails && (
                            <tr>
                                <td>
                                    {item.details}
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );
};

export default MainTable;
