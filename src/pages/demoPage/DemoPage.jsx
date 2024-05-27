import React, { useEffect, useState } from "react";
import "./DemoPage.scss";
import { useSelector, useAppDispatch } from "../../redux/hooks";
import { fetchData, addUser } from "../../redux/demo/slice";
import { EditModal } from "../../component/EditModal";
import { Modal } from "bootstrap";


export const DemoPage = () => {

  const dispatch = useAppDispatch();
  const data = useSelector((state) => state.demo.data);
  const status = useSelector((state) => state.demo.status);
  const error = useSelector((state) => state.demo.error);

  // const [showModal, setShowModal] = useState(true);
  const [editModal, setEditModal] = useState(null);

  useEffect(() => {
    setEditModal(new Modal(document.getElementById("editUserModal"), {}));
    dispatch(fetchData());
  }, [dispatch]);

  const handleSaveUser = async (user) => {
    console.log("\n\n save \n\n", user); // todo stday
    // setShowModal(false);
    dispatch(addUser(user));
    editModal.hide();
  };

  const showModal = () => {
    editModal.show();
  }

  return (
    <div className="demo-root-container">
      <div className="demo-title">Demo</div>
      <div>
        <button className="btn btn-primary btn-theme mb-4" onClick={() => showModal()}>Edit User</button>

        <EditModal
          id="editUserModal"
          title="Edit User"
          onClickSave={handleSaveUser}
        />

      </div>
      <div>
        <table className="demo-table">
          <thead>
            <tr>
              <th className="table-th">Firstname</th>
              <th className="table-th">Lastname</th>
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
