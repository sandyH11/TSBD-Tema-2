import { useState, useEffect } from "react";

export default function StudentTable() {
  const [students, setStudents] = useState([]);
  const [editing, setEditing] = useState(null);
  const [updated, setUpdated] = useState(false);

  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:8090/api/student/all");
      if (!res.ok) throw new Error("Error al obtener estudiantes");
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error("Error al cargar estudiantes:", error);
      alert("No se pudo conectar al microservicio de estudiantes (puerto 8090)");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [updated]);

  const deleteStudent = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este estudiante?")) return;
    try {
      await fetch(`http://localhost:8090/api/student/delete/${id}`, {
        method: "DELETE",
      });
      setUpdated(!updated);
    } catch (error) {
      console.error("Error al eliminar estudiante:", error);
      alert("No se pudo eliminar el estudiante.");
    }
  };

  const updateStudent = async (student) => {
    try {
      const response = await fetch(
        `http://localhost:8090/api/student/update/${student.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(student),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error al actualizar estudiante:", errorText);
        alert("No se pudo actualizar el estudiante");
        return;
      }

      setEditing(null);
      setUpdated(!updated);
    } catch (error) {
      console.error("Error al actualizar estudiante:", error);
      alert("Error de conexión con el servidor (puerto 8090)");
    }
  };

  return (
    <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Lista de Estudiantes</h2>

      <table className="w-full border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Apellidos</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Curso ID</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id} className="text-center border-t">
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.lastName}</td>
              <td>{s.email}</td>
              <td>{s.courseId}</td>
              <td className="space-x-2">
                <button
                  onClick={() => setEditing(s)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteStudent(s.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Editar Estudiante</h3>

            <input
              type="text"
              value={editing.name}
              onChange={(e) =>
                setEditing({ ...editing, name: e.target.value })
              }
              className="border p-2 w-full mb-2"
              placeholder="Nombre"
            />
            <input
              type="text"
              value={editing.lastName}
              onChange={(e) =>
                setEditing({ ...editing, lastName: e.target.value })
              }
              className="border p-2 w-full mb-2"
              placeholder="Apellidos"
            />
            <input
              type="email"
              value={editing.email}
              onChange={(e) =>
                setEditing({ ...editing, email: e.target.value })
              }
              className="border p-2 w-full mb-2"
              placeholder="Correo electrónico"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditing(null)}
                className="bg-gray-400 text-white px-3 py-1 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={() => updateStudent(editing)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}