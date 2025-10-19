import React, { useState } from 'react';
import '../../styles/components/editmodal.css';

export default function EditModal({ title, data, fields, onClose, onSave }){
  const [values, setValues] = useState({...data});

  function handleChange(k, v){ setValues(prev => ({...prev, [k]: v})); }

  async function save(){ await onSave(data.id, values); }

  return (
    <div className="modal-backdrop-custom">
      <div className="modal-dialog-custom card-common">
        <div className="p-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5>{title}</h5>
            <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>Cerrar</button>
          </div>
          <div>
            {fields.map(f => (
              <div key={f.name} className="mb-2">
                <label className="form-label">{f.label}</label>
                <input className="form-control" value={values[f.name] ?? ''} onChange={e=>handleChange(f.name, e.target.value)} />
              </div>
            ))}
          </div>
          <div className="text-end mt-3">
            <button className="btn btn-secondary me-2" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" onClick={save}>Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
