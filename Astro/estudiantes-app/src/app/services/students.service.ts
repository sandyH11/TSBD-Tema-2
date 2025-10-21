import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  private base = environment.apiStudent; // Por ejemplo: '/api/students'

  // ✅ Aquí inyectamos correctamente HttpClient
  constructor(private http: HttpClient) {}

  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.base}/all`);
  }

  getById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.base}/${id}`);
  }

  create(student: Student): Observable<Student> {
    return this.http.post<Student>(`${this.base}/create`, student);
  }

  update(id: number, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.base}/update/${id}`, student);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/delete/${id}`);
  }
}