import { useState, useEffect } from "react";
import CourseForm from "./CourseForm";

export default function CourseTable() {
  const [courses, setCourses] = useState([]);
  const [editing, setEditing] = useState(null);
  const [reload, setReload] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:9090/api/course/all");
      if (!res.ok) throw new Error("Respuesta HTTP no válida");
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error("Error obteniendo cursos:", error);
      alert("No se pudo conectar al microservicio de cursos (puerto 9090)");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [reload]);

  const deleteCourse = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este curso?")) return;
    try {
      const res = await fetch(`http://localhost:9090/api/course/delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setReload(!reload);
      } else {
        alert("Error al eliminar el curso");
      }
    } catch (error) {
      console.error("Error al eliminar curso:", error);
    }
  };

  const updateCourse = async (course) => {
    try {
      const res = await fetch(
        `http://localhost:9090/api/course/update/${course.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(course),
        }
      );
      if (res.ok) {
        setEditing(null);
        setReload(!reload);
      } else {
        alert("Error al actualizar curso");
      }
    } catch (error) {
      console.error("Error al actualizar curso:", error);
    }
  };

  return (
    <div className="mt-6">
      <CourseForm onCourseCreated={() => setReload(!reload)} />

      <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Lista de Cursos</h2>

        <table className="w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Profesor</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id} className="text-center border-t">
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.teacher}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => setEditing(c)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteCourse(c.id)}
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
              <h3 className="text-lg font-bold mb-4">Editar Curso</h3>
              <input
                type="text"
                value={editing.name}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
                className="border p-2 w-full mb-2"
                placeholder="Nombre del curso"
              />
              <input
                type="text"
                value={editing.teacher}
                onChange={(e) =>
                  setEditing({ ...editing, teacher: e.target.value })
                }
                className="border p-2 w-full mb-2"
                placeholder="Profesor del curso"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditing(null)}
                  className="bg-gray-400 text-white px-3 py-1 rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => updateCourse(editing)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}