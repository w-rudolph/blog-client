import { CategoryService } from './../../services/category.service';
import { NzMessageService } from 'ng-zorro-antd';
import { PostService } from './../../services/post.service';
import { EditorMDComponent } from './../../components/editor/editor-md.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent implements OnInit {
  @ViewChild('mdEditor') mdEditor: EditorMDComponent;
  postId: number;
  isLoading = false;
  validateForm: FormGroup;
  catList = [];

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private $msg: NzMessageService,
    private router: ActivatedRoute,
    private catService: CategoryService,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      title: ['', [Validators.required]],
      category: ['', [Validators.required]],
      abstract: ['', [Validators.required]],
      content: ['', [Validators.required]]
    });
    this.router.queryParams.subscribe(params => {
      this.postId = params.id;
      if (this.postId) {
        this.getPostDetail(this.postId);
      }
    });
    this.getCategoryList();
  }

  getCategoryList() {
    this.catService.getCategoryList().subscribe(ret => {
      this.catList = ret.data;
    })
  }

  submitForm() {
    const formKeys = Object.keys(this.validateForm.controls);
    formKeys.forEach(key => {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    });
    if (this.validateForm.invalid) {
      return;
    }
    const params = {
      ...this.validateForm.value,
      postId: this.postId,
      preview: this.mdEditor.getRenderedHtml()
    };
    this.isLoading = true;
    this.postService
      .savePost(params)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.$msg.success('操作成功！');
      });
  }

  getPostDetail(postId: number) {
    this.postService.getPostDetail(postId).subscribe((ret: any) => {
      const { title, content, abstract, category = '' } = ret.data;
      this.validateForm.setValue({
        title,
        category,
        abstract,
        content
      });
    });
  }
}
