import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { usePostApi } from '../utils/base-api';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private http$: HttpService) {}

  getPostDetail(postId: number) {
    return this.http$.get(usePostApi('detail'), { postId });
  }

  getPostList(params: { limit?: number; offset?: number }) {
    return this.http$.get(usePostApi('list'), params);
  }

  getPostSimpleDetail(postId: number) {
    return this.http$.get(usePostApi('simple-detail'), { postId });
  }

  getPostSimpleList(params: {
    catId?: number;
    limit?: number;
    offset?: number;
  }) {
    return this.http$.get(usePostApi('simple-list'), params);
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

  deletePost(postId: number) {
    return this.http$.post(usePostApi('delete'), { postId });
  }

  publishPost(postId: number) {
    return this.http$.post(usePostApi('publish'), { postId });
  }
}
