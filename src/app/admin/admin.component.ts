import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './../services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  userInfo: any = {};
  isCollapsed = false;
  theme = 'dark';

  triggerTemplate: TemplateRef<void> | null = null;
  @ViewChild('trigger') customTrigger: TemplateRef<void>;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.userService.getUserDetail();
    this.userService.detail$.subscribe(data => {
      this.userInfo = data;
    });
  }

  changeTrigger(): void {
    this.triggerTemplate = this.customTrigger;
  }

  toggleMenu() {
    this.isCollapsed = !this.isCollapsed;
  }

  onMenuChange(type: string, extra?: string) {
    switch (type) {
      case 'logout':
        this.userService.postLogout().subscribe(() => {
          localStorage.removeItem('ACCESSTOKEN');
          this.router.navigateByUrl('/login');
        });
        break;
      case 'change-theme':
        if (this.theme !== extra) {
          this.theme = extra;
        }
        break;
    }
  }
}
