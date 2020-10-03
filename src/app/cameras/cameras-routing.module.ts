import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewComponent } from './view/view.component';
import { MaintainCamerasComponent } from './maintain-cameras/maintain-cameras.component';

const routes: Routes = [
  { path: 'view/department/:id', component: ViewComponent },
  { path: 'maintain', component: MaintainCamerasComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  //exports: [RouterModule]
})
export class CamerasRoutingModule { }
