import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { StudentsModule } from './students/students.module';
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [
    HttpModule, // para hacer requests HTTP (axios)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*'], // dejamos las rutas /api para Nest, lo demás se sirve estático
    }),
    StudentsModule,
    CoursesModule,
  ],
})
export class AppModule {}