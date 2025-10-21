import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('api/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.coursesService.findById(+id);
  }

  @Post()
  create(@Body() body: any) {
    return this.coursesService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.coursesService.update(+id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.coursesService.delete(+id);
  }

  @Get(':id/students')
  findStudents(@Param('id') id: string) {
    return this.coursesService.findStudentsByCourse(+id);
  }
}