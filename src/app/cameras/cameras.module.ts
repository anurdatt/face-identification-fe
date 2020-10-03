import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CamerasRoutingModule } from './cameras-routing.module';
import { ViewComponent } from './view/view.component';
import { MaintainCamerasComponent } from './maintain-cameras/maintain-cameras.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ViewComponent, MaintainCamerasComponent],
  imports: [
    CommonModule,
    CamerasRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    ViewComponent,
    MaintainCamerasComponent
  ]
})
export class CamerasModule { }
