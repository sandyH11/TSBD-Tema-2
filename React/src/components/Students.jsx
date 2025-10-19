import React, { useEffect, useState } from 'react';
import { studentApi, courseApi } from '../api';
import EditModal from './common/EditModal.jsx';
import '../styles/components/students.css';

export default function Students(){
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ name:'', lastName:'', email:'', courseId:'' });
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(()=>{ fetchAll(); fetchCourses(); }, []);

  async function fetchAll(){
    try{
      const res = await studentApi.get('/all');
      setStudents(res.data || []);
    }catch(e){ console.error(e); setStudents([]); }
  }
  async function fetchCourses(){
    try{ const res = await courseApi.get('/all'); setCourses(res.data || []); }catch(e){ setCourses([]); }
  }

  async function createStudent(e){
    e.preventDefault();
    try{
      const payload = {...form, courseId: form.courseId ? Number(form.courseId) : null};
      const res = await studentApi.post('/create', payload);
      setStudents(prev => [...prev, res.data]);
      setForm({ name:'', lastName:'', email:'', courseId:'' });
    }catch(e){ alert('Error al crear estudiante'); }
  }

  async function deleteStudent(id){
    if(!window.confirm('¿Eliminar estudiante?')) return;
    try{
      await studentApi.delete('/delete/' + id);
      setStudents(prev => prev.filter(s => s.id !== id));
    }catch(e){ alert('Error al eliminar'); }
  }

  function openEdit(s){ setEditing(s); }

  async function handleUpdate(id, updated){
    try{
      await studentApi.put('/update/' + id, updated);
      setStudents(prev => prev.map(p => p.id === id ? {...p, ...updated} : p));
      setEditing(null);
    }catch(e){ alert('Error al actualizar'); }
  }

  // Search by name, lastName or email
  const visible = students.filter(s => {
    if(!search) return true;
    const q = search.toLowerCase();
    return (s.name || '').toLowerCase().includes(q) || (s.lastName||'').toLowerCase().includes(q) || (s.email||'').toLowerCase().includes(q);
  });

  return (
    <div className="container py-4">
      <h2 className="text-center" style={{fontWeight:800}}>Gestión de Estudiantes</h2>

      <div className="card card-common p-4 mt-3">
        <h5>Crear Estudiante</h5>
        <form onSubmit={createStudent}>
          <div className="row">
            <div className="col-md-6 mb-2">
              <input className="form-control" placeholder="Nombre" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
            </div>
            <div className="col-md-6 mb-2">
              <input className="form-control" placeholder="Apellidos" value={form.lastName} onChange={e=>setForm({...form, lastName:e.target.value})} />
            </div>
            <div className="col-12 mb-2">
              <input className="form-control" placeholder="Correo electrónico" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
            </div>
            <div className="col-12 mb-3">
              <select className="form-control" value={form.courseId} onChange={e=>setForm({...form, courseId:e.target.value})}>
                <option value="">Seleccionar curso</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-12">
              <button className="btn btn-primary">Crear</button>
            </div>
          </div>
        </form>
      </div>

      <div className="card card-common p-4 mt-4">
        <div className="d-flex justify-content-between align-items-center">
          <h5>Lista de Estudiantes</h5>
          <input className="form-control w-25" placeholder="Buscar..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>

        <div className="table-responsive mt-3">
          <table className="table">
            <thead className="table-light">
              <tr>
                <th>ID</th><th>Nombre</th><th>Apellidos</th><th>Email</th><th>Curso ID</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(s => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.lastName}</td>
                  <td>{s.email}</td>
                  <td>{s.courseId}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={()=>openEdit(s)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={()=>deleteStudent(s.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <EditModal
          title="Editar Estudiante"
          data={editing}
          fields={[
            {name:'name', label:'Nombre'},
            {name:'lastName', label:'Apellidos'},
            {name:'email', label:'Email'},
            {name:'courseId', label:'Curso ID'}
          ]}
          onClose={()=>setEditing(null)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
}
