import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { createFormData } from '../utils/util';
import { Observable, empty } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

let retried = 0;
let msgStart = Date.now();
export interface ExtraParams {
  // 请求失败，重试次数
  retry?: number;
  // 是否提示错误信息
  showErrMsg?: boolean;
  // 是否捕获错误，不抛出
  slientError?: boolean;
  // 是否携带cookie凭证
  withCredentials?: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private client: HttpClient, private $msg: NzMessageService) {}

  defaultExtraParams: ExtraParams = {
    retry: 0,
    showErrMsg: true,
    slientError: true,
    withCredentials: true
  };

  get(url: string, params: any = {}, extraParams = this.defaultExtraParams) {
    const req$ = this.client.get(url, {
      params,
      withCredentials: extraParams.withCredentials
    });
    return this.handleResponse(req$, extraParams);
  }

  post(url: string, params: any = {}, extraParams = this.defaultExtraParams) {
    const data = params instanceof FormData ? params : createFormData(params);
    const req$ = this.client.post(url, data, {
      withCredentials: extraParams.withCredentials
    });
    return this.handleResponse(req$, extraParams);
  }

  private handleResponse(
    req$: Observable<any>,
    extraParams: ExtraParams
  ): Observable<any> {
    const { retry, showErrMsg, slientError } = extraParams;
    return req$.pipe(
      tap((ret: any) => {
        if (ret.code !== 0) {
          throw ret;
        }
      }),
      catchError((err, caught$) => {
        if (showErrMsg) {
          let errMsg = '';
          if (err instanceof HttpErrorResponse) {
            errMsg = err.error.message || '请求失败！';
          } else {
            errMsg = err.message;
          }
          // 500ms内只提示一次
          const time = Date.now();
          if (time - msgStart >= 500) {
            msgStart = time;
            this.$msg.error(errMsg);
          }
        }
        // 重试机制
        if (retry > 0 && retried < retry) {
          retried++;
          return caught$;
        }
        if (retried > 0) {
          retried = 0;
        }
        if (slientError) {
          return empty();
        }
        throw err;
      })
    );
  }
}
