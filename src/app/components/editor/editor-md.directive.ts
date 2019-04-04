import {
  AfterViewInit,
  Attribute,
  Directive,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { EditorConfig } from './editor-config';

declare var editormd: any;
declare var $: any;

@Directive({
  selector: '[appEditorMd]'
})
export class EditorMdDirective implements AfterViewInit {
  @Input() editormdConfig: EditorConfig;
  @Output() editorChange: EventEmitter<string> = new EventEmitter<string>();
  editor: any;

  constructor(@Attribute('id') private id: string) {}

  ngAfterViewInit(): void {
    this.editor = editormd(this.id, this.editormdConfig);
    const textarea = $(`#${this.id} :first`);
    this.editor.on('change', () => {
      this.editorChange.emit(textarea.val());
    });
  }
}
