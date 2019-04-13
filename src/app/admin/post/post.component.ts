import { NzMessageService } from 'ng-zorro-antd';
import { PostService } from './../../services/post.service';
import { Component, OnInit } from '@angular/core';

enum PostStatus {
  DRAFT = 0,
  PUBLISHED = 1,
  DELETED = -1
}

const PostStatusMap = {
  [PostStatus.DELETED]: '已删除',
  [PostStatus.DRAFT]: '草稿',
  [PostStatus.PUBLISHED]: '已发布'
};

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  postList: any[] = [];
  total = 0;
  postStatus = PostStatus;
  constructor(
    private postService: PostService,
    private $msg: NzMessageService
  ) { }
  ngOnInit() {
    this.getPostList();
  }

  showPublishBtn(status: number) {
    return status === PostStatus.DRAFT;
  }

  showDeleteBtn(status: number) {
    return status !== PostStatus.DELETED;
  }

  getPostList() {
    this.postService.getPostList().subscribe((ret: any) => {
      this.postList = ret.data.rows;
      this.total = ret.data.total;
    });
  }

  getPostStatusName(status: PostStatus) {
    return PostStatusMap[status];
  }

  onPublish(postId: number) {
    this.postService.publishPost(postId).subscribe(() => {
      this.getPostList();
      this.$msg.success('操作成功！');
    });
  }

  onDelete(postId: number) {
    this.postService.deletePost(postId).subscribe(() => {
      this.getPostList();
      this.$msg.success('操作成功！');
    });
  }
}
