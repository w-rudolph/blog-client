import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpHandler,
  HttpResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, finalize } from 'rxjs/operators';

@Injectable()
export class HttpCustomInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let resCode = 0;
    // 调试用
    const key = 'accesstoken';
    const totken = localStorage.getItem('ACCESSTOKEN');
    const newReq = req.clone({ params: req.params.set(key, totken) });
    return next.handle(newReq).pipe(
      tap(
        (event: any) => {
          if (event instanceof HttpResponse) {
            resCode = event.body.code;
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            resCode = err.error.code;
          }
        }
      ),
      finalize(() => {
        // 未授权
        if (resCode === 401 && this.router.url.indexOf('/login') !== 0) {
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: this.router.url }
          });
        }
      })
    );
  }
}
