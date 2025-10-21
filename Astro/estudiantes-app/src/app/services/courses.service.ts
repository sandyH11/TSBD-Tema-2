import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course } from '../models/course.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CoursesService {
  private base = environment.apiCourse; // '/api/course'

  constructor(private http: HttpClient) {}

  getAll(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.base}/all`);
  }
  getById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.base}/search/${id}`);
  }
  create(course: Course): Observable<Course> {
    return this.http.post<Course>(`${this.base}/create`, course);
  }
  update(id: number, course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.base}/update/${id}`, course);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/delete/${id}`);
  }
  // Devuelve la respuesta con estudiantes asociadas (según tu microservicio course)
  getStudentsByCourse(idCourse: number): Observable<any> {
    return this.http.get<any>(`${this.base}/search-student/${idCourse}`);
  }
}