import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload.component';
//import { FileUploadUtil } from "./file-upload-util";


@NgModule({
  declarations: [FileUploadComponent],// FileUploadUtil],
  imports: [
    CommonModule
  ],
  exports: [
    FileUploadComponent,
    //FileUploadUtil
  ]
})
export class FileUploadModule { }
