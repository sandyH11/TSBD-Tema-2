import axios from 'axios';

export const studentApi = axios.create({
  baseURL: 'http://localhost:8090/api/student',
  headers: { 'Content-Type': 'application/json' }
});

export const courseApi = axios.create({
  baseURL: 'http://localhost:9090/api/course',
  headers: { 'Content-Type': 'application/json' }
});
