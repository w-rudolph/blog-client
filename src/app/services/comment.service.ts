import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { useCommentApi } from '../utils/base-api';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(private http$: HttpService) {}

  getCommentList(postId: number) {
    return this.http$.get(useCommentApi('list'), { postId });
  }

  addComment(postId: number, content: string, toUser?: number) {
    return this.http$.post(useCommentApi('add'), { postId, content, toUser });
  }
}
