import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { EmployeeManagementRoutingModule } from './employee-management-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { MaintainEmployeesComponent } from './maintain-employees/maintain-employees.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProfileComponent, MaintainEmployeesComponent],
  imports: [
    CommonModule,
    EmployeeManagementRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [
    ProfileComponent,
    MaintainEmployeesComponent
  ]
})
export class EmployeeManagementModule { }
