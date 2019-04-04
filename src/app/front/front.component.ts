import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UserService } from './../services/user.service';
@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.scss']
})
export class FrontComponent implements OnInit, OnDestroy {

  isSingleView = false;
  routerSub$: Subscription;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.isSingleView = this.getPageType();
    this.routerSub$ = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isSingleView = this.getPageType();
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
    this.routerSub$.unsubscribe();
  }
}
