import { Component, OnDestroy, AfterViewInit, Input } from '@angular/core';

@Component({
  selector: 'app-page-title',
  template: ''
})
export class PageTitleComponent implements AfterViewInit, OnDestroy {
  tempTitle: string;
  // tslint:disable-next-line:variable-name
  _title: string;
  @Input()
  set title(val) {
    if (val) {
      document.title = val;
    }
    this._title = val;
  }
  get title() {
    return this._title;
  }

  ngAfterViewInit() {
    this.tempTitle = document.title;
  }

  ngOnDestroy() {
    document.title = this.tempTitle;
  }
}
