import React, { useEffect, useState } from 'react';
import "./HistoryPage.scss";
import { useSelector, useAppDispatch } from "../../redux/hooks";
import DataTable, { createTheme } from 'react-data-table-component';
import { useDate } from '../../context/DateContext';
import { getAllSellHistory } from '../../redux/history/slice';
import { MainTable } from '../../component/MainTable/MainTable';
import { generateColumns } from '../../helpers/TableHelper';
import DefaultExpandRow from '../../component/MainTable/DefaultExpandRow';

export const HistoryPage = () => {

  const dispatch = useAppDispatch();
  const history = useSelector((state) => state.history.data);
  const status = useSelector((state) => state.history.status);

  const [historyData, setHistoryData] = useState(history);
  const $date = useDate();







  useEffect(() => {
    if (status === 'idle') {
      dispatch(getAllSellHistory());
    }
  }, [status, dispatch]);

  const tableSettings = {

    tableStyle: {

    },
    paging: {
      showFooter: true,
    },
    expandColumnName: "detailData",
    expandColumns: [],
  }

  return (
    <div className="demo-root-container">
      <div className="demo-title">History page</div>

      <MainTable data={history} settings={tableSettings} localePrefix={'history'}
        columns={generateColumns(history)} expandUI={DefaultExpandRow}
      />


    </div>
  );
};
