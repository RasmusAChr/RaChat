import React from "react";

function ConfirmDialog({ onConfirm }) {
    return (
        <div className="confirm-dialog">
            <div className="confirm-dialog-content">
                <h3>Delete message</h3>
                <p>Are you sure you want to delete your message?</p>
                <button onClick={() => onConfirm(true)}>Yes</button>
                <button onClick={() => onConfirm(false)}>No</button>
            </div>
        </div>
    );
}

export default ConfirmDialog;