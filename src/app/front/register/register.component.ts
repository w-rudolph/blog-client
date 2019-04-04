import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserService } from './../../services/user.service';
import { md5 } from '../../utils/md5';
import { NzMessageService } from 'ng-zorro-antd';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private validateForm: FormGroup;
  private isLoading = false;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private $msg: NzMessageService
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      repassword: [null, [Validators.required]]
    });
  }

  submitForm(): void {
    const formKeys = Object.keys(this.validateForm.controls);
    formKeys.forEach(key => {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    });
    if (this.validateForm.invalid) {
      return;
    }
    const { userName, email, password, repassword } = this.validateForm.value;
    this.isLoading = true;
    this.userService
      .postRegister({
        name: userName,
        email,
        password: md5(password),
        repassword: md5(repassword)
      })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.router.navigateByUrl('/login', { replaceUrl: true });
      });
  }
}
