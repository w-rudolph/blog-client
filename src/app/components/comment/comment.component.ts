import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() isLoading = false;
  @Input() autoSize = { minRows: 2, maxRows: 6 };
  @Input() placeholder = '输入评论';
  @Input() errorText = '请输入评论!';
  @Output() submit = new EventEmitter<string>();
  validateForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      content: ['', [Validators.required]]
    });
  }

  submitForm(): void {
    const formKeys = Object.keys(this.validateForm.controls);
    formKeys.forEach(key => {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    });
    if (this.validateForm.invalid) {
      return;
    }
    this.submit.emit(this.validateForm.get('content').value);
  }
}
