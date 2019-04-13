import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CategoryService } from './../../services/category.service';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';

enum CategoryStatus {
  DRAFT = 0,
  PUBLISHED = 1,
  DELETED = -1
}

const CategoryStatusMap = {
  [CategoryStatus.DELETED]: '已删除',
  [CategoryStatus.PUBLISHED]: '已发布',
  [CategoryStatus.DRAFT]: '草稿'
};

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  catList = [];
  visibleEdit = false;
  editTitle = '';
  validateForm: FormGroup;
  isSaving = false;
  categoryStatus = CategoryStatus;
  constructor(
    private catService: CategoryService,
    private fb: FormBuilder,
    private $modal: NzModalService,
    private $msg: NzMessageService,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      catId: '',
      name: ['', [Validators.required]],
      alias: ['', [Validators.required]],
      sort: [100, [Validators.required]]
    });
    this.getCategoryList();
  }

  getCategoryList() {
    this.catService.getCategoryList().subscribe(ret => {
      this.catList = ret.data.map(row => {
        return {
          ...row,
          status_name: CategoryStatusMap[row.status],
        }
      });
    });
  }

  getCategoryStatusColor(status: number) {
    return status === CategoryStatus.DELETED ? 'red' : 'blue';
  }

  onOpenEdit(row: any = {}) {
    if (row.id) {
      this.editTitle = '编辑分类';
    } else {
      this.editTitle = '创建分类';
    }
    this.validateForm.setValue({
      catId: row.id || '',
      name: row.name || '',
      sort: row.sort || '',
      alias: row.alias || ''
    });
    this.visibleEdit = true;
  }

  onCancelEdit() {
    this.visibleEdit = false;
  }

  onSaveEdit() {
    const formKeys = Object.keys(this.validateForm.controls);
    formKeys.forEach(key => {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    });
    if (this.validateForm.invalid) {
      return;
    }
    this.isSaving = true;
    this.catService.saveCategory(this.validateForm.value).pipe(
      finalize(() => {
        this.isSaving = false;
      })
    ).subscribe(() => {
      this.visibleEdit = false;
      this.getCategoryList();
    });
  }

  updateCategoryStatus(catId: number, status: number) {
    this.catService.updateCategoryStatus(catId, status)
      .subscribe(() => {
        this.$msg.success('操作成功！');
        this.getCategoryList();
      });
  }

  showPublishBtn(status: number) {
    return status === CategoryStatus.DRAFT;
  }

  showDeleteBtn(status: number) {
    return status !== CategoryStatus.DELETED;
  }

  onPublishCategory(catId: number) {
    this.updateCategoryStatus(catId, CategoryStatus.PUBLISHED);
  }

  onDeleteCategory(catId: number) {
    this.updateCategoryStatus(catId, CategoryStatus.DELETED);
  }
}
