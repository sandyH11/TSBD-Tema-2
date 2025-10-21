import { useState, useEffect } from "react";

export default function StudentForm({ onStudentCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    courseId: "",
  });

  const [courses, setCourses] = useState([]);

  //Cargar cursos disponibles para el select
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:9090/api/course/all");
        if (!res.ok) throw new Error("Error al obtener cursos");
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error("Error al cargar cursos:", error);
        alert("No se pudo conectar al microservicio de cursos (puerto 9090)");
      }
    };

    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8090/api/student/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error al crear estudiante:", errorText);
        alert("No se pudo crear el estudiante");
        return;
      }

      await response.json().catch(() => {}); // Evitar error si no hay JSON de respuesta

      if (
        window.confirm(
          "Estudiante creado correctamente"
        )
      ) {
        window.location.reload();
      }

      // Limpia formulario 
      setFormData({
        name: "",
        lastName: "",
        email: "",
        courseId: "",
      });

      if (onStudentCreated) onStudentCreated();
    } catch (error) {
      console.error("Error de conexión con el servidor:", error);
      alert("Error de conexión con el microservicio de estudiantes (puerto 8090)");
    }
  };

  // Render del formulario
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 space-y-4"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Crear Estudiante
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Apellidos"
          value={formData.lastName}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded w-full col-span-2"
          required
        />

        <select
          name="courseId"
          value={formData.courseId}
          onChange={handleChange}
          className="border p-2 rounded w-full col-span-2"
          required
        >
          <option value="">Seleccionar curso</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} — {c.teacher}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Crear
      </button>
    </form>
  );
}