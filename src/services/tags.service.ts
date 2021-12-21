import http from "../http-common";

class ArticleDataService {
  getAll(articleId: number, page: number, size: number) {
    return http.get(`/article/${articleId}/tag`, { params: { page, size } });
  }

  create(articleId: number, tags: string[]) {
    return http.post(`/article/${articleId}/tag`, { tags });
  }

  delete(tagId: number, articleId?: number) {
    let url = articleId ? `/article/${articleId}/tag/${tagId}` : `/article/tag/${tagId}`
    return http.delete(url);
  }
}

export default new ArticleDataService();
