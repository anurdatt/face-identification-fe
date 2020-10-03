import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

declare interface Department {
  id: number;
  name: string;
}

@Component({
  selector: 'app-maintain-cameras',
  templateUrl: './maintain-cameras.component.html',
  styleUrls: ['./maintain-cameras.component.scss']
})
export class MaintainCamerasComponent implements OnInit {
  @Input() directOpen: boolean = true;


  public registerForm: FormGroup;
  departments: Department[] = [
    {id: 0, name: "Select"},
    {id: 1, name: "Dept 1"},
    {id: 2, name: "Dept 2"}];

  constructor() { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      ipCam1: new FormControl(0, [Validators.min(1)]),
      ipCam2: new FormControl(0, [Validators.min(1)]),
    });
  }

}
