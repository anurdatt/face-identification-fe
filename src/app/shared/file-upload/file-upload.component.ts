import { Component, OnInit, Input, HostListener, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileUploadComponent,
      multi: true
    }
  ]
})
export class FileUploadComponent implements ControlValueAccessor {
  @Input() progress
  onChange: Function
  file: File | null = null

  @HostListener('change', ['$event.target.files']) emitFiles( event: FileList ) {
    //console.log('Here in @HostListener("change")')
    const file = event && event.item(0)
    this.onChange(file)
    this.file = file
  }

  constructor( private host: ElementRef<HTMLInputElement>) { }

  writeValue(value: null): void {
    // clear file input
    //console.log('Here in writeValue null')
    this.host.nativeElement.value = ''
    this.file = null

    var x = document.getElementsByClassName("file-input");
    for (let i = 0; i < x.length; i++) {
      (x[i] as HTMLInputElement).value = null;
    }
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn
  }
  registerOnTouched(fn: any): void {
    //throw new Error("Method not implemented.");
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error("Method not implemented.");
  }

}
