import { useState } from "react";

export default function CourseForm({ onCourseCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    teacher: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:9090/api/course/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Si el backend responde con error (400, 500, etc.)
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error al crear curso:", errorText);
        alert("No se pudo crear el curso. Código: " + response.status);
        return;
      }

      // Intentar leer el cuerpo de la respuesta
      const text = await response.text();
      let data = null;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          console.warn("La respuesta no es JSON válida:", text);
        }
      }

      console.log("Curso creado:", data ?? "(sin cuerpo)");

      // Limpiar formulario
      setFormData({ name: "", teacher: "" });

      // Notificar al padre que hay un nuevo curso
      onCourseCreated();

      alert("Curso creado correctamente");
    } catch (error) {
      console.error("Error de conexión con el servidor:", error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 space-y-4"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-4">Crear Curso</h2>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Nombre del Curso"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="text"
          name="teacher"
          placeholder="Profesor del Curso"
          value={formData.teacher}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
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