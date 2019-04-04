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
    return next.handle(req).pipe(
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
        if (resCode === 401) {
          this.router.navigateByUrl('/login');
        }
      })
    );
  }
}
