import React from 'react';
export default function ConfirmDialog({message, onCancel, onConfirm}){
  return (
    <div className="modal-backdrop-custom">
      <div className="modal-dialog-custom card-common p-3">
        <p>{message}</p>
        <div className="text-end">
          <button className="btn btn-secondary me-2" onClick={onCancel}>Cancelar</button>
          <button className="btn btn-danger" onClick={onConfirm}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}
