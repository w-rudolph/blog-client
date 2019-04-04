import { finalize, takeWhile } from 'rxjs/operators';
import { timer, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from './../../services/user.service';
import { md5 } from '../../utils/md5';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  validateForm: FormGroup;
  sub$: Subscription;
  isLoading = false;
  lockBtn = false;
  restTime = '';
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private $msg: NzMessageService
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      email: [name, [Validators.required, Validators.email]],
      code: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  submitForm(): void {
    const formKeys = Object.keys(this.validateForm.controls);
    formKeys.forEach(key => {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    });
    const { email, code, password } = this.validateForm.value;
    if (this.validateForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.userService
      .postPasswordReset({
        email,
        code,
        password: md5(password)
      })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((ret: any) => {
        this.router.navigateByUrl('/login', { replaceUrl: true });
      });
  }

  onGetVerifyCode() {
    const emailCtr = this.validateForm.get('email');
    emailCtr.markAsDirty();
    emailCtr.updateValueAndValidity();
    if (emailCtr.invalid) {
      return;
    }
    this.lockBtn = true;
    this.sub$ = timer(0, 1000)
      .pipe(takeWhile(t => t <= 60))
      .subscribe(t => {
        this.restTime = 60 - t + ' S';
        if (t === 60) {
          this.lockBtn = false;
        }
      });
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }
}
