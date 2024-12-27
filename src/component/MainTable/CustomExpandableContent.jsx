// * * * * * * * * * * * * * * * * * * * * * * * *
// *                                             *
// *                                             *
// *                                             *
// *                                             *
// *                                             *
// *                                             *
// *                                             *
// *      todo dele todo delete this whole file                           
// *      可以刪掉這個檔案                    
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

export const CustomExpandableContent = ({ row }) => {
    return (
        <div>
            <h4>Details for {row.name}</h4>
            <p>{row.detail}</p>
            <ul>
                {row.additionalInfo &&
                    row.additionalInfo.map((info, index) => <li key={index}>{info}</li>)}
            </ul>
        </div>
    );
};

export default CustomExpandableContent;
