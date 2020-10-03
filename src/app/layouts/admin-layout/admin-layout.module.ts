import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminLayoutRoutes } from "./admin-layout.routing";
import { EmployeeManagementModule } from "../../employee-management/employee-management.module";
import { CamerasModule } from "../../cameras/cameras.module";
import { DashboardComponent } from 'src/app/dashboard/dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ DashboardComponent ],
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    // FormsModule,
    // ReactiveFormsModule,
    EmployeeManagementModule,
    CamerasModule,
    SharedModule,
    ReactiveFormsModule
  ]

})
export class AdminLayoutModule { }
