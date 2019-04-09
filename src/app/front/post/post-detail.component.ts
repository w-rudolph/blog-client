import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PostService } from './../../services/post.service';
@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {
  postDetail: any = {
    preview: ''
  };
  constructor(
    private postService: PostService,
    private router: ActivatedRoute
  ) { }

  ngOnInit() {
    this.router.params.subscribe(param => {
      this.getPostDetail(param.id);
    });
  }

  getPostDetail(postId: number) {
    if (!postId) {
      return;
    }
    this.postService.getPostDetail(postId).subscribe((ret: any) => {
      this.postDetail = ret.data;
    });
  }
}
