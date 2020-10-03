import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPLOYEE_API_URL } from "../shared/constants";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http:HttpClient) {

  }

  getAllEmployees() {
    return this.http.get(`${EMPLOYEE_API_URL}/`)
  }

  updateProfile(id, data) {
    return this.http.post(`${EMPLOYEE_API_URL}/${id}/updateProfile`, {images:data})
  }

  uploadCSV(formData, options) {
    return this.http.post(`${EMPLOYEE_API_URL}/uploadCSV`, formData, options)
  }

  downloadSampleCSV() {
    return this.http.get(`${EMPLOYEE_API_URL}/downloadSampleCSV`, { responseType: "blob" })
  }
}
