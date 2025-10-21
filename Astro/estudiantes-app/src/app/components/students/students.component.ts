import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  students: any[] = [];
  courses: any[] = [];
  student = { id: null, name: '', lastName: '', email: '', courseId: null };
  searchId: number | null = null;
  private baseStudent = environment.apiStudent;
  private baseCourse = environment.apiCourse;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadStudents();
    this.loadCourses();
  }

  loadStudents() {
    this.http.get<any[]>(`${this.baseStudent}/all`).subscribe({
      next: data => this.students = data,
      error: err => console.error('Error cargando estudiantes', err)
    });
  }

  loadCourses() {
    this.http.get<any[]>(`${this.baseCourse}/all`).subscribe({
      next: data => this.courses = data,
      error: err => console.error('Error cargando cursos', err)
    });
  }

  saveStudent() {
    const payload = {
      name: this.student.name,
      lastName: this.student.lastName,
      email: this.student.email,
      courseId: this.student.courseId
    };

    if (this.student.id) {
      this.http.put(`${this.baseStudent}/update/${this.student.id}`, payload).subscribe({
        next: () => {
          alert('Estudiante actualizado correctamente');
          this.loadStudents();
          this.resetForm();
        },
        error: err => console.error('Error al actualizar estudiante', err)
      });
    } else {
      this.http.post(`${this.baseStudent}/create`, payload).subscribe({
        next: () => {
          alert('Estudiante guardado correctamente');
          this.loadStudents();
          this.resetForm();
        },
        error: err => console.error('Error al guardar estudiante', err)
      });
    }
  }

  editStudent(s: any) {
    this.student = { ...s };
  }

  deleteStudent(id: number) {
    if (confirm('¿Eliminar estudiante?')) {
      this.http.delete(`${this.baseStudent}/delete/${id}`).subscribe({
        next: () => this.loadStudents(),
        error: err => console.error('Error al eliminar estudiante', err)
      });
    }
  }

  searchStudent() {
    if (this.searchId) {
      this.http.get<any>(`${this.baseStudent}/${this.searchId}`).subscribe({
        next: s => this.students = s ? [s] : [],
        error: err => console.error('Error al buscar estudiante', err)
      });
    } else {
      this.loadStudents();
    }
  }

  resetForm() {
    this.student = { id: null, name: '', lastName: '', email: '', courseId: null };
  }

  getCourseName(courseId: number): string {
    const course = this.courses.find(c => c.id === courseId);
    return course ? course.name : '—';
  }
}