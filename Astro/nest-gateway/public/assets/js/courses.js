const apiBaseCourse = '/api/courses';

const qsC = id => document.getElementById(id);
const coursesTableBody = qsC('coursesTableBody');

async function fetchJson(url, opts) {
  const r = await fetch(url, opts);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

async function loadCourses() {
  try {
    const courses = await fetchJson(apiBaseCourse);
    coursesTableBody.innerHTML = courses.map(c => `
      <tr>
        <td>${c.id}</td>
        <td>${c.name}</td>
        <td>${c.teacher}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary" onclick="editCourse(${c.id})"><i class="fa fa-pen"></i></button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteCourse(${c.id})"><i class="fa fa-trash"></i></button>
          <button class="btn btn-sm btn-outline-info" onclick="viewStudents(${c.id})"><i class="fa fa-users"></i></button>
        </td>
      </tr>
    `).join('');
  } catch (err) { alert('Error: ' + err.message); }
}

async function saveCourse(e) {
  e.preventDefault();
  const id = qsC('courseId').value;
  const payload = { name: qsC('courseName').value, teacher: qsC('teacher').value };
  try {
    if (id) {
      await fetchJson(apiBaseCourse + '/' + id, { method: 'PUT', body: JSON.stringify(payload), headers: {'Content-Type':'application/json'} });
      alert('Curso actualizado');
    } else {
      await fetchJson(apiBaseCourse, { method: 'POST', body: JSON.stringify(payload), headers: {'Content-Type':'application/json'} });
      alert('Curso creado');
    }
    clearCourseForm();
    loadCourses();
  } catch (err) { alert(err.message); }
}

function clearCourseForm() { qsC('courseId').value = ''; qsC('courseName').value = ''; qsC('teacher').value = ''; }

async function editCourse(id) {
  const c = await fetchJson(apiBaseCourse + '/' + id);
  qsC('courseId').value = c.id;
  qsC('courseName').value = c.name;
  qsC('teacher').value = c.teacher;
}

async function deleteCourse(id) {
  if (!confirm('Eliminar curso ' + id + '?')) return;
  await fetch(apiBaseCourse + '/' + id, { method: 'DELETE' });
  loadCourses();
}

async function viewStudents(id) {
  // llama a /api/courses/{id}/students
  try {
    const response = await fetchJson(apiBaseCourse + '/' + id + '/students');
    // response contiene courseName, teacher, studentDTOList (según tu microservicio course)
    const list = response.studentDTOList || [];
    alert(`Estudiantes en el curso:\n` + (list.map(s => `${s.name} ${s.lastName} (${s.email})`).join('\n') || 'Ninguno'));
  } catch (err) { alert(err.message); }
}

qsC('courseForm').addEventListener('submit', saveCourse);
qsC('clearCourseBtn').addEventListener('click', clearCourseForm);

loadCourses();