import { CategoryService } from './../services/category.service';
import { UserService } from './../services/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.scss']
})
export class FrontComponent implements OnInit, OnDestroy {
  isSingleView = false;
  routerSub$: Subscription;
  catList = [];
  userInfo: any = {};

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private catService: CategoryService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.isSingleView = this.getPageType();
    this.routerSub$ = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isSingleView = this.getPageType();
      });
    this.catService.getCategorySimpleList().subscribe(ret => {
      this.catList = (ret.data as any[]).sort((a, b) => a.sort - b.sort);
    });
    this.userService.getUserInfo();
    this.userService.info$.subscribe(data => {
      this.userInfo = data || {};
    });
  }

  onSignOff() {
    this.userService.postLogout().subscribe(() => {
      localStorage.removeItem('ACCESSTOKEN');
      location.reload();
    });
  }

  getPageType() {
    const route = this.activeRoute.firstChild;
    if (!route) {
      return false;
    }
    const config = route.routeConfig;
    return config.data ? !!config.data.isSingle : false;
  }

  ngOnDestroy() {
    if (this.routerSub$) {
      this.routerSub$.unsubscribe();
    }
  }
}
