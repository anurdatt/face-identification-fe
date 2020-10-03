import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { MatSelectChange, MatSelect } from '@angular/material/select';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { ThemePalette } from '@angular/material/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CameraService } from 'src/app/cameras/camera.service';
const JSMpeg = require('jsmpeg-player');
import { RTSP_WS_URL } from "../../shared/constants";


declare interface Employee {
  id: number;
  name: string;
  deptId: number;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})
export class ProfileComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('stepper') stepper: MatStepper

  public registerForm: FormGroup
  public firstFormGroup: FormGroup;
  public secondFormGroup: FormGroup;
  public thirdFormGroup: FormGroup;
  public fourthFormGroup: FormGroup;
  public fifthFormGroup: FormGroup;
  public sixthFormGroup: FormGroup;

  selectedEmpId: number
  employees: Employee[] /* = [{
    "id": 0,
    "name": "Select",
    "deptId": 0
  }] */

  player:any = null;

  color: ThemePalette = 'primary';
  checked = false;
  disabled = true;

  stepsData:Array<{
    label:string,
    placeholderImage:string,
    imageData:string,
    booleanFieldLabel:string,
    booleanFieldValue:boolean,
    formGroup:FormGroup,
    prevButtonText:string|null,
    nextButtonText:string|null,
    buttons:string[]
  }>

  constructor(private empService:EmployeeService,
    private cameraService:CameraService,
    private _formBuilder: FormBuilder) { }


  ngOnInit(): void {

    this.loadEmployees()

    this.registerForm = new FormGroup({
      employee: new FormControl(0, [Validators.min(1)]),
      //ipCam2: new FormControl(0, [Validators.min(1)]),
    });

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: [false, Validators.requiredTrue]
    });

    // this.firstFormGroup = new FormGroup({
    //   firstCtrl: new FormControl(false, [Validators.requiredTrue]),
    //   //ipCam2: new FormControl(0, [Validators.min(1)]),
    // });

    this.secondFormGroup = this._formBuilder.group({
      firstCtrl: [false, Validators.requiredTrue]
    });
    this.thirdFormGroup = this._formBuilder.group({
      firstCtrl: [false, Validators.requiredTrue]
    });
    this.fourthFormGroup = this._formBuilder.group({
      firstCtrl: [false, Validators.requiredTrue]
    });
    this.fifthFormGroup = this._formBuilder.group({
      firstCtrl: [false, Validators.requiredTrue]
    });

    this.sixthFormGroup = this._formBuilder.group({
      firstCtrl: [false, Validators.requiredTrue]
    });

    this.stepsData = [
      {
        "label": "Front",
        "placeholderImage": "../../../assets/images/face_profiles_frontal.jpg",
        "imageData": "../../../assets/images/face_profiles_frontal.jpg",
        "booleanFieldLabel": "Snapshot OK?",
        "booleanFieldValue": this.checked,
        "formGroup": this.firstFormGroup,
        "prevButtonText": null,
        "nextButtonText": "Next",
        "buttons": []
      },
      {
        "label": "Left",
        "placeholderImage": "../../../assets/images/face_profiles_left.jpg",
        "imageData": "../../../assets/images/face_profiles_left.jpg",
        "booleanFieldLabel": "Snapshot OK?",
        "booleanFieldValue": this.checked,
        "formGroup": this.secondFormGroup,
        "prevButtonText": "Back",
        "nextButtonText": "Next",
        "buttons": []
      },
      {
        "label": "Right",
        "placeholderImage": "../../../assets/images/face_profiles_right.jpg",
        "imageData": "../../../assets/images/face_profiles_right.jpg",
        "booleanFieldLabel": "Snapshot OK?",
        "booleanFieldValue": this.checked,
        "formGroup": this.thirdFormGroup,
        "prevButtonText": "Back",
        "nextButtonText": "Next",
        "buttons": []
      },
      {
        "label": "Top",
        "placeholderImage": "../../../assets/images/face_profiles_top.jpg",
        "imageData": "../../../assets/images/face_profiles_top.jpg",
        "booleanFieldLabel": "Snapshot OK?",
        "booleanFieldValue": this.checked,
        "formGroup": this.fourthFormGroup,
        "prevButtonText": "Back",
        "nextButtonText": "Next",
        "buttons": []
      },
      {
        "label": "Bottom",
        "placeholderImage": "../../../assets/images/face_profiles_bottom.jpg",
        "imageData": "../../../assets/images/face_profiles_bottom.jpg",
        "booleanFieldLabel": "Snapshot OK?",
        "booleanFieldValue": this.checked,
        "formGroup": this.fifthFormGroup,
        "prevButtonText": "Back",
        "nextButtonText": "Next",
        "buttons": []
      },
      {
        "label": "Done",
        "placeholderImage": "https://via.placeholder.com/640x360",
        "imageData": "https://via.placeholder.com/640x360",
        "booleanFieldLabel": "Ready to Proceed?",
        "booleanFieldValue": this.checked,
        "formGroup": this.sixthFormGroup,
        "prevButtonText": "Back",
        "nextButtonText": "Reset",
        "buttons": []
      },
    ]


    console.log('Starting RTSP streaming..')

    this.cameraService.executeCommand('start_rtsp').subscribe(() => {
      console.log('Came back from camera start RTSP service..')

      var canvas = document.getElementById('inputRTSP')
      this.player = new JSMpeg.Player(RTSP_WS_URL,
      {
        canvas: canvas,
        disableGl: true,
        onPlay: function (player): void {
          console.log('Inside onPlay()')
          //console.log(JSON.stringify(player, null, '  '))
          //playRTSP(player)
        },
      });
    })

  }

  ngAfterViewInit(): void {

  }


  ngOnDestroy(): void {
    if (this.player) {
      this.cameraService.executeCommand('stop_rtsp').subscribe(() => {
      console.log('Came back from camera stop RTSP service..')
      })

      this.player.destroy()
      this.player = null
    }

  }

  loadEmployees() {
    $('#wait').show()
    this.empService.getAllEmployees().subscribe((response:any) => {
      //console.log('response = ', response)
      //this.employees.push(response)
      this.employees = response
      console.log(JSON.stringify(this.employees))
      $('#wait').hide()
    },
    (error:any) => {
      $('#wait').hide()
      alert(error)
      console.error(error)
    })
  }

  takeSnapshot() {
    const selectedIndex = this.stepper.selectedIndex
    if (this.stepsData[selectedIndex].label === 'Done') {
      console.log('Taking snapshot not applicable at this step..')
      alert('Taking snapshot not applicable at this step..')
      return
    }
    console.log('Taking snapshot..')


    this.cameraService.takeSnapshot('').subscribe((res) => {

      // let reader = new FileReader();
      // reader.addEventListener("load", () => {
      //     this.imageToShow = reader.result;
      // }, false);

      // if (image) {
      //     reader.readAsDataURL(image);
      // }

      if (res && res.hasOwnProperty('image')) {
        let snapShotOk = false
        if(res.hasOwnProperty('detected')) {
          snapShotOk = res['detected']
        }
        this.stepsData[selectedIndex].formGroup.controls['firstCtrl'].setValue(snapShotOk)
        this.stepsData[selectedIndex].imageData = `data:image/jpeg;base64,${res['image']}`
        this.stepper.next()

      }
      else {
        console.error('Error: Invalid Snapshot object received')
        alert('Invalid Snapshot object received')
      }
    })
  }

  submitProfile() {
    console.log('Submitting profile..')
    let data = []
    for (let i=0; i<this.stepsData.length -1; i++) {
      if (this.stepsData[i].formGroup.controls['firstCtrl'].value) {
        let imgStr = this.stepsData[i].imageData.substr(23)
        data.push(imgStr)
      }
    }
    if (data.length == 0) {
      alert('No image to send for profiling!')
      return;
    }
    this.empService.updateProfile(this.selectedEmpId,data).subscribe(()=> {
      console.log('Came back from updateProfile service..')
      alert('Profile Updated for the specified employee')
      for (let i=0; i<this.stepsData.length -1; i++) {
        this.stepsData[i].imageData = this.stepsData[i].placeholderImage
      }
      this.stepper.reset()

      this.loadEmployees()
    },
    (error) => {
      console.error('Error in updateProfile service, ', error )
    })

  }

  onSelectionChange($event) {
    const matSelectChange: MatSelectChange = $event;
    this.selectedEmpId = matSelectChange.value;
    console.log('Select Emp Id = ', this.selectedEmpId)
  }

}
