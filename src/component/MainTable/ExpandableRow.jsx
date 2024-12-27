

import { MainTable } from "./MainTable";

export const ExpandableRow = ({ isExpanded, columns, data, colSpan, localePrefix, settings }) => {
    if (!isExpanded) return null;

    console.log('exp', columns, data); // todo dele

    const tableSettings = {};
    return (
        <tr>
            <td colSpan={colSpan}>
                <div>

                    <MainTable data={data} settings={tableSettings} columns={columns} localePrefix={'common'}
                    />
                </div>
            </td>
        </tr>
    );
};
