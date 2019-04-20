import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentService } from '../../services/comment.service';
import { finalize } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-post-comment',
  templateUrl: './post-comment.component.html',
  styleUrls: ['./post-comment.component.scss']
})
export class PostCommentComponent implements OnInit {
  // tslint:disable-next-line:variable-name
  _postId: number;
  @Input()
  set postId(val: any) {
    val = Number(val);
    if (Number(val)) {
      this._postId = val;
      this.getCommentList();
    }
  }
  get postId() {
    return this._postId;
  }
  commentList = [];
  isSubmit = false;
  validateForm: FormGroup;

  constructor(
    private commentService: CommentService,
    private fb: FormBuilder,
    private $msg: NzMessageService
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      content: ['', [Validators.required]]
    });
  }

  getCommentList() {
    const postId = Number(this.postId);
    if (postId) {
      this.commentService.getCommentList(postId).subscribe(ret => {
        this.commentList = ret.data;
      });
    }
  }

  onSubmitComment(content: string, toUser: number, callback?: () => void) {
    this.commentService
      .addComment(this.postId, content, toUser)
      .pipe(finalize(callback))
      .subscribe(() => {
        this.$msg.success('操作成功！');
        this.getCommentList();
      });
  }

  toggleComment(comment: any) {
    comment.show = !comment.show;
  }

  onReplyComment(content: string, comment: any) {
    console.log(comment);
    if (comment) {
      comment.isSubmit = true;
    } else {
      this.isSubmit = true;
    }
    this.onSubmitComment(content, (comment && comment.userId) || '', () => {
      if (comment) {
        comment.isSubmit = false;
      } else {
        this.isSubmit = false;
      }
    });
  }
}
