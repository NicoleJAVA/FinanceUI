import React, { useState } from "react";
import "./MyPage.scss";
import { useSelector, useAppDispatch } from "../../redux/hooks";
import { MainTable } from "../../component/MainTable/MainTable";
import { generateData } from '../../component/MainTable/mockTableData';
import DefaultExpandRow from "../../component/MainTable/DefaultExpandRow";

export const MyPage = ({ t }) => {

  const dispatch = useAppDispatch();
  // const [data, setData] = useState([ // todo dele
  //   { uuid: '1', name: 'Row 1', detail: 'Detail for Row 1' },
  //   { uuid: '2', name: 'Row 2', detail: 'Detail for Row 2' },
  // ]);
  const [data, setData] = useState(generateData());

  const columns = [
    { key: "uuid" },
    { key: "name" },
    { key: "detail" },
    { key: "tel" },
    { key: "address" },
    { key: "email" },
    { key: "price", isInput: true, affect: ["total"] },
    { key: "amount", isInput: true, affect: ["total"] },
    { key: "total", isInput: false, dep: ["amount", "price"], depType: "multiply" },
  ];

  const tableSettings = {

    tableStyle: {

    },
    paging: {
      showFooter: true,
    },
    expandColumnName: "detailData",
    expandColumns: [

      { key: "color" },
      { key: "season" },
      { key: "fruit" },
      { key: "flower" },


    ],
    autoGenColumns: true,

  }

  return (
    <div className="demo-root-container">
      <div className="demo-title">{t('welcome')}</div>
      <MainTable data={data} settings={tableSettings} columns={columns} localePrefix={'common'}
        expandUI={DefaultExpandRow} />
    </div>
  );
};
