import React, { useState, } from "react";

export const EditModal = ({ id, title, onClickSave, errorMsg = "" }) => {



  const [user, setUser] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };


  const handleSave = () => {
    onClickSave(user);
  };


  return (
    <div className="">

      <div className="modal theme-modal-backdrop" tabIndex="-1" id={id} data-bs-backdrop="false">
        <div className="modal-dialog" >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
            </div>
            {/* modal body begin */}
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="firstname">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstname"
                  name="firstname"
                  value={user.firstname}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastname">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastname"
                  name="lastname"
                  value={user.lastname}
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* modal body end */}

            {/* modal footer begin */}
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={handleSave}>Save changes</button>
            </div>
            {/* modal footer end */}
          </div>
        </div>
      </div>
    </div >
  );


};
