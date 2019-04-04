import { Component, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EditorConfig } from './editor-config';
declare var editormd: any;
@Component({
  selector: 'app-md-editor',
  template: `
    <div id="md">
      <textarea value="{{ value }}" id="{{ mdId }}"></textarea>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: EditorMDComponent,
      multi: true
    }
  ]
})
export class EditorMDComponent
  implements AfterViewInit, OnDestroy, ControlValueAccessor {
  @Input() mdId: string;
  editor: any;
  value: string;
  onChange = (arg: string) => {};
  constructor() {
    this.handleChange = this.handleChange.bind(this);
  }
  ngAfterViewInit() {
    this.editor = editormd(this.mdId, new EditorConfig());
    this.editor.on('change', this.handleChange);
  }

  handleChange() {
    this.onChange(this.editor.getValue());
  }

  getEditorValue() {
    return this.editor.getValue();
  }

  getRenderedHtml() {
    return this.editor.preview[0].innerHTML;
  }

  writeValue(value: any) {
    this.value = value;
    if (this.editor) {
      try {
        this.editor.setValue(value || '');
      } catch (err) {}
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched() {}

  ngOnDestroy() {
    this.editor.off('change', this.handleChange);
  }
}
