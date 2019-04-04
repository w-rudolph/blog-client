import { PostService } from './../../services/post.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  postList = [];
  constructor(private postService: PostService) {}

  ngOnInit() {
    this.postService.getPostSimpleList().subscribe((ret: any) => {
      this.postList = ret.data.rows;
    });
  }
}
