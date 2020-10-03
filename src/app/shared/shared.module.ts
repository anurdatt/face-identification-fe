import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from "../material/material.module";
import { FlexLayoutModule } from '@angular/flex-layout';
import { FileUploadModule } from "./file-upload/file-upload.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FileUploadModule
  ],
  exports: [
    MaterialModule,
    FlexLayoutModule,
    FileUploadModule
  ]
})
export class SharedModule { }
