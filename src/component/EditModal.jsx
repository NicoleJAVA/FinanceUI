import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { useSelector, useAppDispatch } from "../redux/hooks";

export const EditModal = ({ id, title, editItems, onClickSave, warning, errorMsg, type = "", description = "",
  showSaveBtn = true, completeMsg = "",
  saveBtnStr = "Save changes"

}) => {

  const [showPassword, setShowPassword] = useState(true);


  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  }



  const onKeyPress = (e) => {
    if (e.keyCode === 13) {
      onClickSave();
    }
  }




  const showItem = (item) => {
    // if (item.title === LINE_NOTIFY_MODAL_TITLE_AUTH_CODE && !item.editValue) {
    //   return false;
    // }

    return "true";
  }


  return (
    <div className="">

      <div className="modal theme-modal-backdrop" tabIndex="-1" id={id} data-bs-backdrop="false">
        <div className="modal-dialog" >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
            </div>

          </div>
        </div>
      </div>
    </div >
  );


};
