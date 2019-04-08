import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { useCategoryApi } from '../utils/base-api';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http$: HttpService) { }

  getCategoryList() {
    return this.http$.get(useCategoryApi('list'));
  }

  getCategoryDetail(catId: number) {
    return this.http$.get(useCategoryApi('detail'), { catId });
  }

  updateCategoryStatus(catId: number, status: number) {
    return this.http$.post(useCategoryApi('update-status'), { catId, status });
  }

  saveCategory(params: {
    catId?: number,
    name: string,
    alias: string,
  }) {
    return this.http$.post(useCategoryApi('save'), params);
  }
}
