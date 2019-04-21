import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { NzMessageService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { md5 } from '../../utils/md5';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {
  formData: any = { oldpassword: '', password: '', repassworld: '' };
  validateForm: FormGroup;
  isLoading = false;
  constructor(
    private userService: UserService,
    private $msg: NzMessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      oldpassword: [null, [Validators.required]],
      password: [null, [Validators.required]],
      repassword: [null, [Validators.required]]
    });
  }

  submitForm() {
    const formKeys = Object.keys(this.validateForm.controls);
    formKeys.forEach(key => {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    });
    if (this.validateForm.invalid) {
      return;
    }
    const { oldpassword, password, repassword } = this.validateForm.value;
    const params = {
      oldpassword: md5(oldpassword),
      password: md5(password),
      repassword: md5(repassword)
    };
    this.isLoading = true;
    this.userService
      .postUpdatePassword(params)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.$msg.success('操作成功！');
      });
  }
}
