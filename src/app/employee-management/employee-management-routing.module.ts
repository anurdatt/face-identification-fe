import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from "./profile/profile.component";
import { MaintainEmployeesComponent } from './maintain-employees/maintain-employees.component';


const routes: Routes = [
  { path: 'profile', component: ProfileComponent },
  { path: 'maintain', component: MaintainEmployeesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  //exports: [RouterModule]
})
export class EmployeeManagementRoutingModule { }
