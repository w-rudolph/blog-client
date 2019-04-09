import { ActivatedRoute } from '@angular/router';
import { PostService } from './../../services/post.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Unsubscribable } from 'rxjs';
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {
  postList = [];
  sub$: Unsubscribable;
  constructor(
    private postService: PostService,
    private activeRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.sub$ = this.activeRoute.params.subscribe((params: any) => {
      this.getCategoryList(params.id);
    });
  }

  getCategoryList(catId: number) {
    this.postService.getPostSimpleList(catId).subscribe((ret: any) => {
      this.postList = ret.data.rows;
    });
  }

  ngOnDestroy() {
    this.sub$.unsubscribe();
  }
}
