import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: any[] = [];
  course = { id: null as number | null, name: '', teacher: '' };
  private baseUrl = environment.apiCourse;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    this.http.get<any[]>(`${this.baseUrl}/all`).subscribe({
      next: data => this.courses = data,
      error: err => console.error('Error cargando cursos', err)
    });
  }

  saveCourse() {
    const payload = { name: this.course.name, teacher: this.course.teacher };

    if (this.course.id) {
      this.http.put(`${this.baseUrl}/update/${this.course.id}`, payload).subscribe({
        next: () => { alert('Curso actualizado'); this.loadCourses(); this.reset(); },
        error: err => console.error('Error actualizando curso', err)
      });
    } else {
      this.http.post(`${this.baseUrl}/create`, payload).subscribe({
        next: () => { alert('Curso creado'); this.loadCourses(); this.reset(); },
        error: err => console.error('Error creando curso', err)
      });
    }
  }

  editCourse(c: any) {
    this.course = { id: c.id, name: c.name, teacher: c.teacher };
  }

  deleteCourse(id: number) {
    if (confirm(`¿Eliminar curso ${id}?`)) {
      this.http.delete(`${this.baseUrl}/delete/${id}`).subscribe({
        next: () => this.loadCourses(),
        error: err => console.error('Error eliminando curso', err)
      });
    }
  }

  reset() {
    this.course = { id: null, name: '', teacher: '' };
  }
}