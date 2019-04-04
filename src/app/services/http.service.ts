import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { createFormData } from '../utils/util';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private client: HttpClient, private $msg: NzMessageService) {}

  get(
    url: string,
    params: any = {},
    { showError = true, withCredentials = true } = {}
  ) {
    const req$ = this.client.get(url, { params, withCredentials });
    return this.handleResponse(req$, showError);
  }

  post(
    url: string,
    params: any = {},
    { showError = true, withCredentials = true } = {}
  ) {
    const data = params instanceof FormData ? params : createFormData(params);
    const req$ = this.client.post(url, data, { withCredentials });
    return this.handleResponse(req$, showError);
  }

  private handleResponse(
    req$: Observable<any>,
    showError: boolean
  ): Observable<any> {
    return req$.pipe(
      tap((ret: any) => {
        if (ret.code !== 0 && showError) {
          throw ret;
        }
      }),
      catchError(err => {
        if (showError) {
          let errMsg = '';
          if (err instanceof HttpErrorResponse) {
            errMsg = err.error.message;
          } else {
            errMsg = err.message;
          }
          this.$msg.error(errMsg);
        }
        throw err;
      })
    );
  }
}
