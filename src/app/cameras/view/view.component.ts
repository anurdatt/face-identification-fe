import { Component, OnInit, OnDestroy, Input } from '@angular/core';
//import * as io from "socket.io-client";
import { WebSocketService } from '../web-socket.service';
import { Subscription } from 'rxjs';
import { CameraService } from '../camera.service';
import * as faceapi from 'face-api.js'
const JSMpeg = require('jsmpeg-player');
import { RTSP_WS_URL } from "../../shared/constants";
//import { MtcnnOptions } from 'face-api.js';
//import { async } from '@angular/core/testing';

class Queue<T>  {
  static MAX_ENTRIES = 10
  constructor(private data: Array<T> = new Array(),
    private numEntries: number = 0) {
  }

  insert(entry:T):void {
    if (this.numEntries >= Queue.MAX_ENTRIES) {
      this.remove()
    }
    this.data.push(entry)
    this.numEntries++
  }

  remove():T {
    this.numEntries--
    return this.data.shift()
  }

  findOccurence(key:string, value:string):number {
    return this.data.map(el => el[key]).reduce((total, cur) => {
      if(cur === value) return total + 1
      else return total
    }, 0)
  }

  findOccurenceOfLabelWithAvgDist(keyLabel:string, valueLabel:string, keyDist:string, valueDist:number):
    {occurence: number, avgDist: number} {
      return this.data.reduce((total, cur) => {
        if(cur[keyLabel] === valueLabel)
          return {
                  occurence: total.occurence + 1,
                  avgDist: (cur[keyDist] + total.avgDist*total.occurence) / (total.occurence + 1)
                 }
        else return total
      }, {occurence: 0, avgDist: valueDist} )
    }
}

//instantiate a Queue object for holding the matches
var matchQueue: Queue<faceapi.FaceMatch> = new Queue<faceapi.FaceMatch>()

var labeledFDs: faceapi.LabeledFaceDescriptors[] = null

async function getLabeledFaceDescriptors(): Promise<faceapi.LabeledFaceDescriptors[]> {

  const labels = ['Mithai', 'Kaushik', 'Kaushik-Masked', 'Arnab', 'Suparna', 'Tatai', 'Tatai-Masked'] // 'raj', 'leonard', 'howard']

  const labeledFaceDescriptors = await Promise.all(
    labels.map(async label => {
      // fetch image data from urls and convert blob to HTMLImage element
      const imgUrl = `assets/ref_images/${label}.jpg`
      const img = await faceapi.fetchImage(imgUrl)

      // detect the face with the highest score in the image and compute it's landmarks and face descriptor
      const fullFaceDescription = await faceapi.detectSingleFace(img)  //SSD
      //const fullFaceDescription = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions({ inputSize: 512}))
      .withFaceLandmarks()
      .withFaceDescriptor()

      if (!fullFaceDescription) {
        throw new Error(`no faces detected for ${label}`)
      }

      const faceDescriptors = [fullFaceDescription.descriptor]
      return new faceapi.LabeledFaceDescriptors(label, faceDescriptors)
    })
  )

  return labeledFaceDescriptors
}

async function play(videoEl) {
  // run face detection & recognition
  // ...

  const mtcnnForwardParams = {
  // number of scaled versions of the input image passed through the CNN
  // of the first stage, lower numbers will result in lower inference time,
  // but will also be less accurate
  maxNumScales: 10,
  // scale factor used to calculate the scale steps of the image
  // pyramid used in stage 1
  scaleFactor: 0.709,
  // the score threshold values used to filter the bounding
  // boxes of stage 1, 2 and 3
  scoreThresholds: [0.6, 0.7, 0.7],
  // mininum face size to expect, the higher the faster processing will be,
  // but smaller faces won't be detected
    // limiting the search space to larger faces for webcam detection
    minFaceSize: 200
  }

  // ssd_mobilenetv1 options
  let minConfidence = 0.5

  // tiny_face_detector options
  let inputSize = 224
  let scoreThreshold = 0.5

  //const mtcnnResults = await faceapi.mtcnn(document.getElementById('inputVideo') as HTMLVideoElement, mtcnnForwardParams as MtcnnOptions)
  //faceapi.draw.drawDetections('overlay',mtcnnResults.map(res=>res.faceDetection))
  //faceapi.draw.drawDetections('overlay',mtcnnResults.map(res=>res.faceLandmarks))

  //const options = new faceapi.MtcnnOptions(mtcnnForwardParams)
  const options = new faceapi.SsdMobilenetv1Options({ minConfidence })
  //const options = new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
  const input = document.getElementById('inputVideo') as HTMLVideoElement
  const fullFaceDescriptions = await faceapi.detectAllFaces(input, options)
  .withFaceLandmarks()
  .withFaceDescriptors()

  const canvas = document.getElementById('overlay') as HTMLCanvasElement
  const dims = faceapi.matchDimensions(canvas, input, true)


  if (fullFaceDescriptions && fullFaceDescriptions.length > 0) {
    const resizedResult = faceapi.resizeResults(fullFaceDescriptions, dims)
    faceapi.draw.drawDetections(canvas, resizedResult)
    //faceapi.draw.drawFaceLandmarks(canvas, resizedResult)

    //console.log(JSON.stringify(labeledFD))

    // 0.6 is a good distance threshold value to judge
    // whether the descriptors match or not
            const maxDescriptorDistance = 0.6
            const minDescriptorDistance = 0.3
            const fraction = (maxDescriptorDistance - minDescriptorDistance) / Queue.MAX_ENTRIES
            const faceMatcher = new faceapi.FaceMatcher(labeledFDs, maxDescriptorDistance)
            fullFaceDescriptions.map(fd => faceMatcher.findBestMatch(fd.descriptor))
            .forEach((bestMatch, i) => {

            const {occurence, avgDist} = matchQueue.findOccurenceOfLabelWithAvgDist('label',
            bestMatch.label, 'distance', maxDescriptorDistance)

            console.log(`occurence = ${occurence}, avgDist = ${avgDist},
            label = ${bestMatch.label}, score = ${bestMatch.distance}`)
            const margin:number = (((maxDescriptorDistance - avgDist)
                                  /(maxDescriptorDistance - minDescriptorDistance))
                                  * Queue.MAX_ENTRIES + occurence) / 2

            const box = fullFaceDescriptions[i].detection.box
            var label
            if (bestMatch.distance <= (minDescriptorDistance + margin*fraction)) {

                label = bestMatch.toString()


                //matchQueue.insert(bestMatch)
            }
            else {

              label = "unknown"

            }

            const drawBox = new faceapi.draw.DrawBox(box, { label })
            drawBox.draw(canvas)
            matchQueue.insert(bestMatch)

            })
  }



  //console.log('I am playing..')
  setTimeout(() => play(videoEl), 100)
}


async function playRTSP(player) {
  // run face detection & recognition
  // ...

  const mtcnnForwardParams = {
  // number of scaled versions of the input image passed through the CNN
  // of the first stage, lower numbers will result in lower inference time,
  // but will also be less accurate
  maxNumScales: 10,
  // scale factor used to calculate the scale steps of the image
  // pyramid used in stage 1
  scaleFactor: 0.709,
  // the score threshold values used to filter the bounding
  // boxes of stage 1, 2 and 3
  scoreThresholds: [0.6, 0.7, 0.7],
  // mininum face size to expect, the higher the faster processing will be,
  // but smaller faces won't be detected
    // limiting the search space to larger faces for webcam detection
    minFaceSize: 200
  }

  // ssd_mobilenetv1 options
  let minConfidence = 0.5

  // tiny_face_detector options
  let inputSize = 224
  let scoreThreshold = 0.5

  //const mtcnnResults = await faceapi.mtcnn(document.getElementById('inputVideo') as HTMLVideoElement, mtcnnForwardParams as MtcnnOptions)
  //faceapi.draw.drawDetections('overlay',mtcnnResults.map(res=>res.faceDetection))
  //faceapi.draw.drawDetections('overlay',mtcnnResults.map(res=>res.faceLandmarks))

  //const options = new faceapi.MtcnnOptions(mtcnnForwardParams)
  const options = new faceapi.SsdMobilenetv1Options({ minConfidence })
  //const options = new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
  const input = document.getElementById('inputRTSP') as HTMLCanvasElement
  if (input == null || input == undefined) {
    console.log('RTSP canvas element not found, returning from playRTSP()')
    return;
  }
  else if (input.classList.contains('cleared')) {
    console.log('RTSP canvas cleared, returning from playRTSP()')
    return;
  }
  const fullFaceDescriptions = await faceapi.detectAllFaces(input, options)
  .withFaceLandmarks()
  .withFaceDescriptors()

  const canvas = document.getElementById('overlayRTSP') as HTMLCanvasElement
  const dims = faceapi.matchDimensions(canvas, input, true)


  if (fullFaceDescriptions && fullFaceDescriptions.length > 0) {
    const resizedResult = faceapi.resizeResults(fullFaceDescriptions, dims)
    faceapi.draw.drawDetections(canvas, resizedResult)
    //faceapi.draw.drawFaceLandmarks(canvas, resizedResult)

    //console.log(JSON.stringify(labeledFD))

    // 0.6 is a good distance threshold value to judge
    // whether the descriptors match or not
            const maxDescriptorDistance = 0.6
            const minDescriptorDistance = 0.3
            const fraction = (maxDescriptorDistance - minDescriptorDistance) / Queue.MAX_ENTRIES
            const faceMatcher = new faceapi.FaceMatcher(labeledFDs, maxDescriptorDistance)
            fullFaceDescriptions.map(fd => faceMatcher.findBestMatch(fd.descriptor))
            .forEach((bestMatch, i) => {

            const {occurence, avgDist} = matchQueue.findOccurenceOfLabelWithAvgDist('label',
            bestMatch.label, 'distance', maxDescriptorDistance)

            console.log(`occurence = ${occurence}, avgDist = ${avgDist},
            label = ${bestMatch.label}, score = ${bestMatch.distance}`)
            const margin:number = (((maxDescriptorDistance - avgDist)
                                  /(maxDescriptorDistance - minDescriptorDistance))
                                  * Queue.MAX_ENTRIES + occurence) / 2

            const box = fullFaceDescriptions[i].detection.box
            var label
            if (bestMatch.distance <= (minDescriptorDistance + margin*fraction)) {

                label = bestMatch.toString()


                //matchQueue.insert(bestMatch)
            }
            else {

              label = "unknown"

            }

            const drawBox = new faceapi.draw.DrawBox(box, { label })
            drawBox.draw(canvas)
            matchQueue.insert(bestMatch)

            })
  }



  //console.log('I am playing..')
  setTimeout(() => playRTSP(player), 100)
}




@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit, OnDestroy {

  @Input() directOpen: boolean = true;

  count = 0
  //socket:any;
  wssSubscription: Subscription = null;
  //csSubscription: Subscription;

  player:any = null;

  async fetchLabeledFaceDescriptors(): Promise<faceapi.LabeledFaceDescriptors[]> {
    const respJson:any = await this.cameraService.fetchLabeledFDs(true).toPromise()
    console.log(JSON.stringify(respJson))
    return respJson.map((lfd: { label: string, descriptors:[] }) => {
      let fds:Float32Array[] = []
      for (let i=0; i<lfd.descriptors.length; i++) {
        fds.push(new Float32Array(lfd.descriptors[i]))
      }
      //console.log('fds = '+ JSON.stringify(fds))
      return new faceapi.LabeledFaceDescriptors(lfd.label, fds)
    })
  }

  async run() {
    $('#wait').show();

    // load the models

    //await faceapi.loadMtcnnModel('../../../assets/models/')
    await faceapi.loadFaceRecognitionModel('../../../assets/models/');
    await faceapi.nets.faceLandmark68Net.load('../../../assets/models/')
    await faceapi.nets.ssdMobilenetv1.load('../../../assets/models/')
    //await faceapi.nets.faceLandmark68TinyNet.load('../../../assets/models/')
    await faceapi.nets.tinyFaceDetector.load('../../../assets/models/')

    //Load reference images and label FDs
    //labeledFDs = await getLabeledFaceDescriptors()
    labeledFDs = await this.fetchLabeledFaceDescriptors()
    $('#wait').hide();

  }

  constructor(private webSocketService: WebSocketService, private cameraService: CameraService) { }

  ngOnInit() {
    if (!labeledFDs)
    this.run()
  }

  ngOnDestroy(): void {
    // this.socket.disconnect()
    // this.socket.close();
    // //io.close();
    // this.socket = null;

    if (this.wssSubscription)
    this.wssSubscription.unsubscribe()
  }

  public onPlay(videoEl): void {
    console.log('Inside onPlay()')
    if ( labeledFDs != null ) {
      play(videoEl)
    }
  }

  startStreaming() {
    console.log('Starting streaming..')

    this.cameraService.executeCommand('start').subscribe(() => {

      console.log('Came back from camera start BE service..')
      this.count = 0
      if (!this.wssSubscription || this.wssSubscription.closed) {
        // this.socket = io.connect('http://localhost:3000')
        const imageElm = document.getElementById('image') as HTMLImageElement
        // this.socket.on('image', (image) => {
        //   imageElm.src = `data:image/jpeg;base64,${image}`
        //   console.log(count++)
        // })
        this.wssSubscription = this.webSocketService.listen('image').subscribe((image) => {
          imageElm.src = `data:image/jpeg;base64,${image}`
          console.log(this.count++)
        })

      }


    })
  }

  stopStreaming() {
    console.log('Stopping streaming..')
    this.cameraService.executeCommand('stop').subscribe(() => {
      console.log('Came back from camera stop BE service..')
      if (this.wssSubscription && !this.wssSubscription.closed)
        this.wssSubscription.unsubscribe()
    })
  }

  startOnvifStreaming() {
    console.log('Starting Onvif streaming..')

    this.cameraService.executeCommand('start_onvif').subscribe(() => {

      console.log('Came back from camera start_onvif BE service..')
      this.count = 0
      if (!this.wssSubscription || this.wssSubscription.closed) {
        // this.socket = io.connect('http://localhost:3000')
        const imageElm = document.getElementById('onvifImage') as HTMLImageElement
        // this.socket.on('image', (image) => {
        //   imageElm.src = `data:image/jpeg;base64,${image}`
        //   console.log(count++)
        // })
        this.wssSubscription = this.webSocketService.listen('image_onvif').subscribe((image) => {
          imageElm.src = `data:image/jpeg;base64,${image}`
          console.log(this.count++)
        })

      }


    })
  }

  stopOnvifStreaming() {
    console.log('Stopping Onvif streaming..')
    this.cameraService.executeCommand('stop_onvif').subscribe(() => {
      console.log('Came back from camera stop_onvif BE service..')
      if (this.wssSubscription && !this.wssSubscription.closed)
        this.wssSubscription.unsubscribe()
    })
  }


  startCam() {
    // try to access users webcam and stream the images
    // to the video element
    const videoEl = document.getElementById('inputVideo') as HTMLVideoElement
    navigator.getUserMedia (
      { video: {} },
      stream => {
        //if ('srcObject' in videoEl) {
        //  console.log('srcObject')
          videoEl.srcObject = stream
        // }
        // else {
        //   console.log('src')
        //   videoEl.src = URL.createObjectURL(stream)
        // }

      },
      err => console.error(err)
    )
  }

  stopCam() {
    const videoEl = document.getElementById('inputVideo') as HTMLVideoElement
    const stream = videoEl.srcObject as MediaStream;
    const tracks = stream.getTracks();

    tracks.forEach(function(track) {
      track.stop();
    });

    videoEl.srcObject = null;
  }

  startRTSP() {
    console.log('Starting RTSP streaming..')

    this.cameraService.executeCommand('start_rtsp').subscribe(() => {
      console.log('Came back from camera start RTSP service..')
      if (this.player) {
        this.player.stop()
        this.player.play()
        return
      }
      var canvas = document.getElementById('inputRTSP')
      canvas.classList.remove('cleared')
      this.player = new JSMpeg.Player(RTSP_WS_URL,
      {
        canvas: canvas,
        disableGl: true,
        onPlay: function (player): void {
          console.log('Inside onPlay()')
          //console.log(JSON.stringify(player, null, '  '))
          if ( labeledFDs != null ) {
            playRTSP(player)
          }
        },
      });
    })

  }

  stopRTSP() {
    console.log('Stopping RTSP streaming..')
    this.cameraService.executeCommand('stop_rtsp').subscribe(() => {
      console.log('Came back from camera stop RTSP service..')
      this.player.destroy()
      this.player = null

      const canvasEl = document.getElementById('inputRTSP') as HTMLCanvasElement
      var context = canvasEl.getContext('2d')
      context.clearRect(0, 0, canvasEl.width, canvasEl.height)

      $(canvasEl).addClass('cleared')
    })
  }

}
