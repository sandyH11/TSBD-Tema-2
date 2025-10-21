const apiBase = '/api/students';
const qs = id => document.getElementById(id);
const studentsTableBody = qs('studentsTableBody');
const studentForm = qs('studentForm');

let cursos = []; // 🔹 Aquí guardaremos los cursos cargados desde el microservicio course

// --- Funciones utilitarias ---
async function fetchJson(url, opts) {
  const r = await fetch(url, opts);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

// 🔹 Cargar los cursos existentes
async function loadCourses() {
  try {
    const data = await fetchJson(`${apiBase}/courses/all`); // Endpoint del Gateway que retorna todos los cursos
    cursos = data;
    const select = qs('courseId');
    select.innerHTML = '<option value="">Seleccione un curso</option>';
    data.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.name;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error('Error cargando cursos:', err.message);
  }
}

// 🔹 Obtener el nombre de un curso dado su id
function obtenerNombreCurso(idCourse) {
  const c = cursos.find(c => c.id === idCourse);
  return c ? c.name : idCourse ?? '';
}

// --- CRUD de estudiantes ---
async function loadStudents() {
  try {
    const students = await fetchJson(apiBase);
    studentsTableBody.innerHTML = students.map(s => `
      <tr>
        <td>${s.id}</td>
        <td>${s.name}</td>
        <td>${s.lastName}</td>
        <td>${s.email}</td>
        <td>${obtenerNombreCurso(s.courseId)}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary" onclick="editStudent(${s.id})"><i class="fa fa-pen"></i></button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteStudent(${s.id})"><i class="fa fa-trash"></i></button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    alert('Error cargando estudiantes: ' + err.message);
  }
}

async function saveStudent(e) {
  e.preventDefault();
  const id = qs('studentId').value;
  const payload = {
    name: qs('name').value,
    lastName: qs('lastName').value,
    email: qs('email').value,
    courseId: qs('courseId').value ? +qs('courseId').value : null
  };
  try {
    if (id) {
      await fetchJson(apiBase + '/' + id, { method: 'PUT', body: JSON.stringify(payload), headers: {'Content-Type':'application/json'} });
      alert('Estudiante actualizado');
    } else {
      await fetchJson(apiBase, { method: 'POST', body: JSON.stringify(payload), headers: {'Content-Type':'application/json'} });
      alert('Estudiante creado');
    }
    clearForm();
    loadStudents();
  } catch (err) { alert(err.message); }
}

function clearForm() {
  qs('studentId').value = '';
  qs('name').value = '';
  qs('lastName').value = '';
  qs('email').value = '';
  qs('courseId').value = '';
}

async function editStudent(id) {
  try {
    const s = await fetchJson(apiBase + '/' + id);
    qs('studentId').value = s.id;
    qs('name').value = s.name;
    qs('lastName').value = s.lastName;
    qs('email').value = s.email;
    qs('courseId').value = s.courseId ?? '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) { alert(err.message); }
}

async function deleteStudent(id) {
  if (!confirm('Eliminar estudiante ' + id + '?')) return;
  try {
    await fetch(apiBase + '/' + id, { method: 'DELETE' });
    loadStudents();
  } catch (err) { alert(err.message); }
}

async function searchById() {
  const id = qs('searchId').value;
  if (!id) return loadStudents();
  try {
    const s = await fetchJson(apiBase + '/' + id);
    studentsTableBody.innerHTML = `<tr>
      <td>${s.id}</td><td>${s.name}</td><td>${s.lastName}</td><td>${s.email}</td><td>${obtenerNombreCurso(s.courseId)}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary" onclick="editStudent(${s.id})"><i class="fa fa-pen"></i></button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteStudent(${s.id})"><i class="fa fa-trash"></i></button>
      </td>
    </tr>`;
  } catch (err) { alert('No encontrado: ' + err.message); }
}

// --- Eventos ---
studentForm.addEventListener('submit', saveStudent);
qs('clearBtn').addEventListener('click', clearForm);
qs('btnSearch').addEventListener('click', searchById);

// --- Inicial ---
(async () => {
  await loadCourses();  // Cargar primero los cursos
  await loadStudents(); // Luego los estudiantes
})();