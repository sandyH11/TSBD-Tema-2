import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class CoursesService {
  private baseUrl = 'http://localhost:9090/api/course';

  constructor(private readonly httpService: HttpService) {}

  // Método genérico para manejar respuestas HTTP y errores
  private async unwrap<T>(obs: Observable<AxiosResponse<T>>): Promise<T> {
    try {
      const resp = await firstValueFrom(obs);
      return resp.data;
    } catch (err: any) {
      throw new HttpException(
        err?.response?.data || err.message,
        err?.response?.status || 500,
      );
    }
  }

  // Obtener todos los cursos
  findAll() {
    return this.unwrap<any[]>(this.httpService.get(`${this.baseUrl}/all`));
  }

  // Buscar curso por ID
  findById(id: number) {
    return this.unwrap<any>(this.httpService.get(`${this.baseUrl}/search/${id}`));
  }

  // Crear nuevo curso
  create(course: any) {
    return this.unwrap<any>(this.httpService.post(`${this.baseUrl}/create`, course));
  }

  // Actualizar curso
  update(id: number, course: any) {
    return this.unwrap<any>(this.httpService.put(`${this.baseUrl}/update/${id}`, course));
  }

  // Eliminar curso
  delete(id: number) {
    return this.unwrap<void>(this.httpService.delete(`${this.baseUrl}/delete/${id}`));
  }

  // Obtener estudiantes de un curso (llama internamente al microservicio de estudiantes)
  findStudentsByCourse(idCourse: number) {
    return this.unwrap<any>(
      this.httpService.get(`${this.baseUrl}/search-student/${idCourse}`)
    );
  }
}