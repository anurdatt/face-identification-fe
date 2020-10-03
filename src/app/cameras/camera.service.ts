import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CAMERA_API_URL } from "../shared/constants";

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor(private http:HttpClient) {

  }

  executeCommand(command: string) {
    return this.http.get(`${CAMERA_API_URL}/?command=${command}`)
  }

  takeSnapshot(resoluton:string) {
    return this.http.get(`${CAMERA_API_URL}/onvif/take_snapshot?reso=${resoluton}`,
    { responseType: 'json' })
  }

  fetchLabeledFDs(fromMemory:boolean) {
    return this.http.get(`${CAMERA_API_URL}/face/fetch_labeled_fds?memory=${fromMemory}`,
    { responseType: 'json' })
  }
}
