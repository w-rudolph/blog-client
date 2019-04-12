import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { usePostApi } from '../utils/base-api';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private http$: HttpService) { }

  getPostDetail(postId: number) {
    return this.http$.get(usePostApi('detail'), { postId });
  }

  getPostList() {
    return this.http$.get(usePostApi('list'));
  }

  getPostSimpleDetail(postId: number) {
    return this.http$.get(usePostApi('simple-detail'), { postId });
  }

  getPostSimpleList(catId?: number) {
    return this.http$.get(usePostApi('simple-list'), { catId });
  }

  savePost(params: {
    postId?: number;
    title: string;
    abstract: string;
    content: string;
    preview: string;
  }) {
    return this.http$.post(usePostApi('save'), params);
  }

  deletePost(params: { postId: number }) {
    return this.http$.post(usePostApi('delete'), params);
  }
}
