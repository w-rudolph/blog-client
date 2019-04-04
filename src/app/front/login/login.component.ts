import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserService } from './../../services/user.service';
import { md5 } from '../../utils/md5';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  isLoading = false;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private $msg: NzMessageService
  ) {}

  ngOnInit() {
    const remember = Boolean(localStorage.getItem('LOGIN_REMEMBER'));
    const name = remember ? localStorage.getItem('LOGIN_REMEMBER_VALUE') : null;
    this.validateForm = this.fb.group({
      userName: [name, [Validators.required]],
      password: [null, [Validators.required]],
      remember
    });
  }

  submitForm(): void {
    const formKeys = Object.keys(this.validateForm.controls);
    formKeys.forEach(key => {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    });
    const { userName, password, remember } = this.validateForm.value;
    if (remember) {
      localStorage.setItem('LOGIN_REMEMBER', remember);
      localStorage.setItem('LOGIN_REMEMBER_VALUE', userName);
    } else {
      localStorage.removeItem('LOGIN_REMEMBER');
      localStorage.removeItem('LOGIN_REMEMBER_VALUE');
    }
    if (this.validateForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.userService
      .postLogin({
        name: userName,
        password: md5(password)
      })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.router.navigateByUrl('/admin', { replaceUrl: true });
      });
  }
}
