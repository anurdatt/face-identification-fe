import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { pipe } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

export default class FileUploadUtil {

  static uploadProgress<T>( cb: ( progress: number ) => void ) {
    return tap(( event/* : HttpEvent<T> */ ) => {
      if ( event['type'] === HttpEventType.UploadProgress ) {
        cb(Math.round((100 * event['loaded']) / event['total']));
      }
    });
  }

  static toResponseBody<T>() {
    return pipe(
      filter(( event: HttpEvent<T> ) => event.type === HttpEventType.Response),
      map(( res: HttpResponse<T> ) => res.body)
    );
  }


}
