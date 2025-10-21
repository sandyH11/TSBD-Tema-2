import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { StudentsService } from './students.service';

@Controller('api/students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  // Buscar estudiantes por curso
  @Get('course/:courseId')
  findByCourse(@Param('courseId') courseId: string) {
    return this.studentsService.findByCourse(+courseId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.studentsService.findById(+id);
  }

  @Post()
  create(@Body() body: any) {
    return this.studentsService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.studentsService.update(+id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.studentsService.delete(+id);
  }

  // ruta para obtener todos los cursos disponibles
  @Get('courses/all')
  getAllCourses() {
    return this.studentsService.getAllCourses();
  }
}