import React from "react";
import "../../style/seller/confirmmodal.css";

const ConfirmModal = (props) => {
    const { isOpen, onCancel, onDelete } = props;
  return (
    <div className={`confirm-modal ${isOpen ? "open" : ""}`}>
      <div className="confirm-modal-content">
        <h2>{props.heading}</h2>
        <p>{props.para}</p>
        <div className="button-container">
          <button onClick={onDelete} className="delete-button">
            {props.firstBtn}
          </button>
          <button onClick={onCancel} className="cancel-button">
            {props.secBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
