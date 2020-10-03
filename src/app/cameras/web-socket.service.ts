import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { WEB_SOCKET_URL } from "../shared/constants";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  socket:any
  constructor() {
    this.socket = io(WEB_SOCKET_URL)
  }

  listen(eventName:string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data)
      })
    })
  }

  emit(eventName:string, data:any) {
    this.socket.emit(eventName, data)
  }
}
