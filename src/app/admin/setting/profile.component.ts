import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { finalize } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userDetail: any = {};
  isLoading = false;

  constructor(
    private userService: UserService,
    private $msg: NzMessageService
  ) {}

  ngOnInit() {
    this.userService.detail$.subscribe(data => {
      this.userDetail = data;
    });
  }

  getAccountStatus(status: number) {
    return ['未激活', '正常'][status];
  }

  saveProfile() {
    this.isLoading = true;
    this.userService
      .postSave({ email: this.userDetail.email, sex: this.userDetail.sex })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.userService.getUserDetail();
        this.$msg.success('保存成功！');
      });
  }
}
