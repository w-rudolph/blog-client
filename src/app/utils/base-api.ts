import ApiHost from '../config/host';
const protocol = window.location.protocol;
const basePath = `${protocol}//${ApiHost.blog}`;

/**
 * 用户接口
 */
export const useUserApi = (action: string) => `${basePath}/admin/user/${action}`;

/**
 * 分类接口
 */
export const useCategoryApi = (action: string) => `${basePath}/admin/category/${action}`;

/**
 * 文章接口
 */
export const usePostApi = (action: string) => `${basePath}/admin/post/${action}`;
