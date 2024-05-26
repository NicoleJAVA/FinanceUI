import React, { useEffect } from "react";
import "./DemoPage.scss";
import { useSelector, useAppDispatch } from "../../redux/hooks";
import { fetchData } from "../../redux/demo/slice";

export const DemoPage = () => {

  const dispatch = useAppDispatch();
  const data = useSelector((state) => state.demo.data);
  const status = useSelector((state) => state.demo.status);
  const error = useSelector((state) => state.demo.error);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);


  return (
    <div className="demo-root-container">
      <div className="demo-title">Demo</div>

      <div>
        <table>
          <thead>
            <tr>
              <th>Firstname</th>
              <th>Lastname</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id}>
                <td>{item.firstname}</td>
                <td>{item.lastname}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
