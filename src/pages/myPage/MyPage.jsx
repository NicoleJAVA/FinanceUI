import React from "react";
import "./MyPage.scss";
import { useSelector, useAppDispatch } from "../../redux/hooks";


export const MyPage = () => {

  const dispatch = useAppDispatch();


  return (
    <div className="demo-root-container">
      <div className="demo-title">My page</div>
    </div>
  );
};
