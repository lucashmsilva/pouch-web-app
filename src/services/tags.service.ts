import http from "../http-common";

class ArticleDataService {
  getAll(articleId: number, page: number, size: number) {
    return http.get(`/article/${articleId}/tag`, { params: { page, size } });
  }

  create(articleId: number, tags: string[]) {
    return http.post(`/article/${articleId}/tag`, { tags });
  }

  delete(articleId: number, tagId: number) {
    return http.delete(`/article/${articleId}/tag/${tagId}`);
  }
}

export default new ArticleDataService();
