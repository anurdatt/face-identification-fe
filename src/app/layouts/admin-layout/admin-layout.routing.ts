import { Routes } from "@angular/router";
import { DashboardComponent } from "../../dashboard/dashboard.component";
export const AdminLayoutRoutes: Routes = [
  { path: '', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'admin/dashboard', component: DashboardComponent },
  { path: 'admin/employee-management', loadChildren: '../../employee-management/employee-management.module#EmployeeManagementModule' },
  { path: 'admin/cameras', loadChildren: '../../cameras/cameras.module#CamerasModule'}
]
