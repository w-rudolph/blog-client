import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { useUserApi } from '../utils/base-api';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  info$: BehaviorSubject<any>;
  detail$: BehaviorSubject<any>;
  constructor(private http$: HttpService) {
    this.info$ = new BehaviorSubject({});
    this.detail$ = new BehaviorSubject({});
  }

  getUserInfo() {
    return this.http$.get(useUserApi('info')).subscribe(ret => {
      this.info$.next(ret.data);
    });
  }

  getUserDetail() {
    this.http$.get(useUserApi('detail')).subscribe(ret => {
      this.detail$.next(ret.data);
    });
  }

  postLogin(params: { name: string; password: string }) {
    return this.http$.post(useUserApi('login'), params);
  }

  postRegister(params: {
    name: string;
    email: string;
    password: string;
    repassword: string;
  }) {
    return this.http$.post(useUserApi('register'), params);
  }

  postPasswordReset(params: { email: string; code: string; password: string }) {
    return this.http$.post(useUserApi('reset-password'), params);
  }

  postLogout() {
    return this.http$.post(useUserApi('logout'));
  }

  postSave(params: { email: string; sex: number }) {
    return this.http$.post(useUserApi('save'), params);
  }

  postUpdatePassword(params: {
    oldpassword: string;
    password: string;
    repassword: string;
  }) {
    return this.http$.post(useUserApi('update-password'), params);
  }
}
