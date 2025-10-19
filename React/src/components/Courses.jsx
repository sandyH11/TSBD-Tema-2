import React, { useEffect, useState } from 'react';
import { courseApi } from '../api';
import EditModal from './common/EditModal.jsx';
import '../styles/components/courses.css';

export default function Courses(){
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ name:'', teacher:'' });
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(()=>{ fetchAll(); }, []);

  async function fetchAll(){
    try{ const res = await courseApi.get('/all'); setCourses(res.data || []); }catch(e){ setCourses([]); }
  }

  async function createCourse(e){
    e.preventDefault();
    try{
      const res = await courseApi.post('/create', form);
      setCourses(prev => [...prev, res.data]);
      setForm({ name:'', teacher:'' });
    }catch(e){ alert('Error al crear curso'); }
  }

  async function deleteCourse(id){
    if(!window.confirm('¿Eliminar curso?')) return;
    try{ await courseApi.delete('/delete/' + id); setCourses(prev => prev.filter(c => c.id !== id)); }catch(e){ alert('Error al eliminar'); }
  }

  function openEdit(c){ setEditing(c); }

  async function handleUpdate(id, updated){
    try{ await courseApi.put('/update/' + id, updated); setCourses(prev => prev.map(p => p.id === id ? {...p, ...updated} : p)); setEditing(null); }catch(e){ alert('Error al actualizar'); }
  }

  const visible = courses.filter(c => {
    if(!search) return true;
    const q = search.toLowerCase();
    return (c.name||'').toLowerCase().includes(q) || (c.teacher||'').toLowerCase().includes(q);
  });

  return (
    <div className="container py-4">
      <h2 className="text-center" style={{fontWeight:800}}>Gestión de Cursos</h2>

      <div className="card card-common p-4 mt-3">
        <h5>Crear Curso</h5>
        <form onSubmit={createCourse}>
          <div className="row">
            <div className="col-md-6 mb-2">
              <input className="form-control" placeholder="Nombre del Curso" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
            </div>
            <div className="col-md-6 mb-2">
              <input className="form-control" placeholder="Profesor del Curso" value={form.teacher} onChange={e=>setForm({...form, teacher:e.target.value})} />
            </div>
            <div className="col-12">
              <button className="btn btn-primary">Crear</button>
            </div>
          </div>
        </form>
      </div>

      <div className="card card-common p-4 mt-4">
        <div className="d-flex justify-content-between align-items-center">
          <h5>Lista de Cursos</h5>
          <input className="form-control w-25" placeholder="Buscar..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>

        <div className="table-responsive mt-3">
          <table className="table">
            <thead className="table-light">
              <tr><th>ID</th><th>Nombre</th><th>Profesor</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {visible.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.teacher}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={()=>openEdit(c)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={()=>deleteCourse(c.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <EditModal
          title="Editar Curso"
          data={editing}
          fields={[{name:'name', label:'Nombre'}, {name:'teacher', label:'Profesor'}]}
          onClose={()=>setEditing(null)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
}
