import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatInput } from "@angular/material/input";
import { FileUploadComponent } from "../../shared/file-upload/file-upload.component";
import FileUploadUtil from '../../shared/file-upload/file-upload-util';
import { EmployeeService } from '../employee.service';
// import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
// import { tap, filter, map } from 'rxjs/operators';
// import { pipe } from 'rxjs';

// export function uploadProgress<T>( cb: ( progress: number ) => void ) {
//   return tap(( event/* : HttpEvent<T> */ ) => {
//     if ( event['type'] === HttpEventType.UploadProgress ) {
//       cb(Math.round((100 * event['loaded']) / event['total']));
//     }
//   });
// }

// export function toResponseBody<T>() {
//   return pipe(
//     filter(( event: HttpEvent<T> ) => event.type === HttpEventType.Response),
//     map(( res: HttpResponse<T> ) => res.body)
//   );
// }

@Component({
  selector: 'app-maintain-employees',
  templateUrl: './maintain-employees.component.html',
  styleUrls: ['./maintain-employees.component.scss']
})
export class MaintainEmployeesComponent implements OnInit {

  @Input() directOpen: boolean = true;

  @ViewChild('fileupload') fileupload: FileUploadComponent

  progress = 0

  empForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email,]),
    empdata: new FormControl(null, [Validators.required, requiredFileType('csv')])
  });

  success = false

  constructor(private service:EmployeeService/* , private util:FileUploadUtil */) { }

  ngOnInit(): void {
  }

  download() {
    this.service.downloadSampleCSV().subscribe((res) => {
      if (res) {
        console.log(res)
        //alert(res)
        const filename = "Emp.csv"
        if (navigator.msSaveBlob) { // IE 10+
          navigator.msSaveBlob(res, filename);
        }
        else {
          const a = document.createElement('a');
          //const blob = new Blob([csvArray], { type: 'text/csv' });
          const url = window.URL.createObjectURL(res);//(blob);

          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
        }

      }
      else {
        alert("Failed to download file..")
      }
    })
  }

  submit() {

    this.success = false;
    if ( !this.empForm.valid ) {
      markAllAsDirty(this.empForm);
      return;
    }

    this.service.uploadCSV(toFormData(this.empForm.value),{
      reportProgress: true,
      observe: 'events'
    }).pipe(
      FileUploadUtil.uploadProgress(progress => (this.progress = progress)),
      FileUploadUtil.toResponseBody()
    ).subscribe(res => {
      this.empForm.reset();
      this.progress = 0;
      this.success = true
    })
    /* .subscribe(event => {

      if ( event['type'] === HttpEventType.UploadProgress ) {
        this.progress = Math.round((100 * event['loaded']) / event['total']);
        console.log(this.progress)
      }

      if ( event['type'] === HttpEventType.Response ) {
        console.log(event['body']);
        this.empForm.reset();
        //this.fileupload.writeValue(null)
        //this.empForm.get('empdata').setValue(null)
        //resetAllControls(this.empForm)
        //console.log(this.empForm.get('empdata').value)
        this.success = true
        this.progress = 0
      }

    }) */;
  }

  // hasError(field: string, ...errors: string[]) {
  //   const control = this.empForm.get(field)
  //   let isError:boolean = false
  //   if (control)
  //   for(const error in errors) {
  //     isError = control.hasError(error)
  //     if (isError) break
  //   }
  //   return isError
  // }


  hasError(field: string, error: string) {
    const control = this.empForm.get(field)
    let isError:boolean = false
    //if (control)
    //for(const error in errors) {
      isError = control.dirty && control.hasError(error)
    //  if (isError) break
    //}
    return isError
  }


}

export function requiredFileType( type: string ) {
  return function (control: FormControl) {
    const file = control.value;
    if ( file ) {
      const extension = file.name.split('.')[1].toLowerCase();
      if ( type.toLowerCase() !== extension.toLowerCase() ) {
        return {
          requiredFileType: true
        };
      }

      return null;
    }

    return null;
  };
}

export function markAllAsDirty( form: FormGroup ) {
  for ( const control of Object.keys(form.controls) ) {
    form.controls[control].markAsDirty();
  }
}

export function resetAllControls( form: FormGroup ) {
  for ( const control of Object.keys(form.controls) ) {
    form.controls[control].reset();
  }
}

export function toFormData<T>( formValue: T ) {
  const formData = new FormData();

  for ( const key of Object.keys(formValue) ) {
    const value = formValue[key];
    formData.append(key, value);
  }

  return formData;
}
