import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CategoryService } from './../../services/category.service';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';

enum CategoryStatus {
  DEFAULT = 0,
  DELETED = -1
}

const CategoryStatusMap = {
  [CategoryStatus.DELETED]: '已删除',
  [CategoryStatus.DEFAULT]: '正常'
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
    return status === CategoryStatus.DEFAULT ? 'blue' : 'red';
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

  onUpdateCategoryStatus(data: any, status: number) {
    const modalContent = status === CategoryStatus.DELETED ?
      `确认要删除分类【${data.name}】吗？` :
      `确认要把分类【${data.name}】设置为正常吗？`;
    const modal = this.$modal.confirm({
      nzTitle: '提示',
      nzContent: modalContent,
      nzOkLoading: this.isSaving,
      nzOnOk: () => {
        this.isSaving = true;
        this.catService.updateCategoryStatus(data.id, status)
          .pipe(
            finalize(() => {
              this.isSaving = false;
            })
          )
          .subscribe(() => {
            this.$msg.success('操作成功！');
            this.getCategoryList();
            modal.destroy();
          });
      }
    });
  }
}
