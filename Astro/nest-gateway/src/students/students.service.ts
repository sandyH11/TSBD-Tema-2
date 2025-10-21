import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class StudentsService {
  private baseUrl = 'http://localhost:8090/api/student';

  constructor(private readonly httpService: HttpService) {}

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

  findAll() {
    return this.unwrap<any[]>(this.httpService.get(`${this.baseUrl}/all`));
  }

  findById(id: number) {
    return this.unwrap<any>(this.httpService.get(`${this.baseUrl}/search/${id}`));
  }

  findByCourse(idCourse: number) {
    return this.unwrap<any[]>(this.httpService.get(`${this.baseUrl}/search-by-course/${idCourse}`));
  }

  create(student: any) {
    return this.unwrap<any>(this.httpService.post(`${this.baseUrl}/create`, student));
  }

  update(id: number, student: any) {
    return this.unwrap<any>(this.httpService.put(`${this.baseUrl}/update/${id}`, student));
  }

  delete(id: number) {
    return this.unwrap<void>(this.httpService.delete(`${this.baseUrl}/delete/${id}`));
  }

  // método para obtener los cursos existentes
  async getAllCourses() {
    const url = 'http://localhost:9090/api/course/all';
    return this.unwrap<any[]>(this.httpService.get(url));
  }
}