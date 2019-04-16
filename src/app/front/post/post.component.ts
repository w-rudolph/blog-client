import { ActivatedRoute } from '@angular/router';
import { PostService } from './../../services/post.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Unsubscribable } from 'rxjs';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {
  postList = [];
  sub$: Unsubscribable;
  pageTotal = 0;
  pageIndex = 1;
  pageSize = 20;
  categoryId = null;
  isLoading = true;
  constructor(
    private postService: PostService,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.sub$ = this.activeRoute.params.subscribe((params: any) => {
      this.categoryId = params.id;
      this.getPostList({ catId: params.id });
    });
  }

  getPostList(params: { catId?: number; limit?: number; offset?: number }) {
    this.isLoading = true;
    this.postService
      .getPostSimpleList(params)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((ret: any) => {
        this.postList = ret.data.rows;
        this.pageTotal = ret.data.total;
      });
  }

  onPageChange() {
    this.getPostList({
      catId: this.categoryId,
      limit: this.pageSize,
      offset: (this.pageIndex - 1) * this.pageSize
    });
  }

  ngOnDestroy() {
    this.sub$.unsubscribe();
  }
}
