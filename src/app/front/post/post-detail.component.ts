import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from './../../services/post.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit, OnDestroy {
  postDetail: any = {
    preview: ''
  };
  sub$: Subscription;
  constructor(
    private postService: PostService,
    private router: ActivatedRoute
  ) {}

  ngOnInit() {
    this.sub$ = this.router.params.subscribe(param => {
      this.getPostDetail(param.id);
    });
  }

  ngOnDestroy() {
    this.sub$.unsubscribe();
  }

  getPostDetail(postId: number) {
    if (!postId) {
      return;
    }
    this.postService.getPostSimpleDetail(postId).subscribe((ret: any) => {
      this.postDetail = ret.data;
    });
  }
}
